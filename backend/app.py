from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import routes
from app.routes.auth import AuthResource
from app.routes.trips import TripsResource, TripResource
from app.routes.activities import ActivitiesResource, ActivityResource
from app.routes.users import UserResource

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
    
    # Register routes
    api.add_resource(AuthResource, '/auth')
    api.add_resource(UserResource, '/user')
    api.add_resource(TripsResource, '/trips')
    api.add_resource(TripResource, '/trips/<string:trip_id>')
    api.add_resource(ActivitiesResource, '/trips/<string:trip_id>/activities')
    api.add_resource(ActivityResource, '/trips/<string:trip_id>/activities/<string:activity_id>')
    
    # Initialize database
    init_db(app)
    
    @app.route('/')
    def health_check():
        return {"message": "Tripook API is running!", "status": "healthy"}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)