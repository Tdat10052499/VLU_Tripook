import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const EmailVerificationBanner: React.FC = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and email is not verified
    if (isAuthenticated && user && !user.is_verified) {
      // Check if banner was dismissed in this session
      const dismissed = sessionStorage.getItem('verificationBannerDismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
    }
  }, [isAuthenticated, user]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('verificationBannerDismissed', 'true');
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(90deg, #FEF3C7 0%, #FDE68A 100%)',
      borderBottom: '1px solid #F59E0B',
      padding: 'var(--spacing-3) 0',
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 var(--spacing-4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--spacing-4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
          flex: 1
        }}>
          <FaExclamationTriangle style={{
            color: '#D97706',
            fontSize: '20px',
            flexShrink: 0
          }} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-3)',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              color: '#92400E',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              ⚠️ Email của bạn chưa được xác thực.
            </span>
            <Link
              to="/profile?tab=security"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-sm)',
                color: '#D97706',
                fontWeight: 'var(--font-weight-semibold)',
                textDecoration: 'underline',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#92400E';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D97706';
              }}
            >
              Xác thực ngay
            </Link>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#92400E',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FDE68A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          aria-label="Đóng thông báo"
        >
          <FaTimes style={{ fontSize: '16px' }} />
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
