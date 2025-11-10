#!/usr/bin/env python
# Show recent users
import sys
sys.path.insert(0, '/app')
from app import create_app

app = create_app()

with app.app_context():
    from app.utils.database import get_db
    db = get_db()
    
    # Get last 5 users sorted by created_at
    users = list(db.users.find().sort('created_at', -1).limit(5))
    
    print('\n=== LAST 5 USERS (Most Recent First) ===\n')
    for i, user in enumerate(users, 1):
        print(f'{i}. Email: {user.get("email")}')
        print(f'   Name: {user.get("name")}')
        print(f'   Role: {user.get("role")}')
        print(f'   Status: {user.get("status")}')
        print(f'   Created: {user.get("created_at")}')
        print(f'   ID: {user.get("_id")}')
        print()
    
    print(f'Total users in database: {db.users.count_documents({})}')
    print(f'\nDatabase: {db.name}')
    print(f'Connection: MongoDB Atlas')
