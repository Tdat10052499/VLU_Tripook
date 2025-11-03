import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import BookingModal from './BookingModal';
import { FaSearch, FaMapMarkerAlt, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

const Services: React.FC = () => {
  const [activeService, setActiveService] = useState('accommodation');
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: ''
  });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Handle booking modal
  const handleBookNow = (item: any) => {
    setSelectedItem(item);
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setSelectedItem(null);
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
    switch (activeService) {
      case 'accommodation': return accommodationData;
      case 'tour': return tourData;
      case 'transport': return transportData;
      default: return accommodationData;
    }
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-slide banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  return (
    <div className="bg-gray-50">
      <Header />
      
      {/* BHeader - Service Navigation */}
      <section 
        className="relative py-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/Backgroud_Home_Filter.png')`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Service Navigation Tabs */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveService('accommodation')}
                className={`group relative p-6 rounded-2xl font-semibold transition-all duration-300 text-center ${
                  activeService === 'accommodation'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl transform scale-105'
                    : 'bg-white/80 text-gray-700 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 shadow-md hover:shadow-xl border border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`text-4xl ${activeService === 'accommodation' ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`}>
                    🏨
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Chỗ ở</h3>
                    <p className={`text-sm ${activeService === 'accommodation' ? 'text-blue-100' : 'text-gray-500'}`}>
                      Khách sạn • Resort • Homestay
                    </p>
                  </div>
                  {activeService === 'accommodation' && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      NEW
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setActiveService('tour')}
                className={`group relative p-6 rounded-2xl font-semibold transition-all duration-300 text-center ${
                  activeService === 'tour'
                    ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-2xl transform scale-105'
                    : 'bg-white/80 text-gray-700 hover:bg-gradient-to-br hover:from-orange-50 hover:to-pink-50 hover:text-orange-700 shadow-md hover:shadow-xl border border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`text-4xl ${activeService === 'tour' ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`}>
                    🎈
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Tour du lịch</h3>
                    <p className={`text-sm ${activeService === 'tour' ? 'text-orange-100' : 'text-gray-500'}`}>
                      Tour • Hoạt động • Trải nghiệm
                    </p>
                  </div>
                  {activeService === 'tour' && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      NEW
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setActiveService('transport')}
                className={`group relative p-6 rounded-2xl font-semibold transition-all duration-300 text-center ${
                  activeService === 'transport'
                    ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-2xl transform scale-105'
                    : 'bg-white/80 text-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:text-gray-800 shadow-md hover:shadow-xl border border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`text-4xl ${activeService === 'transport' ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`}>
                    🛎️
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Vận chuyển</h3>
                    <p className={`text-sm ${activeService === 'transport' ? 'text-gray-100' : 'text-gray-500'}`}>
                      Vận chuyển • Bảo hiểm • Visa
                    </p>
                  </div>
                  {activeService === 'transport' && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      NEW
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BBody - Search and Content */}
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {activeService === 'accommodation' && '🔍 Tìm kiếm chỗ ở phù hợp'}
              {activeService === 'tour' && '🔍 Tìm kiếm tour du lịch'}
              {activeService === 'transport' && '🔍 Tìm kiếm phương tiện vận chuyển'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination Search */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Điểm đến hoặc tên dịch vụ..."
                  value={searchData.destination}
                  onChange={(e) => handleSearchChange('destination', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Check-in Date */}
              <div className="relative">
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => handleSearchChange('checkIn', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500 font-medium">
                  {activeService === 'accommodation' ? 'Ngày nhận phòng' : 'Ngày đi'}
                </label>
              </div>

              {/* Check-out Date */}
              <div className="relative">
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => handleSearchChange('checkOut', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500 font-medium">
                  {activeService === 'accommodation' ? 'Ngày trả phòng' : 'Ngày về'}
                </label>
              </div>

              {/* Search Button */}
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                <FaSearch />
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Banner Quảng Cáo */}
          <div className="mb-8">
            <div className="relative bg-gradient-to-r overflow-hidden rounded-2xl shadow-xl h-32 md:h-40">
              {bannerSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-opacity duration-1000 ${
                    index === currentBannerSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex items-center h-full px-8">
                    <div className="text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{slide.icon}</span>
                        <h3 className="text-xl md:text-2xl font-bold">{slide.title}</h3>
                      </div>
                      <p className="text-sm md:text-base text-white/90">{slide.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Banner Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentBannerSlide ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Service Suggestions */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {activeService === 'accommodation' && '🏨 Chỗ ở được đề xuất'}
                {activeService === 'tour' && '🗺️ Tour du lịch phổ biến'}
                {activeService === 'transport' && '✈️ Phương tiện vận chuyển'}
              </h3>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <FaChevronLeft className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <FaChevronRight className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getCurrentData().map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                      {item.isFavorite ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.name}
                    </h4>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="text-sm font-medium text-gray-700">
                          {item.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-blue-600">
                        {item.price}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                        Xem chi tiết
                      </button>
                      <button 
                        onClick={() => handleBookNow(item)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Xem thêm dịch vụ
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* BFooter - Illustration Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 py-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-orange-400 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 rounded-full opacity-25"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-cyan-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-white rounded-full opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Text content */}
            <div className="text-white space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Khám phá
                  <span className="block text-yellow-300">dịch vụ du lịch</span>
                  <span className="block">tuyệt vời nhất!</span>
                </h2>
                
                <p className="text-xl text-blue-100 leading-relaxed">
                  Từ chỗ ở sang trọng đến những chuyến tour khám phá, 
                  chúng tôi mang đến trải nghiệm hoàn hảo cho mọi chuyến đi của bạn.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-3 text-blue-100">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-blue-900 font-bold text-sm">✓</span>
                    </div>
                    <span>Đặt chỗ dễ dàng</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-blue-100">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-blue-900 font-bold text-sm">✓</span>
                    </div>
                    <span>Giá cả hợp lý</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-blue-100">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-blue-900 font-bold text-sm">✓</span>
                    </div>
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/30">
                  Khám phá ngay
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                {/* Room illustration */}
                <div className="aspect-square bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 relative overflow-hidden">
                  
                  {/* Window */}
                  <div className="absolute top-4 right-4 w-16 h-12 bg-sky-200 rounded-lg border-2 border-white">
                    <div className="w-full h-full bg-gradient-to-b from-sky-100 to-sky-300 rounded opacity-80"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-white"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-white"></div>
                  </div>

                  {/* Bed */}
                  <div className="absolute bottom-4 left-4 right-4">
                    {/* Bed frame */}
                    <div className="h-8 bg-amber-600 rounded-lg mb-1"></div>
                    {/* Mattress */}
                    <div className="h-6 bg-white rounded-t-lg border-2 border-gray-200"></div>
                    {/* Pillows */}
                    <div className="flex gap-2 -mt-2">
                      <div className="w-12 h-4 bg-blue-200 rounded-full"></div>
                      <div className="w-12 h-4 bg-pink-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Lamp */}
                  <div className="absolute top-1/3 left-6">
                    <div className="w-1 h-8 bg-gray-600"></div>
                    <div className="w-6 h-4 bg-yellow-200 rounded-full -mt-1 -ml-2.5 border border-gray-400"></div>
                  </div>

                  {/* Decorative plants */}
                  <div className="absolute top-6 left-12">
                    <div className="w-3 h-6 bg-green-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-amber-700 rounded-full mx-auto"></div>
                  </div>

                  {/* Heart floating elements */}
                  <div className="absolute top-8 right-8 text-red-400 animate-pulse">�</div>
                  <div className="absolute bottom-16 right-6 text-yellow-400 animate-bounce">✨</div>
                  <div className="absolute top-1/2 left-1/3 text-pink-400">🌸</div>
                </div>

                {/* Floating service icons */}
                <div className="absolute -top-4 -left-4 bg-white rounded-full p-3 shadow-lg animate-float">
                  <span className="text-2xl">🏨</span>
                </div>
                
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-3 shadow-lg animate-float" style={{animationDelay: '1s'}}>
                  <span className="text-2xl">✈️</span>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-float" style={{animationDelay: '2s'}}>
                  <span className="text-2xl">🗺️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        serviceType={activeService}
      />

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Services;