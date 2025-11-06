import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-bg-footer)',
      color: 'var(--color-text-light)',
      padding: 'var(--space-4xl) 0 var(--space-2xl) 0'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3" style={{ marginBottom: 'var(--space-xl)' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: 'var(--color-brushed-bronze)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  color: 'var(--color-text-light)',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: '600',
                  fontSize: 'var(--text-xl)'
                }}>T</span>
              </div>
              <span style={{
                fontSize: 'var(--text-2xl)',
                fontFamily: 'var(--font-serif)',
                fontWeight: '500',
                letterSpacing: '0.05em'
              }}>TRIPOOK</span>
            </div>
            <p style={{
              color: 'rgba(248, 245, 242, 0.8)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: '20rem',
              margin: '0 auto 0 auto',
              fontFamily: 'var(--font-sans)'
            }} className="md:mx-0">
              Nền tảng đặt tour du lịch hàng đầu, mang đến những trải nghiệm tuyệt vời và kỷ niệm khó quên cho mọi chuyến đi của bạn.
            </p>
            <p style={{
              color: 'rgba(248, 245, 242, 0.6)',
              fontSize: 'var(--text-xs)',
              marginTop: 'var(--space-md)',
              fontStyle: 'italic',
              fontFamily: 'var(--font-sans)'
            }}>
              * Đây là sản phẩm học tập không dùng để kinh doanh
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div className="text-center md:text-left">
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontFamily: 'var(--font-serif)',
              fontWeight: '500',
              marginBottom: 'var(--space-xl)',
              color: 'var(--color-text-light)'
            }}>Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li><Link to="/about" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Về chúng tôi</Link></li>
              <li><Link to="/services" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Dịch vụ</Link></li>
              <li><a href="#support" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Trở thành đối tác</a></li>
              <li><a href="#tours" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Đặt tour</a></li>
              <li><a href="#contact" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Liên hệ</a></li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="text-center md:text-left">
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontFamily: 'var(--font-serif)',
              fontWeight: '500',
              marginBottom: 'var(--space-xl)',
              color: 'var(--color-text-light)'
            }}>Hỗ trợ khách hàng</h3>
            <ul className="space-y-3">
              <li><a href="#help-center" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Trung tâm trợ giúp</a></li>
              <li><a href="#faq" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Câu hỏi thường gặp</a></li>
              <li><a href="#terms" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Điều khoản sử dụng</a></li>
              <li><a href="#privacy" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Chính sách bảo mật</a></li>
              <li><a href="#cancellation" style={{
                color: 'rgba(248, 245, 242, 0.8)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease-in-out'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 245, 242, 0.8)'}>Chính sách hủy tour</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-left">
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontFamily: 'var(--font-serif)',
              fontWeight: '500',
              marginBottom: 'var(--space-xl)',
              color: 'var(--color-text-light)'
            }}>Theo dõi chúng tôi</h3>
            <p style={{
              color: 'rgba(248, 245, 242, 0.8)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-md)',
              fontFamily: 'var(--font-sans)'
            }}>
              Đăng ký nhận tin tức và ưu đãi mới nhất từ Tripook
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  backgroundColor: 'rgba(78, 74, 71, 0.8)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '0.5rem',
                  color: 'var(--color-text-light)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-brushed-bronze)';
                  e.currentTarget.style.backgroundColor = 'rgba(78, 74, 71, 0.9)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.backgroundColor = 'rgba(78, 74, 71, 0.8)';
                }}
              />
              <button className="btn-primary">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div style={{
          borderTop: '1px solid rgba(199, 193, 184, 0.3)',
          paddingTop: 'var(--space-2xl)'
        }}>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12">
            {/* Hotline */}
            <div className="flex items-center space-x-3">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                backgroundColor: 'var(--color-brushed-bronze)',
                borderRadius: '50%'
              }}>
                <svg style={{ width: '1rem', height: '1rem', color: 'var(--color-text-light)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p style={{
                  color: 'rgba(248, 245, 242, 0.6)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0'
                }}>Hotline:</p>
                <p style={{
                  color: 'var(--color-text-light)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  fontFamily: 'var(--font-sans)',
                  margin: '0'
                }}>1900-1234</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                backgroundColor: 'var(--color-brushed-bronze)',
                borderRadius: '50%'
              }}>
                <svg style={{ width: '1rem', height: '1rem', color: 'var(--color-text-light)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p style={{
                  color: 'rgba(248, 245, 242, 0.6)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0'
                }}>Email:</p>
                <p style={{
                  color: 'var(--color-text-light)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  fontFamily: 'var(--font-sans)',
                  margin: '0'
                }}>info@tripook.vn</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center space-x-3">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                backgroundColor: 'var(--color-brushed-bronze)',
                borderRadius: '50%'
              }}>
                <svg style={{ width: '1rem', height: '1rem', color: 'var(--color-text-light)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p style={{
                  color: 'rgba(248, 245, 242, 0.6)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0'
                }}>Địa chỉ:</p>
                <p style={{
                  color: 'var(--color-text-light)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  fontFamily: 'var(--font-sans)',
                  margin: '0'
                }}>TP. Hồ Chí Minh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(199, 193, 184, 0.3)',
          marginTop: 'var(--space-2xl)',
          paddingTop: 'var(--space-xl)'
        }}>
          <p style={{
            textAlign: 'center',
            color: 'rgba(248, 245, 242, 0.6)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-sans)',
            margin: '0'
          }}>
            © 2025 Tripook. All rights reserved. Plan your perfect adventure with us.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;