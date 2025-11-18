import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface ProviderPendingStatusProps {
  user: {
    fullName: string;
    email: string;
    companyName?: string;
    businessType?: string;
    accountStatus: string;
  };
}

const ProviderPendingStatus: React.FC<ProviderPendingStatusProps> = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getBusinessTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hotel: '🏨 Khách sạn',
      tour: '🗺️ Tour du lịch',
      transport: '🚗 Vận chuyển'
    };
    return labels[type] || type;
  };

  return (
    <>
      <Header />
      <div style={{
        minHeight: 'calc(100vh - 140px)',
        paddingTop: '100px',
        paddingBottom: 'var(--space-4xl)',
        background: 'linear-gradient(135deg, #0A2342 0%, #1A3A5C 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements - Vietnamese Pattern */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'rgba(174, 142, 91, 0.15)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'rgba(196, 165, 112, 0.15)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />

        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: `0 var(--space-md)`,
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            background: 'var(--color-soft-cream)',
            borderRadius: '1rem',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            border: '2px solid var(--color-bronze-gold)'
          }}>
            {/* Success Banner with Vietnamese Theme */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-soft-cream) 100%)',
              padding: 'var(--space-3xl) var(--space-2xl)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderBottom: '3px solid var(--color-bronze-gold)'
            }}>
              {/* Decorative Pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(circle, rgba(10, 35, 66, 0.05) 2px, transparent 2px)',
                backgroundSize: '30px 30px',
                opacity: 0.5
              }} />
              
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto var(--space-xl)',
                background: 'linear-gradient(135deg, rgba(174, 142, 91, 0.15), rgba(196, 165, 112, 0.15))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(174, 142, 91, 0.3)',
                border: '3px solid var(--color-bronze-gold)'
              }}>
                {/* Animated Hourglass */}
                <div style={{
                  fontSize: '64px',
                  lineHeight: '1',
                  animation: 'hourglassRotate 3s ease-in-out infinite',
                  transformOrigin: 'center'
                }}>
                  ⏳
                </div>
              </div>
              
              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-4xl)',
                fontWeight: '600',
                marginBottom: 'var(--space-md)',
                color: 'var(--color-indigo-blue)',
                position: 'relative',
                zIndex: 1
              }}>
                🎉 Đăng ký thành công!
              </h1>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-primary)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 'var(--leading-relaxed)',
                position: 'relative',
                zIndex: 1
              }}>
                Tài khoản nhà cung cấp của bạn đang được xem xét và sẽ được kích hoạt trong vòng{' '}
                <strong style={{ color: 'var(--color-bronze-gold)', fontWeight: '700' }}>24-48 giờ</strong>
              </p>
            </div>

            {/* Main Content */}
            <div style={{ padding: 'var(--space-2xl)' }}>
              {/* Account Info Card with Vietnamese Theme */}
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: '0.75rem',
                padding: 'var(--space-xl)',
                marginBottom: 'var(--space-xl)',
                border: '2px solid var(--color-border-subtle)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: '600',
                  color: 'var(--color-indigo-blue)',
                  marginBottom: 'var(--space-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)'
                }}>
                  <span>👤</span> Thông tin tài khoản
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 'var(--space-lg)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--space-xs)',
                      fontFamily: 'var(--font-sans)'
                    }}>Họ tên</label>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      fontWeight: '600',
                      color: 'var(--color-indigo-blue)',
                      margin: 0
                    }}>{user.fullName}</p>
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--space-xs)',
                      fontFamily: 'var(--font-sans)'
                    }}>Email</label>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-primary)',
                      margin: 0
                    }}>{user.email}</p>
                  </div>
                  
                  {user.companyName && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '500',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-xs)',
                        fontFamily: 'var(--font-sans)'
                      }}>Tên công ty</label>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-base)',
                        fontWeight: '600',
                        color: 'var(--color-indigo-blue)',
                        margin: 0
                      }}>{user.companyName}</p>
                    </div>
                  )}
                  
                  {user.businessType && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '500',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-xs)',
                        fontFamily: 'var(--font-sans)'
                      }}>Loại hình kinh doanh</label>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-base)',
                        color: 'var(--color-text-primary)',
                        margin: 0
                      }}>{getBusinessTypeLabel(user.businessType)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Warning with Vietnamese Theme */}
              <div style={{
                background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF8E1 100%)',
                border: '2px solid var(--color-bronze-gold)',
                borderRadius: '0.75rem',
                padding: 'var(--space-xl)',
                marginBottom: 'var(--space-xl)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                  <div style={{
                    fontSize: '40px',
                    lineHeight: '1',
                    flexShrink: 0,
                    animation: 'bounce 2s ease-in-out infinite'
                  }}>⏰</div>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'var(--text-xl)',
                      fontWeight: '600',
                      color: 'var(--color-indigo-blue)',
                      marginBottom: 'var(--space-sm)',
                      margin: 0
                    }}>
                      Tài khoản đang chờ phê duyệt
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-primary)',
                      lineHeight: 'var(--leading-relaxed)',
                      margin: 'var(--space-sm) 0 0 0'
                    }}>
                      Tài khoản nhà cung cấp của bạn đang được team Tripook xem xét và phê duyệt. 
                      Quá trình này thường mất từ <strong style={{ fontWeight: '700', color: 'var(--color-bronze-gold)' }}>24-48 giờ làm việc</strong>. 
                      Bạn sẽ nhận được email thông báo ngay khi tài khoản được kích hoạt.
                    </p>
                  </div>
                </div>
              </div>

              {/* Process Timeline with Vietnamese Theme */}
              <div style={{
                background: 'var(--color-soft-cream)',
                borderRadius: '0.75rem',
                padding: 'var(--space-xl)',
                marginBottom: 'var(--space-xl)',
                border: '2px solid var(--color-border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: '600',
                  color: 'var(--color-indigo-blue)',
                  marginBottom: 'var(--space-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)'
                }}>
                  <span>📋</span> Quy trình phê duyệt
                </h3>
                
                <div style={{ position: 'relative' }}>
                  {/* Timeline Line - Bronze Gold gradient */}
                  <div style={{
                    position: 'absolute',
                    left: '15px',
                    top: '40px',
                    bottom: '40px',
                    width: '3px',
                    background: 'linear-gradient(to bottom, var(--color-bronze-gold), var(--color-light-indigo))',
                    opacity: 0.4,
                    borderRadius: '2px'
                  }} />
                  
                  {/* Step 1 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-xl)',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: currentStep >= 1 ? 'linear-gradient(135deg, var(--color-bronze-gold), #C4A570)' : 'var(--color-cream)',
                      color: currentStep >= 1 ? 'white' : 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: 'var(--text-sm)',
                      flexShrink: 0,
                      transition: 'all 0.5s ease',
                      boxShadow: currentStep === 1 ? '0 0 20px rgba(174, 142, 91, 0.6)' : 'none',
                      border: currentStep >= 1 ? '2px solid var(--color-bronze-gold)' : '2px solid var(--color-border-medium)'
                    }}>
                      {currentStep > 1 ? '✓' : '1'}
                    </div>
                    <div style={{ marginLeft: 'var(--space-lg)', flex: 1 }}>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-base)',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-xs)',
                        margin: 0
                      }}>Xem xét thông tin doanh nghiệp</p>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 'var(--space-xs) 0 0 0'
                      }}>Kiểm tra tính hợp lệ và đầy đủ của hồ sơ</p>
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-xl)',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: currentStep >= 2 ? 'linear-gradient(135deg, var(--color-bronze-gold), #C4A570)' : 'var(--color-cream)',
                      color: currentStep >= 2 ? 'white' : 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: 'var(--text-sm)',
                      flexShrink: 0,
                      transition: 'all 0.5s ease',
                      boxShadow: currentStep === 2 ? '0 0 20px rgba(174, 142, 91, 0.6)' : 'none',
                      border: currentStep >= 2 ? '2px solid var(--color-bronze-gold)' : '2px solid var(--color-border-medium)'
                    }}>
                      {currentStep > 2 ? '✓' : '2'}
                    </div>
                    <div style={{ marginLeft: 'var(--space-lg)', flex: 1 }}>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-base)',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-xs)',
                        margin: 0
                      }}>Xác thực tính hợp lệ</p>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 'var(--space-xs) 0 0 0'
                      }}>Đối chiếu thông tin với cơ sở dữ liệu</p>
                    </div>
                  </div>
                  
                  {/* Step 3 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-xl)',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: currentStep >= 3 ? 'linear-gradient(135deg, var(--color-bronze-gold), #C4A570)' : 'var(--color-cream)',
                      color: currentStep >= 3 ? 'white' : 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: 'var(--text-sm)',
                      flexShrink: 0,
                      transition: 'all 0.5s ease',
                      boxShadow: currentStep === 3 ? '0 0 20px rgba(174, 142, 91, 0.6)' : 'none',
                      border: currentStep >= 3 ? '2px solid var(--color-bronze-gold)' : '2px solid var(--color-border-medium)'
                    }}>
                      {currentStep > 3 ? '✓' : '3'}
                    </div>
                    <div style={{ marginLeft: 'var(--space-lg)', flex: 1 }}>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-base)',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-xs)',
                        margin: 0
                      }}>Gửi email thông báo</p>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 'var(--space-xs) 0 0 0'
                      }}>Thông báo kết quả phê duyệt qua email</p>
                    </div>
                  </div>
                  
                  {/* Step 4 - Final Step */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: currentStep >= 4 ? 'linear-gradient(135deg, #0A2342, #1A3A5C)' : 'var(--color-cream)',
                      color: currentStep >= 4 ? '#AE8E5B' : 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: 'var(--text-lg)',
                      flexShrink: 0,
                      transition: 'all 0.5s ease',
                      boxShadow: currentStep === 4 ? '0 0 25px rgba(10, 35, 66, 0.6)' : 'none',
                      border: currentStep >= 4 ? '2px solid var(--color-bronze-gold)' : '2px solid var(--color-border-medium)'
                    }}>
                      ✓
                    </div>
                    <div style={{ marginLeft: 'var(--space-lg)', flex: 1 }}>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-base)',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-xs)',
                        margin: 0
                      }}>Kích hoạt tài khoản</p>
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 'var(--space-xs) 0 0 0'
                      }}>Truy cập Provider Dashboard và bắt đầu kinh doanh</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Section with Vietnamese Theme */}
              <div style={{
                background: 'linear-gradient(135deg, #F0F4FF 0%, #E8EFFD 100%)',
                borderRadius: '0.75rem',
                padding: 'var(--space-xl)',
                marginBottom: 'var(--space-xl)',
                border: '2px solid var(--color-border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: '600',
                  color: 'var(--color-indigo-blue)',
                  marginBottom: 'var(--space-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)'
                }}>
                  <span>📞</span> Cần hỗ trợ?
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--space-lg)'
                }}>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--space-xs)',
                      margin: 0
                    }}>Email hỗ trợ</p>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      fontWeight: '600',
                      color: 'var(--color-indigo-blue)',
                      margin: 'var(--space-xs) 0 0 0'
                    }}>support@tripook.com</p>
                  </div>
                  
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--space-xs)',
                      margin: 0
                    }}>Hotline</p>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      fontWeight: '600',
                      color: 'var(--color-indigo-blue)',
                      margin: 'var(--space-xs) 0 0 0'
                    }}>1900-TRIPOOK</p>
                  </div>
                  
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--space-xs)',
                      margin: 0
                    }}>Giờ làm việc</p>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-primary)',
                      margin: 'var(--space-xs) 0 0 0'
                    }}>T2 - T6: 8:00 - 17:30</p>
                  </div>
                  
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--space-xs)',
                      margin: 0
                    }}>Thời gian phản hồi</p>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-primary)',
                      margin: 'var(--space-xs) 0 0 0'
                    }}>Trong vòng 24 giờ</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons with Vietnamese Theme */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-xl)'
              }}>
                <button
                  onClick={() => window.location.href = '/'}
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
                  <span>🏠</span> Về trang chủ
                </button>
                
                <button
                  onClick={() => window.location.href = '/dashboard'}
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
                  <span>📊</span> Xem Dashboard
                </button>
              </div>

              {/* Additional Info with Vietnamese Theme */}
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-lg)',
                background: 'var(--color-cream)',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border-subtle)'
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-sm)',
                  lineHeight: 'var(--leading-relaxed)',
                  margin: 0
                }}>
                  💌 Bạn sẽ nhận được email thông báo khi tài khoản được phê duyệt.
                </p>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--leading-relaxed)',
                  margin: 'var(--space-sm) 0 0 0'
                }}>
                  🌍 Trong thời gian chờ, bạn có thể khám phá các dịch vụ du lịch trên Tripook.
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.9;
            }
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes hourglassRotate {
            0%, 100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(180deg);
            }
            75% {
              transform: rotate(180deg);
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default ProviderPendingStatus;