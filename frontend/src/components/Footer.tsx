import React from 'react';

const Footer: React.FC = () => {
  return (
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
  );
};

export default Footer;