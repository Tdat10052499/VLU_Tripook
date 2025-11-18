import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { FaSearch, FaMapMarkerAlt, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState('accommodation');
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
  const [searchData, setSearchData] = useState({
    destination: ''
  });
  const [submittedSearch, setSubmittedSearch] = useState(''); // Lưu trữ search query đã được submit
  const [visibleRows, setVisibleRows] = useState(1); // Số hàng hiển thị (mặc định 1 hàng = 4 items)

  // Handle navigation to service detail
  const handleViewDetail = (item: any) => {
    navigate(`/services/detail/${item.id}`, { 
      state: { 
        item, 
        serviceType: activeService 
      } 
    });
  };



  // Sample data for different services
  const accommodationData = [
    {
      id: 1,
      name: 'Khách sạn Mường Thanh Luxury Nha Trang',
      price: '2.500.000đ/đêm',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 2,
      name: 'Resort Vinpearl Phú Quốc',
      price: '4.200.000đ/đêm',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 3,
      name: 'Homestay Sapa Valley View',
      price: '800.000đ/đêm',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 4,
      name: 'Villa Đà Lạt Romance',
      price: '3.500.000đ/đêm',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 5,
      name: 'Khách sạn Rex Sài Gòn',
      price: '1.800.000đ/đêm',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 6,
      name: 'Resort Anantara Hội An',
      price: '6.500.000đ/đêm',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 7,
      name: 'Khách sạn De L\'Opera Hà Nội',
      price: '2.200.000đ/đêm',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 8,
      name: 'InterContinental Danang Sun Peninsula',
      price: '8.900.000đ/đêm',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 9,
      name: 'Flamingo Cát Bà Beach Resort',
      price: '1.500.000đ/đêm',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 10,
      name: 'Pullman Vung Tau',
      price: '2.800.000đ/đêm',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 11,
      name: 'Sheraton Hanoi Hotel',
      price: '3.200.000đ/đêm',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 12,
      name: 'Liberty Central Saigon Citypoint',
      price: '2.100.000đ/đêm',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
      isFavorite: false
    }
  ];

  const tourData = [
    {
      id: 1,
      name: 'Tour Hạ Long - Sapa 4N3Đ',
      price: '5.990.000đ/người',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 2,
      name: 'Tour Phú Quốc Trọn Gói 3N2Đ',
      price: '3.200.000đ/người',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 3,
      name: 'Tour Hội An - Huế - Động Thiên Đường',
      price: '4.500.000đ/người',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1555400292-4c849151a60b?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 4,
      name: 'Tour Bangkok - Pattaya 5N4Đ',
      price: '8.900.000đ/người',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 5,
      name: 'Tour Đà Nẵng - Bà Nà Hills 3N2Đ',
      price: '2.800.000đ/người',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 6,
      name: 'Tour Singapore - Malaysia 6N5Đ',
      price: '12.500.000đ/người',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 7,
      name: 'Tour Mù Cang Chải - Yên Bái 2N1Đ',
      price: '1.800.000đ/người',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1586798271252-e2abca2ec247?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 8,
      name: 'Tour Nhật Bản - Tokyo Osaka 7N6Đ',
      price: '28.900.000đ/người',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
      isFavorite: true
    }
  ];

  const transportData = [
    {
      id: 1,
      name: 'Vé máy bay Hà Nội - TP.HCM',
      price: '1.200.000đ/chiều',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 2,
      name: 'Thuê xe 7 chỗ có tài xế',
      price: '1.500.000đ/ngày',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 3,
      name: 'Vé tàu hỏa Hà Nội - Sapa',
      price: '350.000đ/người',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 4,
      name: 'Thuê xe máy Đà Lạt',
      price: '150.000đ/ngày',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 5,
      name: 'Vé máy bay Hà Nội - Đà Nẵng',
      price: '900.000đ/chiều',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 6,
      name: 'Thuê xe limousine Sài Gòn - Vũng Tàu',
      price: '800.000đ/chuyến',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 7,
      name: 'Vé tàu cao tốc Cần Thơ - Phú Quốc',
      price: '450.000đ/người',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1572098812516-beea72cc0f6d?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 8,
      name: 'Charter máy bay riêng',
      price: '25.000.000đ/chuyến',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop',
      isFavorite: true
    }
  ];

  const bannerSlides = [
    {
      id: 1,
      title: "Ưu đãi mùa hè 2025!",
      description: "Giảm giá lên đến 40% cho tất cả dịch vụ du lịch. Đặt ngay để nhận ưu đãi tốt nhất!",
      gradient: "from-orange-400 to-pink-500",
      icon: "🌞"
    },
    {
      id: 2,
      title: "Tour Châu Âu Khuyến Mãi",
      description: "Khám phá 5 nước châu Âu chỉ từ 45.999.000đ. Bao gồm vé máy bay và khách sạn 4 sao!",
      gradient: "from-blue-500 to-cyan-400",
      icon: "🇪🇺"
    },
    {
      id: 3,
      title: "Combo Nghỉ Dưỡng Phú Quốc",
      description: "Resort 5 sao + Tour 4 đảo + Ăn uống không giới hạn. Ưu đãi đặc biệt 30%!",
      gradient: "from-green-500 to-emerald-400",
      icon: "🏖️"
    },
    {
      id: 4,
      title: "Đặt Sớm Tiết Kiệm Nhiều",
      description: "Đặt tour trước 60 ngày nhận ngay voucher 2.000.000đ. Áp dụng cho mọi điểm đến!",
      gradient: "from-purple-500 to-violet-400",
      icon: "💰"
    }
  ];

  const getCurrentData = () => {
    let data;
    switch (activeService) {
      case 'accommodation': data = accommodationData; break;
      case 'tour': data = tourData; break;
      case 'transport': data = transportData; break;
      default: data = accommodationData;
    }
    // Giới hạn theo số hàng hiển thị (4 items per row)
    const itemsPerRow = 4;
    const maxItems = visibleRows * itemsPerRow;
    return data.slice(0, maxItems);
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  // Handle search submission
  const handleSearch = () => {
    setSubmittedSearch(searchData.destination.trim());
    setVisibleRows(1); // Reset hiển thị về 1 hàng khi tìm kiếm mới
  };

  // Handle load more functionality
  const handleLoadMore = () => {
    setVisibleRows(prev => prev + 3); // Tăng thêm 3 hàng (12 items)
  };

  // Generate dynamic title based on submitted search and service type
  const getContainerTitle = () => {
    const hasDestination = submittedSearch !== '';
    
    let baseTitle = '';
    let icon = '';
    
    switch (activeService) {
      case 'accommodation':
        baseTitle = 'Chỗ ở';
        icon = '🏨';
        break;
      case 'tour':
        baseTitle = 'Tour du lịch';
        icon = '🗺️';
        break;
      case 'transport':
        baseTitle = 'Phương tiện vận chuyển';
        icon = '✈️';
        break;
      default:
        baseTitle = 'Chỗ ở';
        icon = '🏨';
    }
    
    if (hasDestination) {
      return `${icon} ${baseTitle} được đề xuất ở ${submittedSearch}`;
    } else {
      return `${icon} ${baseTitle} được đề xuất`;
    }
  };

  // Auto-slide banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  // Reset visible rows and search when service type changes
  useEffect(() => {
    setVisibleRows(1);
    setSubmittedSearch(''); // Reset search khi chuyển loại dịch vụ
  }, [activeService]);

  return (
    <div style={{ backgroundColor: 'var(--color-bg-main)' }}>
      <Header />
      
      {/* Hero Section with Service Tabs */}
      <section style={{
        position: 'relative',
        padding: 'var(--spacing-20) var(--spacing-8)',
        backgroundColor: 'var(--color-primary)',
        borderBottom: '3px solid var(--color-accent)'
      }}>
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8860B\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Page Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-12)'
          }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-h1)',
              color: '#FFFFFF',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--spacing-4)'
            }}>
              Khám Phá Dịch Vụ Du Lịch
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-lg)',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              Tìm kiếm và đặt dịch vụ du lịch tốt nhất tại Việt Nam
            </p>
          </div>

          {/* Service Navigation Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--spacing-6)'
          }}>
            {/* Chỗ ở Tab */}
            <button
              onClick={() => setActiveService('accommodation')}
              style={{
                padding: 'var(--spacing-8)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeService === 'accommodation' ? '#FFFFFF' : 'rgba(255,255,255,0.1)',
                border: `2px solid ${activeService === 'accommodation' ? 'var(--color-accent)' : 'transparent'}`,
                color: activeService === 'accommodation' ? 'var(--color-primary)' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'var(--transition-default)',
                boxShadow: activeService === 'accommodation' ? 'var(--shadow-accent-lg)' : 'none',
                transform: activeService === 'accommodation' ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (activeService !== 'accommodation') {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeService !== 'accommodation') {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-3)'
              }}>
                <div style={{ fontSize: '3rem' }}>🏨</div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    marginBottom: 'var(--spacing-1)'
                  }}>Chỗ Ở</h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-sm)',
                    opacity: 0.8
                  }}>
                    Khách sạn • Resort • Homestay
                  </p>
                </div>
              </div>
            </button>

            {/* Tour du lịch Tab */}
            <button
              onClick={() => setActiveService('tour')}
              style={{
                padding: 'var(--spacing-8)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeService === 'tour' ? '#FFFFFF' : 'rgba(255,255,255,0.1)',
                border: `2px solid ${activeService === 'tour' ? 'var(--color-accent)' : 'transparent'}`,
                color: activeService === 'tour' ? 'var(--color-primary)' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'var(--transition-default)',
                boxShadow: activeService === 'tour' ? 'var(--shadow-accent-lg)' : 'none',
                transform: activeService === 'tour' ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (activeService !== 'tour') {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeService !== 'tour') {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-3)'
              }}>
                <div style={{ fontSize: '3rem' }}>🎈</div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    marginBottom: 'var(--spacing-1)'
                  }}>Tour Du Lịch</h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-sm)',
                    opacity: 0.8
                  }}>
                    Tour • Hoạt động • Trải nghiệm
                  </p>
                </div>
              </div>
            </button>

            {/* Vận chuyển Tab */}
            <button
              onClick={() => setActiveService('transport')}
              style={{
                padding: 'var(--spacing-8)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeService === 'transport' ? '#FFFFFF' : 'rgba(255,255,255,0.1)',
                border: `2px solid ${activeService === 'transport' ? 'var(--color-accent)' : 'transparent'}`,
                color: activeService === 'transport' ? 'var(--color-primary)' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'var(--transition-default)',
                boxShadow: activeService === 'transport' ? 'var(--shadow-accent-lg)' : 'none',
                transform: activeService === 'transport' ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (activeService !== 'transport') {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeService !== 'transport') {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-3)'
              }}>
                <div style={{ fontSize: '3rem' }}>✈️</div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    marginBottom: 'var(--spacing-1)'
                  }}>Vận Chuyển</h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-sm)',
                    opacity: 0.8
                  }}>
                    Máy bay • Xe • Tàu hỏa
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Search and Content Section */}
      <main style={{
        backgroundColor: 'var(--color-bg-main)',
        padding: 'var(--spacing-16) var(--spacing-8)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Search Bar */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-8)',
            marginBottom: 'var(--spacing-12)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(184,134,11,0.1)'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--spacing-6)'
            }}>
              {activeService === 'accommodation' && '🔍 Tìm Kiếm Chỗ Ở'}
              {activeService === 'tour' && '🔍 Tìm Kiếm Tour Du Lịch'}
              {activeService === 'transport' && '🔍 Tìm Kiếm Vận Chuyển'}
            </h3>
            
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-4)',
              alignItems: 'flex-end'
            }}>
              {/* Destination Search */}
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
                <FaMapMarkerAlt style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-accent)',
                  fontSize: '18px',
                  zIndex: 10
                }} />
                <input
                  type="text"
                  placeholder="Nhập điểm đến hoặc tên dịch vụ..."
                  value={searchData.destination}
                  onChange={(e) => handleSearchChange('destination', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    width: '100%',
                    paddingLeft: '48px',
                    paddingRight: 'var(--spacing-4)',
                    paddingTop: 'var(--spacing-4)',
                    paddingBottom: 'var(--spacing-4)',
                    border: '2px solid #E5E7EB',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    outline: 'none',
                    transition: 'var(--transition-default)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(184,134,11,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                style={{
                  backgroundColor: 'var(--color-cta)',
                  color: '#FFFFFF',
                  padding: 'var(--spacing-4) var(--spacing-10)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition-default)',
                  boxShadow: 'var(--shadow-cta)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(217,65,30,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-cta)';
                }}
              >
                <FaSearch />
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* 3D Card Carousel - Portrait Style */}
          <div style={{ 
            marginBottom: 'var(--spacing-12)',
            position: 'relative',
            height: '480px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '2000px',
            overflow: 'visible'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {bannerSlides.map((slide, index) => {
                const isActive = index === currentBannerSlide;
                const isPrev = index === (currentBannerSlide - 1 + bannerSlides.length) % bannerSlides.length;
                const isNext = index === (currentBannerSlide + 1) % bannerSlides.length;
                const isVisible = isActive || isPrev || isNext;

                // Calculate position and scale for 3D effect - Portrait cards
                let translateX = 0;
                let translateZ = 0;
                let rotateY = 0;
                let scale = 0.75;
                let opacity = 0.5;
                let zIndex = 1;

                if (isActive) {
                  translateX = 0;
                  translateZ = 50;
                  rotateY = 0;
                  scale = 1;
                  opacity = 1;
                  zIndex = 3;
                } else if (isPrev) {
                  translateX = -320;
                  translateZ = -100;
                  rotateY = 15;
                  scale = 0.85;
                  opacity = 0.6;
                  zIndex = 2;
                } else if (isNext) {
                  translateX = 320;
                  translateZ = -100;
                  rotateY = -15;
                  scale = 0.85;
                  opacity = 0.6;
                  zIndex = 2;
                }

                return (
                  <div
                    key={slide.id}
                    style={{
                      position: 'absolute',
                      width: '340px',
                      height: '440px',
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity: isVisible ? opacity : 0,
                      transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      zIndex: zIndex,
                      pointerEvents: isVisible ? 'auto' : 'none',
                      transformStyle: 'preserve-3d',
                      filter: isActive ? 'none' : 'blur(1.5px)'
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      boxShadow: isActive ? 'var(--shadow-2xl)' : 'var(--shadow-lg)',
                      background: slide.id === 1 ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF6B35 100%)' :
                                 slide.id === 2 ? 'linear-gradient(135deg, #2C3E50 0%, #3498DB 50%, #2C3E50 100%)' :
                                 slide.id === 3 ? 'linear-gradient(135deg, #10B981 0%, #059669 50%, #10B981 100%)' :
                                 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #8B5CF6 100%)',
                      cursor: isActive ? 'default' : 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => !isActive && setCurrentBannerSlide(index)}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        // Add hover overlay
                        const overlay = document.createElement('div');
                        overlay.className = 'hover-overlay-temp';
                        overlay.style.cssText = `
                          position: absolute;
                          inset: 0;
                          background: rgba(255, 255, 255, 0.1);
                          pointer-events: none;
                          transition: opacity 0.3s ease;
                        `;
                        e.currentTarget.appendChild(overlay);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.transform = 'scale(1)';
                        // Remove hover overlay
                        const overlay = e.currentTarget.querySelector('.hover-overlay-temp');
                        if (overlay) overlay.remove();
                      }
                    }}
                  >
                  {/* Animated Background Pattern */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.08,
                    backgroundImage: 'radial-gradient(circle at 20% 30%, white 2px, transparent 2px), radial-gradient(circle at 80% 70%, white 2px, transparent 2px)',
                    backgroundSize: '40px 40px',
                    animation: 'slidePattern 25s linear infinite'
                  }} />

                  {/* Decorative Circle - Top Right */}
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    filter: 'blur(40px)',
                    animation: isActive ? 'pulse 4s ease-in-out infinite' : 'none'
                  }} />

                  {/* Content Container - Vertical Layout */}
                  <div style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-8)',
                    color: '#FFFFFF',
                    zIndex: 2
                  }}>
                    {/* Top Section - Icon & Badge */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      {/* Icon Badge - Larger for portrait */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '96px',
                        height: '96px',
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50%',
                        fontSize: '52px',
                        marginBottom: 'var(--spacing-6)',
                        border: '3px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        animation: isActive ? 'bounceIn 0.8s ease-out' : 'none'
                      }}>
                        {slide.icon}
                      </div>

                      {/* Discount Badge - NEW */}
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: slide.id === 1 ? '#FF6B35' :
                               slide.id === 2 ? '#2C3E50' :
                               slide.id === 3 ? '#10B981' : '#8B5CF6',
                        padding: 'var(--spacing-2) var(--spacing-4)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-bold)',
                        fontFamily: 'var(--font-body)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transform: isActive ? 'scale(1)' : 'scale(0.9)',
                        opacity: isActive ? 1 : 0,
                        transition: 'all 0.5s ease-out 0.2s'
                      }}>
                        {slide.id === 1 ? 'GIẢM ĐẾN 40%' :
                         slide.id === 2 ? 'ƯU ĐÃI ĐẶC BIỆT' :
                         slide.id === 3 ? 'COMBO TIẾT KIỆM' : 'BOOK SỚM'}
                      </div>
                    </div>

                    {/* Middle Section - Title & Description */}
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '0 var(--spacing-4)'
                    }}>
                      {/* Title - Center aligned */}
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.5rem, 2vw, 1.75rem)',
                        fontWeight: 'var(--font-weight-bold)',
                        marginBottom: 'var(--spacing-4)',
                        lineHeight: 1.3,
                        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
                        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                        opacity: isActive ? 1 : 0,
                        transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
                      }}>
                        {slide.title}
                      </h3>

                      {/* Description - Center aligned */}
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-base)',
                        lineHeight: 1.6,
                        color: 'rgba(255, 255, 255, 0.95)',
                        textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)',
                        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                        opacity: isActive ? 1 : 0,
                        transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
                      }}>
                        {slide.description}
                      </p>
                    </div>

                    {/* Bottom Section - CTA Button */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <button style={{
                        width: '100%',
                        padding: 'var(--spacing-4) var(--spacing-6)',
                        backgroundColor: '#FFFFFF',
                        color: slide.id === 1 ? '#FF6B35' :
                               slide.id === 2 ? '#2C3E50' :
                               slide.id === 3 ? '#10B981' : '#8B5CF6',
                        border: 'none',
                        borderRadius: 'var(--radius-lg)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 'var(--font-weight-bold)',
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                        opacity: isActive ? 1 : 0,
                        transition: 'all 0.3s ease, transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                      }}>
                        <span>Khám Phá Ngay</span>
                        <span style={{ fontSize: '20px' }}>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                );
              })}
              
              {/* Navigation Controls */}
              <div style={{
                position: 'absolute',
                bottom: 'var(--spacing-6)',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 'var(--spacing-3)',
                zIndex: 10,
                padding: 'var(--spacing-2) var(--spacing-4)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-lg)'
              }}>
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerSlide(index)}
                    style={{
                      width: index === currentBannerSlide ? '32px' : '8px',
                      height: '8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: index === currentBannerSlide ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: index === currentBannerSlide ? '0 2px 8px rgba(255, 255, 255, 0.5)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (index !== currentBannerSlide) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== currentBannerSlide) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                      }
                    }}
                  />
                ))}
              </div>

              {/* Arrow Navigation */}
              <button
                onClick={() => setCurrentBannerSlide(prev => prev === 0 ? bannerSlides.length - 1 : prev - 1)}
                style={{
                  position: 'absolute',
                  left: 'var(--spacing-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'var(--color-primary)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                }}>
                ←
              </button>

              <button
                onClick={() => setCurrentBannerSlide(prev => (prev + 1) % bannerSlides.length)}
                style={{
                  position: 'absolute',
                  right: 'var(--spacing-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'var(--color-primary)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                }}>
                →
              </button>
            </div>
          </div>

          {/* Service Cards Section */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            padding: 'var(--spacing-8)'
          }}>
            {/* Section Title */}
            <div style={{ marginBottom: 'var(--spacing-10)' }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--font-size-h3)',
                color: 'var(--color-primary)',
                fontWeight: 'var(--font-weight-bold)'
              }}>
                {getContainerTitle()}
              </h3>
            </div>

            {/* Service Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--spacing-8)'
            }}>
              {getCurrentData().map((item) => (
                <div
                  key={item.id}
                  style={{
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
                  }}
                >
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
                      <button 
                        onClick={() => handleViewDetail(item)}
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
                      </button>
                      <button 
                        onClick={() => handleViewDetail(item)}
                        style={{
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
                        }}
                      >
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div style={{
              textAlign: 'center',
              marginTop: 'var(--spacing-12)'
            }}>
              <button 
                onClick={handleLoadMore}
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: '#FFFFFF',
                  padding: 'var(--spacing-5) var(--spacing-12)',
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition-default)',
                  boxShadow: '0 4px 20px rgba(184,134,11,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(184,134,11,0.4)';
                  e.currentTarget.style.backgroundColor = '#C79A2B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(184,134,11,0.3)';
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                }}
              >
                Xem Thêm Dịch Vụ
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Call to Action Section with Illustration */}
      <section style={{
        position: 'relative',
        backgroundColor: 'var(--color-primary)',
        padding: 'var(--spacing-20) var(--spacing-8)',
        overflow: 'hidden'
      }}>
        {/* Bronze Pattern Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          pointerEvents: 'none'
        }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="servicesBrocade" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="20" fill="var(--color-accent)" opacity="0.3"/>
                <circle cx="25" cy="25" r="15" fill="var(--color-accent)" opacity="0.2"/>
                <circle cx="75" cy="75" r="15" fill="var(--color-accent)" opacity="0.2"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#servicesBrocade)"/>
          </svg>
        </div>

        {/* Decorative Floating Elements */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            width: '80px',
            height: '80px',
            backgroundColor: 'var(--color-accent)',
            borderRadius: '50%',
            opacity: 0.15,
            animation: 'pulse 3s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '128px',
            right: '80px',
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--color-cta)',
            borderRadius: '50%',
            opacity: 0.2
          }} />
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '25%',
            width: '48px',
            height: '48px',
            backgroundColor: 'var(--color-accent)',
            borderRadius: '50%',
            opacity: 0.12
          }} />
        </div>

        <div style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 var(--spacing-6)',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--spacing-16)',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div style={{ color: '#FFFFFF' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1.2,
              marginBottom: 'var(--spacing-6)'
            }}>
              Khám Phá<br />
              <span style={{ color: 'var(--color-accent)' }}>Dịch Vụ Du Lịch</span><br />
              Tuyệt Vời Nhất!
            </h2>
            
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-xl)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: 'var(--spacing-8)'
            }}>
              Từ chỗ ở sang trọng đến những chuyến tour khám phá, 
              chúng tôi mang đến trải nghiệm hoàn hảo cho mọi chuyến đi của bạn.
            </p>

            {/* Feature List */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-4)',
              marginBottom: 'var(--spacing-10)'
            }}>
              {['Đặt chỗ dễ dàng', 'Giá cả hợp lý', 'Hỗ trợ 24/7'].map((feature) => (
                <div key={feature} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'var(--color-accent)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{
                      color: 'var(--color-primary)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: '12px'
                    }}>✓</span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button style={{
              backgroundColor: 'var(--color-accent)',
              color: '#FFFFFF',
              padding: 'var(--spacing-5) var(--spacing-12)',
              borderRadius: 'var(--radius-xl)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              border: 'none',
              cursor: 'pointer',
              transition: 'var(--transition-default)',
              boxShadow: '0 8px 32px rgba(184,134,11,0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(184,134,11,0.5)';
              e.currentTarget.style.backgroundColor = '#C79A2B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(184,134,11,0.4)';
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            }}>
              Khám Phá Ngay
              <span>→</span>
            </button>
          </div>

          {/* Right Illustration */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--spacing-10)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              {/* Room Illustration */}
              <div style={{
                aspectRatio: '1/1',
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-8)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Window */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--spacing-4)',
                  right: 'var(--spacing-4)',
                  width: '64px',
                  height: '48px',
                  backgroundColor: '#BAE6FD',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid #FFFFFF'
                }}>
                  <div style={{
                    width: '1px',
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }} />
                  <div style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }} />
                </div>

                {/* Bed */}
                <div style={{
                  position: 'absolute',
                  bottom: 'var(--spacing-4)',
                  left: 'var(--spacing-4)',
                  right: 'var(--spacing-4)'
                }}>
                  <div style={{
                    height: '32px',
                    backgroundColor: '#D97706',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-1)'
                  }} />
                  <div style={{
                    height: '24px',
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 'var(--radius-md)',
                    borderTopRightRadius: 'var(--radius-md)',
                    border: '2px solid #E5E7EB'
                  }} />
                  <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-2)',
                    marginTop: '-8px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '16px',
                      backgroundColor: '#BFDBFE',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      width: '48px',
                      height: '16px',
                      backgroundColor: '#FBCFE8',
                      borderRadius: '50%'
                    }} />
                  </div>
                </div>

                {/* Lamp */}
                <div style={{
                  position: 'absolute',
                  top: '33.333%',
                  left: 'var(--spacing-6)'
                }}>
                  <div style={{
                    width: '4px',
                    height: '32px',
                    backgroundColor: '#4B5563'
                  }} />
                  <div style={{
                    width: '24px',
                    height: '16px',
                    backgroundColor: '#FEF08A',
                    borderRadius: '50%',
                    marginTop: '-4px',
                    marginLeft: '-10px',
                    border: '1px solid #9CA3AF'
                  }} />
                </div>

                {/* Decorative Elements */}
                <div style={{
                  position: 'absolute',
                  top: '32px',
                  right: '32px',
                  fontSize: '24px',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>❤️</div>
                <div style={{
                  position: 'absolute',
                  bottom: '64px',
                  right: '24px',
                  fontSize: '20px'
                }}>✨</div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '33.333%',
                  fontSize: '18px'
                }}>🌸</div>
              </div>

              {/* Floating Service Icons */}
              {[
                { icon: '🏨', top: '-16px', left: '-16px', delay: '0s' },
                { icon: '✈️', top: '-8px', right: '-8px', delay: '1s' },
                { icon: '🗺️', bottom: '-16px', right: '-16px', delay: '2s' }
              ].map((item, index) => (
                <div key={index} style={{
                  position: 'absolute',
                  ...(item.top && { top: item.top }),
                  ...(item.bottom && { bottom: item.bottom }),
                  ...(item.left && { left: item.left }),
                  ...(item.right && { right: item.right }),
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  padding: 'var(--spacing-3)',
                  boxShadow: 'var(--shadow-lg)',
                  fontSize: '28px',
                  animation: `float 3s ease-in-out ${item.delay} infinite`
                }}>
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Services;