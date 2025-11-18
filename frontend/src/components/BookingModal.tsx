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
    fullName: '',
    phone: '',
    email: '',
    checkIn: preFilledData?.checkIn || '',
    checkOut: preFilledData?.checkOut || '',
    guests: preFilledData?.guests || 2,
    specialRequests: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  // Update user info and prefilled data when modal opens or user data changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        // For logged-in users, auto-fill with user data
        setBookingData(prev => ({
          ...prev,
          fullName: user?.name || user?.username || '',
          phone: user?.phone || '',
          email: user?.email || '',
          checkIn: preFilledData?.checkIn || '',
          checkOut: preFilledData?.checkOut || '',
          guests: preFilledData?.guests || 2,
        }));
      } else {
        // For guests, only set prefilled dates
        setBookingData(prev => ({
          ...prev,
          checkIn: preFilledData?.checkIn || '',
          checkOut: preFilledData?.checkOut || '',
          guests: preFilledData?.guests || 2,
        }));
      }
      // Reset errors
      setErrors({ fullName: '', email: '', phone: '' });
    }
  }, [user, isOpen, preFilledData]);

  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [currentStep, setCurrentStep] = useState(1); // 1: Booking Info, 2: Payment

  if (!isOpen || !item) return null;

  const handleInputChange = (field: string, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (field === 'fullName' || field === 'email' || field === 'phone') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const pattern = /^0[0-9]{9}$/;
    return pattern.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors = { fullName: '', email: '', phone: '' };
    let isValid = true;

    // Validate fullName
    if (!bookingData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
      isValid = false;
    } else if (bookingData.fullName.trim().length < 3) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 3 ký tự';
      isValid = false;
    }

    // Validate email
    if (!bookingData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!validateEmail(bookingData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    // Validate phone
    if (!bookingData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!validatePhone(bookingData.phone)) {
      newErrors.phone = 'Số điện thoại phải gồm 10 số và bắt đầu bằng 0';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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
    // Validate dates first
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Vui lòng chọn ngày nhận phòng và trả phòng ở trang chi tiết dịch vụ!');
      return;
    }

    // Validate form (both guest and logged-in user)
    if (!validateForm()) {
      return;
    }

    // Additional check for logged-in users without phone
    if (user && !bookingData.phone) {
      alert('Vui lòng cập nhật số điện thoại trong hồ sơ cá nhân để tiếp tục!');
      return;
    }

    setCurrentStep(2);
  };

  const handlePayment = async () => {
    const paymentMethodName = paymentMethod === 'vnpay' ? 'VNPay' : 'Internet Banking';
    
    if (!window.confirm(`Bạn xác nhận thanh toán ${formatCurrency(calculateTotal())} qua ${paymentMethodName}?`)) {
      return;
    }

    try {
      // Create booking payload
      const bookingPayload = {
        service_id: item?.id.toString(),
        service_type: serviceType,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guests: bookingData.guests,
        special_requests: bookingData.specialRequests,
        guest_info: {
          fullName: bookingData.fullName,
          email: bookingData.email,
          phone: bookingData.phone
        }
      };

      console.log('Creating booking:', bookingPayload);

      // Get token if user is logged in
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Call booking API
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      console.log('Booking created:', data);

      // Simulate payment gateway redirect
      alert(`Đang chuyển hướng đến cổng thanh toán ${paymentMethodName}...`);
      
      setTimeout(() => {
        alert(`Thanh toán thành công! Mã đặt chỗ: ${data.booking.booking_reference}\nThông tin đã được gửi đến email: ${bookingData.email}`);
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

    } catch (error: any) {
      console.error('Payment error:', error);
      alert(`Lỗi: ${error.message || 'Không thể tạo đặt chỗ. Vui lòng thử lại!'}`);
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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(16, 24, 40, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-4)'
    }}
    onClick={onClose}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-2xl)',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-2xl)',
        border: '3px solid var(--color-bronze-light)'
      }}
      onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-8)',
          borderBottom: '2px solid var(--color-cream)',
          backgroundColor: 'var(--color-cream)'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-deep-indigo)',
            margin: 0
          }}>
            {currentStep === 1 ? 'Xác nhận đặt chỗ' : 'Thanh toán'}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-light)',
              fontSize: '20px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(205, 127, 50, 0.1)';
              e.currentTarget.style.color = 'var(--color-vermilion)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-light)';
            }}
          >
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-8)' }}>
          {currentStep === 1 ? (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 'var(--spacing-8)'
              }} className="lg:grid-cols-2">
                {/* Service Information */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-6)'
                }}>
                  <div style={{
                    backgroundColor: 'var(--color-cream)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--spacing-6)',
                    border: '2px solid var(--color-bronze-light)'
                  }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-lg)',
                          border: '2px solid var(--color-bronze-light)'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          marginBottom: 'var(--spacing-2)'
                        }}>
                          <span style={{
                            backgroundColor: 'var(--color-bronze)',
                            color: '#FFFFFF',
                            fontSize: 'var(--font-size-xs)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 'var(--font-weight-semibold)'
                          }}>
                            {getServiceTypeText()}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaStar style={{
                              color: 'var(--color-bronze)',
                              fontSize: 'var(--font-size-sm)'
                            }} />
                            <span style={{
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text-light)'
                            }}>{item.rating}</span>
                          </div>
                        </div>
                        <h3 style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-deep-indigo)',
                          marginBottom: 'var(--spacing-2)',
                          margin: 0
                        }}>{item.name}</h3>
                        <p style={{
                          fontSize: 'var(--font-size-lg)',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-vermilion)',
                          margin: 0
                        }}>{item.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div style={{
                    backgroundColor: 'var(--color-cream)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--spacing-6)',
                    border: '2px solid var(--color-bronze-light)'
                  }}>
                    <h4 style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)',
                      marginBottom: 'var(--spacing-4)',
                      margin: 0
                    }}>Tóm tắt đặt chỗ</h4>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-3)',
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-light)' }}>Ngày nhận phòng:</span>
                        <span style={{
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)'
                        }}>{bookingData.checkIn || 'Chưa chọn'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-light)' }}>Ngày trả phòng:</span>
                        <span style={{
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)'
                        }}>{bookingData.checkOut || 'Chưa chọn'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-light)' }}>Số khách:</span>
                        <span style={{
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-deep-indigo)'
                        }}>{bookingData.guests} người</span>
                      </div>
                      <div style={{
                        borderTop: '2px solid var(--color-bronze-light)',
                        paddingTop: 'var(--spacing-3)',
                        marginTop: 'var(--spacing-3)'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-deep-indigo)'
                        }}>
                          <span>Tổng cộng:</span>
                          <span style={{ color: 'var(--color-vermilion)' }}>{formatCurrency(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-6)'
                }}>
                  <div>
                    <h4 style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)',
                      marginBottom: 'var(--spacing-4)',
                      margin: 0
                    }}>Thông tin liên hệ</h4>
                    {user ? (
                      // Logged-in user: Read-only display
                      <div style={{
                        backgroundColor: 'var(--color-cream)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--spacing-6)',
                        border: '2px solid var(--color-bronze-light)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--spacing-4)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-3)'
                        }}>
                          <FaUser style={{
                            color: 'var(--color-bronze)',
                            fontSize: '18px'
                          }} />
                          <div style={{ flex: 1 }}>
                            <p style={{
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text-light)',
                              margin: 0,
                              marginBottom: 'var(--spacing-1)'
                            }}>Họ và tên</p>
                            <p style={{
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-deep-indigo)',
                              margin: 0
                            }}>{bookingData.fullName}</p>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-3)'
                        }}>
                          <FaPhone style={{
                            color: 'var(--color-bronze)',
                            fontSize: '18px'
                          }} />
                          <div style={{ flex: 1 }}>
                            <p style={{
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text-light)',
                              margin: 0,
                              marginBottom: 'var(--spacing-1)'
                            }}>Số điện thoại</p>
                            <p style={{
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-deep-indigo)',
                              margin: 0
                            }}>{bookingData.phone || 'Chưa cập nhật'}</p>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-3)'
                        }}>
                          <FaEnvelope style={{
                            color: 'var(--color-bronze)',
                            fontSize: '18px'
                          }} />
                          <div style={{ flex: 1 }}>
                            <p style={{
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text-light)',
                              margin: 0,
                              marginBottom: 'var(--spacing-1)'
                            }}>Email</p>
                            <p style={{
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-deep-indigo)',
                              margin: 0
                            }}>{bookingData.email}</p>
                          </div>
                        </div>

                        {(!bookingData.phone) && (
                          <div style={{
                            marginTop: 'var(--spacing-4)',
                            padding: 'var(--spacing-4)',
                            backgroundColor: 'rgba(205, 127, 50, 0.1)',
                            border: '2px solid var(--color-bronze-light)',
                            borderRadius: 'var(--radius-lg)'
                          }}>
                            <p style={{
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-deep-indigo)',
                              margin: 0
                            }}>
                              Vui lòng cập nhật số điện thoại trong hồ sơ cá nhân để tiếp tục đặt dịch vụ.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Guest user: Form inputs
                      <div style={{
                        backgroundColor: 'var(--color-cream)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--spacing-6)',
                        border: '2px solid var(--color-bronze-light)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--spacing-4)'
                      }}>
                        {/* Full Name Input */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-deep-indigo)',
                            marginBottom: 'var(--spacing-2)'
                          }}>
                            Họ và tên <span style={{ color: 'var(--color-vermilion)' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={bookingData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            placeholder="Nhập họ và tên đầy đủ"
                            style={{
                              width: '100%',
                              padding: 'var(--spacing-3)',
                              border: errors.fullName ? '2px solid var(--color-vermilion)' : '2px solid var(--color-bronze-light)',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text)',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              if (!errors.fullName) {
                                e.currentTarget.style.border = '2px solid var(--color-bronze)';
                                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(205, 127, 50, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              if (!errors.fullName) {
                                e.currentTarget.style.border = '2px solid var(--color-bronze-light)';
                                e.currentTarget.style.boxShadow = 'none';
                              }
                            }}
                          />
                          {errors.fullName && (
                            <p style={{
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--color-vermilion)',
                              marginTop: 'var(--spacing-1)',
                              margin: 0
                            }}>{errors.fullName}</p>
                          )}
                        </div>

                        {/* Email Input */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-deep-indigo)',
                            marginBottom: 'var(--spacing-2)'
                          }}>
                            Email <span style={{ color: 'var(--color-vermilion)' }}>*</span>
                          </label>
                          <input
                            type="email"
                            value={bookingData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="example@email.com"
                            style={{
                              width: '100%',
                              padding: 'var(--spacing-3)',
                              border: errors.email ? '2px solid var(--color-vermilion)' : '2px solid var(--color-bronze-light)',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text)',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              if (!errors.email) {
                                e.currentTarget.style.border = '2px solid var(--color-bronze)';
                                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(205, 127, 50, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              if (!errors.email) {
                                e.currentTarget.style.border = '2px solid var(--color-bronze-light)';
                                e.currentTarget.style.boxShadow = 'none';
                              }
                            }}
                          />
                          {errors.email && (
                            <p style={{
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--color-vermilion)',
                              marginTop: 'var(--spacing-1)',
                              margin: 0
                            }}>{errors.email}</p>
                          )}
                        </div>

                        {/* Phone Input */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-deep-indigo)',
                            marginBottom: 'var(--spacing-2)'
                          }}>
                            Số điện thoại <span style={{ color: 'var(--color-vermilion)' }}>*</span>
                          </label>
                          <input
                            type="tel"
                            value={bookingData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="0xxxxxxxxx (10 số)"
                            style={{
                              width: '100%',
                              padding: 'var(--spacing-3)',
                              border: errors.phone ? '2px solid var(--color-vermilion)' : '2px solid var(--color-bronze-light)',
                              borderRadius: 'var(--radius-lg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text)',
                              outline: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              if (!errors.phone) {
                                e.currentTarget.style.border = '2px solid var(--color-bronze)';
                                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(205, 127, 50, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              if (!errors.phone) {
                                e.currentTarget.style.border = '2px solid var(--color-bronze-light)';
                                e.currentTarget.style.boxShadow = 'none';
                              }
                            }}
                          />
                          {errors.phone && (
                            <p style={{
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--color-vermilion)',
                              marginTop: 'var(--spacing-1)',
                              margin: 0
                            }}>{errors.phone}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 'var(--spacing-6)' }}>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-deep-indigo)',
                      marginBottom: 'var(--spacing-2)'
                    }}>
                      Yêu cầu đặc biệt (tùy chọn)
                    </label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Ghi chú thêm về yêu cầu của bạn..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-4)',
                        border: '2px solid var(--color-bronze-light)',
                        borderRadius: 'var(--radius-xl)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text)',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.border = '2px solid var(--color-bronze)';
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(205, 127, 50, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border = '2px solid var(--color-bronze-light)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Continue Payment Button - Full Width */}
              <div style={{ marginTop: 'var(--spacing-8)' }}>
                <button
                  onClick={handleBookingSubmit}
                  disabled={!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.checkIn || !bookingData.checkOut}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-4) var(--spacing-6)',
                    borderRadius: 'var(--radius-xl)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'var(--font-weight-bold)',
                    fontSize: 'var(--font-size-lg)',
                    border: 'none',
                    cursor: (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.checkIn || !bookingData.checkOut) ? 'not-allowed' : 'pointer',
                    backgroundColor: (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.checkIn || !bookingData.checkOut) 
                      ? 'rgba(158, 158, 158, 0.3)' 
                      : 'var(--color-vermilion)',
                    color: (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.checkIn || !bookingData.checkOut)
                      ? 'var(--color-text-light)'
                      : '#FFFFFF',
                    transition: 'all 0.3s ease',
                    boxShadow: (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.checkIn || !bookingData.checkOut)
                      ? 'none'
                      : 'var(--shadow-lg)'
                  }}
                  onMouseEnter={(e) => {
                    if (bookingData.fullName && bookingData.email && bookingData.phone && bookingData.checkIn && bookingData.checkOut) {
                      e.currentTarget.style.backgroundColor = 'var(--color-deep-indigo)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (bookingData.fullName && bookingData.email && bookingData.phone && bookingData.checkIn && bookingData.checkOut) {
                      e.currentTarget.style.backgroundColor = 'var(--color-vermilion)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {!bookingData.fullName || !bookingData.email || !bookingData.phone
                    ? 'Vui lòng điền đầy đủ thông tin' 
                    : (!bookingData.checkIn || !bookingData.checkOut)
                    ? 'Vui lòng chọn ngày ở trang chi tiết dịch vụ'
                    : 'Tiếp tục thanh toán'
                  }
                </button>
              </div>
            </>
          
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--spacing-8)'
            }} className="lg:grid-cols-2">
              {/* Payment Summary */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-6)'
              }}>
                <div style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--spacing-8)',
                  border: '2px solid var(--color-bronze-light)'
                }}>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-deep-indigo)',
                    marginBottom: 'var(--spacing-6)',
                    margin: 0
                  }}>Thông tin đặt chỗ</h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-4)',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-light)' }}>Khách hàng:</span>
                      <span style={{
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-deep-indigo)'
                      }}>{bookingData.fullName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-light)' }}>Điện thoại:</span>
                      <span style={{ color: 'var(--color-text)' }}>{bookingData.phone}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-light)' }}>Email:</span>
                      <span style={{ color: 'var(--color-text)' }}>{bookingData.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-light)' }}>Dịch vụ:</span>
                      <span style={{ color: 'var(--color-text)' }}>{item.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-light)' }}>Thời gian:</span>
                      <span style={{ color: 'var(--color-text)' }}>{bookingData.checkIn} - {bookingData.checkOut}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-light)' }}>Số khách:</span>
                      <span style={{ color: 'var(--color-text)' }}>{bookingData.guests} người</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--color-cream)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--spacing-8)',
                  border: '2px solid var(--color-bronze-light)'
                }}>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-deep-indigo)',
                    marginBottom: 'var(--spacing-6)',
                    margin: 0
                  }}>Chi tiết thanh toán</h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-3)',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-light)' }}>Giá dịch vụ:</span>
                      <span style={{ color: 'var(--color-text)' }}>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-light)' }}>Phí dịch vụ:</span>
                      <span style={{ color: 'var(--color-text)' }}>Miễn phí</span>
                    </div>
                    <div style={{
                      borderTop: '2px solid var(--color-bronze-light)',
                      paddingTop: 'var(--spacing-3)',
                      marginTop: 'var(--spacing-3)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 'var(--font-weight-bold)',
                        fontSize: 'var(--font-size-lg)',
                        color: 'var(--color-deep-indigo)'
                      }}>
                        <span>Tổng thanh toán:</span>
                        <span style={{ color: 'var(--color-vermilion)' }}>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-6)'
              }}>
                <div>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-deep-indigo)',
                    marginBottom: 'var(--spacing-6)',
                    margin: 0
                  }}>Chọn phương thức thanh toán</h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-4)'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 'var(--spacing-5)',
                      border: paymentMethod === 'vnpay' 
                        ? '3px solid var(--color-bronze)' 
                        : '2px solid var(--color-bronze-light)',
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: paymentMethod === 'vnpay' 
                        ? 'var(--color-cream)' 
                        : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: paymentMethod === 'vnpay' ? 'var(--shadow-md)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (paymentMethod !== 'vnpay') {
                        e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paymentMethod !== 'vnpay') {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }
                    }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="vnpay"
                        checked={paymentMethod === 'vnpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{
                          accentColor: 'var(--color-bronze)',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer'
                        }}
                      />
                      <div style={{
                        marginLeft: 'var(--spacing-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-4)',
                        flex: 1
                      }}>
                        <div style={{
                          width: '64px',
                          height: '40px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--color-bronze-light)',
                          borderRadius: 'var(--radius-lg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-sm)',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={VNPayLogo} 
                            alt="VNPay Logo" 
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '2px'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-deep-indigo)',
                            margin: 0,
                            marginBottom: 'var(--spacing-1)'
                          }}>VNPay</p>
                          <p style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-light)',
                            margin: 0,
                            marginBottom: 'var(--spacing-1)'
                          }}>Thanh toán nhanh chóng qua ví điện tử VNPay</p>
                          <p style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-bronze)',
                            fontWeight: 'var(--font-weight-semibold)',
                            margin: 0
                          }}>✓ Bảo mật cao • Xử lý tức thì</p>
                        </div>
                      </div>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 'var(--spacing-5)',
                      border: paymentMethod === 'banking' 
                        ? '3px solid var(--color-bronze)' 
                        : '2px solid var(--color-bronze-light)',
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: paymentMethod === 'banking' 
                        ? 'var(--color-cream)' 
                        : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: paymentMethod === 'banking' ? 'var(--shadow-md)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (paymentMethod !== 'banking') {
                        e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paymentMethod !== 'banking') {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }
                    }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="banking"
                        checked={paymentMethod === 'banking'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{
                          accentColor: 'var(--color-bronze)',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer'
                        }}
                      />
                      <div style={{
                        marginLeft: 'var(--spacing-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-4)',
                        flex: 1
                      }}>
                        <div style={{
                          width: '64px',
                          height: '40px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--color-bronze-light)',
                          borderRadius: 'var(--radius-lg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-sm)',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={InternetPaymentLogo} 
                            alt="Internet Banking Logo" 
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '2px'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-deep-indigo)',
                            margin: 0,
                            marginBottom: 'var(--spacing-1)'
                          }}>Internet Banking</p>
                          <p style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-light)',
                            margin: 0,
                            marginBottom: 'var(--spacing-1)'
                          }}>Chuyển khoản trực tiếp qua ngân hàng</p>
                          <p style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-bronze)',
                            fontWeight: 'var(--font-weight-semibold)',
                            margin: 0
                          }}>✓ Hỗ trợ tất cả ngân hàng • An toàn</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Banking Details */}
                {paymentMethod === 'banking' && (
                  <div style={{
                    backgroundColor: 'var(--color-cream)',
                    border: '2px solid var(--color-bronze-light)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--spacing-6)'
                  }}>
                    <h5 style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-deep-indigo)',
                      marginBottom: 'var(--spacing-4)',
                      margin: 0
                    }}>Ngân hàng hỗ trợ</h5>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 'var(--spacing-2)',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text)'
                    }}>
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

                <div style={{
                  backgroundColor: 'rgba(205, 127, 50, 0.1)',
                  border: '2px solid var(--color-bronze-light)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--spacing-6)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-4)'
                  }}>
                    <FaShieldAlt style={{
                      color: 'var(--color-bronze)',
                      fontSize: '24px',
                      marginTop: '4px'
                    }} />
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-deep-indigo)',
                        marginBottom: 'var(--spacing-2)',
                        margin: 0
                      }}>Bảo mật thanh toán</h5>
                      <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text)',
                        margin: 0,
                        lineHeight: 1.6
                      }}>
                        Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối. 
                        Chúng tôi cam kết không lưu trữ thông tin thẻ của bạn.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-4)'
                }}>
                  <button
                    onClick={() => setCurrentStep(1)}
                    style={{
                      flex: 1,
                      padding: 'var(--spacing-4)',
                      borderRadius: 'var(--radius-xl)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: 'var(--font-size-base)',
                      border: '2px solid var(--color-bronze-light)',
                      backgroundColor: 'var(--color-cream)',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = 'var(--color-bronze)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-cream)';
                      e.currentTarget.style.borderColor = 'var(--color-bronze-light)';
                    }}
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handlePayment}
                    style={{
                      flex: 1,
                      padding: 'var(--spacing-4)',
                      borderRadius: 'var(--radius-xl)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: 'var(--font-size-base)',
                      border: 'none',
                      backgroundColor: 'var(--color-vermilion)',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-deep-indigo)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-vermilion)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
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