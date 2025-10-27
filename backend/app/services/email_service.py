import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.from_email = os.getenv('FROM_EMAIL', self.smtp_username)
        self.frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    
    def send_verification_email(self, to_email: str, verification_token: str, user_name: str):
        """Send email verification to user"""
        try:
            verification_link = f"{self.frontend_url}/auth/verify?token={verification_token}"
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = "Xác thực tài khoản Tripook - Verify your Tripook account"
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # HTML content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Xác thực tài khoản Tripook</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 20px; font-size: 14px; color: #666; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Chào mừng đến với Tripook!</h1>
                    </div>
                    <div class="content">
                        <h2>Xin chào {user_name}!</h2>
                        <p>Cảm ơn bạn đã đăng ký tài khoản tại Tripook - nền tảng lên kế hoạch du lịch thông minh.</p>
                        <p>Để hoàn tất việc tạo tài khoản và bắt đầu khám phá những chuyến đi tuyệt vời, vui lòng nhấp vào nút bên dưới để xác thực email của bạn:</p>
                        
                        <div style="text-align: center;">
                            <a href="{verification_link}" class="button">✅ Xác thực tài khoản</a>
                        </div>
                        
                        <p>Hoặc copy link sau vào trình duyệt:</p>
                        <p style="background: #e9e9e9; padding: 10px; border-radius: 5px; word-break: break-all;">
                            {verification_link}
                        </p>
                        
                        <p><strong>Lưu ý:</strong> Link xác thực sẽ hết hạn sau 24 giờ.</p>
                        
                        <hr>
                        <h3>🚀 Những gì bạn có thể làm với Tripook:</h3>
                        <ul>
                            <li>📅 Lên kế hoạch chi tiết cho chuyến đi</li>
                            <li>🗺️ Khám phá địa điểm du lịch hot</li>
                            <li>👥 Chia sẻ chuyến đi với bạn bè</li>
                            <li>💰 Quản lý ngân sách du lịch</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
                        <p>© 2025 Tripook. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Create HTML part
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            # Send email
            if not self.smtp_username or not self.smtp_password:
                print("⚠️ SMTP credentials not configured. Email not sent.")
                print(f"📧 Would send verification email to: {to_email}")
                print(f"🔗 Verification link: {verification_link}")
                return True
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            print(f"✅ Verification email sent to: {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send verification email: {str(e)}")
            return False
    
    def send_password_reset_email(self, to_email: str, reset_token: str, user_name: str):
        """Send password reset email to user"""
        try:
            reset_link = f"{self.frontend_url}/auth/reset-password?token={reset_token}"
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = "Đặt lại mật khẩu Tripook - Reset your Tripook password"
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # HTML content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Đặt lại mật khẩu Tripook</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; background: #dc3545; color: white; padding: 30px; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .button {{ display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 20px; font-size: 14px; color: #666; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔒 Đặt lại mật khẩu</h1>
                    </div>
                    <div class="content">
                        <h2>Xin chào {user_name}!</h2>
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Tripook của bạn.</p>
                        <p>Nếu đây là yêu cầu của bạn, vui lòng nhấp vào nút bên dưới để tạo mật khẩu mới:</p>
                        
                        <div style="text-align: center;">
                            <a href="{reset_link}" class="button">🔑 Đặt lại mật khẩu</a>
                        </div>
                        
                        <p>Hoặc copy link sau vào trình duyệt:</p>
                        <p style="background: #e9e9e9; padding: 10px; border-radius: 5px; word-break: break-all;">
                            {reset_link}
                        </p>
                        
                        <p><strong>Lưu ý:</strong></p>
                        <ul>
                            <li>Link đặt lại mật khẩu sẽ hết hạn sau 1 giờ</li>
                            <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>© 2025 Tripook. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Create HTML part
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            # Send email
            if not self.smtp_username or not self.smtp_password:
                print("⚠️ SMTP credentials not configured. Email not sent.")
                print(f"📧 Would send reset email to: {to_email}")
                print(f"🔗 Reset link: {reset_link}")
                return True
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            print(f"✅ Password reset email sent to: {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send reset email: {str(e)}")
            return False

# Singleton instance
email_service = EmailService()