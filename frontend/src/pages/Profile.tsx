import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, 
  FaEdit, FaSave, FaTimes, FaCamera, FaHeart, FaSuitcase,
  FaHistory, FaShieldAlt
} from 'react-icons/fa';

const Profile: React.FC = () => {
  const { user, isAuthenticated, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'favorites' | 'security'>('info');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    bio: ''
  });

  const [originalData, setOriginalData] = useState(profileData);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [stats, setStats] = useState({ trips: 0, favorites: 0 });
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Check for tab query parameter and switch to security tab if needed
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'security') {
      setActiveTab('security');
    }
  }, [searchParams]);

  // Refetch profile data (extracted for reuse)
  const refetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          const userData = result.user;
          setEmailVerified(userData.is_verified || false);
          
          // Update other profile data too
          const data = {
            name: userData.name || '',
            username: userData.username || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            dateOfBirth: userData.dateOfBirth || '',
            bio: userData.bio || ''
          };
          setProfileData(data);
          setOriginalData(data);
        }
      }
    } catch (error) {
      console.error('Error refetching profile:', error);
    }
  };

  // Check for success message from verification
  useEffect(() => {
    const state = location.state as { message?: string };
    if (state?.message) {
      setSuccessMessage(state.message);
      // Refresh profile to get updated is_verified status
      refetchProfile();
      // Clear message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Profile API Response:', result);
          if (result.success && result.user) {
            const userData = result.user;
            const data = {
              name: userData.name || '',
              username: userData.username || '',
              email: userData.email || '',
              phone: userData.phone || '',
              address: userData.address || '',
              dateOfBirth: userData.dateOfBirth || '',
              bio: userData.bio || ''
            };
            setProfileData(data);
            setOriginalData(data);
            
            // Load avatar if exists
            if (userData.avatar) {
              setAvatarUrl(userData.avatar);
            }
            
            // Load stats
            console.log('Stats from API:', userData.stats);
            if (userData.stats) {
              const newStats = {
                trips: userData.stats.trips || 0,
                favorites: userData.stats.favorites || 0
              };
              console.log('Setting stats to:', newStats);
              setStats(newStats);
            } else {
              console.log('No stats in userData');
            }
            
            // Load email verification status
            setEmailVerified(userData.is_verified || false);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendVerification = async () => {
    setSendingVerification(true);
    setVerificationMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setVerificationMessage('✅ ' + result.message);
        setCountdown(60); // 60 seconds countdown
      } else {
        setVerificationMessage('❌ ' + result.message);
      }
    } catch (error) {
      setVerificationMessage('❌ Không thể gửi email. Vui lòng thử lại sau.');
      console.error('Send verification error:', error);
    } finally {
      setSendingVerification(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          dateOfBirth: profileData.dateOfBirth,
          bio: profileData.bio
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update local state
        setOriginalData(profileData);
        setIsEditing(false);
        
        // Update AuthContext (if needed)
        if (user) {
          Object.assign(user, {
            name: profileData.name,
            phone: profileData.phone,
            address: profileData.address,
            dateOfBirth: profileData.dateOfBirth,
            bio: profileData.bio
          });
        }

        alert('Cập nhật thông tin thành công!');
      } else {
        alert(result.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (PNG, JPG, JPEG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    try {
      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/profile/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            avatar: base64String
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setAvatarUrl(base64String);
          // Refresh user data in AuthContext to update avatar in Header
          await refreshUser();
          alert('Cập nhật ảnh đại diện thành công!');
        } else {
          alert(result.message || 'Có lỗi xảy ra khi tải ảnh lên!');
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Có lỗi xảy ra khi tải ảnh lên!');
    }
  };

  const tabs = [
    { id: 'info' as const, label: 'Thông tin cá nhân', icon: FaUser },
    { id: 'bookings' as const, label: 'Lịch sử đặt chỗ', icon: FaHistory },
    { id: 'favorites' as const, label: 'Yêu thích', icon: FaHeart },
    { id: 'security' as const, label: 'Bảo mật', icon: FaShieldAlt }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-main)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      
      <main style={{ 
        flex: 1,
        paddingTop: 'var(--spacing-12)',
        paddingBottom: 'var(--spacing-20)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-8)'
        }}>
          {/* Page Header */}
          <div style={{
            marginBottom: 'var(--spacing-12)',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-deep-indigo)',
              marginBottom: 'var(--spacing-3)'
            }}>
              Hồ Sơ Của Tôi
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-secondary)'
            }}>
              Quản lý thông tin cá nhân và trải nghiệm du lịch của bạn
            </p>
          </div>

          {/* Profile Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: 'var(--spacing-8)',
            alignItems: 'start'
          }}>
            {/* Left Sidebar - Avatar & Quick Stats */}
            <div style={{
              position: 'sticky',
              top: 'var(--spacing-8)'
            }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--spacing-8)',
                boxShadow: 'var(--shadow-lg)',
                border: '2px solid var(--color-bronze-light)',
                textAlign: 'center'
              }}>
                {/* Avatar */}
                <div style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  margin: '0 auto var(--spacing-6)'
                }}>
                  {avatarUrl || user?.avatar ? (
                    <img 
                      src={avatarUrl || user?.avatar || ''}
                      alt="Avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid var(--color-cream)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-bronze)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--font-size-4xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: '#FFFFFF',
                      border: '4px solid var(--color-cream)'
                    }}>
                      {profileData.name?.charAt(0) || profileData.username?.charAt(0) || 'U'}
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                  <button 
                    onClick={handleAvatarClick}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-vermilion)',
                      border: '3px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-deep-indigo)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-vermilion)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                    <FaCamera style={{ color: '#FFFFFF', fontSize: '14px' }} />
                  </button>
                </div>

                {/* User Name */}
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-deep-indigo)',
                  marginBottom: 'var(--spacing-2)'
                }}>
                  {profileData.name || profileData.username || 'Người dùng'}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-6)'
                }}>
                  @{profileData.username || 'traveller'}
                </p>

                {/* Quick Stats */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-4)',
                  marginTop: 'var(--spacing-6)',
                  paddingTop: 'var(--spacing-6)',
                  borderTop: '2px solid var(--color-bronze-light)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)'
                    }}>
                      <FaSuitcase style={{ color: 'var(--color-bronze)', fontSize: '18px' }} />
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        Chuyến đi
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)'
                    }}>
                      {stats.trips}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)'
                    }}>
                      <FaHeart style={{ color: 'var(--color-vermilion)', fontSize: '18px' }} />
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        Yêu thích
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)'
                    }}>
                      {stats.favorites}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div>
              {/* Tabs Navigation */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--spacing-4)',
                boxShadow: 'var(--shadow-md)',
                border: '2px solid var(--color-bronze-light)',
                marginBottom: 'var(--spacing-8)',
                display: 'flex',
                gap: 'var(--spacing-2)',
                overflow: 'auto'
              }}>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: 1,
                      padding: 'var(--spacing-4)',
                      backgroundColor: activeTab === tab.id ? 'var(--color-cream)' : 'transparent',
                      border: activeTab === tab.id ? '2px solid var(--color-bronze)' : '2px solid transparent',
                      borderRadius: 'var(--radius-xl)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: activeTab === tab.id ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                      color: activeTab === tab.id ? 'var(--color-deep-indigo)' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-2)',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                        e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <tab.icon />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--spacing-10)',
                boxShadow: 'var(--shadow-lg)',
                border: '2px solid var(--color-bronze-light)',
                minHeight: '500px'
              }}>
                {activeTab === 'info' && (
                  <div>
                    {/* Section Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--spacing-8)',
                      paddingBottom: 'var(--spacing-6)',
                      borderBottom: '2px solid var(--color-bronze-light)'
                    }}>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-deep-indigo)'
                      }}>
                        Thông tin cá nhân
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          style={{
                            padding: 'var(--spacing-3) var(--spacing-6)',
                            backgroundColor: 'var(--color-bronze)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: 'var(--radius-lg)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-2)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-deep-indigo)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <FaEdit />
                          Chỉnh sửa
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                          <button
                            onClick={handleSave}
                            style={{
                              padding: 'var(--spacing-3) var(--spacing-6)',
                              backgroundColor: '#27AE60',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-sm)',
                              fontWeight: 'var(--font-weight-semibold)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--spacing-2)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#229954';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#27AE60';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <FaSave />
                            Lưu
                          </button>
                          <button
                            onClick={handleCancel}
                            style={{
                              padding: 'var(--spacing-3) var(--spacing-6)',
                              backgroundColor: 'transparent',
                              color: 'var(--color-text-secondary)',
                              border: '2px solid var(--color-text-secondary)',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-sm)',
                              fontWeight: 'var(--font-weight-semibold)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--spacing-2)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--color-text-secondary)';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--color-text-secondary)';
                            }}
                          >
                            <FaTimes />
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Profile Form */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 'var(--spacing-6)'
                    }}>
                      {/* Full Name */}
                      <div>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)',
                          marginBottom: 'var(--spacing-2)'
                        }}>
                          <FaUser style={{ color: 'var(--color-bronze)' }} />
                          Họ và tên
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            style={{
                              width: '100%',
                              padding: 'var(--spacing-3)',
                              border: '2px solid var(--color-bronze-light)',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-base)',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze)';
                              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(205, 127, 50, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        ) : (
                          <p style={{
                            padding: 'var(--spacing-3)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text)'
                          }}>
                            {profileData.name || '---'}
                          </p>
                        )}
                      </div>

                      {/* Username */}
                      <div>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)',
                          marginBottom: 'var(--spacing-2)'
                        }}>
                          <FaUser style={{ color: 'var(--color-bronze)' }} />
                          Tên người dùng
                        </label>
                        <p style={{
                          padding: 'var(--spacing-3)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-base)',
                          color: 'var(--color-text-secondary)',
                          backgroundColor: 'var(--color-cream)',
                          borderRadius: 'var(--radius-lg)'
                        }}>
                          {profileData.username || '---'}
                        </p>
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)',
                          marginBottom: 'var(--spacing-2)'
                        }}>
                          <FaEnvelope style={{ color: 'var(--color-bronze)' }} />
                          Email
                        </label>
                        <p style={{
                          padding: 'var(--spacing-3)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-base)',
                          color: 'var(--color-text-secondary)',
                          backgroundColor: 'var(--color-cream)',
                          borderRadius: 'var(--radius-lg)'
                        }}>
                          {profileData.email || '---'}
                        </p>
                      </div>

                      {/* Phone */}
                      <div>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)',
                          marginBottom: 'var(--spacing-2)'
                        }}>
                          <FaPhone style={{ color: 'var(--color-bronze)' }} />
                          Số điện thoại
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="0xxxxxxxxx"
                            style={{
                              width: '100%',
                              padding: 'var(--spacing-3)',
                              border: '2px solid var(--color-bronze-light)',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-base)',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze)';
                              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(205, 127, 50, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        ) : (
                          <p style={{
                            padding: 'var(--spacing-3)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text)'
                          }}>
                            {profileData.phone || '---'}
                          </p>
                        )}
                      </div>

                      {/* Address - Full Width */}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)',
                          marginBottom: 'var(--spacing-2)'
                        }}>
                          <FaMapMarkerAlt style={{ color: 'var(--color-bronze)' }} />
                          Địa chỉ
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Nhập địa chỉ của bạn"
                            style={{
                              width: '100%',
                              padding: 'var(--spacing-3)',
                              border: '2px solid var(--color-bronze-light)',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-base)',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze)';
                              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(205, 127, 50, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        ) : (
                          <p style={{
                            padding: 'var(--spacing-3)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text)'
                          }}>
                            {profileData.address || '---'}
                          </p>
                        )}
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)',
                          marginBottom: 'var(--spacing-2)'
                        }}>
                          <FaCalendar style={{ color: 'var(--color-bronze)' }} />
                          Ngày sinh
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            style={{
                              width: '100%',
                              padding: 'var(--spacing-3)',
                              border: '2px solid var(--color-bronze-light)',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-base)',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze)';
                              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(205, 127, 50, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        ) : (
                          <p style={{
                            padding: 'var(--spacing-3)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text)'
                          }}>
                            {profileData.dateOfBirth || '---'}
                          </p>
                        )}
                      </div>

                      {/* Bio - Full Width */}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)',
                          marginBottom: 'var(--spacing-2)'
                        }}>
                          Giới thiệu bản thân
                        </label>
                        {isEditing ? (
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            placeholder="Viết vài dòng về bạn..."
                            rows={4}
                            style={{
                              width: '100%',
                              padding: 'var(--spacing-3)',
                              border: '2px solid var(--color-bronze-light)',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-base)',
                              outline: 'none',
                              transition: 'all 0.3s ease',
                              resize: 'vertical'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze)';
                              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(205, 127, 50, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        ) : (
                          <p style={{
                            padding: 'var(--spacing-3)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text)',
                            lineHeight: 1.6
                          }}>
                            {profileData.bio || '---'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-12)' }}>
                    <FaHistory style={{
                      fontSize: '64px',
                      color: 'var(--color-bronze-light)',
                      marginBottom: 'var(--spacing-4)'
                    }} />
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)',
                      marginBottom: 'var(--spacing-3)'
                    }}>
                      Lịch sử đặt chỗ
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-base)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Chức năng đang được phát triển
                    </p>
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-12)' }}>
                    <FaHeart style={{
                      fontSize: '64px',
                      color: 'var(--color-vermilion)',
                      marginBottom: 'var(--spacing-4)'
                    }} />
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)',
                      marginBottom: 'var(--spacing-3)'
                    }}>
                      Danh sách yêu thích
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-base)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Chức năng đang được phát triển
                    </p>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div style={{ paddingTop: 'var(--spacing-8)' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)',
                      marginBottom: 'var(--spacing-6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)'
                    }}>
                      <FaShieldAlt /> Bảo mật tài khoản
                    </h3>

                    {/* Success Message */}
                    {successMessage && (
                      <div style={{
                        background: '#D1FAE5',
                        border: '1px solid #10B981',
                        borderRadius: 'var(--border-radius-md)',
                        padding: 'var(--spacing-4)',
                        marginBottom: 'var(--spacing-6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        color: '#065F46',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                        <FaShieldAlt style={{ color: '#10B981' }} />
                        {successMessage}
                      </div>
                    )}

                    {/* Email Verification Section */}
                    <div style={{
                      background: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: 'var(--border-radius-lg)',
                      padding: 'var(--spacing-6)',
                      marginBottom: 'var(--spacing-6)'
                    }}>
                      <h4 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-deep-indigo)',
                        marginBottom: 'var(--spacing-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)'
                      }}>
                        <FaEnvelope /> Xác thực Email
                      </h4>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-4)',
                        marginBottom: 'var(--spacing-4)',
                        padding: 'var(--spacing-4)',
                        background: emailVerified ? '#D1FAE5' : '#FEF3C7',
                        borderRadius: 'var(--border-radius-md)',
                        border: `1px solid ${emailVerified ? '#10B981' : '#F59E0B'}`
                      }}>
                        <div style={{
                          fontSize: '24px',
                          color: emailVerified ? '#10B981' : '#F59E0B'
                        }}>
                          {emailVerified ? '✅' : '⚠️'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--spacing-1)'
                          }}>
                            Email: <strong>{profileData.email}</strong>
                          </div>
                          <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-base)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: emailVerified ? '#047857' : '#D97706'
                          }}>
                            {emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                          </div>
                        </div>
                      </div>

                      {!emailVerified && (
                        <>
                          <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--spacing-4)'
                          }}>
                            Xác thực email giúp bảo vệ tài khoản của bạn và nhận thông báo quan trọng. 
                            Nhấn nút bên dưới để nhận email xác thực.
                          </p>

                          <button
                            onClick={handleSendVerification}
                            disabled={sendingVerification || countdown > 0}
                            style={{
                              padding: 'var(--spacing-3) var(--spacing-6)',
                              background: sendingVerification || countdown > 0 ? '#9CA3AF' : 'var(--color-deep-indigo)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 'var(--border-radius-md)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-base)',
                              fontWeight: 'var(--font-weight-semibold)',
                              cursor: sendingVerification || countdown > 0 ? 'not-allowed' : 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 'var(--spacing-2)'
                            }}
                          >
                            <FaEnvelope />
                            {sendingVerification ? 'Đang gửi...' : countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi email xác thực'}
                          </button>

                          {verificationMessage && (
                            <div style={{
                              marginTop: 'var(--spacing-4)',
                              padding: 'var(--spacing-3)',
                              background: verificationMessage.startsWith('✅') ? '#D1FAE5' : '#FEE2E2',
                              border: `1px solid ${verificationMessage.startsWith('✅') ? '#10B981' : '#EF4444'}`,
                              borderRadius: 'var(--border-radius-md)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-sm)',
                              color: verificationMessage.startsWith('✅') ? '#047857' : '#B91C1C'
                            }}>
                              {verificationMessage}
                            </div>
                          )}
                        </>
                      )}

                      {emailVerified && (
                        <div style={{
                          padding: 'var(--spacing-4)',
                          background: '#F0FDF4',
                          borderRadius: 'var(--border-radius-md)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-sm)',
                          color: '#047857'
                        }}>
                          🎉 Email của bạn đã được xác thực thành công!
                        </div>
                      )}
                    </div>

                    {/* Change Password Section - Placeholder */}
                    <div style={{
                      background: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: 'var(--border-radius-lg)',
                      padding: 'var(--spacing-6)'
                    }}>
                      <h4 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-deep-indigo)',
                        marginBottom: 'var(--spacing-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)'
                      }}>
                        🔑 Đổi mật khẩu
                      </h4>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                        padding: 'var(--spacing-8)'
                      }}>
                        Chức năng đổi mật khẩu đang được phát triển
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;