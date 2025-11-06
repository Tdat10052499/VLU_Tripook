// Types cho hệ thống đăng ký đơn giản
export type UserType = 'tourist' | 'provider';

export interface BaseRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  userType: UserType;
}

export interface TouristRegistrationData extends BaseRegistrationData {
  userType: 'tourist';
}

export interface ProviderRegistrationData extends BaseRegistrationData {
  userType: 'provider';
  companyName: string;
  businessType: string;
  businessAddress: string;
  businessLicense?: string;
  businessDescription?: string;
}

export type RegistrationData = TouristRegistrationData | ProviderRegistrationData;

export interface RegistrationResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    accountStatus: string;
  };
}

export const businessTypes = [
  'Công ty du lịch',
  'Khách sạn/Resort', 
  'Nhà hàng',
  'Dịch vụ vận chuyển',
  'Hướng dẫn viên',
  'Cho thuê xe',
  'Hoạt động giải trí',
  'Khác'
] as const;

export type BusinessType = typeof businessTypes[number];