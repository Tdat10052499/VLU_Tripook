#!/usr/bin/env python
# Check users in database
import sys
sys.path.insert(0, '/app')

from app import create_app

app = create_app()

with app.app_context():
    from app.utils.database import get_db
    db = get_db()
    
    total = db.users.count_documents({})
    print(f'\nTotal users in database: {total}\n')
    
    users = list(db.users.find())
    for i, user in enumerate(users, 1):
        print(f'{i}. Email: {user.get("email")}')
        print(f'   Name: {user.get("name")} or {user.get("fullName")}')
        print(f'   Role: {user.get("role")}')
        print(f'   Status: {user.get("status")}')
        print(f'   Created: {user.get("created_at")}')
        print()
