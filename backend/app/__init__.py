# App packagefrom flask import Flask
from flask_cors import CORS
from app.routes.auth import AuthResource, LoginResource, RegisterResource, ForgotPasswordResource, ResetPasswordResource

def create_app():
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app, origins=["http://localhost:3000"])
    
    # Configuration
    app.config['SECRET_KEY'] = 'tripook-secret-key-2024'
    app.config['MONGO_URI'] = 'mongodb+srv://dat:Tdat.100524@tripook-cluster.ht8st5x.mongodb.net/?appName=Tripook-Cluster'
    app.config['JWT_SECRET_KEY'] = 'tripook-jwt-secret-key-2024'  # Add JWT secret
    
    # Initialize Flask-RESTful
    from flask_restful import Api
    api = Api(app)
    
    # Register authentication routes
    api.add_resource(LoginResource, '/api/auth/login')
    api.add_resource(RegisterResource, '/api/auth/register')
    api.add_resource(ForgotPasswordResource, '/api/auth/forgot-password')
    api.add_resource(ResetPasswordResource, '/api/auth/reset-password')
    api.add_resource(AuthResource, '/api/auth/profile')
    
    # Test route
    @app.route('/')
    def hello():
        return {'message': 'Tripook Backend API is running!'}
    
    @app.route('/api/health')
    def health():
        return {'status': 'healthy', 'service': 'Tripook API'}
    
    return app