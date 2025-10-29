import requests
import os
from flask import current_app

class RecaptchaVerifier:
    """Google reCAPTCHA v2 verification utility"""
    
    RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
    
    @staticmethod
    def verify_recaptcha(recaptcha_response, user_ip=None):
        """
        Verify reCAPTCHA v2 response with Google
        
        Args:
            recaptcha_response (str): The reCAPTCHA response token from frontend
            user_ip (str, optional): User's IP address for additional security
            
        Returns:
            dict: Verification result with success status and error codes
        """
        try:
            # Get secret key from environment
            secret_key = os.getenv('RECAPTCHA_SECRET_KEY')
            
            if not secret_key:
                current_app.logger.error("reCAPTCHA secret key not configured")
                return {
                    'success': False,
                    'error_codes': ['missing-secret-key'],
                    'message': 'reCAPTCHA not properly configured'
                }
            
            if not recaptcha_response:
                return {
                    'success': False,
                    'error_codes': ['missing-input-response'],
                    'message': 'reCAPTCHA response missing'
                }
            
            # Prepare verification data
            data = {
                'secret': secret_key,
                'response': recaptcha_response
            }
            
            # Add IP if provided
            if user_ip:
                data['remoteip'] = user_ip
            
            # Make verification request to Google
            response = requests.post(
                RecaptchaVerifier.RECAPTCHA_VERIFY_URL,
                data=data,
                timeout=10
            )
            
            if response.status_code != 200:
                current_app.logger.error(f"reCAPTCHA API error: HTTP {response.status_code}")
                return {
                    'success': False,
                    'error_codes': ['api-error'],
                    'message': 'reCAPTCHA verification failed'
                }
            
            result = response.json()
            
            # Log the result for debugging
            current_app.logger.info(f"reCAPTCHA verification result: {result}")
            
            if result.get('success'):
                return {
                    'success': True,
                    'message': 'reCAPTCHA verification successful'
                }
            else:
                error_codes = result.get('error-codes', ['unknown-error'])
                error_message = RecaptchaVerifier._get_error_message(error_codes)
                
                return {
                    'success': False,
                    'error_codes': error_codes,
                    'message': error_message
                }
                
        except requests.RequestException as e:
            current_app.logger.error(f"reCAPTCHA request error: {str(e)}")
            return {
                'success': False,
                'error_codes': ['network-error'],
                'message': 'Network error during reCAPTCHA verification'
            }
        except Exception as e:
            current_app.logger.error(f"reCAPTCHA verification error: {str(e)}")
            return {
                'success': False,
                'error_codes': ['internal-error'],
                'message': 'Internal error during reCAPTCHA verification'
            }
    
    @staticmethod
    def _get_error_message(error_codes):
        """Convert reCAPTCHA error codes to user-friendly messages"""
        error_messages = {
            'missing-input-secret': 'reCAPTCHA configuration error',
            'invalid-input-secret': 'reCAPTCHA configuration error',
            'missing-input-response': 'Vui lòng hoàn thành reCAPTCHA',
            'invalid-input-response': 'Bạn là Robot',
            'bad-request': 'reCAPTCHA request error',
            'timeout-or-duplicate': 'reCAPTCHA đã hết hạn, vui lòng thử lại'
        }
        
        if not error_codes:
            return 'Bạn là Robot'
        
        # Return the first known error message
        for code in error_codes:
            if code in error_messages:
                return error_messages[code]
        
        # Default message for unknown errors
        return 'Bạn là Robot'

    @staticmethod
    def get_site_key():
        """Get reCAPTCHA site key for frontend"""
        return os.getenv('RECAPTCHA_SITE_KEY', '')