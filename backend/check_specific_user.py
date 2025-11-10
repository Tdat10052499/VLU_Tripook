#!/usr/bin/env python
# Check specific user
import sys
sys.path.insert(0, '/app')
from app import create_app
import json

app = create_app()

with app.app_context():
    from app.utils.database import get_db
    db = get_db()
    
    user = db.users.find_one({'email': 'dato@gmail.com'})
    if user:
        # Convert ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        print(json.dumps(user, indent=2, default=str))
    else:
        print('User not found')
