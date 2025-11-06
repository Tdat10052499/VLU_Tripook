import React from 'react';
import { UserType } from '../../types/registration';

interface UserTypeSelectionProps {
  onSelectUserType: (userType: UserType) => void;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelectUserType }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chào mừng đến với Tripook! 🌟
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Hãy cho chúng tôi biết bạn là ai để tạo tài khoản phù hợp
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Tourist Card */}
          <div 
            onClick={() => onSelectUserType('tourist')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent group-hover:border-blue-500 group-hover:shadow-xl">
              <div className="text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Khách du lịch
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Tôi muốn khám phá và đặt các tour du lịch, dịch vụ tuyệt vời
                </p>

                {/* Features */}
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li>✓ Tìm kiếm và đặt tour</li>
                  <li>✓ Đánh giá dịch vụ</li>
                  <li>✓ Lưu danh sách yêu thích</li>
                </ul>

                {/* Button */}
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-blue-700 transition-colors">
                  Chọn tài khoản khách du lịch
                </button>
              </div>
            </div>
          </div>

          {/* Provider Card */}
          <div 
            onClick={() => onSelectUserType('provider')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent group-hover:border-green-500 group-hover:shadow-xl">
              <div className="text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Nhà cung cấp dịch vụ
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Tôi muốn cung cấp tour du lịch và dịch vụ cho khách hàng
                </p>

                {/* Features */}
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li>✓ Tạo và quản lý tour</li>
                  <li>✓ Nhận đặt chỗ từ khách</li>
                  <li>✓ Thống kê doanh thu</li>
                </ul>

                {/* Button */}
                <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-green-700 transition-colors">
                  Chọn tài khoản nhà cung cấp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Đã có tài khoản? 
            <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;