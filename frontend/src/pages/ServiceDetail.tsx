import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SimpleMap from '../components/SimpleMap';
import BookingModal from '../components/BookingModal';
import { 
  FaStar, 
  FaRegStar, 
  FaHeart, 
  FaRegHeart, 
  FaMapMarkerAlt, 
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaFilter,
  FaPhone,
  FaEnvelope,
  FaGlobe
} from 'react-icons/fa';

interface ServiceDetailProps {}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userAvatar?: string;
}

interface Provider {
  id: number;
  name: string;
  logo: string;
  rating: number;
  yearsActive: number;
  totalServices: number;
  phone: string;
  email: string;
  website: string;
  description: string;
}

interface ServiceData {
  id: number;
  name: string;
  type: 'accommodation' | 'tour' | 'transport';
  images: string[];
  provider: Provider;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  basePrice: number;
  discountPrice?: number;
  weekendSurcharge: number;
  peakSeasonMultiplier: number;
  maxGuests: number;
  amenities: string[];
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

interface RelatedService {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
  type: 'accommodation' | 'tour' | 'transport';
}

const ServiceDetail: React.FC<ServiceDetailProps> = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isProviderCardOpen, setIsProviderCardOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [displayedReviews, setDisplayedReviews] = useState(5);
  const [relatedServices, setRelatedServices] = useState<RelatedService[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    // Check if data was passed via navigation state
    const navigationData = location.state as { item: any; serviceType: string } | null;
    
    // Mock data - In real app, this would be fetched from API
    const mockServiceData: ServiceData = {
      id: parseInt(serviceId || '1'),
      name: navigationData?.item?.name || 'Khách sạn Mường Thanh Luxury Nha Trang',
      type: (navigationData?.serviceType as 'accommodation' | 'tour' | 'transport') || 'accommodation',
      images: [
        navigationData?.item?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      ],
      provider: {
        id: 1,
        name: 'Mường Thanh Hotel Group',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
        rating: 4.6,
        yearsActive: 15,
        totalServices: 24,
        phone: '+84 258 123 456',
        email: 'contact@muongthanh.com',
        website: 'https://muongthanh.com',
        description: 'Mường Thanh Hotel Group là một trong những tập đoàn khách sạn hàng đầu Việt Nam với hơn 15 năm kinh nghiệm trong ngành du lịch và dịch vụ.'
      },
      description: 'Khách sạn Mường Thanh Luxury Nha Trang nằm ở vị trí đắc địa ngay trung tâm thành phố Nha Trang, cách bãi biển chỉ 2 phút đi bộ. Khách sạn 5 sao này cung cấp dịch vụ cao cấp với đầy đủ tiện nghi hiện đại.',
      location: {
        address: '60 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa',
        coordinates: [12.2451, 109.1943]
      },
      basePrice: 2500000,
      discountPrice: 2000000,
      weekendSurcharge: 0.3,
      peakSeasonMultiplier: 1.5,
      maxGuests: 4,
      amenities: ['WiFi miễn phí', 'Hồ bơi', 'Gym', 'Spa', 'Nhà hàng', 'Bar', 'Dịch vụ phòng 24/7'],
      reviews: [
        {
          id: 1,
          userName: 'Nguyễn Văn An',
          rating: 5,
          comment: 'Khách sạn tuyệt vời, vị trí đẹp, dịch vụ chu đáo. Chắc chắn sẽ quay lại!',
          date: '2024-10-15',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop'
        },
        {
          id: 2,
          userName: 'Trần Thị Bình',
          rating: 4,
          comment: 'Phòng sạch sẽ, view biển đẹp. Chỉ có điều bữa sáng hơi đơn điệu.',
          date: '2024-10-10',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop'
        },
        {
          id: 3,
          userName: 'Lê Minh Cường',
          rating: 5,
          comment: 'Dịch vụ tận tình, nhân viên thân thiện. Hồ bơi và spa rất tốt.',
          date: '2024-10-05',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop'
        },
        {
          id: 4,
          userName: 'Phạm Thị Dung',
          rating: 4,
          comment: 'Vị trí thuận tiện, gần biển và trung tâm. Giá cả hợp lý.',
          date: '2024-09-28',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop'
        },
        {
          id: 5,
          userName: 'Hoàng Văn Enh',
          rating: 3,
          comment: 'Khách sạn ổn nhưng có thể cải thiện thêm về âm thanh cách âm.',
          date: '2024-09-20',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop'
        }
      ],
      averageRating: 4.2,
      totalReviews: 156
    };

    // Mock related services data from same provider
    const mockRelatedServices: RelatedService[] = [
      {
        id: 2,
        name: 'Khách sạn Mường Thanh Grand Đà Nẵng',
        price: '2.800.000đ/đêm',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop',
        type: 'accommodation'
      },
      {
        id: 3,
        name: 'Mường Thanh Luxury Sài Gòn',
        price: '3.500.000đ/đêm',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop',
        type: 'accommodation'
      },
      {
        id: 4,
        name: 'Mường Thanh Grand Phú Quốc',
        price: '4.200.000đ/đêm',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=200&fit=crop',
        type: 'accommodation'
      },
      {
        id: 5,
        name: 'Mường Thanh Holiday Hội An',
        price: '2.100.000đ/đêm',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&h=200&fit=crop',
        type: 'accommodation'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setService(mockServiceData);
      setRelatedServices(mockRelatedServices);
      setLoading(false);
    }, 1000);
  }, [serviceId, location.state]);

  const calculatePrice = () => {
    if (!service || !checkInDate || !checkOutDate) return service?.discountPrice || service?.basePrice || 0;
    
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
    let basePrice = service.discountPrice || service.basePrice;
    
    // Weekend surcharge (Friday, Saturday)
    let weekendNights = 0;
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 5 || d.getDay() === 6) weekendNights++;
    }
    
    // Peak season (December, January, holidays)
    const isPeakSeason = startDate.getMonth() === 11 || startDate.getMonth() === 0;
    
    let totalPrice = basePrice * nights;
    totalPrice += basePrice * weekendNights * service.weekendSurcharge;
    
    if (isPeakSeason) {
      totalPrice *= service.peakSeasonMultiplier;
    }
    
    return Math.round(totalPrice);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const stars = [];
    const sizeClass = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }[size];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`${sizeClass} ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          {i <= rating ? <FaStar /> : <FaRegStar />}
        </span>
      );
    }
    return stars;
  };

  const filteredReviews = service?.reviews.filter(review => {
    if (reviewFilter === 'all') return true;
    return review.rating >= parseInt(reviewFilter);
  }) || [];

  const nextImage = () => {
    if (service) {
      setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
    }
  };

  const prevImage = () => {
    if (service) {
      setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index);
    setIsLightboxOpen(true);
  };

  const nextLightboxImage = () => {
    if (service) {
      setLightboxImageIndex((prev) => (prev + 1) % service.images.length);
    }
  };

  const prevLightboxImage = () => {
    if (service) {
      setLightboxImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
        <Header />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '400px',
          flexDirection: 'column',
          gap: 'var(--spacing-6)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid var(--color-bronze)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-deep-indigo)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Đang tải thông tin dịch vụ...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
        <Header />
        <div style={{ 
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'var(--spacing-16) var(--spacing-8)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-deep-indigo)',
              marginBottom: 'var(--spacing-6)'
            }}>
              Dịch vụ không tìm thấy
            </h1>
            <Link 
              to="/services" 
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-vermilion)',
                textDecoration: 'underline',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Quay lại trang dịch vụ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      <Header />
      
      {/* Hero Gallery Section - 600px Full Width */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        marginBottom: 'var(--spacing-12)',
        overflow: 'hidden'
      }}>
        {/* Main Image with Gradient Overlay */}
        <img
          src={service.images[currentImageIndex]}
          alt={`${service.name} - ${currentImageIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer'
          }}
          onClick={() => openLightbox(currentImageIndex)}
        />
        
        {/* Gradient Overlay for Title */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(16, 24, 40, 0) 50%, rgba(16, 24, 40, 0.85) 100%)',
          pointerEvents: 'none'
        }} />
        
        {/* Favorite Button - Top Right */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          style={{
            position: 'absolute',
            top: 'var(--spacing-6)',
            right: 'var(--spacing-6)',
            width: '56px',
            height: '56px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '24px',
            color: isFavorite ? 'var(--color-vermilion)' : 'var(--color-bronze)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
        
        {/* Image Counter Badge - Bottom Right */}
        <div style={{
          position: 'absolute',
          bottom: 'var(--spacing-6)',
          right: 'var(--spacing-6)',
          backgroundColor: 'rgba(16, 24, 40, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: 'var(--spacing-3) var(--spacing-5)',
          borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          color: '#FFFFFF',
          zIndex: 10
        }}>
          {currentImageIndex + 1} / {service.images.length}
        </div>
        
        {/* Navigation Arrow - Left */}
        <button
          onClick={prevImage}
          style={{
            position: 'absolute',
            left: 'var(--spacing-6)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '56px',
            height: '56px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '20px',
            color: 'var(--color-deep-indigo)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.color = 'var(--color-deep-indigo)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <FaChevronLeft />
        </button>
        
        {/* Navigation Arrow - Right */}
        <button
          onClick={nextImage}
          style={{
            position: 'absolute',
            right: 'var(--spacing-6)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '56px',
            height: '56px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '20px',
            color: 'var(--color-deep-indigo)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.color = 'var(--color-deep-indigo)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <FaChevronRight />
        </button>
        
        {/* Service Title Overlay - Bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'var(--spacing-10) var(--spacing-12)',
          zIndex: 5
        }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 'var(--font-weight-bold)',
            color: '#FFFFFF',
            marginBottom: 'var(--spacing-4)',
            textShadow: '2px 2px 12px rgba(0, 0, 0, 0.5)',
            lineHeight: 1.2
          }}>
            {service.name}
          </h1>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-4)',
            alignItems: 'center'
          }}>
            {/* Rating Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              padding: 'var(--spacing-2) var(--spacing-4)',
              backgroundColor: 'var(--color-bronze)',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-md)'
            }}>
              <FaStar style={{ fontSize: '14px' }} />
              <span>{service.averageRating.toFixed(1)}</span>
              <span>({service.totalReviews} đánh giá)</span>
            </div>
            
            {/* Location Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              padding: 'var(--spacing-2) var(--spacing-4)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-md)'
            }}>
              <FaMapMarkerAlt style={{ fontSize: '14px' }} />
              <span>{service.location.address}</span>
            </div>
          </div>
        </div>
        
        {/* Thumbnail Gallery - Bottom Center */}
        <div style={{
          position: 'absolute',
          bottom: 'var(--spacing-6)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 'var(--spacing-3)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-3)',
          boxShadow: 'var(--shadow-xl)',
          maxWidth: 'calc(100% - 32px)',
          overflowX: 'auto',
          zIndex: 10
        }}>
          {service.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: '80px',
                height: '60px',
                padding: 0,
                border: index === currentImageIndex ? '3px solid var(--color-bronze)' : '3px solid transparent',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: index === currentImageIndex ? 1 : 0.6,
                flexShrink: 0,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                if (index !== currentImageIndex) {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.border = '3px solid var(--color-bronze-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentImageIndex) {
                  e.currentTarget.style.opacity = '0.6';
                  e.currentTarget.style.border = '3px solid transparent';
                }
              }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Container - 2 Column Layout */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 var(--spacing-8) var(--spacing-16)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: 'var(--spacing-10)',
          alignItems: 'start'
        }}>
          {/* Left Column - Main Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-8)'
          }}>

            {/* Service Description Section */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--spacing-8)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-deep-indigo)',
                borderBottom: '3px solid var(--color-bronze)',
                paddingBottom: 'var(--spacing-4)',
                marginBottom: 'var(--spacing-6)'
              }}>
                Thông tin về dịch vụ
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                lineHeight: 1.7,
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-6)'
              }}>
                {service.description}
              </p>
              
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-deep-indigo)',
                marginBottom: 'var(--spacing-4)'
              }}>
                Tiện nghi
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 'var(--spacing-3)'
              }}>
                {service.amenities.map((amenity, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text)'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'var(--color-bronze)',
                      borderRadius: '50%',
                      flexShrink: 0
                    }} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Location Section */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--spacing-8)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-deep-indigo)',
                borderBottom: '3px solid var(--color-bronze)',
                paddingBottom: 'var(--spacing-4)',
                marginBottom: 'var(--spacing-6)'
              }}>
                Vị trí
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)',
                padding: 'var(--spacing-4)',
                backgroundColor: 'var(--color-cream)',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--color-bronze-light)',
                marginBottom: 'var(--spacing-6)'
              }}>
                <FaMapMarkerAlt style={{ 
                  color: 'var(--color-bronze)', 
                  fontSize: '24px',
                  flexShrink: 0
                }} />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  {service.location.address}
                </span>
              </div>
              <div style={{
                height: '400px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '2px solid var(--color-bronze-light)'
              }}>
                <SimpleMap 
                  latitude={service.location.coordinates[0]}
                  longitude={service.location.coordinates[1]}
                  popupContent={service.name}
                />
              </div>
            </div>

            {/* Provider Information Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--spacing-8)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-deep-indigo)',
                borderBottom: '3px solid var(--color-bronze)',
                paddingBottom: 'var(--spacing-4)',
                marginBottom: 'var(--spacing-6)'
              }}>
                Nhà cung cấp dịch vụ
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-6)',
                padding: 'var(--spacing-6)',
                backgroundColor: 'var(--color-cream)',
                borderRadius: 'var(--radius-xl)',
                border: '2px solid var(--color-bronze-light)'
              }}>
                <img
                  src={service.provider.logo}
                  alt={service.provider.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--color-bronze)',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-deep-indigo)',
                    marginBottom: 'var(--spacing-2)'
                  }}>
                    {service.provider.name}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    marginBottom: 'var(--spacing-2)'
                  }}>
                    {renderStars(Math.round(service.provider.rating))}
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text)'
                    }}>
                      {service.provider.rating.toFixed(1)}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-light)'
                  }}>
                    {service.provider.yearsActive} năm kinh nghiệm • {service.provider.totalServices} dịch vụ
                  </p>
                </div>
                <button
                  onClick={() => setIsProviderCardOpen(true)}
                  style={{
                    padding: 'var(--spacing-3) var(--spacing-6)',
                    backgroundColor: 'var(--color-bronze)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-deep-indigo)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Xem thông tin
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--spacing-8)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-6)',
                paddingBottom: 'var(--spacing-4)',
                borderBottom: '3px solid var(--color-bronze)'
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-deep-indigo)'
                }}>
                  Đánh giá từ khách hàng
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)'
                }}>
                  <FaFilter style={{ 
                    color: 'var(--color-bronze)', 
                    fontSize: '16px' 
                  }} />
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-4)',
                      border: '2px solid var(--color-bronze-light)',
                      borderRadius: 'var(--radius-lg)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-bronze)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(205, 127, 50, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="all">Tất cả đánh giá</option>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao trở lên</option>
                    <option value="3">3 sao trở lên</option>
                  </select>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-6)'
              }}>
                {filteredReviews.slice(0, displayedReviews).map((review) => (
                  <div key={review.id} style={{
                    padding: 'var(--spacing-6)',
                    backgroundColor: 'var(--color-cream)',
                    borderRadius: 'var(--radius-xl)',
                    border: '2px solid var(--color-bronze-light)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: 'var(--spacing-4)',
                      marginBottom: 'var(--spacing-4)'
                    }}>
                      <img
                        src={review.userAvatar || `https://i.pravatar.cc/150?img=${review.id}`}
                        alt={review.userName}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--color-bronze)',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 'var(--spacing-2)'
                        }}>
                          <h4 style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-base)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-deep-indigo)'
                          }}>
                            {review.userName}
                          </h4>
                          <span style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-light)'
                          }}>
                            {new Date(review.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-1)',
                          marginBottom: 'var(--spacing-3)'
                        }}>
                          {renderStars(review.rating)}
                        </div>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--font-size-sm)',
                          lineHeight: 1.6,
                          color: 'var(--color-text)'
                        }}>
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredReviews.length > displayedReviews && (
                <button
                  onClick={() => setDisplayedReviews(prev => prev + 5)}
                  style={{
                    marginTop: 'var(--spacing-6)',
                    padding: 'var(--spacing-3) var(--spacing-8)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-bronze)',
                    border: '2px solid var(--color-bronze)',
                    borderRadius: 'var(--radius-lg)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-bronze)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Xem thêm đánh giá
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div style={{
            position: 'sticky',
            top: 'var(--spacing-8)'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--spacing-8)',
              boxShadow: 'var(--shadow-lg)',
              border: '3px solid var(--color-bronze-light)',
              boxSizing: 'border-box'
            }}>
              {/* Price Display */}
              <div style={{
                marginBottom: 'var(--spacing-6)',
                paddingBottom: 'var(--spacing-6)',
                borderBottom: '2px solid var(--color-bronze-light)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 'var(--spacing-3)',
                  marginBottom: 'var(--spacing-2)'
                }}>
                  {service.discountPrice && (
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-lg)',
                      color: '#999999',
                      textDecoration: 'line-through'
                    }}>
                      {service.basePrice.toLocaleString()}đ
                    </span>
                  )}
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--font-size-3xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-vermilion)'
                  }}>
                    {(service.discountPrice || service.basePrice).toLocaleString()}đ
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: '#666666'
                }}>
                  / đêm
                </span>
                {service.discountPrice && (
                  <div style={{
                    marginTop: 'var(--spacing-2)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-sm)',
                    color: '#333333',
                    fontWeight: 'var(--font-weight-bold)'
                  }}>
                    Tiết kiệm {((service.basePrice - service.discountPrice) / service.basePrice * 100).toFixed(0)}%
                  </div>
                )}
              </div>

              {/* Date Inputs */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-4)',
                marginBottom: 'var(--spacing-6)'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-deep-indigo)',
                    marginBottom: 'var(--spacing-2)'
                  }}>
                    Ngày nhận
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      border: '2px solid var(--color-bronze-light)',
                      borderRadius: 'var(--radius-lg)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text)',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-bronze)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(205, 127, 50, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-deep-indigo)',
                    marginBottom: 'var(--spacing-2)'
                  }}>
                    Ngày trả
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      border: '2px solid var(--color-bronze-light)',
                      borderRadius: 'var(--radius-lg)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text)',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-bronze)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(205, 127, 50, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Guest Counter */}
              <div style={{
                marginBottom: 'var(--spacing-8)'
              }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-deep-indigo)',
                  marginBottom: 'var(--spacing-2)'
                }}>
                  Số khách
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-4)',
                  padding: 'var(--spacing-3)',
                  border: '2px solid var(--color-bronze-light)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <button
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--color-bronze-light)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bronze-light)';
                      e.currentTarget.style.color = 'var(--color-deep-indigo)';
                    }}
                  >
                    −
                  </button>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-2)'
                  }}>
                    <FaUsers style={{ color: 'var(--color-bronze)', fontSize: '20px' }} />
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-deep-indigo)'
                    }}>
                      {guestCount}
                    </span>
                  </div>
                  <button
                    onClick={() => setGuestCount(Math.min(service.maxGuests, guestCount + 1))}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--color-bronze-light)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bronze-light)';
                      e.currentTarget.style.color = 'var(--color-deep-indigo)';
                    }}
                  >
                    +
                  </button>
                </div>
                <p style={{
                  marginTop: 'var(--spacing-2)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-light)'
                }}>
                  Tối đa {service.maxGuests} khách
                </p>
              </div>

              {/* Total Price */}
              {checkInDate && checkOutDate && (
                <div style={{
                  marginBottom: 'var(--spacing-6)',
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--color-bronze-light)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-base)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-deep-indigo)'
                    }}>
                      Tổng cộng:
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-vermilion)'
                    }}>
                      {calculatePrice().toLocaleString()}đ
                    </span>
                  </div>
                </div>
              )}

              {/* Booking CTA Button */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                disabled={!checkInDate || !checkOutDate}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-4)',
                  backgroundColor: !checkInDate || !checkOutDate ? '#CCCCCC' : '#27AE60',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  cursor: !checkInDate || !checkOutDate ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-md)',
                  opacity: !checkInDate || !checkOutDate ? 0.5 : 1,
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  if (checkInDate && checkOutDate) {
                    e.currentTarget.style.backgroundColor = '#229954';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (checkInDate && checkOutDate) {
                    e.currentTarget.style.backgroundColor = '#27AE60';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }
                }}
              >
                Đặt ngay
              </button>

              <p style={{
                marginTop: 'var(--spacing-4)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-light)',
                textAlign: 'center'
              }}>
                Bạn sẽ không bị tính phí ngay bây giờ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Info Modal */}
      {isProviderCardOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            backgroundColor: 'rgba(16, 24, 40, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-4)'
          }}
          onClick={() => setIsProviderCardOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              maxWidth: '600px',
              width: '100%',
              padding: 'var(--spacing-10)',
              position: 'relative',
              boxShadow: 'var(--shadow-2xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsProviderCardOpen(false)}
              style={{
                position: 'absolute',
                top: 'var(--spacing-6)',
                right: 'var(--spacing-6)',
                width: '40px',
                height: '40px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--color-text-light)',
                fontSize: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                e.currentTarget.style.color = 'var(--color-vermilion)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-light)';
              }}
            >
              <FaTimes />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-6)',
              marginBottom: 'var(--spacing-8)',
              paddingBottom: 'var(--spacing-6)',
              borderBottom: '2px solid var(--color-bronze-light)'
            }}>
              <img
                src={service.provider.logo}
                alt={service.provider.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid var(--color-bronze)',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-deep-indigo)',
                  marginBottom: 'var(--spacing-2)'
                }}>
                  {service.provider.name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  marginBottom: 'var(--spacing-2)'
                }}>
                  <div style={{ display: 'flex' }}>
                    {renderStars(Math.round(service.provider.rating))}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text)'
                  }}>
                    {service.provider.rating.toFixed(1)}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-light)'
                }}>
                  {service.provider.yearsActive} năm kinh nghiệm • {service.provider.totalServices} dịch vụ
                </p>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-8)' }}>
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-deep-indigo)',
                marginBottom: 'var(--spacing-4)'
              }}>
                Giới thiệu
              </h4>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-base)',
                lineHeight: 1.7,
                color: 'var(--color-text)'
              }}>
                {service.provider.description}
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-8)' }}>
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-deep-indigo)',
                marginBottom: 'var(--spacing-4)'
              }}>
                Thông tin liên hệ
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <FaPhone style={{ color: 'var(--color-bronze)', fontSize: '18px' }} />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-text)'
                  }}>
                    {service.provider.phone}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <FaEnvelope style={{ color: 'var(--color-bronze)', fontSize: '18px' }} />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-text)'
                  }}>
                    {service.provider.email}
                  </span>
                </div>
                {service.provider.website && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-3)',
                    padding: 'var(--spacing-3)',
                    backgroundColor: 'var(--color-cream)',
                    borderRadius: 'var(--radius-lg)'
                  }}>
                    <FaGlobe style={{ color: 'var(--color-bronze)', fontSize: '18px' }} />
                    <a
                      href={service.provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-base)',
                        color: 'var(--color-bronze)',
                        textDecoration: 'underline'
                      }}
                    >
                      {service.provider.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--spacing-4)'
            }}>
              <button
                onClick={() => setIsProviderCardOpen(false)}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                  border: '2px solid var(--color-bronze-light)',
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                  e.currentTarget.style.borderColor = 'var(--color-bronze)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                }}
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setIsProviderCardOpen(false);
                  navigate(`/provider/${service.provider.id}`);
                }}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'var(--color-vermilion)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-bold)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
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
                Xem trang nhà cung cấp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-4)'
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: 'var(--spacing-6)',
              right: 'var(--spacing-6)',
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: '#FFFFFF',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-vermilion)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaTimes />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightboxImage();
            }}
            style={{
              position: 'absolute',
              left: 'var(--spacing-6)',
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: '#FFFFFF',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaChevronLeft />
          </button>

          <div style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-4)'
          }} onClick={(e) => e.stopPropagation()}>
            <img
              src={service.images[lightboxImageIndex]}
              alt={`${service.name} - ${lightboxImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-2xl)'
              }}
            />
            <div style={{
              padding: 'var(--spacing-3) var(--spacing-6)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-base)',
              color: '#FFFFFF',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              {lightboxImageIndex + 1} / {service.images.length}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightboxImage();
            }}
            style={{
              position: 'absolute',
              right: 'var(--spacing-6)',
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: '#FFFFFF',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bronze)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {service && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          item={{
            id: service.id,
            name: service.name,
            price: `${(service.discountPrice || service.basePrice).toLocaleString()}đ/đêm`,
            rating: service.averageRating,
            image: service.images[0]
          }}
          serviceType={service.type}
          preFilledData={{
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: guestCount
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default ServiceDetail;