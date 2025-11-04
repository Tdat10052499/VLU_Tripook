import React, { useState, useContext, useEffect } from 'react';
import { FaTimes, FaShieldAlt, FaUser, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
// Import payment logos
import VNPayLogo from '../assets/images/vnpay-logo.png';
import InternetPaymentLogo from '../assets/images/internet-payment.png';

interface BookingItem {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BookingItem | null;
  serviceType: string;
  preFilledData?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, item, serviceType, preFilledData }) => {
  const { user } = useContext(AuthContext);
  
  const [bookingData, setBookingData] = useState({
    fullName: user?.name || user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    checkIn: preFilledData?.checkIn || '',
    checkOut: preFilledData?.checkOut || '',
    guests: preFilledData?.guests || 2,
    specialRequests: ''
  });

  // Update user info and prefilled data when modal opens or user data changes
  useEffect(() => {
    if (isOpen) {
      setBookingData(prev => ({
        ...prev,
        fullName: user?.name || user?.username || '',
        phone: user?.phone || '',
        email: user?.email || '',
        checkIn: preFilledData?.checkIn || '',
        checkOut: preFilledData?.checkOut || '',
        guests: preFilledData?.guests || 2,
      }));
    }
  }, [user, isOpen, preFilledData]);

  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [currentStep, setCurrentStep] = useState(1); // 1: Booking Info, 2: Payment

  if (!isOpen || !item) return null;

  const handleInputChange = (field: string, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    // Extract price number from string (e.g., "2.500.000đ/đêm" -> 2500000)
    const priceStr = item.price.replace(/[^\d]/g, '');
    const pricePerNight = parseInt(priceStr) || 0;
    
    // Calculate nights between check-in and check-out
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
      return pricePerNight * (nights > 0 ? nights : 1);
    }
    return pricePerNight;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const handleBookingSubmit = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để tiếp tục đặt dịch vụ!');
      return;
    }

    if (!bookingData.phone) {
      alert('Vui lòng cập nhật số điện thoại trong hồ sơ cá nhân để tiếp tục!');
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Vui lòng chọn ngày nhận phòng và trả phòng!');
      return;
    }

    setCurrentStep(2);
  };

  const handlePayment = () => {
    // Create booking data to send to backend
    const bookingPayload = {
      serviceId: item?.id,
      serviceName: item?.name,
      customerInfo: {
        fullName: bookingData.fullName,
        phone: bookingData.phone,
        email: bookingData.email
      },
      bookingDetails: {
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        specialRequests: bookingData.specialRequests
      },
      paymentMethod: paymentMethod,
      totalAmount: calculateTotal(),
      currency: 'VND'
    };

    console.log('Booking Payload:', bookingPayload);

    // Simulate payment processing with more realistic flow
    const paymentMethodName = paymentMethod === 'vnpay' ? 'VNPay' : 'Internet Banking';
    
    if (window.confirm(`Bạn xác nhận thanh toán ${formatCurrency(calculateTotal())} qua ${paymentMethodName}?`)) {
      // Here you would integrate with actual payment gateway
      alert(`Đang chuyển hướng đến cổng thanh toán ${paymentMethodName}...`);
      
      setTimeout(() => {
        alert('Thanh toán thành công! Thông tin đặt chỗ đã được gửi đến email của bạn.');
        onClose();
        setCurrentStep(1);
        // Reset form
        setBookingData({
          fullName: '',
          phone: '',
          email: '',
          checkIn: '',
          checkOut: '',
          guests: 2,
          specialRequests: ''
        });
      }, 2000);
    }
  };

  const getServiceTypeText = () => {
    switch (serviceType) {
      case 'accommodation': return 'Chỗ ở';
      case 'tour': return 'Tour du lịch';
      case 'transport': return 'Vận chuyển';
      default: return 'Dịch vụ';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentStep === 1 ? 'Xác nhận đặt chỗ' : 'Thanh toán'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {currentStep === 1 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Service Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {getServiceTypeText()}
                          </span>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-sm" />
                            <span className="text-sm text-gray-600">{item.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-lg font-bold text-blue-600">{item.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-3">Tóm tắt đặt chỗ</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Ngày nhận phòng:</span>
                        <span>{bookingData.checkIn || 'Chưa chọn'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ngày trả phòng:</span>
                        <span>{bookingData.checkOut || 'Chưa chọn'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số khách:</span>
                        <span>{bookingData.guests} người</span>
                      </div>
                      <div className="border-t border-blue-200 pt-2 mt-2">
                        <div className="flex justify-between font-semibold text-blue-900">
                          <span>Tổng cộng:</span>
                          <span>{formatCurrency(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Thông tin liên hệ</h4>
                    {user ? (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center space-x-3">
                          <FaUser className="text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Họ và tên</p>
                            <p className="font-medium text-gray-900">{bookingData.fullName}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <FaPhone className="text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Số điện thoại</p>
                            <p className="font-medium text-gray-900">{bookingData.phone || 'Chưa cập nhật'}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <FaEnvelope className="text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{bookingData.email}</p>
                          </div>
                        </div>

                        {(!bookingData.phone) && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              📝 Vui lòng cập nhật số điện thoại trong hồ sơ cá nhân để tiếp tục đặt dịch vụ.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-800 text-sm">
                          🔐 Vui lòng đăng nhập để tiếp tục đặt dịch vụ.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu đặc biệt (tùy chọn)
                    </label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Ghi chú thêm về yêu cầu của bạn..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Continue Payment Button - Full Width */}
              <div className="mt-8">
                <button
                  onClick={handleBookingSubmit}
                  disabled={!user || !bookingData.phone || !bookingData.checkIn || !bookingData.checkOut}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
                    (!user || !bookingData.phone || !bookingData.checkIn || !bookingData.checkOut)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {!user 
                    ? '🔐 Vui lòng đăng nhập để tiếp tục' 
                    : !bookingData.phone 
                    ? '📞 Vui lòng cập nhật số điện thoại'
                    : (!bookingData.checkIn || !bookingData.checkOut)
                    ? '📅 Vui lòng chọn ngày ở trang chi tiết dịch vụ'
                    : '💳 Tiếp tục thanh toán'
                  }
                </button>
              </div>
            </>
          
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Summary */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Thông tin đặt chỗ</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Khách hàng:</span>
                      <span className="font-medium">{bookingData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Điện thoại:</span>
                      <span>{bookingData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{bookingData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dịch vụ:</span>
                      <span>{item.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thời gian:</span>
                      <span>{bookingData.checkIn} - {bookingData.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số khách:</span>
                      <span>{bookingData.guests} người</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-4">Chi tiết thanh toán</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Giá dịch vụ:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí dịch vụ:</span>
                      <span>Miễn phí</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg text-blue-900">
                        <span>Tổng thanh toán:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Chọn phương thức thanh toán</h4>
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'vnpay' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="vnpay"
                        checked={paymentMethod === 'vnpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3 flex items-center gap-3 flex-1">
                        <div className="w-16 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
                          <img 
                            src={VNPayLogo} 
                            alt="VNPay Logo" 
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">VNPay</p>
                          <p className="text-sm text-gray-500">Thanh toán nhanh chóng qua ví điện tử VNPay</p>
                          <p className="text-xs text-green-600 font-medium">✓ Bảo mật cao • Xử lý tức thì</p>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'banking' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="banking"
                        checked={paymentMethod === 'banking'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3 flex items-center gap-3 flex-1">
                        <div className="w-16 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
                          <img 
                            src={InternetPaymentLogo} 
                            alt="Internet Banking Logo" 
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Internet Banking</p>
                          <p className="text-sm text-gray-500">Chuyển khoản trực tiếp qua ngân hàng</p>
                          <p className="text-xs text-green-600 font-medium">✓ Hỗ trợ tất cả ngân hàng • An toàn</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Banking Details */}
                {paymentMethod === 'banking' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h5 className="font-medium text-blue-900 mb-3">Ngân hàng hỗ trợ</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                      <div>• Vietcombank</div>
                      <div>• BIDV</div>
                      <div>• VietinBank</div>
                      <div>• Agribank</div>
                      <div>• Techcombank</div>
                      <div>• MB Bank</div>
                      <div>• VPBank</div>
                      <div>• ACB</div>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-yellow-600 mt-1" />
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-1">Bảo mật thanh toán</h5>
                      <p className="text-sm text-yellow-700">
                        Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối. 
                        Chúng tôi cam kết không lưu trữ thông tin thẻ của bạn.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-colors"
                  >
                    Thanh toán ngay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;