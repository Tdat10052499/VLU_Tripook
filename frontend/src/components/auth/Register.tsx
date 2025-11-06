import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import RecaptchaComponent, { RecaptchaComponentRef } from '../RecaptchaComponent';
import { useRecaptchaConfig } from '../../hooks/useRecaptchaConfig';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    hasDigit: false,
    hasLetter: false,
    special: false,
    notUsername: false,
    match: false
  });
  const [formValidation, setFormValidation] = useState({
    ageValid: false,
    phoneValid: false
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const recaptchaRef = useRef<RecaptchaComponentRef>(null);
  const { siteKey, isLoading: configLoading, error: configError } = useRecaptchaConfig();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Password validation
    if (name === 'password') {
      const hasUppercase = /[A-Z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(value);
      const notContainsUsername = formData.username ? !value.toLowerCase().includes(formData.username.toLowerCase()) : true;
      
      setPasswordValidation(prev => ({
        ...prev,
        length: value.length >= 6,
        uppercase: hasUppercase,
        hasDigit: hasDigit,
        hasLetter: hasLetter,
        special: hasSpecial,
        notUsername: notContainsUsername,
        match: formData.confirmPassword === value
      }));
    }

    if (name === 'confirmPassword') {
      setPasswordValidation(prev => ({
        ...prev,
        match: formData.password === value
      }));
    }

    // Re-validate password when username changes
    if (name === 'username' && formData.password) {
      const notContainsUsername = value ? !formData.password.toLowerCase().includes(value.toLowerCase()) : true;
      setPasswordValidation(prev => ({
        ...prev,
        notUsername: notContainsUsername
      }));
    }

    // Age validation (16+ years old)
    if (name === 'date_of_birth') {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year
      const isValidAge = age > 16 || (age === 16 && monthDiff >= 0 && (monthDiff > 0 || today.getDate() >= birthDate.getDate()));
      
      setFormValidation(prev => ({
        ...prev,
        ageValid: isValidAge
      }));
    }

    // Phone validation (exactly 10 digits)
    if (name === 'phone') {
      const phoneRegex = /^0\d{9}$/; // Vietnamese phone format: starts with 0, total 10 digits
      const isValidPhone = phoneRegex.test(value);
      
      setFormValidation(prev => ({
        ...prev,
        phoneValid: isValidPhone
      }));
    }
  };

  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
    if (!token) {
      setError('');
    }
  };

  const handleRecaptchaError = () => {
    setError('Bạn là Robot');
    setRecaptchaToken(null);
  };

  const handleRecaptchaExpired = () => {
    setError('reCAPTCHA đã hết hạn, vui lòng thử lại');
    setRecaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check reCAPTCHA
    if (!recaptchaToken) {
      setError('Vui lòng hoàn thành reCAPTCHA');
      setIsLoading(false);
      return;
    }

    // Age validation
    if (!formValidation.ageValid) {
      setError('Bạn phải từ 16 tuổi trở lên để đăng ký tài khoản');
      setIsLoading(false);
      return;
    }

    // Phone validation
    if (!formValidation.phoneValid) {
      setError('Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0');
      setIsLoading(false);
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp');
      setIsLoading(false);
      return;
    }

    // Kiểm tra tất cả các yêu cầu mật khẩu
    if (!passwordValidation.length || 
        !passwordValidation.uppercase || 
        !passwordValidation.hasDigit ||
        !passwordValidation.hasLetter ||
        !passwordValidation.special || 
        !passwordValidation.notUsername) {
      setError('Mật khẩu không đáp ứng tất cả các yêu cầu bảo mật');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare user data for registration
      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        username: formData.username.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        gender: formData.gender || undefined,
        password: formData.password
      };

      await register(userData, recaptchaToken);
      navigate('/auth/login', { 
        state: { message: 'Registration successful! Please log in with your new account.' }
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `url('/images/Backgroud_Home_Filter.png')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        position: 'relative'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div style={{
        position: 'absolute',
        inset: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}></div>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-3xl)',
              fontWeight: '600',
              color: 'var(--color-deep-taupe)',
              marginBottom: 'var(--space-sm)',
              lineHeight: '1.2'
            }}>
              Create Account
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-xl)'
            }}>
              Join Tripook and start planning your adventures
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: 'var(--space-md)',
              padding: 'var(--space-md)',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-sans)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div>
              <label htmlFor="name" style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-deep-taupe)',
                marginBottom: 'var(--space-sm)'
              }}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--color-stone-gray)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-deep-taupe)',
                  backgroundColor: 'var(--color-linen-white)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-brushed-bronze)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-stone-gray)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-deep-taupe)',
                marginBottom: 'var(--space-sm)'
              }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--color-stone-gray)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-deep-taupe)',
                  backgroundColor: 'var(--color-linen-white)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-brushed-bronze)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-stone-gray)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="username" style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-deep-taupe)',
                marginBottom: 'var(--space-sm)'
              }}>
                Username (Optional)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--color-stone-gray)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-deep-taupe)',
                  backgroundColor: 'var(--color-linen-white)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-brushed-bronze)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-stone-gray)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="phone" style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-deep-taupe)',
                marginBottom: 'var(--space-sm)'
              }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    border: formData.phone 
                      ? formValidation.phoneValid 
                        ? '1px solid #22c55e' 
                        : '1px solid #ef4444'
                      : '1px solid var(--color-stone-gray)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-deep-taupe)',
                    backgroundColor: formData.phone 
                      ? formValidation.phoneValid 
                        ? '#f0fdf4' 
                        : '#fef2f2'
                      : 'var(--color-linen-white)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    if (!formData.phone || formValidation.phoneValid) {
                      e.target.style.borderColor = 'var(--color-brushed-bronze)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!formData.phone) {
                      e.target.style.borderColor = 'var(--color-stone-gray)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  placeholder="0xxxxxxxxx"
                  maxLength={10}
                />
                {formData.phone && formValidation.phoneValid && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <FaCheck style={{ color: '#22c55e' }} />
                  </div>
                )}
              </div>
              {formData.phone && !formValidation.phoneValid && (
                <p style={{
                  color: '#ef4444',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-sans)',
                  marginTop: 'var(--space-xs)'
                }}>
                  Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0
                </p>
              )}
            </div>

            <div>
              <label htmlFor="date_of_birth" style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-deep-taupe)',
                marginBottom: 'var(--space-sm)'
              }}>
                Date of Birth
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    border: formData.date_of_birth 
                      ? formValidation.ageValid 
                        ? '1px solid #22c55e' 
                        : '1px solid #ef4444'
                      : '1px solid var(--color-stone-gray)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-deep-taupe)',
                    backgroundColor: formData.date_of_birth 
                      ? formValidation.ageValid 
                        ? '#f0fdf4' 
                        : '#fef2f2'
                      : 'var(--color-linen-white)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    if (!formData.date_of_birth || formValidation.ageValid) {
                      e.target.style.borderColor = 'var(--color-brushed-bronze)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!formData.date_of_birth) {
                      e.target.style.borderColor = 'var(--color-stone-gray)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  required
                />
                {formData.date_of_birth && formValidation.ageValid && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <FaCheck style={{ color: '#22c55e' }} />
                  </div>
                )}
              </div>
              {formData.date_of_birth && !formValidation.ageValid && (
                <p style={{
                  color: '#ef4444',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-sans)',
                  marginTop: 'var(--space-xs)'
                }}>
                  Bạn phải từ 16 tuổi trở lên
                </p>
              )}
            </div>

            <div>
              <label htmlFor="gender" style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-deep-taupe)',
                marginBottom: 'var(--space-sm)'
              }}>
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--color-stone-gray)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-deep-taupe)',
                  backgroundColor: 'var(--color-linen-white)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-brushed-bronze)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-stone-gray)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-deep-taupe)',
                marginBottom: 'var(--space-sm)'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    border: '1px solid var(--color-stone-gray)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-deep-taupe)',
                    backgroundColor: 'var(--color-linen-white)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-brushed-bronze)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-stone-gray)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    padding: '0',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash style={{ width: '20px', height: '20px', color: 'var(--color-text-secondary)' }} />
                  ) : (
                    <FaEye style={{ width: '20px', height: '20px', color: 'var(--color-text-secondary)' }} />
                  )}
                </button>
              </div>
              
              {/* Password validation indicators */}
              {formData.password && (
                <div style={{
                  marginTop: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  backgroundColor: 'var(--color-warm-beige)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-stone-gray)'
                }}>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    color: 'var(--color-deep-taupe)',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    Yêu cầu mật khẩu:
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 'var(--text-sm)',
                    color: passwordValidation.length ? '#22c55e' : '#ef4444',
                    marginBottom: 'var(--space-xs)'
                  }}>
                    {passwordValidation.length ? (
                      <FaCheck style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    ) : (
                      <FaTimes style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    )}
                    Ít nhất 6 ký tự
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 'var(--text-sm)',
                    color: passwordValidation.uppercase ? '#22c55e' : '#ef4444',
                    marginBottom: 'var(--space-xs)'
                  }}>
                    {passwordValidation.uppercase ? (
                      <FaCheck style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    ) : (
                      <FaTimes style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    )}
                    Có ít nhất 1 chữ cái viết hoa (A-Z)
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 'var(--text-sm)',
                    color: passwordValidation.hasDigit ? '#22c55e' : '#ef4444',
                    marginBottom: 'var(--space-xs)'
                  }}>
                    {passwordValidation.hasDigit ? (
                      <FaCheck style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    ) : (
                      <FaTimes style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    )}
                    Có ít nhất 1 chữ số (0-9)
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 'var(--text-sm)',
                    color: passwordValidation.hasLetter ? '#22c55e' : '#ef4444',
                    marginBottom: 'var(--space-xs)'
                  }}>
                    {passwordValidation.hasLetter ? (
                      <FaCheck style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    ) : (
                      <FaTimes style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    )}
                    Có ít nhất 1 chữ cái (a-z, A-Z)
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 'var(--text-sm)',
                    color: passwordValidation.special ? '#22c55e' : '#ef4444',
                    marginBottom: 'var(--space-xs)'
                  }}>
                    {passwordValidation.special ? (
                      <FaCheck style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    ) : (
                      <FaTimes style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    )}
                    Có ít nhất 1 ký tự đặc biệt (!@#$%^&*)
                  </div>
                  
                  {formData.username && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 'var(--text-sm)',
                      color: passwordValidation.notUsername ? '#22c55e' : '#ef4444'
                    }}>
                      {passwordValidation.notUsername ? (
                        <FaCheck style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                      ) : (
                        <FaTimes style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                      )}
                      Không được chứa tên người dùng
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-deep-taupe)',
                marginBottom: 'var(--space-sm)'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    border: '1px solid var(--color-stone-gray)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-deep-taupe)',
                    backgroundColor: 'var(--color-linen-white)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-brushed-bronze)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(161, 138, 104, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-stone-gray)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    padding: '0',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash style={{ width: '20px', height: '20px', color: 'var(--color-text-secondary)' }} />
                  ) : (
                    <FaEye style={{ width: '20px', height: '20px', color: 'var(--color-text-secondary)' }} />
                  )}
                </button>
              </div>
              
              {formData.confirmPassword && (
                <div style={{ marginTop: 'var(--space-sm)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 'var(--text-sm)',
                    color: passwordValidation.match ? '#22c55e' : '#ef4444'
                  }}>
                    {passwordValidation.match ? (
                      <FaCheck style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    ) : (
                      <FaTimes style={{ width: '12px', height: '12px', marginRight: '8px' }} />
                    )}
                    {passwordValidation.match ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                  </div>
                </div>
              )}
            </div>

            {/* reCAPTCHA */}
            {configLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-md)' }}>
                <div style={{
                  animation: 'spin 1s linear infinite',
                  borderRadius: '50%',
                  height: '24px',
                  width: '24px',
                  border: '2px solid transparent',
                  borderTop: '2px solid var(--color-brushed-bronze)'
                }}></div>
              </div>
            ) : configError ? (
              <div style={{
                color: '#ef4444',
                fontSize: 'var(--text-sm)',
                textAlign: 'center',
                fontFamily: 'var(--font-sans)'
              }}>
                {configError}
              </div>
            ) : (
              <RecaptchaComponent
                ref={recaptchaRef}
                siteKey={siteKey}
                onVerify={handleRecaptchaVerify}
                onError={handleRecaptchaError}
                onExpired={handleRecaptchaExpired}
                theme="light"
                size="normal"
              />
            )}

            <button
              type="submit"
              disabled={isLoading || !passwordValidation.length || !passwordValidation.match || !recaptchaToken}
              className="btn-primary w-full"
              style={{
                opacity: (isLoading || !passwordValidation.length || !passwordValidation.match || !recaptchaToken) ? '0.5' : '1',
                cursor: (isLoading || !passwordValidation.length || !passwordValidation.match || !recaptchaToken) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    animation: 'spin 1s linear infinite',
                    borderRadius: '50%',
                    height: '20px',
                    width: '20px',
                    border: '2px solid transparent',
                    borderTop: '2px solid var(--color-linen-white)',
                    marginRight: '8px'
                  }}></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--color-deep-taupe)',
                marginBottom: '8px'
              }}>
                Đã có tài khoản?{' '}
                <Link
                  to="/auth/login"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: '500',
                    color: 'var(--color-brushed-bronze)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-deep-taupe)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-brushed-bronze)'}
                >
                  Đăng nhập tại đây
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;