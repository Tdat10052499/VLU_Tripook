from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from app.utils.database import get_db
from app.utils.jwt_auth import decode_token
from app.services.email_service import send_provider_approval_email, send_provider_rejection_email
from datetime import datetime, timedelta
from bson import ObjectId
import functools
from app.models.login_activity import LoginActivity

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required(f):
    """Decorator to require admin role"""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        # Allow OPTIONS requests without authentication (CORS preflight)
        if request.method == 'OPTIONS':
            return '', 200
        
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
        
        if not data.get('providerId'):
            return jsonify({
                'success': False,
                'message': 'Provider ID là bắt buộc'
            }), 400
        
        provider_id = data['providerId']
        
        # Accept both 'approve' boolean (from frontend) or 'action' string (legacy)
        if 'approve' in data:
            approve = data['approve']
            action = 'approve' if approve else 'reject'
        elif 'action' in data:
            action = data['action']
            if action not in ['approve', 'reject']:
                return jsonify({
                    'success': False,
                    'message': 'Action không hợp lệ'
                }), 400
        else:
            return jsonify({
                'success': False,
                'message': 'Thiếu thông tin approve hoặc action'
            }), 400
        
        reason = data.get('reason', '')
        
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


# ==================== LOGIN STATISTICS ====================
@admin_bp.route('/login-stats', methods=['GET', 'OPTIONS'])
@admin_required
def get_login_stats():
    """
    Get login statistics for different time periods
    Query params:
    - period: 'day' (last 30 days), 'month' (last 12 months), 'year' (last 5 years)
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        period = request.args.get('period', 'day')
        
        if period == 'day':
            # Last 30 days
            stats = LoginActivity.get_activity_stats(days=30)
        elif period == 'month':
            # Last 12 months
            stats = LoginActivity.get_activity_stats(days=365)
        elif period == 'year':
            # Last 5 years
            stats = LoginActivity.get_activity_stats(days=1825)
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid period. Use: day, month, or year'
            }), 400
        
        return jsonify({
            'success': True,
            'period': period,
            'stats': stats
        }), 200
        
    except Exception as e:
        print(f"Error getting login stats: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải thống kê đăng nhập'
        }), 500


# ==================== REGISTRATION STATISTICS ====================
@admin_bp.route('/registration-stats', methods=['GET', 'OPTIONS'])
@admin_required
def get_registration_stats():
    """
    Get registration statistics with role filtering
    Query params:
    - period: 'day' (last 30 days), 'month' (last 12 months), 'year' (last 5 years)
    - role: 'user', 'provider', 'all' (default)
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        period = request.args.get('period', 'day')
        role = request.args.get('role', 'all')
        
        # Calculate date range
        if period == 'day':
            days = 30
            group_format = '%Y-%m-%d'
        elif period == 'month':
            days = 365
            group_format = '%Y-%m'
        elif period == 'year':
            days = 1825
            group_format = '%Y'
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid period. Use: day, month, or year'
            }), 400
        
        since = datetime.utcnow() - timedelta(days=days)
        
        # Build query
        query = {'createdAt': {'$gte': since}}
        if role != 'all':
            query['role'] = role
        
        # Aggregate registrations by date
        pipeline = [
            {'$match': query},
            {
                '$group': {
                    '_id': {
                        '$dateToString': {
                            'format': group_format,
                            'date': '$createdAt'
                        }
                    },
                    'count': {'$sum': 1},
                    'users': {
                        '$sum': {
                            '$cond': [{'$eq': ['$role', 'user']}, 1, 0]
                        }
                    },
                    'providers': {
                        '$sum': {
                            '$cond': [{'$eq': ['$role', 'provider']}, 1, 0]
                        }
                    }
                }
            },
            {'$sort': {'_id': 1}}
        ]
        
        results = list(db.users.aggregate(pipeline))
        
        # Get total counts
        total_query = {'createdAt': {'$gte': since}}
        total_users = db.users.count_documents({**total_query, 'role': 'user'})
        total_providers = db.users.count_documents({**total_query, 'role': 'provider'})
        
        return jsonify({
            'success': True,
            'period': period,
            'role': role,
            'stats': results,
            'totals': {
                'users': total_users,
                'providers': total_providers,
                'total': total_users + total_providers
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting registration stats: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải thống kê đăng ký'
        }), 500


# ==================== USER MANAGEMENT ====================
@admin_bp.route('/users', methods=['GET', 'OPTIONS'])
@admin_required
def get_users():
    """
    Get paginated list of users with filtering
    Query params:
    - page: page number (default: 1)
    - limit: items per page (default: 20)
    - role: filter by role (user, provider, admin)
    - status: filter by status (active, blocked, pending)
    - search: search in name or email
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        
        # Get query params
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        role = request.args.get('role', '')
        status = request.args.get('status', '')
        search = request.args.get('search', '')
        
        # Build query
        query = {}
        
        if role:
            query['role'] = role
        
        if status:
            query['status'] = status
        
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'email': {'$regex': search, '$options': 'i'}}
            ]
        
        # Get total count
        total = db.users.count_documents(query)
        
        # Get paginated users
        skip = (page - 1) * limit
        users = list(db.users.find(query).skip(skip).limit(limit).sort('createdAt', -1))
        
        # Format users
        users_data = []
        for user in users:
            users_data.append({
                '_id': str(user['_id']),
                'name': user.get('name', ''),
                'email': user.get('email', ''),
                'role': user.get('role', 'user'),
                'status': user.get('status', 'active'),
                'phone': user.get('phone', ''),
                'address': user.get('address', ''),
                'createdAt': user.get('createdAt').isoformat() if user.get('createdAt') else None,
                'lastLoginAt': user.get('lastLoginAt').isoformat() if user.get('lastLoginAt') else None
            })
        
        return jsonify({
            'success': True,
            'users': users_data,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting users: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải danh sách người dùng'
        }), 500


@admin_bp.route('/users/<user_id>', methods=['GET', 'OPTIONS'])
@admin_required
def get_user_detail(user_id):
    """Get detailed information about a specific user"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        
        # Get user
        user = db.users.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy người dùng'
            }), 404
        
        # Get additional stats
        if user.get('role') == 'provider':
            services_count = db.services.count_documents({'providerId': user_id})
            bookings_count = db.bookings.count_documents({'providerId': user_id})
        else:
            services_count = 0
            bookings_count = db.bookings.count_documents({'userId': user_id})
        
        # Get login history
        login_history = LoginActivity.get_user_activity(user_id, limit=10)
        
        user_data = {
            '_id': str(user['_id']),
            'name': user.get('name', ''),
            'email': user.get('email', ''),
            'role': user.get('role', 'user'),
            'status': user.get('status', 'active'),
            'phone': user.get('phone', ''),
            'address': user.get('address', ''),
            'avatar': user.get('avatar', ''),
            'createdAt': user.get('createdAt').isoformat() if user.get('createdAt') else None,
            'lastLoginAt': user.get('lastLoginAt').isoformat() if user.get('lastLoginAt') else None,
            
            # Statistics
            'servicesCount': services_count,
            'bookingsCount': bookings_count,
            'loginHistory': login_history
        }
        
        # Add provider-specific fields if applicable
        if user.get('role') == 'provider':
            user_data.update({
                'businessName': user.get('businessName', ''),
                'businessType': user.get('businessType', ''),
                'taxCode': user.get('taxCode', ''),
                'approvedAt': user.get('approvedAt').isoformat() if user.get('approvedAt') else None,
                'approvedBy': user.get('approvedBy', ''),
                'rejectedAt': user.get('rejectedAt').isoformat() if user.get('rejectedAt') else None,
                'rejectedBy': user.get('rejectedBy', ''),
                'rejectionReason': user.get('rejectionReason', '')
            })
        
        return jsonify({
            'success': True,
            'user': user_data
        }), 200
        
    except Exception as e:
        print(f"Error getting user detail: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải thông tin người dùng'
        }), 500


@admin_bp.route('/users/<user_id>', methods=['PUT', 'OPTIONS'])
@admin_required
def update_user(user_id):
    """Update user information"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        data = request.get_json()
        
        # Check if user exists
        user = db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy người dùng'
            }), 404
        
        # Prevent admin from demoting themselves
        if str(user['_id']) == str(request.current_user['_id']) and data.get('role') != 'admin':
            return jsonify({
                'success': False,
                'message': 'Bạn không thể thay đổi role của chính mình'
            }), 400
        
        # Build update data
        update_data = {}
        allowed_fields = ['name', 'email', 'phone', 'address', 'role', 'status']
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if not update_data:
            return jsonify({
                'success': False,
                'message': 'Không có dữ liệu để cập nhật'
            }), 400
        
        # Update user
        update_data['updatedAt'] = datetime.utcnow()
        
        result = db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({
                'success': False,
                'message': 'Không có thay đổi nào được thực hiện'
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'Cập nhật thông tin người dùng thành công'
        }), 200
        
    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi cập nhật người dùng'
        }), 500


@admin_bp.route('/users/<user_id>', methods=['DELETE', 'OPTIONS'])
@admin_required
def delete_user(user_id):
    """Soft delete a user (set status to 'deleted')"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        
        # Check if user exists
        user = db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy người dùng'
            }), 404
        
        # Prevent admin from deleting themselves
        if str(user['_id']) == str(request.current_user['_id']):
            return jsonify({
                'success': False,
                'message': 'Bạn không thể xóa tài khoản của chính mình'
            }), 400
        
        # Soft delete
        result = db.users.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'status': 'deleted',
                    'deletedAt': datetime.utcnow(),
                    'deletedBy': str(request.current_user['_id'])
                }
            }
        )
        
        if result.modified_count == 0:
            return jsonify({
                'success': False,
                'message': 'Không thể xóa người dùng'
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'Xóa người dùng thành công'
        }), 200
        
    except Exception as e:
        print(f"Error deleting user: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi xóa người dùng'
        }), 500


@admin_bp.route('/users/<user_id>/block', methods=['POST', 'OPTIONS'])
@admin_required
def block_user(user_id):
    """Block or unblock a user"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        data = request.get_json()
        
        # Check if user exists
        user = db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy người dùng'
            }), 404
        
        # Prevent admin from blocking themselves
        if str(user['_id']) == str(request.current_user['_id']):
            return jsonify({
                'success': False,
                'message': 'Bạn không thể chặn tài khoản của chính mình'
            }), 400
        
        # Toggle block status
        block = data.get('block', True)
        new_status = 'blocked' if block else 'active'
        
        update_data = {
            'status': new_status,
            'updatedAt': datetime.utcnow()
        }
        
        if block:
            update_data['blockedAt'] = datetime.utcnow()
            update_data['blockedBy'] = str(request.current_user['_id'])
            update_data['blockReason'] = data.get('reason', '')
        else:
            update_data['unblockedAt'] = datetime.utcnow()
            update_data['unblockedBy'] = str(request.current_user['_id'])
        
        result = db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({
                'success': False,
                'message': 'Không thể thay đổi trạng thái người dùng'
            }), 400
        
        message = 'Chặn người dùng thành công' if block else 'Bỏ chặn người dùng thành công'
        
        return jsonify({
            'success': True,
            'message': message
        }), 200
        
    except Exception as e:
        print(f"Error blocking/unblocking user: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi thay đổi trạng thái người dùng'
        }), 500


# ==================== SERVICES & TRIPS VIEWING ====================
@admin_bp.route('/services', methods=['GET', 'OPTIONS'])
@admin_required
def get_services():
    """Get paginated list of services"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        provider_id = request.args.get('providerId', '')
        
        query = {}
        if provider_id:
            query['providerId'] = provider_id
        
        total = db.services.count_documents(query)
        skip = (page - 1) * limit
        
        services = list(db.services.find(query).skip(skip).limit(limit).sort('createdAt', -1))
        
        services_data = []
        for service in services:
            services_data.append({
                '_id': str(service['_id']),
                'name': service.get('name', ''),
                'providerId': service.get('providerId', ''),
                'category': service.get('category', ''),
                'price': service.get('price', 0),
                'status': service.get('status', 'active'),
                'createdAt': service.get('createdAt').isoformat() if service.get('createdAt') else None
            })
        
        return jsonify({
            'success': True,
            'services': services_data,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting services: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải danh sách dịch vụ'
        }), 500


@admin_bp.route('/trips', methods=['GET', 'OPTIONS'])
@admin_required
def get_trips():
    """Get paginated list of trips"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        user_id = request.args.get('userId', '')
        
        query = {}
        if user_id:
            query['userId'] = user_id
        
        total = db.trips.count_documents(query)
        skip = (page - 1) * limit
        
        trips = list(db.trips.find(query).skip(skip).limit(limit).sort('createdAt', -1))
        
        trips_data = []
        for trip in trips:
            trips_data.append({
                '_id': str(trip['_id']),
                'name': trip.get('name', ''),
                'userId': trip.get('userId', ''),
                'destination': trip.get('destination', ''),
                'startDate': trip.get('startDate').isoformat() if trip.get('startDate') else None,
                'endDate': trip.get('endDate').isoformat() if trip.get('endDate') else None,
                'status': trip.get('status', 'planning'),
                'createdAt': trip.get('createdAt').isoformat() if trip.get('createdAt') else None
            })
        
        return jsonify({
            'success': True,
            'trips': trips_data,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting trips: {e}")
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải danh sách chuyến đi'
        }), 500