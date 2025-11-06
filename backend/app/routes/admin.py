from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from app.utils.database import get_db
from app.utils.jwt_auth import decode_token
from app.services.email_service import send_provider_approval_email, send_provider_rejection_email
from datetime import datetime
from bson import ObjectId
import functools

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required(f):
    """Decorator to require admin role"""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from request
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({
                'success': False,
                'message': 'Token không hợp lệ'
            }), 401

        token = token.split(' ')[1]
        
        try:
            # Verify token and get user_id
            user_id = decode_token(token)
            if not user_id:
                return jsonify({
                    'success': False,
                    'message': 'Token không hợp lệ'
                }), 401

            # Get user from database
            db = get_db()
            user = db.users.find_one({'_id': ObjectId(user_id)})
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'Người dùng không tồn tại'
                }), 404

            # Check if user is admin
            if user.get('role') != 'admin':
                return jsonify({
                    'success': False,
                    'message': 'Bạn không có quyền truy cập'
                }), 403

            # Add user to request context
            request.current_user = user
            return f(*args, **kwargs)
            
        except Exception as e:
            print(f"Admin auth error: {e}")
            return jsonify({
                'success': False,
                'message': 'Lỗi xác thực'
            }), 401
    
    return decorated_function

@admin_bp.route('/pending-providers', methods=['GET'])
@admin_required
def get_pending_providers():
    """Get all providers pending approval"""
    try:
        db = get_db()
        
        # Find all providers with pending status and email verified
        pending_providers = db.users.find({
            'role': 'provider',
            'accountStatus': 'pending',
            'isEmailVerified': True
        }).sort('createdAt', 1)  # Sort by creation date, oldest first
        
        providers_list = []
        for provider in pending_providers:
            provider_data = {
                '_id': str(provider['_id']),
                'email': provider['email'],
                'fullName': provider['fullName'],
                'phone': provider['phone'],
                'companyName': provider.get('companyName', ''),
                'businessType': provider.get('businessType', ''),
                'businessAddress': provider.get('businessAddress', ''),
                'businessLicense': provider.get('businessLicense', ''),
                'businessDescription': provider.get('businessDescription', ''),
                'accountStatus': provider['accountStatus'],
                'createdAt': provider['createdAt'].isoformat(),
                'isEmailVerified': provider['isEmailVerified']
            }
            providers_list.append(provider_data)
        
        return jsonify({
            'success': True,
            'providers': providers_list,
            'total': len(providers_list)
        }), 200
        
    except Exception as e:
        print(f"Error getting pending providers: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải danh sách provider'
        }), 500

@admin_bp.route('/approve-provider', methods=['POST'])
@admin_required
def approve_provider():
    """Approve or reject a provider"""
    try:
        data = request.get_json()
        
        if not data.get('providerId') or not data.get('action'):
            return jsonify({
                'success': False,
                'message': 'Provider ID và action là bắt buộc'
            }), 400
        
        provider_id = data['providerId']
        action = data['action']  # 'approve' or 'reject'
        reason = data.get('reason', '')
        
        if action not in ['approve', 'reject']:
            return jsonify({
                'success': False,
                'message': 'Action không hợp lệ'
            }), 400
        
        db = get_db()
        
        # Find the provider
        provider = db.users.find_one({'_id': ObjectId(provider_id)})
        if not provider:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy provider'
            }), 404
        
        # Check if provider is in pending status
        if provider.get('accountStatus') != 'pending':
            return jsonify({
                'success': False,
                'message': 'Provider không ở trạng thái chờ phê duyệt'
            }), 400
        
        # Update provider status
        if action == 'approve':
            new_status = 'active'
            update_data = {
                'accountStatus': new_status,
                'approvedAt': datetime.utcnow(),
                'approvedBy': str(request.current_user['_id']),
                'updatedAt': datetime.utcnow()
            }
        else:  # reject
            new_status = 'rejected'
            update_data = {
                'accountStatus': new_status,
                'rejectedAt': datetime.utcnow(),
                'rejectedBy': str(request.current_user['_id']),
                'rejectionReason': reason,
                'updatedAt': datetime.utcnow()
            }
        
        # Update in database
        result = db.users.update_one(
            {'_id': ObjectId(provider_id)},
            {'$set': update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({
                'success': False,
                'message': 'Không thể cập nhật trạng thái provider'
            }), 500
        
        # Send notification email
        try:
            if action == 'approve':
                send_provider_approval_email(
                    provider['email'], 
                    provider['fullName'],
                    provider.get('companyName', '')
                )
            else:
                send_provider_rejection_email(
                    provider['email'], 
                    provider['fullName'],
                    provider.get('companyName', ''),
                    reason
                )
        except Exception as email_error:
            print(f"Failed to send notification email: {email_error}")
            # Don't fail the approval process if email fails
        
        return jsonify({
            'success': True,
            'message': f'Provider đã được {("phê duyệt" if action == "approve" else "từ chối")} thành công',
            'providerId': provider_id,
            'newStatus': new_status
        }), 200
        
    except Exception as e:
        print(f"Error approving provider: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra trong quá trình xử lý'
        }), 500

@admin_bp.route('/provider-stats', methods=['GET'])
@admin_required
def get_provider_stats():
    """Get provider statistics for admin dashboard"""
    try:
        db = get_db()
        
        # Count providers by status
        pipeline = [
            {'$match': {'role': 'provider'}},
            {'$group': {
                '_id': '$accountStatus',
                'count': {'$sum': 1}
            }}
        ]
        
        status_counts = list(db.users.aggregate(pipeline))
        
        # Format stats
        stats = {
            'total': 0,
            'active': 0,
            'pending': 0,
            'rejected': 0
        }
        
        for stat in status_counts:
            status = stat['_id']
            count = stat['count']
            stats['total'] += count
            
            if status in stats:
                stats[status] = count
        
        # Get recent registrations (last 30 days)
        from datetime import timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        recent_registrations = db.users.count_documents({
            'role': 'provider',
            'createdAt': {'$gte': thirty_days_ago}
        })
        
        stats['recentRegistrations'] = recent_registrations
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except Exception as e:
        print(f"Error getting provider stats: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải thống kê'
        }), 500

@admin_bp.route('/provider/<provider_id>', methods=['GET'])
@admin_required
def get_provider_details(provider_id):
    """Get detailed information about a specific provider"""
    try:
        db = get_db()
        
        provider = db.users.find_one({'_id': ObjectId(provider_id)})
        if not provider:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy provider'
            }), 404
        
        if provider.get('role') != 'provider':
            return jsonify({
                'success': False,
                'message': 'Người dùng không phải là provider'
            }), 400
        
        # Get provider's services count
        services_count = db.services.count_documents({'provider_id': str(provider['_id'])})
        
        # Get provider's bookings count
        bookings_count = db.bookings.count_documents({'provider_id': str(provider['_id'])})
        
        provider_data = {
            '_id': str(provider['_id']),
            'email': provider['email'],
            'fullName': provider['fullName'],
            'phone': provider['phone'],
            'role': provider['role'],
            'accountStatus': provider['accountStatus'],
            'isEmailVerified': provider['isEmailVerified'],
            'createdAt': provider['createdAt'].isoformat(),
            'updatedAt': provider.get('updatedAt', provider['createdAt']).isoformat(),
            
            # Business info
            'companyName': provider.get('companyName', ''),
            'businessType': provider.get('businessType', ''),
            'businessAddress': provider.get('businessAddress', ''),
            'businessLicense': provider.get('businessLicense', ''),
            'businessDescription': provider.get('businessDescription', ''),
            
            # Approval info
            'approvedAt': provider.get('approvedAt').isoformat() if provider.get('approvedAt') else None,
            'approvedBy': provider.get('approvedBy', ''),
            'rejectedAt': provider.get('rejectedAt').isoformat() if provider.get('rejectedAt') else None,
            'rejectedBy': provider.get('rejectedBy', ''),
            'rejectionReason': provider.get('rejectionReason', ''),
            
            # Statistics
            'servicesCount': services_count,
            'bookingsCount': bookings_count
        }
        
        return jsonify({
            'success': True,
            'provider': provider_data
        }), 200
        
    except Exception as e:
        print(f"Error getting provider details: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải thông tin provider'
        }), 500