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
    
    def send_verification_email(self, to_email: str, verification_code: str, user_name: str):
        """Send email verification code to user"""
        try:
            
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

    def send_verification_code_email(self, to_email: str, verification_code: str, user_name: str):
        """Send email verification code to user"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = "Mã xác thực tài khoản Tripook - Verification Code"
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # HTML content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Mã xác thực tài khoản Tripook</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .code-box {{ background: #fff; border: 2px dashed #667eea; padding: 30px; text-align: center; margin: 20px 0; border-radius: 10px; }}
                    .verification-code {{ font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; }}
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
                        <p>Cảm ơn bạn đã đăng ký tài khoản Tripook. Để hoàn tất quá trình đăng ký, vui lòng nhập mã xác thực dưới đây:</p>
                        
                        <div class="code-box">
                            <p style="margin: 0; font-size: 16px; color: #666;">Mã xác thực của bạn:</p>
                            <div class="verification-code">{verification_code}</div>
                            <p style="margin: 0; font-size: 14px; color: #666;">Mã có hiệu lực trong 10 phút</p>
                        </div>
                        
                        <p><strong>Lưu ý quan trọng:</strong></p>
                        <ul>
                            <li>Mã xác thực chỉ có hiệu lực trong 10 phút</li>
                            <li>Không chia sẻ mã này với bất kỳ ai</li>
                            <li>Nếu mã hết hạn, bạn có thể yêu cầu mã mới</li>
                        </ul>
                        
                        <hr style="margin: 30px 0;">
                        
                        <h3>🌟 Khám phá Tripook:</h3>
                        <ul>
                            <li>🏖️ Đặt tour du lịch hấp dẫn</li>
                            <li>🏨 Tìm khách sạn giá tốt</li>
                            <li>🍜 Khám phá ẩm thực địa phương</li>
                            <li>📱 Quản lý chuyến đi dễ dàng</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
                        <p>© 2024 Tripook. All rights reserved.</p>
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
                print(f"📧 Would send verification code to: {to_email}")
                print(f"🔢 Verification code: {verification_code}")
                return True
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            print(f"✅ Verification code email sent to: {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send verification code: {str(e)}")
            return False

    def send_provider_approval_email(self, to_email: str, user_name: str, company_name: str):
        """Send provider approval notification email"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = "🎉 Tài khoản Provider đã được phê duyệt - Tripook"
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # HTML content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Tài khoản Provider đã được phê duyệt</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .button {{ display: inline-block; background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 20px; font-size: 14px; color: #666; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Chúc mừng! Tài khoản đã được phê duyệt</h1>
                    </div>
                    <div class="content">
                        <h2>Xin chào {user_name}!</h2>
                        <p>Chúng tôi rất vui mừng thông báo rằng tài khoản nhà cung cấp dịch vụ của <strong>{company_name}</strong> đã được phê duyệt thành công!</p>
                        
                        <div style="background: #fff; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #10B981;">✅ Tài khoản đã được kích hoạt</h3>
                            <p>Bạn có thể bắt đầu sử dụng tất cả các tính năng của Provider Dashboard ngay bây giờ.</p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{self.frontend_url}/provider/dashboard" class="button">🏢 Truy cập Provider Dashboard</a>
                        </div>
                        
                        <h3>🌟 Những gì bạn có thể làm:</h3>
                        <ul>
                            <li>📝 Tạo và quản lý các tour/dịch vụ du lịch</li>
                            <li>📊 Xem thống kê đặt chỗ và doanh thu</li>
                            <li>💬 Tương tác với khách hàng</li>
                            <li>📈 Phân tích hiệu suất kinh doanh</li>
                        </ul>
                        
                        <div style="background: #E7F6FF; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="margin-top: 0; color: #1E40AF;">💡 Mẹo để bắt đầu:</h4>
                            <ol>
                                <li>Hoàn thiện thông tin profile của bạn</li>
                                <li>Tạo dịch vụ đầu tiên với mô tả chi tiết</li>
                                <li>Upload ảnh chất lượng cao</li>
                                <li>Thiết lập giá cả cạnh tranh</li>
                            </ol>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Cảm ơn bạn đã tham gia cộng đồng Tripook!</p>
                        <p>© 2024 Tripook. All rights reserved.</p>
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
                print(f"📧 Would send approval email to: {to_email}")
                return True
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            print(f"✅ Provider approval email sent to: {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send approval email: {str(e)}")
            return False

    def send_provider_rejection_email(self, to_email: str, user_name: str, company_name: str, reason: str = ""):
        """Send provider rejection notification email"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = "❌ Thông báo về tài khoản Provider - Tripook"
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # HTML content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Thông báo về tài khoản Provider</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .button {{ display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 20px; font-size: 14px; color: #666; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📋 Thông báo về tài khoản Provider</h1>
                    </div>
                    <div class="content">
                        <h2>Xin chào {user_name},</h2>
                        <p>Cảm ơn bạn đã quan tâm và đăng ký tài khoản nhà cung cấp dịch vụ tại Tripook.</p>
                        
                        <div style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #EF4444;">❌ Tài khoản chưa được phê duyệt</h3>
                            <p>Rất tiếc, tài khoản Provider cho <strong>{company_name}</strong> chưa đáp ứng được các yêu cầu của chúng tôi tại thời điểm này.</p>
                            {f'<p><strong>Lý do:</strong> {reason}</p>' if reason else ''}
                        </div>
                        
                        <h3>🔄 Bạn có thể làm gì tiếp theo:</h3>
                        <ul>
                            <li>📞 Liên hệ với team hỗ trợ để được tư vấn chi tiết</li>
                            <li>📝 Cập nhật thông tin và đăng ký lại</li>
                            <li>📋 Chuẩn bị đầy đủ giấy tờ pháp lý</li>
                            <li>🏢 Đảm bảo thông tin doanh nghiệp chính xác</li>
                        </ul>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{self.frontend_url}/contact" class="button">📞 Liên hệ hỗ trợ</a>
                        </div>
                        
                        <div style="background: #F3F4F6; padding: 15px; border-radius: 5px;">
                            <h4 style="margin-top: 0;">📧 Thông tin liên hệ:</h4>
                            <p>Email: support@tripook.com<br>
                            Hotline: 1900-TRIPOOK<br>
                            Giờ làm việc: Thứ 2 - Thứ 6, 8:00 - 17:30</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Cảm ơn bạn đã hiểu và ủng hộ Tripook!</p>
                        <p>© 2024 Tripook. All rights reserved.</p>
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
                print(f"📧 Would send rejection email to: {to_email}")
                return True
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            print(f"✅ Provider rejection email sent to: {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send rejection email: {str(e)}")
            return False

# Singleton instance
email_service = EmailService()

# Convenience functions
def send_verification_email(to_email: str, verification_code: str, user_name: str):
    """Send verification code email"""
    return email_service.send_verification_code_email(to_email, verification_code, user_name)

def send_provider_approval_email(to_email: str, user_name: str, company_name: str):
    """Send provider approval email"""
    return email_service.send_provider_approval_email(to_email, user_name, company_name)

def send_provider_rejection_email(to_email: str, user_name: str, company_name: str, reason: str = ""):
    """Send provider rejection email"""
    return email_service.send_provider_rejection_email(to_email, user_name, company_name, reason)