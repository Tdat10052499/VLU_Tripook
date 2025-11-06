import axios from 'axios';
import { RegistrationData, RegistrationResponse } from '../types/registration';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class RegistrationApi {
  private api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Đăng ký tài khoản mới - trả token trực tiếp
  async register(data: RegistrationData): Promise<RegistrationResponse> {
    try {
      console.log('Sending registration data:', data);
      const response = await this.api.post('/registration/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }

  // Check email availability
  async checkEmailAvailability(email: string): Promise<{ available: boolean; message?: string }> {
    try {
      console.log('Checking email availability:', email);
      const response = await this.api.get(`/registration/check-email?email=${encodeURIComponent(email)}`);
      console.log('Email check response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Email check error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Kiểm tra email thất bại');
    }
  }
}

export const registrationApi = new RegistrationApi();