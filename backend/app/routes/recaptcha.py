from flask_restful import Resource
from flask import jsonify
from ..utils.recaptcha import RecaptchaVerifier

class RecaptchaConfigResource(Resource):
    """API endpoint để frontend lấy reCAPTCHA site key"""
    
    def get(self):
        """Get reCAPTCHA site key for frontend configuration"""
        try:
            site_key = RecaptchaVerifier.get_site_key()
            
            # If reCAPTCHA is not configured, return success=False with 200 status
            # This allows frontend to disable reCAPTCHA instead of showing error
            if not site_key or site_key == 'your-recaptcha-site-key-here':
                return {
                    'success': False,
                    'message': 'reCAPTCHA not configured',
                    'site_key': None
                }, 200
            
            return {
                'success': True,
                'site_key': site_key
            }, 200
            
        except Exception as e:
            print(f"Error in RecaptchaConfigResource: {str(e)}")
            return {
                'success': False,
                'message': f'Error getting reCAPTCHA configuration: {str(e)}',
                'site_key': None
            }, 200