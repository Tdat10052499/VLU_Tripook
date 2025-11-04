import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaUsers, FaHandshake, FaArrowRight, FaStar, FaGlobe, FaHeart } from 'react-icons/fa';

const About: React.FC = () => {
  const navigate = useNavigate();

  // Team members data
  const managementTeam = [
    {
      id: 1,
      name: 'Nguyễn Minh Chính',
      position: 'Content Manager',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description: 'Chuyên gia quản lý nội dung với hơn 5 năm kinh nghiệm trong lĩnh vực du lịch.'
    },
    {
      id: 2,
      name: 'Hồ Du Tuấn Đạt',
      position: 'Content Strategist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      description: 'Chuyên gia chiến lược nội dung, đảm bảo chất lượng thông tin du lịch.'
    },
    {
      id: 3,
      name: 'Nguyễn Thị Phương Nhung',
      position: 'Content Specialist',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      description: 'Chuyên viên nội dung sáng tạo, mang đến trải nghiệm độc đáo cho khách hàng.'
    },
    {
      id: 4,
      name: 'Hà Đặng Trí Bảo',
      position: 'Content Coordinator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
      description: 'Điều phối viên nội dung, đảm bảo tính nhất quán và chính xác thông tin.'
    }
  ];

  const handleDevelopmentTeam = () => {
    // Tạm thời show notification, sẽ navigate khi trang được tạo
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = '🚀 Trang đội ngũ phát triển đang được xây dựng!';
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
    // navigate('/development-team');
  };

  const handlePartners = () => {
    // Tạm thời show notification, sẽ navigate khi trang được tạo
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = '🤝 Trang đối tác phát triển đang được xây dựng!';
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
    // navigate('/partners');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-float-delay {
            animation: float 3s ease-in-out infinite;
            animation-delay: 1s;
          }
        `}
      </style>
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-25 animate-float-delay"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-cyan-200 rounded-full opacity-20 animate-bounce"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-8">
              <FaHeart className="text-red-500" />
              <span className="text-sm font-medium text-gray-700">Về Tripook - Đồng hành cùng bạn</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chúng tôi là
              </span>
              <br />
              <span className="text-gray-900">Tripook</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Nền tảng du lịch hàng đầu Việt Nam, mang đến trải nghiệm du lịch tuyệt vời 
              với dịch vụ chất lượng cao và giá cả hợp lý cho mọi gia đình.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span>Đánh giá 4.8/5 từ khách hàng</span>
              </div>
              <div className="flex items-center gap-2">
                <FaGlobe className="text-blue-500" />
                <span>Phục vụ toàn quốc</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-green-500" />
                <span>Hơn 10,000+ khách hàng tin tựa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Tripook được ra đời từ niềm đam mê du lịch và mong muốn mang đến 
                  những trải nghiệm tuyệt vời cho mọi người. Chúng tôi hiểu rằng 
                  mỗi chuyến đi đều mang ý nghĩa đặc biệt và xứng đáng được trân trọng.
                </p>
                <p>
                  Với sứ mệnh "Kết nối mọi người với thế giới", chúng tôi không ngừng 
                  cải tiến dịch vụ, nâng cao chất lượng và mở rộng mạng lưới đối tác 
                  để phục vụ khách hàng tốt nhất.
                </p>
                <p>
                  Từ một ý tưởng nhỏ, Tripook đã phát triển thành nền tảng du lịch 
                  được tin tưởng, giúp hàng ngàn gia đình tạo nên những kỷ niệm đẹp.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Tripook Team"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Team Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đội ngũ quản lý nội dung
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Những người tâm huyết đảm bảo chất lượng thông tin và trải nghiệm 
              tốt nhất cho khách hàng của Tripook
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {managementTeam.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-100"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FaStar className="text-white text-sm" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  
                  <p className="text-sm text-blue-600 font-medium mb-3">
                    {member.position}
                  </p>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Khám phá thêm về Tripook
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Tìm hiểu về đội ngũ phát triển và các đối tác đồng hành cùng chúng tôi
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handleDevelopmentTeam}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <FaUsers className="text-xl" />
              Đội ngũ phát triển
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={handlePartners}
              className="group bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <FaHandshake className="text-xl text-blue-600" />
              Đối tác phát triển
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Những nguyên tắc định hướng hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tận tâm</h3>
              <p className="text-blue-100">
                Chúng tôi đặt khách hàng làm trung tâm trong mọi quyết định và hành động
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">Chất lượng</h3>
              <p className="text-blue-100">
                Cam kết mang đến dịch vụ và trải nghiệm tốt nhất cho mỗi chuyến đi
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="text-2xl text-blue-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đổi mới</h3>
              <p className="text-blue-100">
                Không ngừng cải tiến và áp dụng công nghệ mới để phục vụ khách hàng
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;