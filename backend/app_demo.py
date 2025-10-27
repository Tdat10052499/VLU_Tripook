import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from dotenv import load_dotenv

# Import routes
from app.routes.auth import AuthResource
from app.routes.trips import TripsResource, TripResource
from app.routes.activities import ActivitiesResource, ActivityResource
from app.routes.users import UserResource

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
    app.config['MONGO_URI'] = os.getenv('MONGO_URI')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    
    # Initialize CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize API
    api = Api(app, prefix='/api')
    
    # Health check endpoint
    @app.route('/')
    def health_check():
        return {
            "message": "Tripook API is running!", 
            "status": "healthy",
            "version": "1.0.0"
        }
    
    # Register routes only if MongoDB connection is available
    try:
        # Try to initialize database only if MONGO_URI is properly configured
        mongo_uri = app.config.get('MONGO_URI')
        if mongo_uri and 'username:password' not in mongo_uri:
            # Import database only when we have real MongoDB credentials
            from app.utils.database import init_db
            init_db(app)
            
            # Register API routes
            api.add_resource(AuthResource, '/auth')
            api.add_resource(UserResource, '/user')
            api.add_resource(TripsResource, '/trips')
            api.add_resource(TripResource, '/trips/<string:trip_id>')
            api.add_resource(ActivitiesResource, '/trips/<string:trip_id>/activities')
            api.add_resource(ActivityResource, '/trips/<string:trip_id>/activities/<string:activity_id>')
        else:
            print("⚠️  MongoDB not configured. API endpoints disabled.")
            print("💡 Please update MONGO_URI in .env file with your MongoDB Atlas connection string.")
            
            # Add a mock endpoint for testing
            @app.route('/api/status')
            def api_status():
                return {
                    "status": "running",
                    "database": "not_configured",
                    "message": "Please configure MongoDB Atlas to enable full API functionality"
                }
            
    except Exception as e:
        print(f"⚠️  Database initialization failed: {str(e)}")
        print("💡 Running in demo mode without database functionality.")
        
        # Add a status endpoint
        @app.route('/api/status')
        def api_status_error():
            return {
                "status": "running",
                "database": "connection_failed",
                "message": f"Database error: {str(e)}"
            }
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("\n🚀 Starting Tripook Backend Server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("🔍 Health check: http://localhost:5000")
    print("📊 API Status: http://localhost:5000/api/status")
    print("\n" + "="*50)
    app.run(debug=True, host='0.0.0.0', port=5000)