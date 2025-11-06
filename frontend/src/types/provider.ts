// Provider related type definitions

export interface ProviderInfo {
  company_name: string;
  business_type: 'hotel' | 'tour' | 'transport';
  description: string;
  address: string;
  business_phone: string;
  business_email: string;
  website: string;
  bank_account: {
    account_number: string;
    bank_name: string;
    account_holder: string;
  };
  vnpay_info: {
    merchant_id: string;
  };
  approved_at: string;
  is_active: boolean;
}

export interface Provider {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'provider';
  provider_info: ProviderInfo;
  created_at: string;
  updated_at: string;
}

export interface Service {
  _id: string;
  name: string;
  service_type: 'accommodation' | 'tour' | 'transportation';
  provider_id: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  pricing: {
    base_price: number;
    currency: string;
    price_type: string;
  };
  images: string[];
  features: string[];
  contact: {
    phone: string;
    email: string;
  };
  status: 'active' | 'inactive' | 'pending';
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  _id: string;
  user_id: string;
  service_id: string;
  provider_id: string;
  start_date: string;
  end_date: string;
  number_of_guests: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  guest_details: Array<{
    name: string;
    age: number;
    id_number: string;
  }>;
  booking_date: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_services: number;
  total_bookings: number;
  recent_bookings: number;
  provider_since: string;
  account_status: 'active' | 'inactive';
}

export interface BecomeProviderFormData {
  company_name: string;
  business_type: 'hotel' | 'tour' | 'transport';
  description: string;
  address: string;
  business_phone: string;
  business_email: string;
  website: string;
  bank_account: {
    account_number: string;
    bank_name: string;
    account_holder: string;
  };
  agree_terms: boolean;
}

export const BUSINESS_TYPE_LABELS = {
  hotel: 'Khách sạn / Chỗ ở',
  tour: 'Tour / Du lịch',
  transport: 'Vận chuyển'
} as const;

export const BOOKING_STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
  completed: 'Hoàn thành'
} as const;

export const PAYMENT_STATUS_LABELS = {
  pending: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán thất bại',
  refunded: 'Đã hoàn tiền'
} as const;