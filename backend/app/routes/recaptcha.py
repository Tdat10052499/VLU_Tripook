from flask_restful import Resource
from flask import jsonify
from ..utils.recaptcha import RecaptchaVerifier

class RecaptchaConfigResource(Resource):
    """API endpoint để frontend lấy reCAPTCHA site key"""
    
    def get(self):
        """Get reCAPTCHA site key for frontend configuration"""
        try:
            site_key = RecaptchaVerifier.get_site_key()
            
            if not site_key:
                return {
                    'success': False,
                    'message': 'reCAPTCHA not configured'
                }, 500
            
            return {
                'success': True,
                'site_key': site_key
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': 'Error getting reCAPTCHA configuration'
            }, 500