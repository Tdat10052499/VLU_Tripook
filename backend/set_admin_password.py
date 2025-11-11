#!/usr/bin/env python
"""
Script to set password for admin account
"""
import sys
sys.path.insert(0, '/app')

from app import create_app
from app.models.user import User

app = create_app()

with app.app_context():
    # Find admin
    admin = User.find_by_email('admin@tripook.com')
    
    if not admin:
        print('❌ Admin account not found!')
        sys.exit(1)
    
    # Set password
    new_password = 'Admin@123456'
    admin.set_password(new_password)
    admin.role = 'admin'
    admin.status = 'active'
    admin.is_verified = True
    admin.save()
    
    print('\n' + '='*60)
    print('✅ ADMIN PASSWORD SET SUCCESSFULLY!')
    print('='*60)
    print(f'\nEmail:    {admin.email}')
    print(f'Password: {new_password}')
    print(f'Role:     {admin.role}')
    print(f'Status:   {admin.status}')
    print('\n' + '='*60)
    print('⚠️  Please change the password after first login!')
    print('='*60 + '\n')
