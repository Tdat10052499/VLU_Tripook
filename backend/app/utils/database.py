import pymongo
from pymongo import MongoClient
from flask import current_app
import os

# Global database connection
db = None
client = None

def init_db(app):
    """Initialize MongoDB connection"""
    global db, client
    
    # Get database name from environment
    database_name = os.getenv('MONGO_DATABASE', 'tripook')
    
    # Use local MongoDB (primary for development)
    local_uri = os.getenv('MONGO_LOCAL_URI', 'mongodb://localhost:27017/tripook')
    atlas_uri = app.config.get('MONGO_URI')  # Keep as backup if needed
    
    connected = False
    
    # Try local MongoDB first
    try:
        print("🔗 Connecting to local MongoDB...")
        # Optimized settings for local development
        client = MongoClient(
            local_uri, 
            serverSelectionTimeoutMS=2000,  # Quick timeout for local
            connectTimeoutMS=2000,
            maxPoolSize=10,  # Connection pool for better performance
            retryWrites=False  # Not needed for local development
        )
        db = client[database_name]
        db.command('ping')
        print(f"✅ Connected to local MongoDB: {database_name}")
        connected = True
    except Exception as local_error:
        print(f"❌ Local MongoDB connection failed: {local_error}")
    
    # Fallback to Atlas only if local fails and Atlas is configured
    if not connected and atlas_uri:
        try:
            print("☁️  Falling back to MongoDB Atlas...")
            client = MongoClient(atlas_uri, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
            db = client[database_name]
            db.command('ping')
            print(f"✅ Connected to MongoDB Atlas: {database_name}")
            connected = True
        except Exception as atlas_error:
            print(f"❌ Failed to connect to MongoDB Atlas: {atlas_error}")
    
    # If both failed, create a mock db instance but don't crash
    if not connected:
        print("⚠️  No MongoDB connection available. Server will start but database operations will fail.")
        try:
            # Create a basic client that will fail gracefully
            client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=1000)
            db = client[database_name]
        except Exception as final_error:
            print(f"Could not create MongoDB client: {final_error}")
            raise RuntimeError("No MongoDB connection could be established")

def get_db():
    """Get database instance"""
    global db, client
    if db is None:
        # Try to reconnect if database connection was lost
        try:
            from flask import current_app
            if current_app:
                init_db(current_app)
                if db is not None:
                    return db
        except RuntimeError:
            pass
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return db

def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")