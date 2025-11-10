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
    
    # Priority: Use MONGO_URI from environment (Docker/Production) or fall back to local
    mongo_uri = app.config.get('MONGO_URI') or os.getenv('MONGO_URI')
    
    # If no MONGO_URI, use local MongoDB as fallback
    if not mongo_uri:
        mongo_uri = os.getenv('MONGO_LOCAL_URI', 'mongodb://localhost:27017/tripook')
    
    connected = False
    
    # Try connecting to MongoDB
    try:
        print(f"🔗 Connecting to MongoDB...")
        # Optimized settings for development
        client = MongoClient(
            mongo_uri, 
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            maxPoolSize=10,  # Connection pool for better performance
            retryWrites=True
        )
        db = client[database_name]
        db.command('ping')
        
        # Determine connection type for logging
        if 'mongodb.net' in mongo_uri or 'atlas' in mongo_uri.lower():
            print(f"✅ Connected to MongoDB Atlas: {database_name}")
        else:
            print(f"✅ Connected to MongoDB: {database_name}")
        connected = True
    except Exception as error:
        print(f"❌ MongoDB connection failed: {error}")
    
    # If still not connected, try one more fallback
    if not connected:
        try:
            print("🔄 Trying fallback connection...")
            fallback_uri = 'mongodb://localhost:27017/tripook'
            client = MongoClient(fallback_uri, serverSelectionTimeoutMS=2000)
            db = client[database_name]
            db.command('ping')
            print(f"✅ Connected to fallback MongoDB: {database_name}")
            connected = True
        except Exception as fallback_error:
            print(f"❌ Fallback connection failed: {fallback_error}")
    
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