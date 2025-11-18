/**
 * TRIPOOK NAVBAR - Redesigned
 * Theme: Di sản và Lịch sử Việt Nam
 * Style: Chuyên nghiệp, Thanh lịch, Minimalist
 */

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: 'var(--color-primary)',
      boxShadow: 'var(--shadow-md)',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
      borderBottom: '1px solid rgba(184, 134, 11, 0.1)' // Subtle bronze border
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        padding: '0 var(--spacing-6)'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--font-size-h4)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-light)',
            textDecoration: 'none',
            letterSpacing: 'var(--letter-spacing-wide)',
            transition: 'var(--transition-default)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-light)';
          }}
        >
          <span style={{
            fontSize: '1.5rem',
            color: 'var(--color-accent)'
          }}>🏛️</span>
          <span>TRIPOOK</span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-8)'
        }}
        className="desktop-nav">
          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-6)'
          }}>
            <NavLink to="/" label="Trang chủ" />
            <NavLink to="/services" label="Khám phá" />
            
            {isAuthenticated && (
              <>
                {user?.role === 'provider' && (
                  <NavLink to="/provider" label="Quản lý dịch vụ" />
                )}
                {user?.role === 'admin' && (
                  <NavLink to="/admin" label="Quản trị" />
                )}
                {user?.role === 'user' && (
                  <NavLink to="/dashboard" label="Dashboard" />
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-4)'
            }}>
              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'var(--transition-default)'
              }}>
                {user?.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-full)',
                      border: '2px solid var(--color-accent)'
                    }}
                  />
                )}
                <span style={{
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--color-text-light)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  {user?.fullName || user?.name || user?.email}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  padding: 'var(--spacing-3) var(--spacing-5)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-light)',
                  border: '1px solid var(--color-accent)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'var(--transition-default)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.color = 'var(--color-text-light)';
                }}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)'
            }}>
              {/* Login Button */}
              <Link
                to="/auth/login"
                style={{
                  padding: 'var(--spacing-3) var(--spacing-5)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-light)',
                  border: '1px solid var(--color-accent)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                  transition: 'var(--transition-default)',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(184, 134, 11, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Đăng nhập
              </Link>

              {/* Register Button - CTA */}
              <Link
                to="/auth/register"
                style={{
                  padding: 'var(--spacing-3) var(--spacing-5)',
                  backgroundColor: 'var(--color-cta)',
                  color: 'var(--color-text-light)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                  transition: 'var(--transition-default)',
                  display: 'inline-block',
                  boxShadow: 'var(--shadow-cta)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-cta-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-cta-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-cta)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-cta)';
                }}
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              padding: 'var(--spacing-2)',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-text-light)',
              cursor: 'pointer',
              fontSize: '1.5rem'
            }}
            className="mobile-menu-button"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu (Hidden by default) */}
      {isMobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-primary-light)',
          padding: 'var(--spacing-4)',
          display: 'none'
        }}
        className="mobile-menu">
          {/* Mobile menu items */}
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

// NavLink Component for reusability
const NavLink: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <Link
    to={to}
    style={{
      color: 'var(--color-text-light)',
      textDecoration: 'none',
      fontSize: 'var(--font-size-body)',
      fontWeight: 'var(--font-weight-medium)',
      fontFamily: 'var(--font-body)',
      transition: 'var(--transition-default)',
      position: 'relative',
      padding: 'var(--spacing-2) 0'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = 'var(--color-accent)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = 'var(--color-text-light)';
    }}
  >
    {label}
  </Link>
);

export default Navbar;