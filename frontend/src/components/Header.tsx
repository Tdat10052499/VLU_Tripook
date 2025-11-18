import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaCog, FaCaretDown, FaBusinessTime, FaChartBar } from 'react-icons/fa';
import EmailVerificationBanner from './EmailVerificationBanner';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, isProvider, isActiveProvider } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <EmailVerificationBanner />
      <header style={{ 
        backgroundColor: 'var(--color-deep-indigo)',
        borderBottom: '2px solid var(--color-bronze-light)',
        padding: 'var(--spacing-4) 0',
        boxShadow: '0 2px 8px rgba(16, 24, 40, 0.08)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ minHeight: '4rem' }}>
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3" style={{ textDecoration: 'none' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--color-bronze)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
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
                color: 'var(--color-cream)',
                letterSpacing: '-0.025em'
              }}>Tripook</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-2">
            <Link 
              to="/" 
              style={{
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-medium)',
                padding: 'var(--spacing-2) var(--spacing-4)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                borderRadius: 'var(--radius-lg)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-cream)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Trang chủ
            </Link>
            <Link 
              to="/about" 
              style={{
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-medium)',
                padding: 'var(--spacing-2) var(--spacing-4)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                borderRadius: 'var(--radius-lg)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-cream)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Về chúng tôi
            </Link>
            <Link 
              to="/services" 
              style={{
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-medium)',
                padding: 'var(--spacing-2) var(--spacing-4)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                borderRadius: 'var(--radius-lg)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze)';
                e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-cream)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Dịch vụ
            </Link>
            
            {/* Provider/Partner Link */}
            {isAuthenticated && isActiveProvider() ? (
              <Link 
                to="/provider/dashboard" 
                style={{
                  color: 'var(--color-bronze)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  padding: 'var(--spacing-2) var(--spacing-4)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  backgroundColor: 'rgba(205, 127, 50, 0.15)',
                  border: '1px solid var(--color-bronze-light)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.25)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.15)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                }}
              >
                <FaBusinessTime style={{ width: '16px', height: '16px' }} />
                Dashboard Provider
              </Link>
            ) : !isAuthenticated || !isProvider() ? (
              <Link 
                to="/auth/register" 
                style={{
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-medium)',
                  padding: 'var(--spacing-2) var(--spacing-4)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  borderRadius: 'var(--radius-lg)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-bronze)';
                  e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-cream)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Trở thành đối tác
              </Link>
            ) : null}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    color: 'var(--color-cream)',
                    backgroundColor: 'transparent',
                    border: '2px solid var(--color-bronze-light)',
                    cursor: 'pointer',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-bronze)';
                    e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* User Avatar */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'var(--color-bronze)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-bronze-light)',
                    overflow: 'hidden'
                  }}>
                    {(user.avatar || user.picture) ? (
                      <img 
                        src={user.avatar || user.picture} 
                        alt={getUserDisplayName()} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{
                        color: '#FFFFFF',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        fontFamily: 'var(--font-body)'
                      }}>
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  
                  {/* User Name */}
                  <span style={{
                    display: 'none',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontFamily: 'var(--font-body)'
                  }} className="sm:block">
                    {getUserDisplayName()}
                  </span>
                  
                  {/* Dropdown Arrow */}
                  <FaCaretDown style={{
                    width: '14px',
                    height: '14px',
                    transition: 'transform 0.3s ease',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: '0',
                    marginTop: 'var(--spacing-3)',
                    width: '280px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-2xl)',
                    boxShadow: 'var(--shadow-2xl)',
                    border: '2px solid var(--color-bronze-light)',
                    zIndex: 9999,
                    overflow: 'hidden'
                  }}>
                    <div>
                      {/* User Info */}
                      <div style={{
                        padding: 'var(--spacing-6)',
                        borderBottom: '2px solid var(--color-cream)',
                        backgroundColor: 'var(--color-cream)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-3)'
                      }}>
                        {/* Avatar in Dropdown */}
                        <div style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: 'var(--color-bronze)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid var(--color-bronze-light)',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          {(user.avatar || user.picture) ? (
                            <img 
                              src={user.avatar || user.picture} 
                              alt={getUserDisplayName()} 
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <span style={{
                              color: '#FFFFFF',
                              fontSize: 'var(--font-size-base)',
                              fontWeight: 'var(--font-weight-bold)',
                              fontFamily: 'var(--font-body)'
                            }}>
                              {getUserInitials()}
                            </span>
                          )}
                        </div>
                        
                        {/* User Name and Email */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: 'var(--font-size-base)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-deep-indigo)',
                            margin: '0 0 var(--spacing-1) 0',
                            fontFamily: 'var(--font-body)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{getUserDisplayName()}</p>
                          <p style={{
                            fontSize: 'var(--font-size-sm)',
                            color: '#666666',
                            margin: '0',
                            fontFamily: 'var(--font-body)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{user.email}</p>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div style={{ padding: 'var(--spacing-2) 0' }}>
                        <Link
                          to="/profile"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 'var(--spacing-3) var(--spacing-6)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text)',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 'var(--font-weight-medium)',
                            gap: 'var(--spacing-3)'
                          }}
                          onClick={() => setIsDropdownOpen(false)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                            e.currentTarget.style.color = 'var(--color-deep-indigo)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text)';
                          }}
                        >
                          <FaUser style={{ width: '18px', height: '18px', color: 'var(--color-bronze)' }} />
                          <span>Hồ sơ</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 'var(--spacing-3) var(--spacing-6)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text)',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 'var(--font-weight-medium)',
                            gap: 'var(--spacing-3)'
                          }}
                          onClick={() => setIsDropdownOpen(false)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                            e.currentTarget.style.color = 'var(--color-deep-indigo)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text)';
                          }}
                        >
                          <FaCog style={{ width: '18px', height: '18px', color: 'var(--color-bronze)' }} />
                          <span>Cài đặt</span>
                        </Link>
                        
                        {/* Provider Dashboard */}
                        {isActiveProvider() && (
                          <Link
                            to="/provider/dashboard"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: 'var(--spacing-3) var(--spacing-6)',
                              fontSize: 'var(--font-size-base)',
                              color: 'var(--color-bronze)',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease',
                              fontFamily: 'var(--font-body)',
                              fontWeight: 'var(--font-weight-semibold)',
                              gap: 'var(--spacing-3)',
                              borderTop: '1px solid var(--color-cream)',
                              marginTop: 'var(--spacing-2)'
                            }}
                            onClick={() => setIsDropdownOpen(false)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
                              e.currentTarget.style.color = 'var(--color-deep-indigo)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--color-bronze)';
                            }}
                          >
                            <FaChartBar style={{ width: '18px', height: '18px' }} />
                            <span>Dashboard Provider</span>
                          </Link>
                        )}
                        
                        {/* Provider Status - For pending providers */}
                        {isProvider() && !isActiveProvider() && (
                          <Link
                            to="/provider/pending"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: 'var(--spacing-3) var(--spacing-6)',
                              fontSize: 'var(--font-size-base)',
                              color: '#F59E0B',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease',
                              fontFamily: 'var(--font-body)',
                              fontWeight: 'var(--font-weight-semibold)',
                              gap: 'var(--spacing-3)',
                              borderTop: '1px solid var(--color-cream)',
                              marginTop: 'var(--spacing-2)',
                              backgroundColor: 'rgba(245, 158, 11, 0.1)'
                            }}
                            onClick={() => setIsDropdownOpen(false)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                            }}
                          >
                            <FaBusinessTime style={{ width: '18px', height: '18px' }} />
                            <span>⏳ Trạng thái Provider</span>
                          </Link>
                        )}
                        
                        {/* Become Provider if not yet a provider */}
                        {!isProvider() && (
                          <Link
                            to="/auth/register"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: 'var(--spacing-3) var(--spacing-6)',
                              fontSize: 'var(--font-size-base)',
                              color: 'var(--color-bronze)',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease',
                              fontFamily: 'var(--font-body)',
                              fontWeight: 'var(--font-weight-semibold)',
                              gap: 'var(--spacing-3)',
                              borderTop: '1px solid var(--color-cream)',
                              marginTop: 'var(--spacing-2)'
                            }}
                            onClick={() => setIsDropdownOpen(false)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
                              e.currentTarget.style.color = 'var(--color-deep-indigo)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--color-bronze)';
                            }}
                          >
                            <FaBusinessTime style={{ width: '18px', height: '18px' }} />
                            <span>Trở thành đối tác</span>
                          </Link>
                        )}
                      </div>
                      
                      <div style={{ 
                        borderTop: '2px solid var(--color-cream)',
                        padding: 'var(--spacing-4) var(--spacing-6) var(--spacing-6)'
                      }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: 'var(--spacing-3)',
                            fontSize: 'var(--font-size-base)',
                            color: '#FFFFFF',
                            backgroundColor: 'var(--color-vermilion)',
                            border: 'none',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 'var(--font-weight-semibold)',
                            gap: 'var(--spacing-2)',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-deep-indigo)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-vermilion)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                          }}
                        >
                          <FaSignOutAlt style={{ width: '16px', height: '16px' }} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
                <Link
                  to="/auth/login"
                  style={{
                    color: 'var(--color-cream)',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-medium)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-body)',
                    padding: 'var(--spacing-2) var(--spacing-5)',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-bronze)';
                    e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                    e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-cream)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/auth/register"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--spacing-2) var(--spacing-6)',
                    backgroundColor: 'var(--color-vermilion)',
                    color: '#FFFFFF',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    fontFamily: 'var(--font-body)',
                    borderRadius: 'var(--radius-lg)',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    boxShadow: 'var(--shadow-md)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-deep-indigo)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-vermilion)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;