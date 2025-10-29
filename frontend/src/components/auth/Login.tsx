import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import RecaptchaComponent, { RecaptchaComponentRef } from '../RecaptchaComponent';
import { useRecaptchaConfig } from '../../hooks/useRecaptchaConfig';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(() => {
    // Initialize error from sessionStorage to persist across re-mounts
    return sessionStorage.getItem('login_error') || '';
  });

  // Persist error to sessionStorage
  const setErrorPersistent = (newError: string) => {
    setError(newError);
    if (newError) {
      sessionStorage.setItem('login_error', newError);
    } else {
      sessionStorage.removeItem('login_error');
    }
  };

  // Clear error when component unmounts
  React.useEffect(() => {
    return () => {
      // Clear error from sessionStorage when component unmounts
      // This happens when user successfully navigates away
      const currentPath = window.location.pathname;
      if (currentPath !== '/auth/login') {
        sessionStorage.removeItem('login_error');
      }
    };
  }, []);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const recaptchaRef = useRef<RecaptchaComponentRef>(null);
  const { siteKey, isLoading: configLoading, error: configError } = useRecaptchaConfig();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing to fix their input
    if (error) {
      setErrorPersistent('');
    }
  };

  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
    // Don't clear error automatically when reCAPTCHA is reset
    // Let user see the error message until they fix the issue
  };

  const handleRecaptchaError = () => {
    setErrorPersistent('Bạn là Robot');
    setRecaptchaToken(null);
  };

  const handleRecaptchaExpired = () => {
    setErrorPersistent('reCAPTCHA đã hết hạn, vui lòng thử lại');
    setRecaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Don't clear error immediately - let it show until success or new error

    // Check reCAPTCHA
    if (!recaptchaToken) {
      setErrorPersistent('Vui lòng hoàn thành reCAPTCHA');
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.login, formData.password, formData.rememberMe, recaptchaToken);
      
      // Clear error only on successful login
      setErrorPersistent('');
      
      // Use setTimeout to ensure state update completes
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorPersistent(err.message || 'Login failed. Please try again.');
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in to your Tripook account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
                Email or Username
              </label>
              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                required
                value={formData.login}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email or username"
              />
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
                  autoComplete="current-password"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/auth/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
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
              disabled={isLoading || !recaptchaToken}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;