#!/usr/bin/env python
"""
Script to create admin account for Tripook system
"""
import sys
sys.path.insert(0, '/app')

from app import create_app
from app.models.user import User

def create_admin_account():
    """Create admin account with full privileges"""
    app = create_app()
    
    with app.app_context():
        # Admin account details
        admin_email = 'admin@tripook.com'
        admin_password = 'Admin@123456'
        admin_name = 'System Administrator'
        
        print('\n' + '='*60)
        print('CREATING ADMIN ACCOUNT FOR TRIPOOK SYSTEM')
        print('='*60)
        
        # Check if admin already exists
        existing_admin = User.find_by_email(admin_email)
        if existing_admin:
            print(f'\n⚠️  Admin account already exists: {admin_email}')
            print(f'   Role: {existing_admin.role}')
            print(f'   Status: {existing_admin.status}')
            
            # Update existing admin
            response = input('\nDo you want to reset the password? (yes/no): ')
            if response.lower() == 'yes':
                existing_admin.set_password(admin_password)
                existing_admin.role = 'admin'
                existing_admin.status = 'active'
                existing_admin.is_verified = True
                existing_admin.save()
                print('\n✅ Admin password has been reset successfully!')
            else:
                print('\n❌ Operation cancelled.')
            return
        
        # Create new admin account
        print(f'\n📝 Creating admin account: {admin_email}')
        
        admin_user = User(
            email=admin_email,
            name=admin_name,
            phone='0999999999'
        )
        
        # Set password with bcrypt
        admin_user.set_password(admin_password)
        
        # Set admin privileges
        admin_user.role = 'admin'
        admin_user.status = 'active'
        admin_user.is_verified = True
        
        # Save to database
        admin_user.save()
        
        print('\n✅ Admin account created successfully!')
        print('\n' + '-'*60)
        print('ADMIN CREDENTIALS:')
        print('-'*60)
        print(f'Email:    {admin_email}')
        print(f'Password: {admin_password}')
        print(f'Role:     admin')
        print(f'Status:   active')
        print('-'*60)
        print('\n⚠️  IMPORTANT: Please change the password after first login!')
        print('='*60 + '\n')

if __name__ == '__main__':
    try:
        create_admin_account()
    except Exception as e:
        print(f'\n❌ Error creating admin account: {str(e)}')
        sys.exit(1)
