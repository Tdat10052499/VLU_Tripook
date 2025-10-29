import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';

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
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter Bar - Compact Version */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            {/* Top Row - Main Search */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm địa điểm..."
                    value={searchData.destination}
                    onChange={(e) => handleSearchChange('destination', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => handleSearchChange('checkIn', e.target.value)}
                    className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => handleSearchChange('checkOut', e.target.value)}
                    className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row - Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-1 gap-3">
                <select
                  value={searchData.serviceType}
                  onChange={(e) => handleSearchChange('serviceType', e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Loại dịch vụ</option>
                  <option value="hotel">Khách sạn</option>
                  <option value="tour">Tour du lịch</option>
                  <option value="transport">Vận chuyển</option>
                </select>
                <select
                  value={searchData.priceRange}
                  onChange={(e) => handleSearchChange('priceRange', e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Khoảng giá</option>
                  <option value="0-1000000">{'<'} 1 triệu</option>
                  <option value="1000000-3000000">1-3 triệu</option>
                  <option value="3000000-5000000">3-5 triệu</option>
                  <option value="5000000+">{'>'} 5 triệu</option>
                </select>
                <select
                  value={searchData.rating}
                  onChange={(e) => handleSearchChange('rating', e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Đánh giá</option>
                  <option value="5">5 sao</option>
                  <option value="4">4+ sao</option>
                  <option value="3">3+ sao</option>
                </select>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                <FaSearch className="mr-2 text-sm" />
                Tìm kiếm
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

            {/* Service Providers (1/4 width) - Compact */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-3 h-72 overflow-y-auto">
                <h3 className="font-bold text-gray-800 mb-3 text-sm sticky top-0 bg-white pb-1">Đối tác nổi bật</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600">S</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-xs truncate leading-tight">Saigon Tourist</h4>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="w-2 h-2" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-1 font-medium">4.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                    <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-600">V</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-xs truncate leading-tight">Vietravel</h4>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="w-2 h-2" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-1 font-medium">4.9</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                    <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-purple-600">F</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-xs truncate leading-tight">Fiditour</h4>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 space-x-0.5">
                          {[...Array(4)].map((_, i) => (
                            <FaStar key={i} className="w-2 h-2" />
                          ))}
                          <FaStar className="w-2 h-2 text-gray-300" />
                        </div>
                        <span className="text-xs text-gray-600 ml-1 font-medium">4.7</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                    <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-red-600">T</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-xs truncate leading-tight">TST Tourist</h4>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 space-x-0.5">
                          {[...Array(4)].map((_, i) => (
                            <FaStar key={i} className="w-2 h-2" />
                          ))}
                          <FaStar className="w-2 h-2 text-gray-300" />
                        </div>
                        <span className="text-xs text-gray-600 ml-1 font-medium">4.6</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                    <div className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-indigo-600">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-xs truncate leading-tight">Asia Travel</h4>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 space-x-0.5">
                          {[...Array(4)].map((_, i) => (
                            <FaStar key={i} className="w-2 h-2" />
                          ))}
                          <FaStar className="w-2 h-2 text-gray-300" />
                        </div>
                        <span className="text-xs text-gray-600 ml-1 font-medium">4.5</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                    <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-teal-600">H</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-xs truncate leading-tight">HanoiRedtour</h4>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 space-x-0.5">
                          {[...Array(4)].map((_, i) => (
                            <FaStar key={i} className="w-2 h-2" />
                          ))}
                          <FaStar className="w-2 h-2 text-gray-300" />
                        </div>
                        <span className="text-xs text-gray-600 ml-1 font-medium">4.4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area - BBody and BFooter will be added here */}
      <main className="min-h-screen">
        {/* Placeholder for BBody and BFooter */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl text-gray-800 font-semibold mb-4">
              🚧 BBody và BFooter sẽ được thêm vào tiếp theo
            </h2>
            <p className="text-lg text-gray-600">
              BHeader đã hoàn thành với Searching/Filter và Banner + Service Providers
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className="text-2xl font-bold tracking-wider">TRIPOOK</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                Nền tảng đặt tour du lịch hàng đầu, mang đến những trải nghiệm tuyệt vời và kỷ niệm khó quên cho mọi chuyến đi của bạn.
              </p>
              <p className="text-gray-400 text-xs mt-4 italic">
                * Đây là sản phẩm học tập không dùng để kinh doanh
              </p>
            </div>

            {/* Liên kết nhanh */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-6 text-white">Liên kết nhanh</h3>
              <ul className="space-y-3">
                <li><a href="#about" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Về chúng tôi</a></li>
                <li><a href="#services" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Dịch vụ</a></li>
                <li><a href="#support" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Trở thành đối tác</a></li>
                <li><a href="#tours" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Đặt tour</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Liên hệ</a></li>
              </ul>
            </div>

            {/* Hỗ trợ khách hàng */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-6 text-white">Hỗ trợ khách hàng</h3>
              <ul className="space-y-3">
                <li><a href="#help-center" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Trung tâm trợ giúp</a></li>
                <li><a href="#faq" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Câu hỏi thường gặp</a></li>
                <li><a href="#terms" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Điều khoản sử dụng</a></li>
                <li><a href="#privacy" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Chính sách bảo mật</a></li>
                <li><a href="#cancellation" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm">Chính sách hủy tour</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-6 text-white">Theo dõi chúng tôi</h3>
              <p className="text-gray-300 text-sm mb-4">
                Đăng ký nhận tin tức và ưu đãi mới nhất từ Tripook
              </p>
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12">
              {/* Hotline */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Hotline:</p>
                  <p className="text-white text-sm font-medium">1900-1234</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Email:</p>
                  <p className="text-white text-sm font-medium">info@tripook.vn</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Địa chỉ:</p>
                  <p className="text-white text-sm font-medium">TP. Hồ Chí Minh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <p className="text-center text-gray-400 text-sm">
              © 2025 Tripook. All rights reserved. Plan your perfect adventure with us.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;