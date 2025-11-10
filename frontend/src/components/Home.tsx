import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaSearch, FaMapMarkerAlt, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import BackgroundVideo from '../assets/videos/Background_VIdeo.mp4';
import { AuthContext } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  // Redirect based on user role after login
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
      // Regular users stay on home page
    }
  }, [isAuthenticated, user, navigate]);
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
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '90vh',
        minHeight: '600px',
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
          {/* Fallback image if video doesn't load */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url('/images/Backgroud_Home_Filter.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
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

        {/* Dark Overlay to make video darker */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          zIndex: 1
        }} />
        
        {/* Decorative Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23AE8E5B\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
          zIndex: 2
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          color: 'var(--color-text-light)',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
            color: '#FFFFFF'
          }}>
            TRIPOOK: Kết Nối Mọi Hành Trình
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            lineHeight: 1.6,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            color: '#F5F5F5',
            fontWeight: 500
          }}>
            Nền tảng kết nối du khách với nhà cung cấp dịch vụ du lịch uy tín.<br />
            Đặt tour, lưu trú, vận chuyển - Tất cả trong một nơi
          </p>

          {/* Search Box */}
          <div style={{
            background: 'var(--color-cream)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {/* Destination */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.5rem',
                  textAlign: 'left',
                  fontWeight: 500
                }}>
                  <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
                  Điểm đến
                </label>
                <input
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  value={searchData.destination}
                  onChange={(e) => handleSearchChange('destination', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid var(--color-border-subtle)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-sans)',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-bronze-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border-subtle)'}
                />
              </div>

              {/* Check-in Date */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.5rem',
                  textAlign: 'left',
                  fontWeight: 500
                }}>
                  <FaSearch style={{ marginRight: '0.5rem' }} />
                  Ngày khởi hành
                </label>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => handleSearchChange('checkIn', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid var(--color-border-subtle)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-sans)',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-bronze-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border-subtle)'}
                />
              </div>

              {/* Guests */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.5rem',
                  textAlign: 'left',
                  fontWeight: 500
                }}>
                  Số khách
                </label>
                <select
                  value={searchData.serviceType}
                  onChange={(e) => handleSearchChange('serviceType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid var(--color-border-subtle)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-sans)',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-bronze-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border-subtle)'}
                >
                  <option value="">1 người</option>
                  <option value="2">2 người</option>
                  <option value="3-4">3-4 người</option>
                  <option value="5+">5+ người</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button style={{
              width: '100%',
              padding: '1rem 2rem',
              background: 'var(--gradient-bronze)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow-bronze)',
              fontFamily: 'var(--font-sans)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(174, 142, 91, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-bronze)';
            }}>
              <FaSearch />
              Tìm kiếm tour
            </button>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section style={{
        padding: '5rem 2rem',
        background: 'var(--color-bg-main)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'var(--color-text-heading)',
            fontWeight: 700,
            letterSpacing: '-0.01em'
          }}>
            Khám phá theo loại hình
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'var(--color-cream)',
              padding: '2.5rem 2rem',
              borderRadius: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid var(--color-border-subtle)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = 'var(--color-bronze-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
            }}>
              <div style={{ fontSize: '3.5rem', color: 'var(--color-bronze-gold)', marginBottom: '1rem' }}>🏔️</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text-heading)', fontWeight: 700 }}>Miền núi</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 600 }}>52 tour</p>
            </div>

            <div style={{
              background: 'var(--color-cream)',
              padding: '2.5rem 2rem',
              borderRadius: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid var(--color-border-subtle)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = 'var(--color-bronze-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
            }}>
              <div style={{ fontSize: '3.5rem', color: 'var(--color-bronze-gold)', marginBottom: '1rem' }}>🏖️</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text-heading)', fontWeight: 700 }}>Biển đảo</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 600 }}>78 tour</p>
            </div>

            <div style={{
              background: 'var(--color-cream)',
              padding: '2.5rem 2rem',
              borderRadius: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid var(--color-border-subtle)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = 'var(--color-bronze-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
            }}>
              <div style={{ fontSize: '3.5rem', color: 'var(--color-bronze-gold)', marginBottom: '1rem' }}>🏙️</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text-heading)', fontWeight: 700 }}>Đô thị</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 600 }}>34 tour</p>
            </div>

            <div style={{
              background: 'var(--color-cream)',
              padding: '2.5rem 2rem',
              borderRadius: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid var(--color-border-subtle)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = 'var(--color-bronze-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
            }}>
              <div style={{ fontSize: '3.5rem', color: 'var(--color-bronze-gold)', marginBottom: '1rem' }}>🍜</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text-heading)', fontWeight: 700 }}>Ẩm thực</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 600 }}>45 tour</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <main style={{ backgroundColor: 'var(--color-cream)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Accommodations Section */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              marginBottom: '1rem',
              color: 'var(--color-text-heading)',
              fontWeight: 700,
              letterSpacing: '-0.01em'
            }}>
              Tour được yêu thích
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.125rem',
              fontWeight: 500
            }}>
              Những hành trình đáng nhớ nhất
            </p>
          </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sampleAccommodations.map((item) => (
                <div key={item.id} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      style={{ borderRadius: '0.75rem 0.75rem 0 0' }}
                    />
                    <button style={{
                      position: 'absolute',
                      top: 'var(--space-sm)',
                      right: 'var(--space-sm)',
                      padding: 'var(--space-sm)',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(248, 245, 242, 0.9)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-main)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 245, 242, 0.9)'}>
                      {item.isFavorite ? (
                        <FaHeart style={{ color: '#DC2626' }} />
                      ) : (
                        <FaRegHeart style={{ color: 'var(--color-text-secondary)' }} />
                      )}
                    </button>
                  </div>
                  
                  <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h4 style={{
                      fontFamily: 'var(--font-serif)',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-sm)',
                      fontSize: '1.0625rem',
                      lineHeight: 'var(--leading-tight)',
                      minHeight: '3rem'
                    }} className="line-clamp-2">{item.name}</h4>
                    <div className="flex items-center gap-1" style={{ marginBottom: 'var(--space-sm)' }}>
                      <FaStar style={{ color: 'var(--color-bronze-gold)', fontSize: '0.9375rem' }} />
                      <span style={{
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-sans)'
                      }}>{item.rating}</span>
                    </div>
                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)', flexGrow: 1 }}>
                      <span style={{
                        fontSize: '1.1875rem',
                        fontWeight: '700',
                        color: 'var(--color-bronze-gold)',
                        fontFamily: 'var(--font-sans)'
                      }}>{item.price}</span>
                    </div>
                    
                    {/* Action Buttons - Always at bottom */}
                    <div className="flex gap-2 mt-auto">
                      <Link 
                        to={`/services/detail/${item.id}`} 
                        className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors text-center"
                      >
                        Xem chi tiết
                      </Link>
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
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

      {/* CTA Section */}
      <section style={{
        padding: '5rem 2rem',
        background: 'var(--gradient-indigo)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23AE8E5B\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }} />

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1.5rem',
            color: '#FFFFFF',
            fontWeight: 700,
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            Bắt đầu hành trình của bạn
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            color: '#F5F5F5',
            fontWeight: 500,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}>
            Đăng ký ngay để nhận ưu đãi đặc biệt và khám phá Việt Nam theo cách riêng của bạn
          </p>
          <Link 
            to="/auth/register"
            style={{
              display: 'inline-block',
              padding: '1rem 3rem',
              background: 'var(--gradient-bronze)',
              color: 'white',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(174, 142, 91, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(174, 142, 91, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(174, 142, 91, 0.3)';
            }}
          >
            Đăng ký ngay
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;