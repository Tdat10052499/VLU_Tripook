import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import RecaptchaComponent, { RecaptchaComponentRef } from '../RecaptchaComponent';
import { useRecaptchaConfig } from '../../hooks/useRecaptchaConfig';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(() => {
    // Initialize error from sessionStorage to persist across re-mounts
    return sessionStorage.getItem('login_error') || '';
  });

  // Persist error to sessionStorage
  const setErrorPersistent = (newError: string) => {
    setError(newError);
    if (newError) {
      sessionStorage.setItem('login_error', newError);
    } else {
      sessionStorage.removeItem('login_error');
    }
  };

  // Clear error when component unmounts
  React.useEffect(() => {
    return () => {
      // Clear error from sessionStorage when component unmounts
      // This happens when user successfully navigates away
      const currentPath = window.location.pathname;
      if (currentPath !== '/auth/login') {
        sessionStorage.removeItem('login_error');
      }
    };
  }, []);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const { login } = useContext(AuthContext);
  const recaptchaRef = useRef<RecaptchaComponentRef>(null);
  const { siteKey, isLoading: configLoading, error: configError } = useRecaptchaConfig();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing to fix their input
    if (error) {
      setErrorPersistent('');
    }
  };

  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
    // Don't clear error automatically when reCAPTCHA is reset
    // Let user see the error message until they fix the issue
  };

  const handleRecaptchaError = () => {
    setErrorPersistent('Bạn là Robot');
    setRecaptchaToken(null);
  };

  const handleRecaptchaExpired = () => {
    setErrorPersistent('reCAPTCHA đã hết hạn, vui lòng thử lại');
    setRecaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Don't clear error immediately - let it show until success or new error

    // Check reCAPTCHA
    if (!recaptchaToken) {
      setErrorPersistent('Vui lòng hoàn thành reCAPTCHA');
      setIsLoading(false);
      return;
    }

    try {
      // Login returns user data directly
      const loggedInUser = await login(formData.login, formData.password, formData.rememberMe, recaptchaToken);
      
      // Clear error only on successful login
      setErrorPersistent('');
      
      // Redirect based on user role immediately
      if (loggedInUser.role === 'admin') {
        window.location.href = '/admin/provider-approval';
      } else if (loggedInUser.role === 'provider') {
        // Check if provider is approved
        if (loggedInUser.provider_info?.is_active) {
          window.location.href = '/provider/dashboard';
        } else {
          window.location.href = '/provider/pending';
        }
      } else {
        // Regular user
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorPersistent(err.message || 'Login failed. Please try again.');
      
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url('/images/Backgroud_Home_Filter.png')`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div style={{
          backgroundColor: 'var(--color-bg-main)',
          borderRadius: '0.75rem',
          boxShadow: '0 20px 25px rgba(78, 74, 71, 0.1)',
          padding: 'var(--space-2xl)'
        }}>
          <div className="text-center">
            <h2 style={{
              fontSize: 'var(--text-3xl)',
              fontFamily: 'var(--font-serif)',
              fontWeight: '500',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-sm)'
            }}>
              Welcome Back
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-2xl)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-base)'
            }}>
              Đăng nhập vào tài khoản Tripook của bạn
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: 'var(--space-md)',
              padding: 'var(--space-md)',
              color: '#B91C1C',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '0.375rem',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
                fontFamily: 'var(--font-sans)'
              }}>
                Email hoặc Username
              </label>
              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                required
                value={formData.login}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px rgba(78, 74, 71, 0.05)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-bg-main)',
                  transition: 'all 0.2s ease-in-out'
                }}
                placeholder="Nhập email hoặc username của bạn"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-brushed-bronze)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(78, 74, 71, 0.05)';
                }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
                fontFamily: 'var(--font-sans)'
              }}>
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    paddingRight: '2.5rem',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 2px rgba(78, 74, 71, 0.05)',
                    fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'var(--color-bg-main)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  placeholder="Nhập mật khẩu của bạn"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-brushed-bronze)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(78, 74, 71, 0.05)';
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    bottom: '0',
                    paddingRight: 'var(--space-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-text-secondary)' }} />
                  ) : (
                    <FaEye style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-text-secondary)' }} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  style={{
                    height: '1rem',
                    width: '1rem',
                    accentColor: 'var(--color-brushed-bronze)',
                    marginRight: 'var(--space-sm)'
                  }}
                />
                <label htmlFor="rememberMe" style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-sans)'
                }}>
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div style={{ fontSize: 'var(--text-sm)' }}>
                <Link
                  to="/auth/forgot-password"
                  style={{
                    fontWeight: '500',
                    color: 'var(--color-brushed-bronze)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8F7A5A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-brushed-bronze)';
                  }}
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            {/* reCAPTCHA */}
            {configLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            ) : configError ? (
              <div className="text-red-500 text-sm text-center">
                {configError}
              </div>
            ) : (
              <RecaptchaComponent
                ref={recaptchaRef}
                siteKey={siteKey}
                onVerify={handleRecaptchaVerify}
                onError={handleRecaptchaError}
                onExpired={handleRecaptchaExpired}
                theme="light"
                size="normal"
              />
            )}

            <button
              type="submit"
              disabled={isLoading || !recaptchaToken}
              className="btn-primary w-full"
              style={{
                opacity: (isLoading || !recaptchaToken) ? '0.5' : '1',
                cursor: (isLoading || !recaptchaToken) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    animation: 'spin 1s linear infinite',
                    borderRadius: '50%',
                    height: '20px',
                    width: '20px',
                    border: '2px solid transparent',
                    borderTop: '2px solid var(--color-linen-white)',
                    marginRight: '8px'
                  }}></div>
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>

            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--color-deep-taupe)',
                marginBottom: '8px'
              }}>
                Chưa có tài khoản?{' '}
                <Link
                  to="/auth/register"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: '500',
                    color: 'var(--color-brushed-bronze)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-deep-taupe)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
                >
                  Đăng ký tại đây
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;