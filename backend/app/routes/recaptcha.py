from flask_restful import Resource
from flask import jsonify
from ..utils.recaptcha import RecaptchaVerifier

class RecaptchaConfigResource(Resource):
    """API endpoint để frontend lấy reCAPTCHA site key"""
    
    def get(self):
        """Get reCAPTCHA site key for frontend configuration"""
        try:
            site_key = RecaptchaVerifier.get_site_key()
            
            if not site_key or site_key == 'your-recaptcha-site-key-here':
                return {
                    'success': False,
                    'message': 'reCAPTCHA not configured. Please set RECAPTCHA_SITE_KEY in .env file'
                }, 500
            
            return {
                'success': True,
                'site_key': site_key
            }, 200
            
        except Exception as e:
            print(f"Error in RecaptchaConfigResource: {str(e)}")
            return {
                'success': False,
                'message': f'Error getting reCAPTCHA configuration: {str(e)}'
            }, 500