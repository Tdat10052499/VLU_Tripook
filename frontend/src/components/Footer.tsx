import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert('Cảm ơn bạn đã đăng ký nhận tin!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer style={{
      position: 'relative',
      backgroundColor: 'var(--color-deep-indigo)',
      color: 'var(--color-cream)',
      paddingTop: 'var(--spacing-20)',
      paddingBottom: 'var(--spacing-8)',
      borderTop: '3px solid var(--color-bronze)',
      overflow: 'hidden'
    }}>
      {/* Decorative Pattern Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(205, 127, 50, 0.03) 35px,
            rgba(205, 127, 50, 0.03) 70px
          )
        `,
        opacity: 0.5,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 var(--spacing-8)'
      }}>
        {/* Newsletter Section */}
        <div style={{
          backgroundColor: 'rgba(205, 127, 50, 0.1)',
          border: '2px solid var(--color-bronze-light)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--spacing-12)',
          marginBottom: 'var(--spacing-16)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-cream)',
            marginBottom: 'var(--spacing-3)'
          }}>
            Nhận thông tin du lịch mới nhất
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-base)',
            color: 'rgba(247, 237, 226, 0.85)',
            marginBottom: 'var(--spacing-6)',
            maxWidth: '600px',
            margin: '0 auto var(--spacing-6)'
          }}>
            Đăng ký để nhận ưu đãi, tin tức và cảm hứng du lịch mới nhất từ Tripook
          </p>
          <form onSubmit={handleNewsletterSubmit} style={{
            display: 'flex',
            gap: 'var(--spacing-3)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
              style={{
                flex: 1,
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--color-bronze-light)',
                backgroundColor: '#FFFFFF',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-bronze)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(205, 127, 50, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0 var(--spacing-8)',
                backgroundColor: 'var(--color-vermilion)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-bold)',
                fontFamily: 'var(--font-body)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-md)',
                whiteSpace: 'nowrap',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = 'var(--color-deep-indigo)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-vermilion)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
            </button>
          </form>
        </div>

        {/* Main Footer Content - 4 Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--spacing-12)',
          marginBottom: 'var(--spacing-12)',
          textAlign: 'left'
        }}>
          {/* Column 1: Về Tripook + Logo */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              marginBottom: 'var(--spacing-6)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--color-bronze)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)'
              }}>
                <span style={{
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'var(--font-weight-bold)',
                  fontSize: 'var(--font-size-2xl)'
                }}>T</span>
              </div>
              <span style={{
                fontSize: 'var(--font-size-2xl)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-cream)'
              }}>Tripook</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              lineHeight: 1.7,
              color: 'rgba(247, 237, 226, 0.85)',
              marginBottom: 'var(--spacing-4)'
            }}>
              Kết nối du khách với dịch vụ du lịch uy tín, khám phá vẻ đẹp Việt Nam cùng Tripook.
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-bronze)',
              fontStyle: 'italic',
              margin: 0
            }}>
              ✨ Sản phẩm học tập
            </p>
          </div>

          {/* Column 2: Dịch vụ */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--spacing-6)',
              color: 'var(--color-bronze)',
              borderBottom: '2px solid var(--color-bronze-light)',
              paddingBottom: 'var(--spacing-3)'
            }}>Dịch vụ</h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)'
            }}>
              <li><Link to="/" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                color: 'rgba(247, 237, 226, 0.85)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontWeight: 'var(--font-weight-medium)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(247, 237, 226, 0.85)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>Trang chủ</Link></li>
              <li><Link to="/services" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                color: 'rgba(247, 237, 226, 0.85)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontWeight: 'var(--font-weight-medium)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(247, 237, 226, 0.85)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>Khám phá dịch vụ</Link></li>
              <li><Link to="/about" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                color: 'rgba(247, 237, 226, 0.85)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontWeight: 'var(--font-weight-medium)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(247, 237, 226, 0.85)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>Về chúng tôi</Link></li>
              <li><Link to="/auth/register" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                color: 'rgba(247, 237, 226, 0.85)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontWeight: 'var(--font-weight-medium)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(247, 237, 226, 0.85)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>Trở thành đối tác</Link></li>
            </ul>
          </div>

          {/* Column 3: Hỗ trợ */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--spacing-6)',
              color: 'var(--color-bronze)',
              borderBottom: '2px solid var(--color-bronze-light)',
              paddingBottom: 'var(--spacing-3)'
            }}>Hỗ trợ</h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)'
            }}>
              <li><a href="#help" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                color: 'rgba(247, 237, 226, 0.85)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontWeight: 'var(--font-weight-medium)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(247, 237, 226, 0.85)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>Trung tâm trợ giúp</a></li>
              <li><a href="#faq" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                color: 'rgba(247, 237, 226, 0.85)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontWeight: 'var(--font-weight-medium)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(247, 237, 226, 0.85)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>Câu hỏi thường gặp</a></li>
              <li><a href="#terms" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                color: 'rgba(247, 237, 226, 0.85)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontWeight: 'var(--font-weight-medium)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(247, 237, 226, 0.85)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>Điều khoản sử dụng</a></li>
              <li><a href="#privacy" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                color: 'rgba(247, 237, 226, 0.85)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontWeight: 'var(--font-weight-medium)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(247, 237, 226, 0.85)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Column 4: Liên hệ & Social */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--spacing-6)',
              color: 'var(--color-bronze)',
              borderBottom: '2px solid var(--color-bronze-light)',
              paddingBottom: 'var(--spacing-3)'
            }}>Liên hệ</h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)',
              marginBottom: 'var(--spacing-6)'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <FaPhone style={{ color: 'var(--color-bronze)', fontSize: '16px' }} />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  color: 'rgba(247, 237, 226, 0.85)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>1900-1234</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <FaEnvelope style={{ color: 'var(--color-bronze)', fontSize: '16px' }} />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  color: 'rgba(247, 237, 226, 0.85)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>info@tripook.vn</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <FaMapMarkerAlt style={{ color: 'var(--color-bronze)', fontSize: '16px' }} />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  color: 'rgba(247, 237, 226, 0.85)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>TP. Hồ Chí Minh</span>
              </li>
            </ul>

            {/* Social Media */}
            <div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-bronze)',
                marginBottom: 'var(--spacing-3)',
                fontWeight: 'var(--font-weight-semibold)'
              }}>
                Theo dõi chúng tôi
              </p>
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-3)'
              }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(205, 127, 50, 0.1)',
                  border: '2px solid var(--color-bronze-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-bronze)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                  e.currentTarget.style.color = 'var(--color-bronze)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <FaFacebookF size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(205, 127, 50, 0.1)',
                  border: '2px solid var(--color-bronze-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-bronze)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                  e.currentTarget.style.color = 'var(--color-bronze)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <FaInstagram size={18} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(205, 127, 50, 0.1)',
                  border: '2px solid var(--color-bronze-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-bronze)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                  e.currentTarget.style.color = 'var(--color-bronze)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <FaTwitter size={18} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(205, 127, 50, 0.1)',
                  border: '2px solid var(--color-bronze-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-bronze)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                  e.currentTarget.style.color = 'var(--color-bronze)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <FaYoutube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div style={{
          borderTop: '2px solid var(--color-bronze-light)',
          marginTop: 'var(--spacing-12)',
          paddingTop: 'var(--spacing-8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--spacing-4)'
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-sm)',
            color: 'rgba(247, 237, 226, 0.7)',
            margin: 0
          }}>
            © 2025 <span style={{ 
              fontWeight: 'var(--font-weight-bold)', 
              color: 'var(--color-bronze)',
              fontFamily: 'var(--font-heading)'
            }}>Tripook</span>. Khám phá vẻ đẹp Việt Nam cùng chúng tôi.
          </p>
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-6)',
            flexWrap: 'wrap'
          }}>
            <a href="#terms" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              color: 'rgba(247, 237, 226, 0.7)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontWeight: 'var(--font-weight-medium)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-bronze)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(247, 237, 226, 0.7)'}>
              Điều khoản
            </a>
            <a href="#privacy" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              color: 'rgba(247, 237, 226, 0.7)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontWeight: 'var(--font-weight-medium)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-bronze)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(247, 237, 226, 0.7)'}>
              Bảo mật
            </a>
            <a href="#cookies" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              color: 'rgba(247, 237, 226, 0.7)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontWeight: 'var(--font-weight-medium)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-bronze)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(247, 237, 226, 0.7)'}>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;