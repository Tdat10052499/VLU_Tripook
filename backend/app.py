# This file is kept for backward compatibility
# The actual create_app is now in app/__init__.py
from app import create_app

# Re-export create_app for run.py
__all__ = ['create_app']