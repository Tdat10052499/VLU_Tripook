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
        # Provider phải verify email trước khi admin review
        pending_providers = db.users.find({
            'role': 'provider',
            'accountStatus': 'pending',
            '$or': [
                {'isEmailVerified': True},
                {'is_verified': True}
            ]
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
                'isEmailVerified': provider.get('isEmailVerified', provider.get('is_verified', False))
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
            'isEmailVerified': provider.get('isEmailVerified', provider.get('is_verified', False)),
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


# ==================== TRANSACTION ANALYTICS ====================
@admin_bp.route('/transaction-stats', methods=['GET', 'OPTIONS'])
@admin_required
def get_transaction_stats():
    """
    Get transaction statistics
    Query params:
    - period: 'week' (last 7 days), 'month' (last 30 days), 'year' (last 365 days)
    - startDate: optional custom start date (YYYY-MM-DD)
    - endDate: optional custom end date (YYYY-MM-DD)
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        period = request.args.get('period', 'month')
        start_date_str = request.args.get('startDate')
        end_date_str = request.args.get('endDate')
        
        # Calculate date range
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').replace(hour=23, minute=59, second=59)
        else:
            end_date = datetime.utcnow()
            if period == 'week':
                start_date = end_date - timedelta(days=7)
            elif period == 'month':
                start_date = end_date - timedelta(days=30)
            elif period == 'year':
                start_date = end_date - timedelta(days=365)
            else:
                start_date = end_date - timedelta(days=30)
        
        # Query bookings in date range
        bookings = list(db.bookings.find({
            'booking_date': {
                '$gte': start_date,
                '$lte': end_date
            }
        }))
        
        # Calculate basic stats
        total_transactions = len(bookings)
        total_revenue = sum(b.get('total_amount', 0) for b in bookings)
        avg_transaction_value = total_revenue / total_transactions if total_transactions > 0 else 0
        
        # Calculate success rate
        completed_count = sum(1 for b in bookings if b.get('status') == 'confirmed')
        success_rate = (completed_count / total_transactions * 100) if total_transactions > 0 else 0
        
        # Get top providers (via services)
        provider_stats = {}
        for booking in bookings:
            service_id = booking.get('service_id')
            if service_id:
                service = db.services.find_one({'_id': service_id})
                if service:
                    provider_id = str(service.get('provider_id'))
                    if provider_id not in provider_stats:
                        provider = db.users.find_one({'_id': ObjectId(provider_id)})
                        if provider:
                            provider_stats[provider_id] = {
                                'provider_id': provider_id,
                                'provider_name': provider.get('fullName', 'Unknown'),
                                'company_name': provider.get('companyName', ''),
                                'transaction_count': 0,
                                'total_revenue': 0
                            }
                    if provider_id in provider_stats:
                        provider_stats[provider_id]['transaction_count'] += 1
                        provider_stats[provider_id]['total_revenue'] += booking.get('total_amount', 0)
        
        top_providers = sorted(provider_stats.values(), key=lambda x: x['transaction_count'], reverse=True)[:10]
        
        # Get top users
        user_stats = {}
        for booking in bookings:
            user_id = str(booking.get('user_id'))
            if user_id not in user_stats:
                user = db.users.find_one({'_id': ObjectId(user_id)})
                if user:
                    user_stats[user_id] = {
                        'user_id': user_id,
                        'user_name': user.get('fullName', 'Unknown'),
                        'email': user.get('email', ''),
                        'transaction_count': 0,
                        'total_spent': 0
                    }
            if user_id in user_stats:
                user_stats[user_id]['transaction_count'] += 1
                user_stats[user_id]['total_spent'] += booking.get('total_amount', 0)
        
        top_users = sorted(user_stats.values(), key=lambda x: x['transaction_count'], reverse=True)[:10]
        
        # Transaction timeline (group by date)
        timeline = {}
        for booking in bookings:
            date_str = booking.get('booking_date').strftime('%Y-%m-%d')
            if date_str not in timeline:
                timeline[date_str] = {'date': date_str, 'count': 0, 'revenue': 0}
            timeline[date_str]['count'] += 1
            timeline[date_str]['revenue'] += booking.get('total_amount', 0)
        
        timeline_data = sorted(timeline.values(), key=lambda x: x['date'])
        
        # Status distribution
        status_stats = {
            'pending': sum(1 for b in bookings if b.get('status') == 'pending'),
            'confirmed': sum(1 for b in bookings if b.get('status') == 'confirmed'),
            'cancelled': sum(1 for b in bookings if b.get('status') == 'cancelled'),
            'completed': sum(1 for b in bookings if b.get('status') == 'completed'),
        }
        
        return jsonify({
            'success': True,
            'period': period,
            'dateRange': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            },
            'stats': {
                'totalTransactions': total_transactions,
                'totalRevenue': round(total_revenue, 2),
                'averageTransactionValue': round(avg_transaction_value, 2),
                'successRate': round(success_rate, 2),
                'statusDistribution': status_stats
            },
            'topProviders': top_providers,
            'topUsers': top_users,
            'timeline': timeline_data
        }), 200
        
    except Exception as e:
        print(f"Error getting transaction stats: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải thống kê giao dịch'
        }), 500


@admin_bp.route('/transactions', methods=['GET', 'OPTIONS'])
@admin_required
def get_transactions():
    """
    Get list of transactions (bookings) with details
    Query params:
    - page: page number (default: 1)
    - limit: items per page (default: 20)
    - status: filter by status
    - provider_id: filter by provider
    - user_id: filter by user
    - startDate: filter start date
    - endDate: filter end date
    """
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        status = request.args.get('status')
        provider_id = request.args.get('provider_id')
        user_id = request.args.get('user_id')
        start_date_str = request.args.get('startDate')
        end_date_str = request.args.get('endDate')
        
        # Build query
        query = {}
        
        if status:
            query['status'] = status
        
        if user_id:
            query['user_id'] = ObjectId(user_id)
        
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').replace(hour=23, minute=59, second=59)
            query['booking_date'] = {'$gte': start_date, '$lte': end_date}
        
        # Get total count
        total = db.bookings.count_documents(query)
        
        # Get bookings with pagination
        bookings = list(db.bookings.find(query)
                       .sort('booking_date', -1)
                       .skip((page - 1) * limit)
                       .limit(limit))
        
        # Enrich booking data with user, provider, service info
        transactions = []
        for booking in bookings:
            # Get user info
            user = db.users.find_one({'_id': booking.get('user_id')})
            user_data = {
                'user_id': str(booking.get('user_id')),
                'name': user.get('fullName', 'Unknown') if user else 'Unknown',
                'email': user.get('email', '') if user else ''
            }
            
            # Get service and provider info
            service_id = booking.get('service_id')
            provider_data = {'provider_id': '', 'name': '', 'company_name': ''}
            service_data = {'service_id': '', 'name': '', 'type': ''}
            
            if service_id:
                service = db.services.find_one({'_id': service_id})
                if service:
                    service_data = {
                        'service_id': str(service_id),
                        'name': service.get('name', 'Unknown'),
                        'type': service.get('type', '')
                    }
                    
                    provider_id = service.get('provider_id')
                    if provider_id:
                        provider = db.users.find_one({'_id': ObjectId(provider_id)})
                        if provider:
                            provider_data = {
                                'provider_id': str(provider_id),
                                'name': provider.get('fullName', 'Unknown'),
                                'company_name': provider.get('companyName', '')
                            }
            
            # Filter by provider if specified
            if provider_id and provider_data.get('provider_id') != provider_id:
                continue
            
            transaction = {
                'transaction_id': f"TXN-{str(booking['_id'])[-8:]}",
                'booking_id': str(booking['_id']),
                'user': user_data,
                'provider': provider_data,
                'service': service_data,
                'amount': booking.get('total_amount', 0),
                'currency': booking.get('currency', 'USD'),
                'status': booking.get('status', 'pending'),
                'payment_status': booking.get('payment_status', 'pending'),
                'booking_date': booking.get('booking_date').isoformat() if booking.get('booking_date') else None,
                'confirmed_at': booking.get('confirmed_at').isoformat() if booking.get('confirmed_at') else None,
                'number_of_guests': booking.get('number_of_guests', 1),
                'start_date': booking.get('start_date').isoformat() if booking.get('start_date') else None,
                'end_date': booking.get('end_date').isoformat() if booking.get('end_date') else None
            }
            transactions.append(transaction)
        
        return jsonify({
            'success': True,
            'transactions': transactions,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'totalPages': (total + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting transactions: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải danh sách giao dịch'
        }), 500


@admin_bp.route('/transaction/<booking_id>', methods=['GET', 'OPTIONS'])
@admin_required
def get_transaction_detail(booking_id):
    """Get detailed information about a specific transaction"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = get_db()
        
        # Get booking
        booking = db.bookings.find_one({'_id': ObjectId(booking_id)})
        if not booking:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy giao dịch'
            }), 404
        
        # Get user info
        user = db.users.find_one({'_id': booking.get('user_id')})
        user_data = {
            'user_id': str(booking.get('user_id')),
            'name': user.get('fullName', 'Unknown') if user else 'Unknown',
            'email': user.get('email', '') if user else '',
            'phone': user.get('phone', '') if user else ''
        }
        
        # Get service and provider info
        service_id = booking.get('service_id')
        provider_data = {}
        service_data = {}
        
        if service_id:
            service = db.services.find_one({'_id': service_id})
            if service:
                service_data = {
                    'service_id': str(service_id),
                    'name': service.get('name', 'Unknown'),
                    'type': service.get('type', ''),
                    'description': service.get('description', ''),
                    'location': service.get('location', {})
                }
                
                provider_id = service.get('provider_id')
                if provider_id:
                    provider = db.users.find_one({'_id': ObjectId(provider_id)})
                    if provider:
                        provider_data = {
                            'provider_id': str(provider_id),
                            'name': provider.get('fullName', 'Unknown'),
                            'email': provider.get('email', ''),
                            'phone': provider.get('phone', ''),
                            'company_name': provider.get('companyName', ''),
                            'business_address': provider.get('businessAddress', '')
                        }
        
        # Get payment info if exists
        payment = db.payments.find_one({'booking_id': booking['_id']})
        payment_data = None
        if payment:
            payment_data = {
                'payment_id': str(payment['_id']),
                'amount': payment.get('amount', 0),
                'status': payment.get('status', 'pending'),
                'payment_method': payment.get('payment_method', ''),
                'payment_provider': payment.get('payment_provider', ''),
                'transaction_id': payment.get('transaction_id', ''),
                'created_at': payment.get('created_at').isoformat() if payment.get('created_at') else None,
                'processed_at': payment.get('processed_at').isoformat() if payment.get('processed_at') else None
            }
        
        transaction_detail = {
            'transaction_id': f"TXN-{str(booking['_id'])[-8:]}",
            'booking_id': str(booking['_id']),
            'user': user_data,
            'provider': provider_data,
            'service': service_data,
            'payment': payment_data,
            'booking_details': {
                'booking_type': booking.get('booking_type', 'trip'),
                'booking_reference': booking.get('booking_reference', ''),
                'confirmation_code': booking.get('confirmation_code', ''),
                'start_date': booking.get('start_date').isoformat() if booking.get('start_date') else None,
                'end_date': booking.get('end_date').isoformat() if booking.get('end_date') else None,
                'number_of_guests': booking.get('number_of_guests', 1),
                'guest_details': booking.get('guest_details', []),
                'special_requests': booking.get('special_requests', ''),
                'notes': booking.get('notes', '')
            },
            'financial': {
                'total_amount': booking.get('total_amount', 0),
                'currency': booking.get('currency', 'USD'),
                'price_breakdown': booking.get('price_breakdown', {})
            },
            'status': {
                'booking_status': booking.get('status', 'pending'),
                'payment_status': booking.get('payment_status', 'pending')
            },
            'timestamps': {
                'booking_date': booking.get('booking_date').isoformat() if booking.get('booking_date') else None,
                'confirmed_at': booking.get('confirmed_at').isoformat() if booking.get('confirmed_at') else None,
                'cancelled_at': booking.get('cancelled_at').isoformat() if booking.get('cancelled_at') else None,
                'created_at': booking.get('created_at').isoformat() if booking.get('created_at') else None,
                'updated_at': booking.get('updated_at').isoformat() if booking.get('updated_at') else None
            }
        }
        
        return jsonify({
            'success': True,
            'transaction': transaction_detail
        }), 200
        
    except Exception as e:
        print(f"Error getting transaction detail: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': 'Có lỗi xảy ra khi tải thông tin giao dịch'
        }), 500