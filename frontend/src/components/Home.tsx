import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaSearch, FaMapMarkerAlt, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import BackgroundVideo from '../assets/videos/Background_VIdeo.mp4';

const Home: React.FC = () => {
  // Don't auto-redirect on home page
  // Users should be able to visit home page even when logged in
  // Redirect logic is handled in Login component after successful login
  
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    serviceType: '',
    priceRange: '',
    rating: ''
  });

  // Sample data for services
  const sampleAccommodations = [
    {
      id: 1,
      name: 'Apartment in Quận Ba Đình',
      price: '900.000đ/2 đêm',
      rating: 4.78,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 2,
      name: 'Villa sang trọng Tây Hồ',
      price: '1.395.000đ/2 đêm',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 3,
      name: 'Homestay cozy Hoàn Kiếm',
      price: '597.000đ/2 đêm',
      rating: 4.94,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 4,
      name: 'Tour Hạ Long 3N2Đ',
      price: '2.500.000đ/người',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop',
      isFavorite: false
    }
  ];

  const handleSearchChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-bg-main)' }}>
      <Header />
      
      {/* Hero Section - Redesigned with Vietnamese Heritage Theme */}
      <section style={{
        position: 'relative',
        height: '85vh',
        minHeight: '600px',
        maxHeight: '900px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src={BackgroundVideo} type="video/mp4" />
        </video>

        {/* Fallback Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/images/Backgroud_Home_Filter.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          display: 'none'
        }} className="video-fallback" />

        {/* Dark Overlay for Text Readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(44, 62, 80, 0.6) 0%, rgba(44, 62, 80, 0.4) 100%)',
          zIndex: 1
        }} />

        {/* Content Container */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-8)',
          width: '100%'
        }}>
          {/* Main Title - Playfair Display */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--font-size-h1)',
            fontWeight: 'var(--font-weight-bold)',
            marginBottom: 'var(--spacing-6)',
            lineHeight: 1.15,
            letterSpacing: 'var(--letter-spacing-tight)',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            color: '#FFFFFF'
          }}>
            Khám Phá Di Sản Việt Nam
          </h1>
          
          {/* Subtitle - Be Vietnam Pro */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--spacing-12)',
            maxWidth: '700px',
            margin: `0 auto ${52}px`,
            lineHeight: 1.7,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: 'var(--font-weight-normal)'
          }}>
            Kết nối với những trải nghiệm du lịch đích thực<br />
            Tour • Lưu trú • Vận chuyển
          </p>

          {/* Search Box - Redesigned with Design System */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-10)',
            boxShadow: 'var(--shadow-2xl)',
            maxWidth: '1050px',
            margin: '0 auto',
            border: `1px solid rgba(184, 134, 11, 0.15)`
          }}>
            {/* Search Title */}
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-h3)',
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-6)',
              fontWeight: 'var(--font-weight-semibold)',
              textAlign: 'center'
            }}>
              Tìm kiếm chuyến đi của bạn
            </h3>

            {/* Search Fields Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--spacing-4)',
              marginBottom: 'var(--spacing-6)'
            }}>
              {/* Destination Input */}
              <div style={{ position: 'relative' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--spacing-2)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  Điểm đến
                </label>
                <div style={{ position: 'relative' }}>
                  <FaMapMarkerAlt style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-accent)',
                    fontSize: '16px'
                  }} />
                  <input
                    type="text"
                    placeholder="Bạn muốn đi đâu?"
                    value={searchData.destination}
                    onChange={(e) => handleSearchChange('destination', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '2px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)',
                      fontFamily: 'var(--font-body)',
                      transition: 'var(--transition-default)',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--color-text)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-accent)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Check-in Date */}
              <div style={{ position: 'relative' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--spacing-2)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  Ngày đi
                </label>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => handleSearchChange('checkIn', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-body)',
                    transition: 'var(--transition-default)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-text)',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Check-out Date */}
              <div style={{ position: 'relative' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--spacing-2)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  Ngày về
                </label>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => handleSearchChange('checkOut', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-body)',
                    transition: 'var(--transition-default)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-text)',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Number of Guests */}
              <div style={{ position: 'relative' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--spacing-2)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  Số khách
                </label>
                <select
                  value={searchData.serviceType}
                  onChange={(e) => handleSearchChange('serviceType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-base)',
                    fontFamily: 'var(--font-body)',
                    transition: 'var(--transition-default)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23333333' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '40px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">1 người</option>
                  <option value="2">2 người</option>
                  <option value="3-4">3-4 người</option>
                  <option value="5+">5+ người</option>
                </select>
              </div>
            </div>

            {/* Search Button - Full Width CTA */}
            <button
              onClick={() => console.log('Tìm kiếm:', searchData)}
              style={{
                width: '100%',
                padding: 'var(--spacing-4)',
                backgroundColor: 'var(--color-cta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-lg)',
                fontFamily: 'var(--font-body)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer',
                transition: 'var(--transition-default)',
                boxShadow: 'var(--shadow-cta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C23818';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(217, 65, 30, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-cta)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-cta)';
              }}
            >
              <FaSearch style={{ fontSize: '18px' }} />
              <span>Tìm kiếm chuyến đi</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section - Khám phá theo loại hình */}
      <section style={{
        backgroundColor: 'var(--color-bg-main)',
        padding: 'var(--spacing-20) var(--spacing-8)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-16)'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-h2)',
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--spacing-4)'
            }}>
              Khám Phá Theo Loại Hình
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Tìm kiếm trải nghiệm phù hợp với sở thích của bạn
            </p>
          </div>

          {/* Category Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--spacing-8)'
          }}>
            {/* Miền núi */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'var(--transition-default)',
              border: '2px solid transparent',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-accent-lg)';
              e.currentTarget.style.borderColor = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              {/* Image Section */}
              <div style={{
                height: '160px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" 
                  alt="Miền núi"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.9
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(44,62,80,0.3) 0%, rgba(44,62,80,0.6) 100%)'
                }} />
              </div>
              {/* Content Section */}
              <div style={{
                padding: 'var(--spacing-6)',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-xl)',
                  color: 'var(--color-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--spacing-2)'
                }}>Miền Núi</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-accent)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>52 tour</p>
              </div>
            </div>

            {/* Biển đảo */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'var(--transition-default)',
              border: '2px solid transparent',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-accent-lg)';
              e.currentTarget.style.borderColor = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              {/* Image Section */}
              <div style={{
                height: '160px',
                background: 'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop" 
                  alt="Biển đảo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.9
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(44,62,80,0.3) 0%, rgba(44,62,80,0.6) 100%)'
                }} />
              </div>
              {/* Content Section */}
              <div style={{
                padding: 'var(--spacing-6)',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-xl)',
                  color: 'var(--color-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--spacing-2)'
                }}>Biển Đảo</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-accent)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>78 tour</p>
              </div>
            </div>

            {/* Đô thị */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'var(--transition-default)',
              border: '2px solid transparent',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-accent-lg)';
              e.currentTarget.style.borderColor = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              {/* Image Section */}
              <div style={{
                height: '160px',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=400&h=300&fit=crop" 
                  alt="Đô thị"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.9
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(44,62,80,0.3) 0%, rgba(44,62,80,0.6) 100%)'
                }} />
              </div>
              {/* Content Section */}
              <div style={{
                padding: 'var(--spacing-6)',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-xl)',
                  color: 'var(--color-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--spacing-2)'
                }}>Đô Thị</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-accent)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>34 tour</p>
              </div>
            </div>

            {/* Ẩm thực */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'var(--transition-default)',
              border: '2px solid transparent',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-accent-lg)';
              e.currentTarget.style.borderColor = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              {/* Image Section */}
              <div style={{
                height: '160px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" 
                  alt="Ẩm thực"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.9
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(44,62,80,0.3) 0%, rgba(44,62,80,0.6) 100%)'
                }} />
              </div>
              {/* Content Section */}
              <div style={{
                padding: 'var(--spacing-6)',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-xl)',
                  color: 'var(--color-primary)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--spacing-2)'
                }}>Ẩm Thực</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-accent)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>45 tour</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section - Tour được yêu thích */}
      <main style={{
        backgroundColor: '#FFFFFF',
        padding: 'var(--spacing-20) var(--spacing-8)',
        borderTop: '1px solid rgba(184,134,11,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-16)'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-h2)',
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--spacing-4)'
            }}>
              Tour Được Yêu Thích
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Những hành trình đáng nhớ nhất được lựa chọn nhiều nhất
            </p>
          </div>

          {/* Service Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--spacing-8)'
          }}>
            {sampleAccommodations.map((item) => (
              <div key={item.id} style={{
                backgroundColor: 'var(--color-bg-main)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'var(--transition-default)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}>
                {/* Image */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  {/* Favorite Button */}
                  <button style={{
                    position: 'absolute',
                    top: 'var(--spacing-3)',
                    right: 'var(--spacing-3)',
                    padding: 'var(--spacing-2)',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition-default)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                  }}>
                    {item.isFavorite ? (
                      <FaHeart style={{ color: 'var(--color-cta)', fontSize: '16px' }} />
                    ) : (
                      <FaRegHeart style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }} />
                    )}
                  </button>
                </div>
                
                {/* Content */}
                <div style={{
                  padding: 'var(--spacing-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1
                }}>
                  {/* Title */}
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-primary)',
                    fontWeight: 'var(--font-weight-semibold)',
                    marginBottom: 'var(--spacing-3)',
                    lineHeight: '1.4',
                    minHeight: '2.8rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>{item.name}</h4>
                  
                  {/* Rating */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    marginBottom: 'var(--spacing-4)'
                  }}>
                    <FaStar style={{
                      color: 'var(--color-accent)',
                      fontSize: '14px'
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text)'
                    }}>{item.rating}</span>
                  </div>
                  
                  {/* Price */}
                  <div style={{
                    marginBottom: 'var(--spacing-6)',
                    flexGrow: 1
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-accent)'
                    }}>{item.price}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-3)',
                    marginTop: 'auto'
                  }}>
                    <Link 
                      to={`/services/detail/${item.id}`}
                      style={{
                        flex: 1,
                        padding: 'var(--spacing-3) var(--spacing-4)',
                        backgroundColor: 'transparent',
                        color: 'var(--color-primary)',
                        border: '2px solid var(--color-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        textAlign: 'center',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'var(--transition-default)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-primary)';
                      }}
                    >
                      Chi tiết
                    </Link>
                    <button style={{
                      flex: 1,
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      backgroundColor: 'var(--color-cta)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      cursor: 'pointer',
                      transition: 'var(--transition-default)',
                      boxShadow: 'var(--shadow-cta)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(217,65,30,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-cta)';
                    }}>
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
              
              {/* Show "Chưa có dịch vụ" if no data */}
              {sampleAccommodations.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="text-4xl mb-3">🏠</div>
                  <p className="text-sm">Chưa có dịch vụ</p>
                </div>
              )}
            </div>
        </div>
      </main>

      {/* CTA Section - Bắt đầu hành trình */}
      <section style={{
        padding: 'var(--spacing-20) var(--spacing-8)',
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Pattern Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8860B\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.15,
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--font-size-h1)',
            color: '#FFFFFF',
            fontWeight: 'var(--font-weight-bold)',
            marginBottom: 'var(--spacing-6)',
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}>
            Bắt Đầu Hành Trình Của Bạn
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-xl)',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: 'var(--spacing-10)',
            lineHeight: '1.6'
          }}>
            Đăng ký ngay để nhận ưu đãi đặc biệt và khám phá<br />Việt Nam theo cách riêng của bạn
          </p>
          <Link 
            to="/auth/register"
            style={{
              display: 'inline-block',
              padding: 'var(--spacing-5) var(--spacing-12)',
              backgroundColor: 'var(--color-accent)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              textDecoration: 'none',
              transition: 'var(--transition-default)',
              boxShadow: '0 4px 20px rgba(184,134,11,0.3)',
              border: '2px solid var(--color-accent)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(184,134,11,0.4)';
              e.currentTarget.style.backgroundColor = '#C79A2B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(184,134,11,0.3)';
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            }}
          >
            Đăng Ký Ngay
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;