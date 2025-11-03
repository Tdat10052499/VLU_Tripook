import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
    // Mock data - In real app, this would be fetched from API
    const mockServiceData: ServiceData = {
      id: parseInt(serviceId || '1'),
      name: 'Khách sạn Mường Thanh Luxury Nha Trang',
      type: 'accommodation',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
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
  }, [serviceId]);

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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Dịch vụ không tìm thấy</h1>
            <Link to="/services" className="text-blue-600 hover:underline">
              Quay lại trang dịch vụ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            <span className="mx-2">&gt;</span>
            <Link to="/services" className="hover:text-blue-600">Dịch vụ</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 truncate">{service.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start min-h-full">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.round(service.averageRating))}
                      <span className="ml-1">{service.averageRating}</span>
                      <span>({service.totalReviews} đánh giá)</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{service.location.address}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
              <h2 className="text-2xl font-bold mb-4">Hình ảnh</h2>
              <div className="relative">
                {/* Main Image */}
                <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                  <img
                    src={service.images[currentImageIndex]}
                    alt={`${service.name} - ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openLightbox(currentImageIndex)}
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FaChevronRight />
                  </button>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-5 gap-2">
                  {service.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
              <h2 className="text-2xl font-bold mb-4">Nhà cung cấp dịch vụ</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={service.provider.logo}
                  alt={service.provider.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{service.provider.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    {renderStars(Math.round(service.provider.rating), 'sm')}
                    <span className="ml-1">{service.provider.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {service.provider.yearsActive} năm kinh nghiệm • {service.provider.totalServices} dịch vụ
                  </p>
                </div>
                <button
                  onClick={() => setIsProviderCardOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xem thông tin
                </button>
              </div>
            </div>

            {/* Service Description */}
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
              <h2 className="text-2xl font-bold mb-4">Thông tin về dịch vụ</h2>
              <p className="text-gray-700 mb-4">{service.description}</p>
              
              <h3 className="text-lg font-semibold mb-3">Tiện nghi</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {service.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                  >
                    <option value="all">Tất cả đánh giá</option>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao trở lên</option>
                    <option value="3">3 sao trở lên</option>
                    <option value="2">2 sao trở lên</option>
                    <option value="1">1 sao trở lên</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredReviews.slice(0, displayedReviews).map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <img
                        src={review.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop'}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-sm">{review.userName}</h4>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating, 'sm')}
                          </div>
                          <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredReviews.length > displayedReviews && (
                <button
                  onClick={() => setDisplayedReviews(prev => prev + 5)}
                  className="mt-4 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Xem thêm đánh giá
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1 min-h-full">
            <div className="sticky top-6 flex flex-col space-y-6 min-h-[calc(100vh-8rem)]">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  {service.discountPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {service.basePrice.toLocaleString()}đ
                    </span>
                  )}
                  <span className="text-2xl font-bold text-blue-600">
                    {(service.discountPrice || service.basePrice).toLocaleString()}đ
                  </span>
                  <span className="text-sm text-gray-600">/đêm</span>
                </div>
                {service.discountPrice && (
                  <span className="text-sm text-green-600 font-medium">
                    Tiết kiệm {((service.basePrice - service.discountPrice) / service.basePrice * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày nhận phòng
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày trả phòng
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate || new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số khách
                  </label>
                  <div className="relative">
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      {Array.from({ length: service.maxGuests }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} khách
                        </option>
                      ))}
                    </select>
                    <FaUsers className="absolute right-3 top-3 text-gray-400 text-sm" />
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              {checkInDate && checkOutDate && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tổng tiền:</span>
                      <span className="font-semibold">{calculatePrice().toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Button */}
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
                disabled={!checkInDate || !checkOutDate}
                onClick={() => setIsBookingModalOpen(true)}
              >
                Đặt ngay
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Bạn sẽ không bị tính phí ngay lúc này
              </p>
              </div>

              {/* Location Map */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Vị trí</h2>
                <div className="h-80 rounded-lg overflow-hidden">
                  <SimpleMap 
                    latitude={service.location.coordinates[0]}
                    longitude={service.location.coordinates[1]}
                    popupContent={service.name}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{service.location.address}</p>
              </div>

              {/* Related Services */}
              <div className="bg-white rounded-lg shadow-md p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Dịch vụ liên quan</h2>
                <p className="text-sm text-gray-600 mb-4">Các dịch vụ khác từ {service.provider.name}</p>
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {relatedServices.map((relatedService) => (
                    <div key={relatedService.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex-shrink-0">
                        <img
                          src={relatedService.image}
                          alt={relatedService.name}
                          className="w-16 h-12 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{relatedService.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <FaStar
                                key={i}
                                className={`text-xs ${i < Math.floor(relatedService.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-xs text-gray-600">{relatedService.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-blue-600 mt-1">{relatedService.price}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Link
                          to={`/services/detail/${relatedService.id}`}
                          className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Info Modal */}
      {isProviderCardOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Thông tin nhà cung cấp</h3>
                <button
                  onClick={() => setIsProviderCardOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <img
                  src={service.provider.logo}
                  alt={service.provider.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                />
                <h4 className="text-lg font-semibold">{service.provider.name}</h4>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {renderStars(Math.round(service.provider.rating))}
                  <span className="ml-1">{service.provider.rating}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {service.provider.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-blue-600" />
                  <span className="text-sm">{service.provider.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-blue-600" />
                  <span className="text-sm">{service.provider.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaGlobe className="text-blue-600" />
                  <a href={service.provider.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {service.provider.website}
                  </a>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsProviderCardOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setIsProviderCardOpen(false);
                    // Navigate to provider profile
                    navigate(`/provider/${service.provider.id}`);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xem trang cá nhân
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            >
              <FaTimes />
            </button>
            <button
              onClick={prevLightboxImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextLightboxImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10"
            >
              <FaChevronRight />
            </button>
            <img
              src={service.images[lightboxImageIndex]}
              alt={`${service.name} - ${lightboxImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {lightboxImageIndex + 1} / {service.images.length}
            </div>
          </div>
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