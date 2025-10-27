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
    
    try:
        # Get MongoDB URI from environment variables
        mongo_uri = app.config.get('MONGO_URI')
        if not mongo_uri:
            raise ValueError("MONGO_URI not found in environment variables")
        
        # Create MongoDB client
        client = MongoClient(mongo_uri)
        
        # Get database name from URI or use default
        database_name = os.getenv('MONGO_DATABASE', 'tripook')
        db = client[database_name]
        
        # Test the connection
        db.command('ping')
        print(f"Successfully connected to MongoDB database: {database_name}")
        
    except Exception as e:
        print(f"Failed to connect to MongoDB: {str(e)}")
        raise e

def get_db():
    """Get database instance"""
    global db
    if db is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return db

def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")