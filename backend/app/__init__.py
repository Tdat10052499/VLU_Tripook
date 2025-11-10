# App package
from flask import Flask
from flask_cors import CORS
from app.routes.auth import AuthResource, LoginResource, RegisterResource, ForgotPasswordResource, ResetPasswordResource

def create_app():
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
    
    # Configuration
    app.config['SECRET_KEY'] = 'tripook-secret-key-2024'
    app.config['MONGO_URI'] = 'mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/?appName=Tripook-Cluster'
    app.config['JWT_SECRET_KEY'] = 'tripook-jwt-secret-key-2024'  # Add JWT secret
    
    # Initialize Flask-RESTful
    from flask_restful import Api
    api = Api(app)
    
    # Register authentication routes
    api.add_resource(LoginResource, '/api/auth/login')
    # api.add_resource(RegisterResource, '/api/auth/register')  # Disabled to avoid conflict with blueprint
    api.add_resource(ForgotPasswordResource, '/api/auth/forgot-password')
    api.add_resource(ResetPasswordResource, '/api/auth/reset-password')
    api.add_resource(AuthResource, '/api/auth/profile')
    
    # Tạm thời thêm registration route trực tiếp
    from flask import request, jsonify
    from flask_cors import cross_origin
    from werkzeug.security import generate_password_hash
    from app.utils.database import get_db
    from app.utils.jwt_auth import generate_token
    from datetime import datetime
    import re
    
    def validate_email(email):
        pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return re.match(pattern, email) is not None
    
    def validate_phone(phone):
        pattern = r'^[0-9]{10,11}$'
        return re.match(pattern, phone.replace(' ', '')) is not None
    
    @app.route('/api/registration/test', methods=['GET'])
    @cross_origin(origins=['http://localhost:3000'])
    def test_registration():
        return jsonify({'message': 'Registration API is working!'})
    
    @app.route('/api/registration/register', methods=['POST', 'OPTIONS'])
    @cross_origin(origins=['http://localhost:3000'])
    def register_user():
        try:
            data = request.get_json()
            print(f"Registration data received: {data}")
            
            # Validate required fields
            required_fields = ['userType', 'email', 'password', 'fullName', 'phone']
            for field in required_fields:
                if field not in data or not data[field]:
                    return jsonify({
                        'success': False,
                        'message': f'Trường {field} là bắt buộc'
                    }), 400

            email = data['email'].lower().strip()
            user_type = data['userType']
            
            # Validate email format
            if not validate_email(email):
                return jsonify({
                    'success': False,
                    'message': 'Email không hợp lệ'
                }), 400

            # Validate phone format
            if not validate_phone(data['phone']):
                return jsonify({
                    'success': False,
                    'message': 'Số điện thoại không hợp lệ'
                }), 400

            # Validate password
            if len(data['password']) < 6:
                return jsonify({
                    'success': False,
                    'message': 'Mật khẩu phải có ít nhất 6 ký tự'
                }), 400

            # Check password confirmation
            if data['password'] != data.get('confirmPassword'):
                return jsonify({
                    'success': False,
                    'message': 'Mật khẩu xác nhận không khớp'
                }), 400

            # Get database
            db = get_db()
            
            # Check if email already exists
            existing_user = db.users.find_one({'email': email})
            if existing_user:
                return jsonify({
                    'success': False,
                    'message': 'Email đã được sử dụng'
                }), 400

            # Validate provider specific fields
            if user_type == 'provider':
                provider_fields = ['companyName', 'businessType', 'businessAddress']
                for field in provider_fields:
                    if field not in data or not data[field]:
                        return jsonify({
                            'success': False,
                            'message': f'Trường {field} là bắt buộc cho nhà cung cấp'
                        }), 400

            # Create user document
            user_doc = {
                'email': email,
                'password_hash': generate_password_hash(data['password']),
                'fullName': data['fullName'],
                'phone': data['phone'],
                'role': 'provider' if user_type == 'provider' else 'user',
                'isEmailVerified': True,  # Bỏ qua xác thực email
                'accountStatus': 'pending' if user_type == 'provider' else 'active',
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow()
            }

            # Add provider specific fields
            if user_type == 'provider':
                user_doc.update({
                    'companyName': data['companyName'],
                    'businessType': data['businessType'],
                    'businessAddress': data['businessAddress'],
                    'businessLicense': data.get('businessLicense', ''),
                    'businessDescription': data.get('businessDescription', ''),
                })

            # Insert user
            result = db.users.insert_one(user_doc)
            user_id = str(result.inserted_id)

            # Generate JWT token cho user mới
            token = generate_token(user_id)
            
            # Tạo user object để trả về
            user_data = {
                'id': user_id,
                'email': email,
                'fullName': data['fullName'],
                'role': user_doc['role'],
                'accountStatus': user_doc['accountStatus']
            }

            return jsonify({
                'success': True,
                'message': 'Đăng ký thành công!',
                'token': token,
                'user': user_data
            }), 201

        except Exception as e:
            print(f"Registration error: {e}")
            return jsonify({
                'success': False,
                'message': 'Có lỗi xảy ra trong quá trình đăng ký'
            }), 500

    # Register admin blueprint
    from app.routes.admin import admin_bp
    app.register_blueprint(admin_bp)
    
    # Register registration blueprint
    from app.routes.registration import registration_bp
    app.register_blueprint(registration_bp)
    
    # Add simple-login route (proxy to registration/login)
    @app.route('/api/auth/simple-login', methods=['POST', 'OPTIONS'])
    @cross_origin(origins=['http://localhost:3000'])
    def auth_simple_login():
        from werkzeug.security import check_password_hash
        try:
            data = request.get_json()
            
            if not data or not data.get('login') or not data.get('password'):
                return jsonify({
                    'success': False,
                    'message': 'Email/username và password là bắt buộc'
                }), 400
            
            login_identifier = data['login'].lower().strip()
            password = data['password']
            remember_me = data.get('remember_me', False)
            
            # Get database
            db = get_db()
            
            # Find user by email or username
            user_data = db.users.find_one({
                '$or': [
                    {'email': login_identifier},
                    {'username': login_identifier}
                ]
            })
            
            if not user_data:
                return jsonify({
                    'success': False,
                    'message': 'Email hoặc mật khẩu không đúng'
                }), 401
            
            # Check password
            password_hash = user_data.get('password_hash')
            if not password_hash or not check_password_hash(password_hash, password):
                return jsonify({
                    'success': False,
                    'message': 'Email hoặc mật khẩu không đúng'
                }), 401
            
            # Generate JWT token
            user_id = str(user_data['_id'])
            token = generate_token(user_id, remember_me)
            
            # Prepare user data to return
            user_response = {
                'id': user_id,
                'email': user_data['email'],
                'name': user_data.get('name', ''),
                'username': user_data.get('username', ''),
                'role': user_data.get('role', 'user'),
                'status': user_data.get('status', 'active'),
                'phone': user_data.get('phone', ''),
                'picture': user_data.get('picture', ''),
                'is_verified': user_data.get('is_verified', False),
                'provider_info': user_data.get('provider_info')
            }
            
            return jsonify({
                'success': True,
                'message': 'Đăng nhập thành công',
                'data': {
                    'token': token,
                    'user': user_response,
                    'remember_me': remember_me
                }
            }), 200
            
        except Exception as e:
            print(f"Login error: {e}")
            return jsonify({
                'success': False,
                'message': 'Có lỗi xảy ra trong quá trình đăng nhập'
            }), 500
    
    # Test route
    @app.route('/')
    def hello():
        return {'message': 'Tripook API is running!', 'status': 'healthy'}
    
    @app.route('/api/health')
    def health():
        return {'status': 'healthy', 'service': 'Tripook API'}
    
    return app