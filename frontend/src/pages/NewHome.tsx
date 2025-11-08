import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaCalendarAlt, FaUsers, FaMapMarkerAlt,
  FaMountain, FaUmbrellaBeach, FaCity, FaUtensils,
  FaStar, FaArrowRight, FaPlay
} from 'react-icons/fa';

const NewHomePage: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [guests, setGuests] = useState('2 người');

  // Featured destinations
  const destinations = [
    {
      name: 'Hạ Long',
      image: '/images/halong.jpg',
      properties: '234 tour',
      fallbackColor: '#1A365D'
    },
    {
      name: 'Hội An',
      image: '/images/hoian.jpg',
      properties: '189 tour',
      fallbackColor: '#2D3E50'
    },
    {
      name: 'Sapa',
      image: '/images/sapa.jpg',
      properties: '156 tour',
      fallbackColor: '#C9A961'
    },
    {
      name: 'Phú Quốc',
      image: '/images/phuquoc.jpg',
      properties: '298 tour',
      fallbackColor: '#1A365D'
    }
  ];

  // Property types
  const propertyTypes = [
    { icon: <FaMountain />, name: 'Miền núi', count: '450+' },
    { icon: <FaUmbrellaBeach />, name: 'Biển đảo', count: '320+' },
    { icon: <FaCity />, name: 'Thành phố', count: '280+' },
    { icon: <FaUtensils />, name: 'Ẩm thực', count: '190+' }
  ];

  // Featured tours
  const featuredTours = [
    {
      name: 'Hành Trình Vịnh Hạ Long 2N1Đ',
      location: 'Quảng Ninh',
      rating: 9.2,
      reviews: 156,
      price: 2500000,
      image: '/images/tour1.jpg',
      badge: 'Phổ biến'
    },
    {
      name: 'Khám Phá Phố Cổ Hội An',
      location: 'Quảng Nam',
      rating: 9.5,
      reviews: 234,
      price: 1800000,
      image: '/images/tour2.jpg',
      badge: 'Yêu thích'
    },
    {
      name: 'Sapa Mùa Lúa Chín',
      location: 'Lào Cai',
      rating: 9.0,
      reviews: 189,
      price: 3200000,
      image: '/images/tour3.jpg',
      badge: 'Mới'
    }
  ];

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Hero Section với Video Background */}
      <section style={{
        position: 'relative',
        height: '90vh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Image/Video Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(10, 35, 66, 0.90) 0%, rgba(26, 58, 92, 0.80) 100%)',
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
          zIndex: 1
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'var(--color-text-light)',
          maxWidth: '1200px',
          padding: '0 2rem'
        }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            VIỆT NAM: Vẻ Đẹp Bất Tận
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            marginBottom: '3rem',
            opacity: 0.95,
            maxWidth: '700px',
            margin: '0 auto 3rem'
          }}>
            Khám phá hồn Việt qua từng hành trình, trải nghiệm văn hóa đích thực
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
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
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
                  <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                  Ngày khởi hành
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
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
                  <FaUsers style={{ marginRight: '0.5rem' }} />
                  Số khách
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid var(--color-border-subtle)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-sans)',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-bronze-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border-subtle)'}
                >
                  <option>1 người</option>
                  <option>2 người</option>
                  <option>3-4 người</option>
                  <option>5+ người</option>
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
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(201, 169, 97, 0.4)';
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
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'var(--color-indigo-blue)'
          }}>
            Khám phá theo loại hình
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {propertyTypes.map((type, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--color-cream)',
                  padding: '2.5rem 2rem',
                  borderRadius: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid var(--color-border-subtle)',
                  position: 'relative',
                  overflow: 'hidden'
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
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  color: 'var(--color-bronze-gold)',
                  marginBottom: '1rem'
                }}>
                  {type.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem',
                  color: 'var(--color-indigo-blue)'
                }}>
                  {type.name}
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '1rem',
                  fontWeight: 500
                }}>
                  {type.count} tour
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section style={{
        padding: '5rem 2rem',
        background: 'var(--color-cream)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              marginBottom: '1rem',
              color: 'var(--color-indigo-blue)'
            }}>
              Điểm đến phổ biến
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.125rem'
            }}>
              Những địa điểm được du khách yêu thích nhất
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {destinations.map((dest, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  height: '400px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
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
                }}
              >
                {/* Fallback gradient background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${dest.fallbackColor} 0%, rgba(45, 62, 80, 0.8) 100%)`
                }} />
                
                {/* Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '2rem',
                  background: 'linear-gradient(to top, rgba(10, 35, 66, 0.95), transparent)',
                  color: 'white'
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.75rem',
                    marginBottom: '0.5rem'
                  }}>
                    {dest.name}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    opacity: 0.9
                  }}>
                    {dest.properties}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section style={{
        padding: '5rem 2rem',
        background: 'var(--color-bg-main)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              marginBottom: '1rem',
              color: 'var(--color-indigo-blue)'
            }}>
              Tour được yêu thích
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.125rem'
            }}>
              Những hành trình đáng nhớ nhất
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {featuredTours.map((tour, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--color-cream)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Image */}
                <div style={{
                  height: '240px',
                  background: 'linear-gradient(135deg, var(--color-indigo-blue) 0%, var(--color-light-indigo) 100%)',
                  position: 'relative'
                }}>
                  {/* Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'var(--color-bronze-gold)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    {tour.badge}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    marginBottom: '0.75rem',
                    color: 'var(--color-indigo-blue)'
                  }}>
                    {tour.name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem'
                  }}>
                    <FaMapMarkerAlt />
                    {tour.location}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border-subtle)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        background: 'var(--color-indigo-blue)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                        {tour.rating}
                      </div>
                      <span style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.875rem'
                      }}>
                        ({tour.reviews} đánh giá)
                      </span>
                    </div>

                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.25rem'
                      }}>
                        Từ
                      </div>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-bronze-gold)'
                      }}>
                        {tour.price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link
              to="/trips"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2.5rem',
                background: 'transparent',
                color: 'var(--color-bronze-gold)',
                border: '2px solid var(--color-bronze-gold)',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-sans)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-bronze-gold)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-bronze-gold)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Xem tất cả tour
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

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
            marginBottom: '1.5rem'
          }}>
            Bắt đầu hành trình của bạn
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: 0.95
          }}>
            Đăng ký ngay để nhận ưu đãi đặc biệt và khám phá Việt Nam theo cách của bạn
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              to="/auth/register"
              style={{
                padding: '1rem 2.5rem',
                background: 'var(--color-bronze-gold)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontFamily: 'var(--font-sans)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-bronze)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Đăng ký ngay
            </Link>
            <Link
              to="/trips"
              style={{
                padding: '1rem 2.5rem',
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontFamily: 'var(--font-sans)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'var(--color-indigo-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              Khám phá tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHomePage;
