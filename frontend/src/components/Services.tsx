import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SimpleMap from './SimpleMap';
import { FaSearch, FaMapMarkerAlt, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

const Services: React.FC = () => {
  const [activeService, setActiveService] = useState('accommodation');
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    city: ''
  });

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
      name: 'InterContinental Danang Sun Peninsula',
      price: '6.800.000đ/đêm',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 6,
      name: 'Flamingo Cát Bà Beach Resort',
      price: '1.800.000đ/đêm',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 7,
      name: 'JW Marriott Hotel Hanoi',
      price: '5.200.000đ/đêm',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 8,
      name: 'Anantara Hoi An Resort',
      price: '4.900.000đ/đêm',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
      isFavorite: true
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
      name: 'Tour Maldives Trọn Gói 5N4Đ',
      price: '25.900.000đ/người',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 6,
      name: 'Tour Singapore - Malaysia 6N5Đ',
      price: '12.500.000đ/người',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 7,
      name: 'Tour Nhật Bản Mùa Hoa Anh Đào 7N6Đ',
      price: '35.000.000đ/người',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 8,
      name: 'Tour Đài Loan Khám Phá 4N3Đ',
      price: '14.900.000đ/người',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop',
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
      name: 'Vé máy bay TP.HCM - Phú Quốc',
      price: '950.000đ/chiều',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&h=300&fit=crop',
      isFavorite: true
    },
    {
      id: 6,
      name: 'Thuê xe bus 45 chỗ có tài xế',
      price: '3.500.000đ/ngày',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 7,
      name: 'Vé tàu cao tốc TP.HCM - Vũng Tàu',
      price: '280.000đ/người',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
      isFavorite: false
    },
    {
      id: 8,
      name: 'Thuê xe limousine VIP',
      price: '2.800.000đ/ngày',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
      isFavorite: true
    }
  ];

  // Danh sách thành phố
  const cities = [
    { value: '', label: 'Tất cả thành phố' },
    { value: 'ho-chi-minh', label: 'TP. Hồ Chí Minh' },
    { value: 'ha-noi', label: 'Hà Nội' },
    { value: 'da-nang', label: 'Đà Nẵng' },
    { value: 'nha-trang', label: 'Nha Trang' },
    { value: 'phu-quoc', label: 'Phú Quốc' },
    { value: 'hoi-an', label: 'Hội An' },
    { value: 'can-tho', label: 'Cần Thơ' },
    { value: 'vung-tau', label: 'Vũng Tàu' }
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

  const getServiceName = () => {
    switch (activeService) {
      case 'accommodation': return 'Chỗ ở';
      case 'tour': return 'Tour du lịch';
      case 'transport': return 'Vận chuyển';
      default: return 'Dịch vụ';
    }
  };

  const getCityName = () => {
    const selectedCity = cities.find(city => city.value === searchData.city);
    return selectedCity ? selectedCity.label : 'Tất cả thành phố';
  };



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
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* City Filter */}
              <div className="relative">
                <select
                  value={searchData.city}
                  onChange={(e) => handleSearchChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {cities.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

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



          {/* Container 1: Service được ưa chuộng tại [Thành phố] */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {searchData.city ? 
                  `${getServiceName()} được ưa chuộng tại ${getCityName()}` : 
                  `${getServiceName()} được ưa chuộng tại Việt Nam`
                }
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
              {getCurrentData().slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 flex flex-col h-full"
                >
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
            </div>
          </div>

          {/* Container 2: Service được đặt nhiều nhất trên Tripook */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {getServiceName()} được đặt nhiều nhất trên Tripook
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
              {getCurrentData().slice(4, 8).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
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
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
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

                    <div className="flex items-center justify-between mb-4 flex-grow">
                      <span className="text-lg font-bold text-blue-600">
                        {item.price}
                      </span>
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
            
            {/* Left side - Contact Information */}
            <div className="text-white space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Liên hệ trực tiếp
                  <span className="block text-yellow-300">với chúng tôi</span>
                </h2>
                
                <p className="text-xl text-blue-100 leading-relaxed">
                  Hãy để chúng tôi tư vấn và hỗ trợ bạn lên kế hoạch cho chuyến đi hoàn hảo. 
                  Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-900 font-bold text-sm">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-300 mb-1">Địa chỉ trụ sở:</h3>
                      <p className="text-blue-100 leading-relaxed">
                        69/68 Đ. Đặng Thuỳ Trâm, Phường 13, Bình Thạnh,<br/>
                        Thành phố Hồ Chí Minh 70000, Việt Nam
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-900 font-bold text-sm">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-300 mb-1">Hotline:</h3>
                      <p className="text-blue-100">1900 1234 (24/7)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-900 font-bold text-sm">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-300 mb-1">Email:</h3>
                      <p className="text-blue-100">support@tripook.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/30">
                  Liên hệ ngay
                  <span className="ml-2">📞</span>
                </button>
              </div>
            </div>

            {/* Right side - Office Location Map */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  Vị trí trụ sở chính
                </h3>
                <div className="relative">
                  <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-100">
                    <SimpleMap
                      latitude={10.827643}
                      longitude={106.703349}
                      zoom={16}
                      className="w-full h-96"
                    />
                  </div>
                  
                  {/* Overlay thông tin */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium text-gray-900">Tripook Vietnam</p>
                    <p className="text-xs text-gray-600">Phường 13, Bình Thạnh, TP.HCM</p>
                  </div>
                </div>
              </div>
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