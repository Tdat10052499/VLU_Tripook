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
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url('/images/Backgroud_Home_Filter.png')`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 mb-8">
              Join Tripook and start planning your adventures
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username (Optional)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    formData.phone 
                      ? formValidation.phoneValid 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="0xxxxxxxxx"
                  maxLength={10}
                />
                {formData.phone && formValidation.phoneValid && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FaCheck className="text-green-500" />
                  </div>
                )}
              </div>
              {formData.phone && !formValidation.phoneValid && (
                <p className="text-red-600 text-xs mt-1">Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0</p>
              )}
            </div>

            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    formData.date_of_birth 
                      ? formValidation.ageValid 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  required
                />
                {formData.date_of_birth && formValidation.ageValid && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FaCheck className="text-green-500" />
                  </div>
                )}
              </div>
              {formData.date_of_birth && !formValidation.ageValid && (
                <p className="text-red-600 text-xs mt-1">Bạn phải từ 16 tuổi trở lên</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password validation indicators */}
              {formData.password && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Yêu cầu mật khẩu:</p>
                  
                  <div className={`flex items-center text-sm ${passwordValidation.length ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.length ? (
                      <FaCheck className="h-3 w-3 mr-2" />
                    ) : (
                      <FaTimes className="h-3 w-3 mr-2" />
                    )}
                    Ít nhất 6 ký tự
                  </div>
                  
                  <div className={`flex items-center text-sm ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.uppercase ? (
                      <FaCheck className="h-3 w-3 mr-2" />
                    ) : (
                      <FaTimes className="h-3 w-3 mr-2" />
                    )}
                    Có ít nhất 1 chữ cái viết hoa (A-Z)
                  </div>
                  
                  <div className={`flex items-center text-sm ${passwordValidation.hasDigit ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.hasDigit ? (
                      <FaCheck className="h-3 w-3 mr-2" />
                    ) : (
                      <FaTimes className="h-3 w-3 mr-2" />
                    )}
                    Có ít nhất 1 chữ số (0-9)
                  </div>
                  
                  <div className={`flex items-center text-sm ${passwordValidation.hasLetter ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.hasLetter ? (
                      <FaCheck className="h-3 w-3 mr-2" />
                    ) : (
                      <FaTimes className="h-3 w-3 mr-2" />
                    )}
                    Có ít nhất 1 chữ cái (a-z, A-Z)
                  </div>
                  
                  <div className={`flex items-center text-sm ${passwordValidation.special ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.special ? (
                      <FaCheck className="h-3 w-3 mr-2" />
                    ) : (
                      <FaTimes className="h-3 w-3 mr-2" />
                    )}
                    Có ít nhất 1 ký tự đặc biệt (!@#$%^&*)
                  </div>
                  
                  {formData.username && (
                    <div className={`flex items-center text-sm ${passwordValidation.notUsername ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordValidation.notUsername ? (
                        <FaCheck className="h-3 w-3 mr-2" />
                      ) : (
                        <FaTimes className="h-3 w-3 mr-2" />
                      )}
                      Không được chứa tên người dùng
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {formData.confirmPassword && (
                <div className="mt-2">
                  <div className={`flex items-center text-sm ${passwordValidation.match ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.match ? (
                      <FaCheck className="h-3 w-3 mr-2" />
                    ) : (
                      <FaTimes className="h-3 w-3 mr-2" />
                    )}
                    {passwordValidation.match ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                  </div>
                </div>
              )}
            </div>

            {/* reCAPTCHA */}
            {configLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            ) : configError ? (
              <div className="text-red-500 text-sm text-center">
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
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link
                  to="/auth/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
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