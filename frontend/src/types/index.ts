export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  created_at: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  trip_id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  cost?: number;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}