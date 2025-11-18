import os
from dotenv import load_dotenv
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

load_dotenv()

class EmailService:
    def __init__(self):
        # Brevo (Sendinblue) configuration
        self.brevo_api_key = os.getenv('BREVO_API_KEY')
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@tripook.com')
        self.from_name = os.getenv('FROM_NAME', 'Tripook')
        self.frontend_url = os.getenv('FRONTEND_URL', 'http://localhost')
        
        # Configure Brevo API
        if self.brevo_api_key:
            configuration = sib_api_v3_sdk.Configuration()
            configuration.api_key['api-key'] = self.brevo_api_key
            self.api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
        else:
            self.api_instance = None
            print("⚠️ BREVO_API_KEY not configured. Email service in mock mode.")
    
    def send_verification_email(self, to_email: str, verification_token: str, user_name: str):
        """Send email verification link to user via Brevo"""
        try:
            # Create verification link
            verification_link = f"{self.frontend_url}/verify-email?token={verification_token}"
            
            # HTML content with modern design
            html_content = f"""
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Xác thực Email - Tripook</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f7fa;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #f5f7fa; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <!-- Main Container -->
                            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; max-width: 600px;">
                                
                                <!-- Header with Gradient -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                                        <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
                                        <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Xác thực Email - Tripook</h1>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">Xin chào {user_name}!</h2>
                                        
                                        <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                            Bạn đã yêu cầu xác thực địa chỉ email cho tài khoản Tripook của mình.
                                        </p>
                                        
                                        <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                            Để hoàn tất quá trình xác thực, vui lòng nhấp vào nút bên dưới:
                                        </p>
                                        
                                        <!-- Button -->
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <a href="{verification_link}" 
                                                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                                        ✅ Xác thực Email
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Alternative Link -->
                                        <div style="margin: 30px 0; padding: 20px; background: #f7fafc; border-radius: 8px; border-left: 4px solid #667eea;">
                                            <p style="margin: 0 0 10px 0; color: #2d3748; font-size: 14px; font-weight: 600;">Hoặc copy link sau vào trình duyệt:</p>
                                            <p style="margin: 0; color: #4a5568; font-size: 13px; word-break: break-all; line-height: 1.5;">
                                                <a href="{verification_link}" style="color: #667eea; text-decoration: none;">{verification_link}</a>
                                            </p>
                                        </div>
                                        
                                        <!-- Important Notes -->
                                        <div style="margin: 30px 0; padding: 20px; background: #fff5f5; border-radius: 8px; border-left: 4px solid #fc8181;">
                                            <p style="margin: 0 0 10px 0; color: #742a2a; font-size: 15px; font-weight: 600;">⚠️ Lưu ý:</p>
                                            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #742a2a; font-size: 14px;">
                                                <li style="margin-bottom: 8px;">Link xác thực sẽ hết hạn sau 24 giờ</li>
                                                <li>Nếu bạn không yêu cầu xác thực này, vui lòng bỏ qua email</li>
                                            </ul>
                                        </div>
                                        
                                        <!-- Benefits Section -->
                                        <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%); border-radius: 8px;">
                                            <h3 style="margin: 0 0 15px 0; color: #5a67d8; font-size: 18px; font-weight: 600;">🚀 Lợi ích khi xác thực email:</h3>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="padding: 8px 0; color: #4c51bf; font-size: 14px;">
                                                        <span style="font-weight: 700;">🔒</span> Bảo mật tài khoản tốt hơn
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #4c51bf; font-size: 14px;">
                                                        <span style="font-weight: 700;">🔔</span> Nhận thông báo quan trọng
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #4c51bf; font-size: 14px;">
                                                        <span style="font-weight: 700;">🎁</span> Truy cập đầy đủ tính năng
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #4c51bf; font-size: 14px;">
                                                        <span style="font-weight: 700;">💌</span> Nhận ưu đãi đặc biệt
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background: #f7fafc; border-top: 1px solid #e2e8f0;">
                                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px; text-align: center; line-height: 1.5;">
                                            Nếu bạn cần hỗ trợ, vui lòng liên hệ <a href="mailto:support@tripook.com" style="color: #667eea; text-decoration: none;">support@tripook.com</a>
                                        </p>
                                        <p style="margin: 0; color: #a0aec0; font-size: 13px; text-align: center;">
                                            © 2025 Tripook. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            
            # Mock mode if API not configured
            if not self.api_instance:
                print("⚠️ Brevo API not configured. Mock mode.")
                print(f"📧 Would send verification email to: {to_email}")
                print(f"🔗 Verification link: {verification_link}")
                return True
            
            # Send email via Brevo
            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=[{"email": to_email, "name": user_name}],
                sender={"email": self.from_email, "name": self.from_name},
                subject="Xác thực tài khoản Tripook - Verify your Tripook account",
                html_content=html_content
            )
            
            api_response = self.api_instance.send_transac_email(send_smtp_email)
            print(f"✅ Verification email sent to: {to_email}")
            print(f"📬 Brevo Message ID: {api_response.message_id}")
            return True
            
        except ApiException as e:
            print(f"❌ Brevo API error: {e}")
            return False
        except Exception as e:
            print(f"❌ Failed to send verification email: {str(e)}")
            return False
    
    def send_password_reset_email(self, to_email: str, reset_token: str, user_name: str):
        """Send password reset email to user via Brevo"""
        try:
            reset_link = f"{self.frontend_url}/auth/reset-password?token={reset_token}"
            
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
            
            # Mock mode if API not configured
            if not self.api_instance:
                print("⚠️ Brevo API not configured. Mock mode.")
                print(f"📧 Would send reset email to: {to_email}")
                print(f"🔗 Reset link: {reset_link}")
                return True
            
            # Send email via Brevo
            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=[{"email": to_email, "name": user_name}],
                sender={"email": self.from_email, "name": self.from_name},
                subject="Đặt lại mật khẩu Tripook - Reset your Tripook password",
                html_content=html_content
            )
            
            api_response = self.api_instance.send_transac_email(send_smtp_email)
            print(f"✅ Password reset email sent to: {to_email}")
            print(f"📬 Brevo Message ID: {api_response.message_id}")
            return True
            
        except ApiException as e:
            print(f"❌ Brevo API error: {e}")
            return False
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
        """Send provider approval notification email via Brevo"""
        try:
            # Dashboard link
            dashboard_link = f"{self.frontend_url}/provider/dashboard"
            
            # HTML content with Vietnamese Soul theme
            html_content = f"""
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Tài khoản Provider đã được phê duyệt - Tripook</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF3E0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #FAF3E0; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <!-- Main Container -->
                            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(10, 35, 66, 0.15); overflow: hidden; max-width: 600px; border: 2px solid #AE8E5B;">
                                
                                <!-- Header with Success Gradient -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 50px 40px; text-align: center; border-bottom: 3px solid #AE8E5B;">
                                        <div style="font-size: 72px; margin-bottom: 15px; animation: bounce 1s ease-in-out;">🎉</div>
                                        <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; font-family: 'Merriweather', serif; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Chúc mừng, {user_name}!</h1>
                                        <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.95); font-size: 18px;">Tài khoản Provider đã được kích hoạt</p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="margin: 0 0 20px 0; color: #0A2342; font-size: 24px; font-weight: 600; font-family: 'Merriweather', serif;">
                                            ✅ Tài khoản đã được phê duyệt thành công
                                        </h2>
                                        
                                        <p style="margin: 0 0 20px 0; color: #2D3748; font-size: 16px; line-height: 1.7;">
                                            Chúng tôi rất vui mừng thông báo rằng tài khoản nhà cung cấp dịch vụ của 
                                            <strong style="color: #AE8E5B;">{company_name}</strong> đã được phê duyệt và kích hoạt thành công!
                                        </p>
                                        
                                        <!-- Success Card -->
                                        <div style="background: linear-gradient(135deg, #FFFEF8 0%, #FAF3E0 100%); border: 2px solid #AE8E5B; border-radius: 12px; padding: 25px; margin: 30px 0; box-shadow: 0 4px 12px rgba(174, 142, 91, 0.2);">
                                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                                <div style="font-size: 36px; margin-right: 15px;">🏢</div>
                                                <h3 style="margin: 0; color: #0A2342; font-size: 20px; font-weight: 600;">Bắt đầu ngay hôm nay</h3>
                                            </div>
                                            <p style="margin: 0 0 20px 0; color: #4A5568; font-size: 15px; line-height: 1.6;">
                                                Bạn có thể truy cập Provider Dashboard và bắt đầu tạo các dịch vụ du lịch của mình ngay lập tức.
                                            </p>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td align="center" style="padding: 10px 0;">
                                                        <a href="{dashboard_link}" 
                                                           style="display: inline-block; background: linear-gradient(135deg, #AE8E5B 0%, #C4A570 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: 600; box-shadow: 0 6px 20px rgba(174, 142, 91, 0.4); font-family: 'Be Vietnam Pro', sans-serif;">
                                                            🚀 Truy cập Dashboard
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        
                                        <!-- Features Section -->
                                        <div style="background: #F7FAFC; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #E2E8F0;">
                                            <h3 style="margin: 0 0 20px 0; color: #0A2342; font-size: 20px; font-weight: 600; font-family: 'Merriweather', serif;">
                                                🌟 Tính năng bạn có thể sử dụng
                                            </h3>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="padding: 12px 0;">
                                                        <div style="display: flex; align-items: start;">
                                                            <span style="font-size: 24px; margin-right: 12px;">📝</span>
                                                            <div>
                                                                <strong style="color: #1A3A5C; font-size: 15px;">Tạo & Quản lý Dịch vụ</strong>
                                                                <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">Đăng tải các tour du lịch, homestay, và dịch vụ khác</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-top: 1px solid #E2E8F0;">
                                                        <div style="display: flex; align-items: start;">
                                                            <span style="font-size: 24px; margin-right: 12px;">📊</span>
                                                            <div>
                                                                <strong style="color: #1A3A5C; font-size: 15px;">Thống kê & Báo cáo</strong>
                                                                <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">Xem đặt chỗ, doanh thu, và phân tích chi tiết</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-top: 1px solid #E2E8F0;">
                                                        <div style="display: flex; align-items: start;">
                                                            <span style="font-size: 24px; margin-right: 12px;">💬</span>
                                                            <div>
                                                                <strong style="color: #1A3A5C; font-size: 15px;">Tương tác Khách hàng</strong>
                                                                <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">Trả lời đánh giá và hỗ trợ khách hàng</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-top: 1px solid #E2E8F0;">
                                                        <div style="display: flex; align-items: start;">
                                                            <span style="font-size: 24px; margin-right: 12px;">📈</span>
                                                            <div>
                                                                <strong style="color: #1A3A5C; font-size: 15px;">Marketing & Quảng bá</strong>
                                                                <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">Sử dụng công cụ để tăng khả năng tiếp cận</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        
                                        <!-- Tips Section -->
                                        <div style="background: linear-gradient(135deg, #EBF8FF 0%, #E0F2FE 100%); border-left: 4px solid #3B82F6; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                            <h4 style="margin: 0 0 15px 0; color: #1E40AF; font-size: 18px; font-weight: 600;">💡 Mẹo để bắt đầu thành công</h4>
                                            <ol style="margin: 0; padding-left: 20px; color: #2563EB; font-size: 14px; line-height: 1.8;">
                                                <li style="margin-bottom: 8px;">Hoàn thiện profile với thông tin chi tiết và ảnh đại diện chuyên nghiệp</li>
                                                <li style="margin-bottom: 8px;">Tạo dịch vụ đầu tiên với mô tả hấp dẫn và đầy đủ</li>
                                                <li style="margin-bottom: 8px;">Upload ảnh chất lượng cao (tối thiểu 5 ảnh cho mỗi dịch vụ)</li>
                                                <li style="margin-bottom: 8px;">Thiết lập giá cả cạnh tranh và chính sách hủy linh hoạt</li>
                                                <li>Phản hồi nhanh chóng với khách hàng để tăng uy tín</li>
                                            </ol>
                                        </div>
                                        
                                        <!-- Support Section -->
                                        <div style="background: #FFFBF0; border: 2px solid #FCD34D; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                            <h4 style="margin: 0 0 10px 0; color: #92400E; font-size: 16px; font-weight: 600;">📞 Cần hỗ trợ?</h4>
                                            <p style="margin: 0; color: #78350F; font-size: 14px; line-height: 1.6;">
                                                Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn:<br>
                                                📧 Email: <a href="mailto:support@tripook.com" style="color: #AE8E5B; text-decoration: none; font-weight: 600;">support@tripook.com</a><br>
                                                📱 Hotline: <strong style="color: #92400E;">1900-TRIPOOK</strong><br>
                                                🕐 Thứ 2 - Thứ 6, 8:00 - 17:30
                                            </p>
                                        </div>
                                        
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background: linear-gradient(135deg, #FAF3E0 0%, #FFFEF8 100%); border-top: 2px solid #AE8E5B;">
                                        <p style="margin: 0 0 10px 0; color: #0A2342; font-size: 16px; text-align: center; font-weight: 600; font-family: 'Merriweather', serif;">
                                            Chào mừng bạn đến với cộng đồng Tripook! 🌏
                                        </p>
                                        <p style="margin: 0; color: #718096; font-size: 13px; text-align: center; line-height: 1.5;">
                                            © 2025 Tripook - Hồn Việt. All rights reserved.<br>
                                            <a href="{self.frontend_url}" style="color: #AE8E5B; text-decoration: none;">www.tripook.com</a>
                                        </p>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            
            # Mock mode if API not configured
            if not self.api_instance:
                print("⚠️ Brevo API not configured. Mock mode.")
                print(f"📧 Would send provider approval email to: {to_email}")
                print(f"👤 Provider: {user_name} ({company_name})")
                print(f"🔗 Dashboard link: {dashboard_link}")
                return True
            
            # Send email via Brevo
            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=[{"email": to_email, "name": user_name}],
                sender={"email": self.from_email, "name": self.from_name},
                subject="🎉 Tài khoản Provider đã được phê duyệt - Tripook",
                html_content=html_content
            )
            
            api_response = self.api_instance.send_transac_email(send_smtp_email)
            print(f"✅ Provider approval email sent to: {to_email}")
            print(f"📬 Brevo Message ID: {api_response.message_id}")
            return True
            
        except ApiException as e:
            print(f"❌ Brevo API error: {e}")
            return False
        except Exception as e:
            print(f"❌ Failed to send approval email: {str(e)}")
            return False

    def send_provider_rejection_email(self, to_email: str, user_name: str, company_name: str, reason: str = ""):
        """Send provider rejection notification email via Brevo"""
        try:
            # Contact link
            contact_link = f"{self.frontend_url}/contact"
            
            # HTML content with Vietnamese Soul theme
            html_content = f"""
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thông báo về tài khoản Provider - Tripook</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF3E0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #FAF3E0; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <!-- Main Container -->
                            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(10, 35, 66, 0.15); overflow: hidden; max-width: 600px; border: 2px solid #AE8E5B;">
                                
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #0A2342 0%, #1A3A5C 100%); padding: 50px 40px; text-align: center; border-bottom: 3px solid #AE8E5B;">
                                        <div style="font-size: 64px; margin-bottom: 15px;">📋</div>
                                        <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; font-family: 'Merriweather', serif; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Thông báo về đăng ký Provider</h1>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="margin: 0 0 20px 0; color: #0A2342; font-size: 24px; font-weight: 600; font-family: 'Merriweather', serif;">
                                            Xin chào {user_name},
                                        </h2>
                                        
                                        <p style="margin: 0 0 25px 0; color: #2D3748; font-size: 16px; line-height: 1.7;">
                                            Cảm ơn bạn đã quan tâm và đăng ký tài khoản nhà cung cấp dịch vụ tại Tripook cho 
                                            <strong style="color: #AE8E5B;">{company_name}</strong>.
                                        </p>
                                        
                                        <!-- Rejection Notice -->
                                        <div style="background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%); border: 2px solid #EF4444; border-left: 6px solid #DC2626; border-radius: 12px; padding: 25px; margin: 30px 0; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);">
                                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                                <div style="font-size: 36px; margin-right: 15px;">⚠️</div>
                                                <h3 style="margin: 0; color: #991B1B; font-size: 20px; font-weight: 600;">Đơn đăng ký chưa được chấp thuận</h3>
                                            </div>
                                            <p style="margin: 0 0 15px 0; color: #7F1D1D; font-size: 15px; line-height: 1.6;">
                                                Rất tiếc, tài khoản Provider của bạn chưa đáp ứng được các yêu cầu của chúng tôi tại thời điểm này.
                                            </p>
                                            {f'''
                                            <div style="background: white; border-radius: 8px; padding: 15px; margin-top: 15px;">
                                                <p style="margin: 0 0 8px 0; color: #991B1B; font-weight: 600; font-size: 14px;">📝 Lý do:</p>
                                                <p style="margin: 0; color: #7F1D1D; font-size: 14px; line-height: 1.6; font-style: italic;">"{reason}"</p>
                                            </div>
                                            ''' if reason else ''}
                                        </div>
                                        
                                        <!-- Next Steps -->
                                        <div style="background: #F7FAFC; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #E2E8F0;">
                                            <h3 style="margin: 0 0 20px 0; color: #0A2342; font-size: 20px; font-weight: 600; font-family: 'Merriweather', serif;">
                                                🔄 Các bước tiếp theo
                                            </h3>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="padding: 12px 0;">
                                                        <div style="display: flex; align-items: start;">
                                                            <span style="font-size: 24px; margin-right: 12px;">📞</span>
                                                            <div>
                                                                <strong style="color: #1A3A5C; font-size: 15px;">Liên hệ hỗ trợ</strong>
                                                                <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">Đội ngũ của chúng tôi sẽ tư vấn chi tiết và hướng dẫn bạn</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-top: 1px solid #E2E8F0;">
                                                        <div style="display: flex; align-items: start;">
                                                            <span style="font-size: 24px; margin-right: 12px;">📝</span>
                                                            <div>
                                                                <strong style="color: #1A3A5C; font-size: 15px;">Cập nhật thông tin</strong>
                                                                <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">Bổ sung đầy đủ giấy tờ và thông tin cần thiết</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-top: 1px solid #E2E8F0;">
                                                        <div style="display: flex; align-items: start;">
                                                            <span style="font-size: 24px; margin-right: 12px;">📋</span>
                                                            <div>
                                                                <strong style="color: #1A3A5C; font-size: 15px;">Chuẩn bị giấy tờ</strong>
                                                                <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">Đảm bảo có đầy đủ giấy phép kinh doanh hợp lệ</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-top: 1px solid #E2E8F0;">
                                                        <div style="display: flex; align-items: start;">
                                                            <span style="font-size: 24px; margin-right: 12px;">🔄</span>
                                                            <div>
                                                                <strong style="color: #1A3A5C; font-size: 15px;">Đăng ký lại</strong>
                                                                <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px; line-height: 1.5;">Sau khi hoàn tất, bạn có thể đăng ký lại</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        
                                        <!-- Contact Button -->
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <a href="{contact_link}" 
                                                       style="display: inline-block; background: linear-gradient(135deg, #AE8E5B 0%, #C4A570 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: 600; box-shadow: 0 6px 20px rgba(174, 142, 91, 0.4); font-family: 'Be Vietnam Pro', sans-serif;">
                                                        📞 Liên hệ hỗ trợ
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Support Info -->
                                        <div style="background: linear-gradient(135deg, #FFFEF8 0%, #FAF3E0 100%); border: 2px solid #AE8E5B; border-radius: 12px; padding: 25px; margin: 25px 0;">
                                            <h4 style="margin: 0 0 15px 0; color: #0A2342; font-size: 18px; font-weight: 600; font-family: 'Merriweather', serif;">
                                                📧 Thông tin liên hệ
                                            </h4>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="padding: 8px 0; color: #4A5568; font-size: 14px;">
                                                        <strong style="color: #1A3A5C;">Email:</strong> 
                                                        <a href="mailto:support@tripook.com" style="color: #AE8E5B; text-decoration: none; font-weight: 600;">support@tripook.com</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #4A5568; font-size: 14px;">
                                                        <strong style="color: #1A3A5C;">Hotline:</strong> 
                                                        <span style="color: #AE8E5B; font-weight: 700;">1900-TRIPOOK</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #4A5568; font-size: 14px;">
                                                        <strong style="color: #1A3A5C;">Giờ làm việc:</strong> 
                                                        Thứ 2 - Thứ 6, 8:00 - 17:30
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        
                                        <!-- Encouragement -->
                                        <div style="background: linear-gradient(135deg, #EBF8FF 0%, #E0F2FE 100%); border-left: 4px solid #3B82F6; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                            <p style="margin: 0; color: #1E40AF; font-size: 15px; line-height: 1.7;">
                                                <strong>💪 Đừng nản lòng!</strong> Chúng tôi luôn chào đón các đối tác chất lượng. 
                                                Hãy liên hệ với chúng tôi để được hướng dẫn cụ thể về cách hoàn thiện hồ sơ đăng ký.
                                            </p>
                                        </div>
                                        
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background: linear-gradient(135deg, #FAF3E0 0%, #FFFEF8 100%); border-top: 2px solid #AE8E5B;">
                                        <p style="margin: 0 0 10px 0; color: #0A2342; font-size: 16px; text-align: center; font-weight: 600; font-family: 'Merriweather', serif;">
                                            Cảm ơn bạn đã quan tâm đến Tripook
                                        </p>
                                        <p style="margin: 0; color: #718096; font-size: 13px; text-align: center; line-height: 1.5;">
                                            © 2025 Tripook - Hồn Việt. All rights reserved.<br>
                                            <a href="{self.frontend_url}" style="color: #AE8E5B; text-decoration: none;">www.tripook.com</a>
                                        </p>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            
            # Mock mode if API not configured
            if not self.api_instance:
                print("⚠️ Brevo API not configured. Mock mode.")
                print(f"📧 Would send provider rejection email to: {to_email}")
                print(f"👤 Provider: {user_name} ({company_name})")
                print(f"❌ Reason: {reason if reason else 'No reason provided'}")
                return True
            
            # Send email via Brevo
            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=[{"email": to_email, "name": user_name}],
                sender={"email": self.from_email, "name": self.from_name},
                subject="📋 Thông báo về đăng ký tài khoản Provider - Tripook",
                html_content=html_content
            )
            
            api_response = self.api_instance.send_transac_email(send_smtp_email)
            print(f"✅ Provider rejection email sent to: {to_email}")
            print(f"📬 Brevo Message ID: {api_response.message_id}")
            return True
            
        except ApiException as e:
            print(f"❌ Brevo API error: {e}")
            return False
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