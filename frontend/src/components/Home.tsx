import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaSearch, FaMapMarkerAlt, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

const Home: React.FC = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    serviceType: '',
    priceRange: '',
    rating: ''
  });

  // Banner carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Service carousel states
  const [accommodationSlide, setAccommodationSlide] = useState(0);
  const [tourSlide, setTourSlide] = useState(0);
  const [transportSlide, setTransportSlide] = useState(0);

  // Random locations for accommodation title
  const locations = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hạ Long', 'Nha Trang', 'Hội An', 'Phú Quốc', 'Sapa'];
  const [randomLocation] = useState(locations[Math.floor(Math.random() * locations.length)]);

  // Sample data
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
    }
  ];

  const sampleTours = [
    {
      id: 1,
      name: 'Tour Hạ Long 3N2Đ',
      price: '2.500.000đ/người',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 2,
      name: 'Sapa trekking 4N3Đ',
      price: '1.800.000đ/người',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 3,
      name: 'Phú Quốc tropical 5N4Đ',
      price: '3.200.000đ/người',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      isFavorite: true
    }
  ];

  const sampleTransports = [
    {
      id: 1,
      name: 'Xe limousine VIP Hà Nội - Sapa',
      price: '350.000đ/người',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 2,
      name: 'Máy bay private charter',
      price: '15.000.000đ/chuyến',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 3,
      name: 'Xe bus sleeping cao cấp',
      price: '180.000đ/người',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
      isFavorite: true
    }
  ];
  const bannerSlides = [
    {
      id: 1,
      title: "Khuyến mãi đặc biệt!",
      description: "Giảm giá lên đến 50% cho các tour du lịch hè. Đặt ngay để nhận ưu đãi tốt nhất!",
      gradient: "from-orange-400 to-pink-500",
      icon: "✈️"
    },
    {
      id: 2,
      title: "Tour Phú Quốc 3N2Đ",
      description: "Khám phá đảo ngọc với giá chỉ từ 2.999.000đ. Bao gồm vé máy bay và khách sạn 4 sao!",
      gradient: "from-blue-500 to-cyan-400",
      icon: "🏖️"
    },
    {
      id: 3,
      title: "Du lịch Hà Nội - Sapa",
      description: "Chinh phục đỉnh Fansipan và thưởng thức ẩm thực đặc sắc miền Bắc. Ưu đãi 30%!",
      gradient: "from-green-500 to-emerald-400",
      icon: "⛰️"
    },
    {
      id: 4,
      title: "Bangkok - Pattaya 4N3Đ",
      description: "Tận hưởng thiên đường mua sắm và ẩm thực Thái Lan. Khởi hành hàng tuần!",
      gradient: "from-purple-500 to-pink-400",
      icon: "🛍️"
    }
  ];

  // Auto carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  const handleSearchChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* BHeader - Body Header Section */}
      <section 
        className="relative py-16 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/Backgroud_Home_Filter.png')`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter Bar - Clean Version */}
          <div className="bg-white/90 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-200">
            {/* Top Row - Main Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="text-blue-600 mr-2 text-lg">📍</span>
                  Tìm kiếm địa điểm
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 text-lg" />
                  <input
                    type="text"
                    placeholder="Nhập tên thành phố, điểm đến..."
                    value={searchData.destination}
                    onChange={(e) => handleSearchChange('destination', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                {/* Ngày đi */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-green-600 mr-2 text-lg">✈️</span>
                    Ngày đi
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) => handleSearchChange('checkIn', e.target.value)}
                      className="px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl min-w-[180px]"
                    />
                  </div>
                </div>

                {/* Ngày về */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-orange-600 mr-2 text-lg">🏠</span>
                    Ngày về
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) => handleSearchChange('checkOut', e.target.value)}
                      className="px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl min-w-[180px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-1 gap-4">
                {/* Loại dịch vụ */}
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-purple-600 mr-2 text-lg">🏷️</span>
                    Loại dịch vụ
                  </label>
                  <select
                    value={searchData.serviceType}
                    onChange={(e) => handleSearchChange('serviceType', e.target.value)}
                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-violet-50 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <option value="">Chọn loại dịch vụ</option>
                    <option value="hotel">Chỗ ở</option>
                    <option value="tour">Tour du lịch</option>
                    <option value="transport">Vận chuyển</option>
                  </select>
                </div>

                {/* Khoảng giá */}
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-red-600 mr-2 text-lg">💰</span>
                    Khoảng giá
                  </label>
                  <select
                    value={searchData.priceRange}
                    onChange={(e) => handleSearchChange('priceRange', e.target.value)}
                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/30 focus:border-red-500 bg-gradient-to-r from-red-50 to-rose-50 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <option value="">Chọn khoảng giá</option>
                    <option value="0-1000000">{'<'} 1 triệu</option>
                    <option value="1000000-3000000">1-3 triệu</option>
                    <option value="3000000-5000000">3-5 triệu</option>
                    <option value="5000000+">{'>'} 5 triệu</option>
                  </select>
                </div>

                {/* Đánh giá */}
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-yellow-600 mr-2 text-lg">⭐</span>
                    Đánh giá
                  </label>
                  <select
                    value={searchData.rating}
                    onChange={(e) => handleSearchChange('rating', e.target.value)}
                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <option value="">Chọn mức đánh giá</option>
                    <option value="5">5 sao</option>
                    <option value="4">4+ sao</option>
                    <option value="3">3+ sao</option>
                  </select>
                </div>
              </div>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <FaSearch className="mr-3 text-lg" />
                Tìm kiếm ngay
              </button>
            </div>
          </div>

          {/* Banner and Service Providers - Enhanced */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Banner Advertisement (3/4 width) - Auto Carousel */}
            <div className="lg:col-span-3">
              <div className="relative rounded-xl overflow-hidden h-72 group">
                {/* Carousel Slides */}
                <div 
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {bannerSlides.map((slide) => (
                    <div
                      key={slide.id}
                      className={`min-w-full h-full bg-gradient-to-r ${slide.gradient} flex items-center`}
                    >
                      <div className="flex-1 p-8">
                        <h2 className="text-3xl font-bold mb-4 text-white">{slide.title}</h2>
                        <p className="text-white text-opacity-90 mb-6 text-base leading-relaxed">
                          {slide.description}
                        </p>
                        <button className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg">
                          Khám phá ngay
                        </button>
                      </div>
                      <div className="hidden lg:block pr-8">
                        <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <span className="text-5xl">{slide.icon}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {bannerSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index 
                          ? 'bg-white' 
                          : 'bg-white bg-opacity-60 hover:bg-opacity-80'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={prevSlide}
                    className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                  >
                    <span className="text-white font-bold text-xl">‹</span>
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                  >
                    <span className="text-white font-bold text-xl">›</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Service Providers (1/4 width) - Dynamic based on ratings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg h-72 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3">
                  <h3 className="font-bold text-white text-sm text-center">
                    🏆 Nhà cung cấp dịch vụ nổi bật
                  </h3>
                </div>

                {/* Body Section */}
                <div className="p-3 h-60 overflow-y-auto">
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="text-4xl mb-3">📊</div>
                    <p className="text-sm text-center">
                      Danh sách nhà cung cấp sẽ được hiển thị<br />
                      dựa trên đánh giá của khách hàng
                    </p>
                    <div className="mt-3 text-xs text-gray-400">
                      Sắp xếp theo số sao đánh giá
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BBody - Services Section */}
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Accommodations Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                🏠 Chỗ ở phổ biến ở {randomLocation}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAccommodationSlide(Math.max(0, accommodationSlide - 1))}
                  disabled={accommodationSlide === 0}
                  className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setAccommodationSlide(Math.min(sampleAccommodations.length - 1, accommodationSlide + 1))}
                  disabled={accommodationSlide >= sampleAccommodations.length - 1}
                  className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sampleAccommodations.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                      {item.isFavorite ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{item.name}</h4>
                    <div className="flex items-center gap-1 mb-3">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4 flex-grow">
                      <span className="text-lg font-bold text-blue-600">{item.price}</span>
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
          </section>

          {/* Tours Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                🗺️ Tour nổi bật
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTourSlide(Math.max(0, tourSlide - 1))}
                  disabled={tourSlide === 0}
                  className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setTourSlide(Math.min(sampleTours.length - 1, tourSlide + 1))}
                  disabled={tourSlide >= sampleTours.length - 1}
                  className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sampleTours.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                      {item.isFavorite ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{item.name}</h4>
                    <div className="flex items-center gap-1 mb-3">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4 flex-grow">
                      <span className="text-lg font-bold text-blue-600">{item.price}</span>
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
              {sampleTours.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="text-4xl mb-3">🗺️</div>
                  <p className="text-sm">Chưa có dịch vụ</p>
                </div>
              )}
            </div>
          </section>

          {/* Transportation Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                🚗 Dịch vụ vận chuyển
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTransportSlide(Math.max(0, transportSlide - 1))}
                  disabled={transportSlide === 0}
                  className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setTransportSlide(Math.min(sampleTransports.length - 1, transportSlide + 1))}
                  disabled={transportSlide >= sampleTransports.length - 1}
                  className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleTransports.map((item) => (
                <div key={item.id} className="group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-sm">
                      {item.isFavorite ? (
                        <FaHeart className="w-4 h-4 text-red-500" />
                      ) : (
                        <FaRegHeart className="w-4 h-4 text-gray-600 hover:text-red-400" />
                      )}
                    </button>
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                      <span className="text-xs font-semibold text-gray-700">Guest favorite</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base leading-tight">{item.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-indigo-600 mb-4">{item.price}</p>
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                        Xem chi tiết
                      </button>
                      <button className="flex-1 px-3 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md">
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show "Chưa có dịch vụ" if no data */}
              {sampleTransports.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="text-4xl mb-3">🚗</div>
                  <p className="text-sm">Chưa có dịch vụ</p>
                </div>
              )}
            </div>
          </section>

          {/* BFooter - Call to Action Section */}
          <section className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl py-12 px-8 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0">
              {/* Yellow/Orange decorative shapes */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-30"></div>
              <div className="absolute top-1/3 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-25 translate-x-1/2"></div>
              
              {/* Blue accent shapes */}
              <div className="absolute bottom-8 right-8 w-6 h-6 bg-blue-300 rounded-full opacity-40"></div>
              <div className="absolute top-8 right-1/4 w-4 h-4 bg-blue-200 rounded-full opacity-50"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                  Cảm giác như ở nhà cho chuyến đi tiếp theo của bạn?
                </h2>
                <Link
                  to="/services"
                  className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg text-lg hover:bg-gray-50 hover:shadow-lg transform transition-all duration-300"
                >
                  Khám phá dịch vụ du lịch
                </Link>
              </div>

              {/* Right Illustration */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Room Background */}
                  <div className="w-80 h-64 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl relative overflow-hidden">
                    {/* Floor */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-300 rounded-b-2xl"></div>
                    
                    {/* Chair */}
                    <div className="absolute bottom-16 left-12">
                      {/* Chair back */}
                      <div className="w-16 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-t-2xl relative">
                        {/* Chair curves */}
                        <div className="absolute top-2 left-2 right-2 h-12 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-t-xl"></div>
                      </div>
                      {/* Chair seat */}
                      <div className="w-20 h-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg -mt-1"></div>
                      {/* Chair legs */}
                      <div className="flex justify-between mt-1">
                        <div className="w-1 h-6 bg-yellow-600 rounded-full"></div>
                        <div className="w-1 h-6 bg-yellow-600 rounded-full"></div>
                      </div>
                    </div>

                    {/* Side Table */}
                    <div className="absolute bottom-16 right-16">
                      {/* Table top */}
                      <div className="w-12 h-2 bg-blue-800 rounded-lg mb-1"></div>
                      {/* Table leg */}
                      <div className="w-1 h-8 bg-blue-800 rounded-full mx-auto"></div>
                      {/* Cup on table */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-white rounded-b-lg"></div>
                    </div>

                    {/* Plant */}
                    <div className="absolute bottom-16 left-2">
                      {/* Pot */}
                      <div className="w-6 h-4 bg-gray-600 rounded-b-full"></div>
                      {/* Plant leaves */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-2 h-6 bg-green-600 rounded-full transform -rotate-12"></div>
                        <div className="w-2 h-5 bg-green-500 rounded-full transform rotate-12 absolute top-0 left-1"></div>
                        <div className="w-2 h-4 bg-green-600 rounded-full transform rotate-45 absolute top-1 left-2"></div>
                      </div>
                    </div>

                    {/* Character */}
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                      {/* Head */}
                      <div className="w-8 h-8 bg-orange-200 rounded-full relative mx-auto mb-1">
                        {/* Hair */}
                        <div className="absolute -top-2 left-1 w-6 h-4 bg-yellow-600 rounded-t-full"></div>
                        {/* Face */}
                        <div className="absolute top-2 left-2 w-1 h-1 bg-black rounded-full"></div>
                        <div className="absolute top-2 right-2 w-1 h-1 bg-black rounded-full"></div>
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-orange-400 rounded-full"></div>
                      </div>
                      {/* Body */}
                      <div className="w-6 h-8 bg-white rounded-lg mx-auto"></div>
                    </div>

                    {/* Window */}
                    <div className="absolute top-8 right-8 w-16 h-12 bg-blue-200 rounded-lg">
                      <div className="w-full h-0.5 bg-blue-300 absolute top-1/2"></div>
                      <div className="h-full w-0.5 bg-blue-300 absolute left-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;