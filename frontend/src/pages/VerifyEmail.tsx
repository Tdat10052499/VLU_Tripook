import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaSpinner, FaEnvelope } from 'react-icons/fa';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Link xác thực không hợp lệ');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`, {
        method: 'GET'
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail(result.data?.email || '');
        
        // Update auth context if user is logged in
        const token = localStorage.getItem('token');
        
        // Redirect to profile security tab after 2 seconds
        setTimeout(() => {
          if (token) {
            // User is logged in - go to profile
            navigate('/profile?tab=security', { 
              state: { message: 'Email đã được xác thực thành công!' } 
            });
          } else {
            // User is not logged in - go to login
            navigate('/login', { 
              state: { message: 'Email đã được xác thực! Vui lòng đăng nhập.' } 
            });
          }
        }, 2000);
      } else {
        setStatus('error');
        setMessage(result.message);
        setIsExpired(result.expired || false);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Có lỗi xảy ra khi xác thực email. Vui lòng thử lại sau.');
      console.error('Verify email error:', error);
    }
  };

  const handleResendEmail = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { state: { message: 'Vui lòng đăng nhập để gửi lại email xác thực' } });
      return;
    }

    setResending(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Email xác thực mới đã được gửi! Vui lòng kiểm tra hộp thư.');
        setIsExpired(false);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Không thể gửi email xác thực. Vui lòng thử lại sau.');
      console.error('Resend email error:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Header />
      <main style={{
        minHeight: 'calc(100vh - 140px)',
        paddingTop: '100px',
        paddingBottom: 'var(--spacing-16)',
        background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '0 var(--spacing-4)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: 'var(--border-radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            padding: 'var(--spacing-12)',
            textAlign: 'center'
          }}>
            {status === 'loading' && (
              <>
                <FaSpinner style={{
                  fontSize: '64px',
                  color: 'var(--color-deep-indigo)',
                  animation: 'spin 1s linear infinite',
                  marginBottom: 'var(--spacing-6)'
                }} />
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-3xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-deep-indigo)',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  Đang xác thực email...
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-text-secondary)'
                }}>
                  Vui lòng đợi trong giây lát
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-6)'
                }}>
                  <div style={{
                    fontSize: '96px',
                    lineHeight: '1',
                    animation: 'scaleIn 0.5s ease-out'
                  }}>
                    ✅
                  </div>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-3xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-deep-indigo)',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  Xác thực thành công!
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-2)'
                }}>
                  {message}
                </p>
                {email && (
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-6)'
                  }}>
                    Email: <strong>{email}</strong>
                  </p>
                )}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--spacing-8)'
                }}>
                  Đang chuyển hướng đến trang hồ sơ...
                </p>
                <button
                  onClick={() => navigate('/profile?tab=security')}
                  style={{
                    padding: 'var(--spacing-3) var(--spacing-8)',
                    background: 'var(--color-deep-indigo)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--border-radius-lg)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-vibrant-purple)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-deep-indigo)';
                  }}
                >
                  Về trang hồ sơ
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-6)'
                }}>
                  <div style={{
                    fontSize: '96px',
                    lineHeight: '1',
                    animation: 'scaleIn 0.5s ease-out'
                  }}>
                    ❌
                  </div>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-3xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-deep-indigo)',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  Xác thực thất bại
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-8)'
                }}>
                  {message}
                </p>

                {isExpired && (
                  <div style={{
                    background: '#FFF3CD',
                    border: '1px solid #FFE69C',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: 'var(--spacing-4)',
                    marginBottom: 'var(--spacing-6)',
                    textAlign: 'left'
                  }}>
                    <FaEnvelope style={{
                      color: '#856404',
                      marginRight: 'var(--spacing-2)'
                    }} />
                    <strong style={{ color: '#856404' }}>Link đã hết hạn?</strong>
                    <p style={{
                      margin: 'var(--spacing-2) 0 0 0',
                      fontSize: 'var(--font-size-sm)',
                      color: '#856404'
                    }}>
                      Đăng nhập vào tài khoản của bạn và yêu cầu gửi lại email xác thực trong phần Bảo mật.
                    </p>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-3)',
                  justifyContent: 'center'
                }}>
                  {isExpired && (
                    <button
                      onClick={handleResendEmail}
                      disabled={resending}
                      style={{
                        padding: 'var(--spacing-3) var(--spacing-6)',
                        background: resending ? '#95A5A6' : '#27AE60',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--border-radius-lg)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-semibold)',
                        cursor: resending ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)'
                      }}
                    >
                      {resending ? (
                        <>
                          <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <FaEnvelope />
                          Gửi lại email
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      padding: 'var(--spacing-3) var(--spacing-6)',
                      background: 'var(--color-deep-indigo)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--border-radius-lg)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-base)',
                      fontWeight: 'var(--font-weight-semibold)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-vibrant-purple)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--color-deep-indigo)';
                    }}
                  >
                    Về trang đăng nhập
                  </button>
                </div>
              </>
            )}
          </div>

          <style>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
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
      </main>
      <Footer />
    </>
  );
};

export default VerifyEmail;
