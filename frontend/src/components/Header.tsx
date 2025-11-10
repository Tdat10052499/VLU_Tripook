import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaCog, FaCaretDown, FaBusinessTime, FaChartBar } from 'react-icons/fa';

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
    <header style={{ 
      backgroundColor: 'var(--color-indigo-blue)',
      borderBottom: '1px solid var(--color-border-subtle)',
      padding: 'var(--space-md) 0'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ minHeight: '4rem' }}>
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
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
                color: 'var(--color-cream)',
                letterSpacing: '-0.025em'
              }}>Tripook</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              style={{
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-base)',
                fontWeight: '500',
                padding: 'var(--space-sm) var(--space-md)',
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out',
                borderRadius: '0.375rem',
                opacity: 0.9
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze-gold)';
                e.currentTarget.style.backgroundColor = 'rgba(174, 142, 91, 0.15)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-cream)';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.opacity = '0.9';
              }}
            >
              Trang chủ
            </Link>
            <Link 
              to="/about" 
              style={{
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-base)',
                fontWeight: '500',
                padding: 'var(--space-sm) var(--space-md)',
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out',
                borderRadius: '0.375rem',
                opacity: 0.9
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze-gold)';
                e.currentTarget.style.backgroundColor = 'rgba(174, 142, 91, 0.15)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-cream)';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.opacity = '0.9';
              }}
            >
              Về chúng tôi
            </Link>
            <Link 
              to="/services" 
              style={{
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-base)',
                fontWeight: '500',
                padding: 'var(--space-sm) var(--space-md)',
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out',
                borderRadius: '0.375rem',
                opacity: 0.9
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-bronze-gold)';
                e.currentTarget.style.backgroundColor = 'rgba(174, 142, 91, 0.15)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-cream)';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.opacity = '0.9';
              }}
            >
              Dịch vụ
            </Link>
            
            {/* Provider/Partner Link */}
            {isAuthenticated && isActiveProvider() ? (
              <Link 
                to="/provider/dashboard" 
                style={{
                  color: 'var(--color-bronze-gold)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  padding: 'var(--space-sm) var(--space-md)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(174, 142, 91, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <FaBusinessTime style={{ width: '1rem', height: '1rem' }} />
                Dashboard Provider
              </Link>
            ) : !isAuthenticated || !isProvider() ? (
              <Link 
                to="/auth/register" 
                style={{
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-base)',
                  fontWeight: '500',
                  padding: 'var(--space-sm) var(--space-md)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: '0.375rem',
                  opacity: 0.9
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-bronze-gold)';
                  e.currentTarget.style.backgroundColor = 'rgba(174, 142, 91, 0.15)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-cream)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.9';
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
                    gap: 'var(--space-sm)',
                    color: 'var(--color-cream)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 'var(--space-xs)',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s ease-in-out',
                    opacity: 0.9
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-bronze-gold)';
                    e.currentTarget.style.backgroundColor = 'rgba(174, 142, 91, 0.15)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-cream)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.opacity = '0.9';
                  }}
                >
                  {/* User Avatar */}
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: 'var(--color-brushed-bronze)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {user.picture ? (
                      <img 
                        src={user.picture} 
                        alt={getUserDisplayName()} 
                        style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{
                        color: 'var(--color-text-light)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '500',
                        fontFamily: 'var(--font-sans)'
                      }}>
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  
                  {/* User Name */}
                  <span style={{
                    display: 'none',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    fontFamily: 'var(--font-sans)'
                  }} className="sm:block">
                    {getUserDisplayName()}
                  </span>
                  
                  {/* Dropdown Arrow */}
                  <FaCaretDown style={{
                    width: '1rem',
                    height: '1rem',
                    transition: 'transform 0.2s ease-in-out',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: '0',
                    marginTop: 'var(--space-sm)',
                    width: '12rem',
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 25px rgba(78, 74, 71, 0.15)',
                    border: '1px solid var(--color-border-subtle)',
                    zIndex: '50'
                  }}>
                    <div style={{ padding: 'var(--space-xs) 0' }}>
                      {/* User Info */}
                      <div style={{
                        padding: 'var(--space-md) var(--space-lg)',
                        borderBottom: '1px solid var(--color-border-subtle)'
                      }}>
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: '500',
                          color: 'var(--color-text-primary)',
                          margin: '0 0 var(--space-xs) 0',
                          fontFamily: 'var(--font-sans)'
                        }}>{getUserDisplayName()}</p>
                        <p style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-secondary)',
                          margin: '0',
                          fontFamily: 'var(--font-sans)'
                        }}>{user.email}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <Link
                        to="/profile"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 'var(--space-sm) var(--space-lg)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-secondary)',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease-in-out',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: '500'
                        }}
                        onClick={() => setIsDropdownOpen(false)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
                          e.currentTarget.style.color = 'var(--color-text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }}
                      >
                        <FaUser style={{ width: '1rem', height: '1rem', marginRight: 'var(--space-sm)' }} />
                        Profile
                      </Link>
                      
                      <Link
                        to="/settings"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 'var(--space-sm) var(--space-lg)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-secondary)',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease-in-out',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: '500'
                        }}
                        onClick={() => setIsDropdownOpen(false)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
                          e.currentTarget.style.color = 'var(--color-text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }}
                      >
                        <FaCog style={{ width: '1rem', height: '1rem', marginRight: 'var(--space-sm)' }} />
                        Settings
                      </Link>
                      
                      {/* Provider Dashboard */}
                      {isActiveProvider() && (
                        <Link
                          to="/provider/dashboard"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 'var(--space-sm) var(--space-lg)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--color-brushed-bronze)',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease-in-out',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: '500'
                          }}
                          onClick={() => setIsDropdownOpen(false)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(161, 138, 104, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <FaChartBar style={{ width: '1rem', height: '1rem', marginRight: 'var(--space-sm)' }} />
                          Provider Dashboard
                        </Link>
                      )}
                      
                      {/* Become Provider if not yet a provider */}
                      {!isProvider() && (
                        <Link
                          to="/auth/register"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 'var(--space-sm) var(--space-lg)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--color-brushed-bronze)',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease-in-out',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: '500'
                          }}
                          onClick={() => setIsDropdownOpen(false)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(161, 138, 104, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <FaBusinessTime style={{ width: '1rem', height: '1rem', marginRight: 'var(--space-sm)' }} />
                          Become Provider
                        </Link>
                      )}
                      
                      <div style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: 'var(--space-sm) var(--space-lg)',
                            fontSize: 'var(--text-sm)',
                            color: '#DC2626',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: '500'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <FaSignOutAlt style={{ width: '1rem', height: '1rem', marginRight: 'var(--space-sm)' }} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  style={{
                    color: 'var(--color-cream)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease-in-out',
                    fontFamily: 'var(--font-sans)',
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: '0.375rem',
                    opacity: 0.9
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-bronze-gold)';
                    e.currentTarget.style.backgroundColor = 'rgba(174, 142, 91, 0.15)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-cream)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.opacity = '0.9';
                  }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/auth/register"
                  className="btn-primary"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-block'
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
  );
};

export default Header;