import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { FaCheckCircle, FaStore, FaChartLine, FaCog, FaRocket } from 'react-icons/fa';

const ProviderApprovedSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div style={{
        minHeight: 'calc(100vh - 140px)',
        paddingTop: '100px',
        paddingBottom: 'var(--space-4xl)',
        background: 'linear-gradient(135deg, var(--color-soft-cream) 0%, var(--color-cream) 100%)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: `0 var(--space-md)`,
          position: 'relative',
          zIndex: 1
        }}>
          {/* Success Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '1rem',
            padding: 'var(--space-3xl) var(--space-2xl)',
            textAlign: 'center',
            color: 'white',
            marginBottom: 'var(--space-xl)',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
            border: '2px solid #34D399'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto var(--space-xl)',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              animation: 'scaleIn 0.6s ease-out'
            }}>
              <FaCheckCircle style={{ fontSize: '64px', color: 'white' }} />
            </div>
            
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-4xl)',
              fontWeight: '600',
              marginBottom: 'var(--space-md)'
            }}>
              🎉 Tài khoản đã được xác thực!
            </h1>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-lg)',
              opacity: 0.95,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 'var(--leading-relaxed)'
            }}>
              Chào mừng bạn trở thành đối tác của Tripook! Tài khoản Provider của bạn đã được kích hoạt thành công.
            </p>
          </div>

          {/* Main Content Card */}
          <div style={{
            background: 'var(--color-soft-cream)',
            borderRadius: '1rem',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            border: '2px solid var(--color-bronze-gold)'
          }}>
            <div style={{ padding: 'var(--space-2xl)' }}>
              {/* Getting Started Section */}
              <div style={{
                background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF8E1 100%)',
                borderRadius: '0.75rem',
                padding: 'var(--space-xl)',
                marginBottom: 'var(--space-xl)',
                border: '2px solid var(--color-bronze-gold)'
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: '600',
                  color: 'var(--color-indigo-blue)',
                  marginBottom: 'var(--space-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)'
                }}>
                  <FaRocket style={{ color: 'var(--color-bronze-gold)' }} />
                  Bắt đầu với Tripook
                </h2>
                
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 'var(--leading-relaxed)',
                  marginBottom: 'var(--space-lg)'
                }}>
                  Để bắt đầu kinh doanh trên Tripook, bạn cần tạo các dịch vụ du lịch của mình. 
                  Hãy làm theo các bước hướng dẫn bên dưới để thiết lập dịch vụ đầu tiên.
                </p>
              </div>

              {/* Step-by-Step Guide */}
              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: 'var(--space-xl)',
                marginBottom: 'var(--space-xl)',
                border: '2px solid var(--color-border-subtle)'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: '600',
                  color: 'var(--color-indigo-blue)',
                  marginBottom: 'var(--space-xl)'
                }}>
                  📝 Hướng dẫn thiết lập
                </h3>

                {/* Step 1 */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-lg)',
                  marginBottom: 'var(--space-xl)',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-bronze-gold), #C4A570)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: 'var(--text-xl)',
                    flexShrink: 0
                  }}>
                    1
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-sm)'
                    }}>
                      <FaStore style={{ color: 'var(--color-bronze-gold)', marginRight: 'var(--space-sm)' }} />
                      Tạo dịch vụ đầu tiên
                    </h4>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 'var(--leading-relaxed)',
                      margin: 0
                    }}>
                      Truy cập Provider Dashboard và click vào "Tạo dịch vụ mới". Điền đầy đủ thông tin về dịch vụ của bạn bao gồm: tên, mô tả, giá cả, hình ảnh và các tiện ích.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-lg)',
                  marginBottom: 'var(--space-xl)',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-bronze-gold), #C4A570)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: 'var(--text-xl)',
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-sm)'
                    }}>
                      <FaChartLine style={{ color: 'var(--color-bronze-gold)', marginRight: 'var(--space-sm)' }} />
                      Quản lý và theo dõi
                    </h4>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 'var(--leading-relaxed)',
                      margin: 0
                    }}>
                      Sử dụng Dashboard để theo dõi booking, đánh giá từ khách hàng, và doanh thu. Cập nhật thông tin dịch vụ thường xuyên để tăng khả năng tiếp cận khách hàng.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-lg)',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-bronze-gold), #C4A570)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: 'var(--text-xl)',
                    flexShrink: 0
                  }}>
                    3
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-sm)'
                    }}>
                      <FaCog style={{ color: 'var(--color-bronze-gold)', marginRight: 'var(--space-sm)' }} />
                      Tối ưu hóa hiệu suất
                    </h4>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 'var(--leading-relaxed)',
                      margin: 0
                    }}>
                      Phản hồi nhanh với khách hàng, duy trì chất lượng dịch vụ cao, và tận dụng các công cụ marketing từ Tripook để tăng doanh số.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-lg)'
              }}>
                <button
                  onClick={() => navigate('/provider/services/new')}
                  style={{
                    background: 'linear-gradient(135deg, var(--color-bronze-gold), #C4A570)',
                    color: 'white',
                    border: 'none',
                    padding: 'var(--space-md) var(--space-lg)',
                    borderRadius: '0.5rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-base)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-sm)',
                    boxShadow: 'var(--shadow-bronze)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(174, 142, 91, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-bronze)';
                  }}
                >
                  <FaStore /> Tạo dịch vụ ngay
                </button>
                
                <button
                  onClick={() => navigate('/provider/dashboard')}
                  style={{
                    background: 'white',
                    color: 'var(--color-indigo-blue)',
                    border: '2px solid var(--color-bronze-gold)',
                    padding: 'var(--space-md) var(--space-lg)',
                    borderRadius: '0.5rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-base)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-sm)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-bronze-gold)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-bronze)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = 'var(--color-indigo-blue)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <FaChartLine /> Xem Dashboard
                </button>
              </div>

              {/* Support Info */}
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: '0.5rem',
                padding: 'var(--space-lg)',
                border: '1px solid var(--color-border-subtle)',
                textAlign: 'center'
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--leading-relaxed)',
                  margin: 0
                }}>
                  💡 <strong>Cần hỗ trợ?</strong> Liên hệ với chúng tôi qua email{' '}
                  <a href="mailto:support@tripook.com" style={{ color: 'var(--color-bronze-gold)', textDecoration: 'none' }}>
                    support@tripook.com
                  </a>{' '}
                  hoặc hotline <strong>1900-TRIPOOK</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes scaleIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default ProviderApprovedSuccess;
