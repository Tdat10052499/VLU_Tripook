import { useState, useEffect } from 'react';
import api from '../services/api';

interface RecaptchaConfig {
  siteKey: string;
  isLoading: boolean;
  error: string | null;
}

export const useRecaptchaConfig = (): RecaptchaConfig => {
  const [siteKey, setSiteKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get('/auth/recaptcha-config');
        
        if (response.data.success && response.data.data) {
          setSiteKey(response.data.data.siteKey);
        } else {
          setError('Failed to load reCAPTCHA configuration');
        }
      } catch (err: any) {
        console.error('Error fetching reCAPTCHA config:', err);
        setError('Error loading reCAPTCHA configuration');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { siteKey, isLoading, error };
};