from flask import Flask, request, jsonify
from flask_restful import Api
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

# Import routes
from app.routes.auth import LoginResource, RegisterResource, VerifyEmailResource, ResendVerificationResource
from app.routes.recaptcha import RecaptchaConfigResource
from app.routes.trips import TripsResource, TripResource
from app.routes.activities import ActivitiesResource, ActivityResource
from app.routes.users import UserResource
from app.routes.provider import provider_bp

# Import database
from app.utils.database import init_db

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
    app.config['MONGO_URI'] = os.getenv('MONGO_URI')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'tripook-jwt-secret-key-2024')
    
    # Initialize CORS with more permissive settings for development
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000", 
                "http://127.0.0.1:3000",
                "http://localhost:3001", 
                "http://127.0.0.1:3001",
                "http://localhost",
                "http://localhost:80",
                "http://127.0.0.1:80",
                "http://127.0.0.1"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
            "supports_credentials": True
        }
    })
    
    # Initialize API
    api = Api(app, prefix='/api')
    
    # Register routes
    api.add_resource(LoginResource, '/auth/login')
    api.add_resource(RegisterResource, '/auth/register')
    api.add_resource(VerifyEmailResource, '/auth/verify')
    api.add_resource(ResendVerificationResource, '/auth/resend-verification')
    api.add_resource(RecaptchaConfigResource, '/auth/recaptcha-config')
    api.add_resource(UserResource, '/user')
    api.add_resource(TripsResource, '/trips')
    api.add_resource(TripResource, '/trips/<string:trip_id>')
    api.add_resource(ActivitiesResource, '/trips/<string:trip_id>/activities')
    api.add_resource(ActivityResource, '/trips/<string:trip_id>/activities/<string:activity_id>')
    
    # Register blueprints
    app.register_blueprint(provider_bp, url_prefix='/api/provider')
    
    # Add simple registration endpoint
    from flask import request, jsonify
    from werkzeug.security import generate_password_hash
    from datetime import datetime
    import re
    
    def validate_email(email):
        pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return re.match(pattern, email) is not None
    
    def validate_phone(phone):
        pattern = r'^[0-9]{10,11}$'
        return re.match(pattern, phone.replace(' ', '')) is not None
    
    @app.route('/api/registration/test', methods=['GET'])
    def test_registration():
        return jsonify({'message': 'Registration API is working!'})
    
    @app.route('/api/registration/register', methods=['POST', 'OPTIONS'])
    def register_user():
        if request.method == 'OPTIONS':
            return '', 200
            
        try:
            from app.utils.database import get_db
            from app.utils.jwt_auth import generate_token
            
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
                'password': generate_password_hash(data['password']),
                'fullName': data['fullName'],
                'phone': data['phone'],
                'role': 'provider' if user_type == 'provider' else 'user',
                'isEmailVerified': True,  # Bỏ qua xác thực email
                'accountStatus': 'active',  # Active ngay
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

            # Generate JWT token - simplified
            token = f"simple_token_{user_id}_{datetime.utcnow().timestamp()}"
            
            # Create user object to return
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

    @app.route('/api/auth/simple-login', methods=['POST'])
    def simple_login():
        """Simplified login endpoint without reCAPTCHA"""
        try:
            from app.utils.database import get_db
            
            data = request.get_json()
            
            if not data or not data.get('login') or not data.get('password'):
                return jsonify({
                    'success': False,
                    'message': 'Email và mật khẩu là bắt buộc'
                }), 400

            login_identifier = data['login'].lower().strip()
            password = data['password']
            remember_me = data.get('remember_me', False)

            # Get database connection
            db = get_db()
            
            # Find user by email
            user = db.users.find_one({'email': login_identifier})
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'Email hoặc mật khẩu không đúng'
                }), 401

            # Check password
            if not check_password_hash(user['password'], password):
                return jsonify({
                    'success': False,
                    'message': 'Email hoặc mật khẩu không đúng'
                }), 401

            # Generate simple token
            user_id = str(user['_id'])
            token = f"simple_token_{user_id}_{datetime.utcnow().timestamp()}"
            
            # Create user data to return
            user_data = {
                'id': user_id,
                'email': user['email'],
                'fullName': user['fullName'],
                'role': user['role'],
                'accountStatus': user['accountStatus']
            }

            return jsonify({
                'success': True,
                'message': 'Đăng nhập thành công!',
                'data': {
                    'token': token,
                    'user': user_data,
                    'remember_me': remember_me
                }
            }), 200

        except Exception as e:
            print(f"Login error: {e}")
            return jsonify({
                'success': False,
                'message': 'Đã xảy ra lỗi trong quá trình đăng nhập'
            }), 500
    
    # Initialize database
    init_db(app)
    
    @app.route('/')
    def health_check():
        return {"message": "Tripook API is running!", "status": "healthy"}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)