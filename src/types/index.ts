export * from './database';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface BookingFormData {
  locationId: string;
  serviceId: string;
  doctorId: string;
  date: Date;
  timeSlot: TimeSlot;
  mode: 'online' | 'offline' | 'home_visit';
  notes?: string;
}

export interface DashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  todayAppointments: number;
  newPatients: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOptions {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  locationId?: string;
  doctorId?: string;
  serviceId?: string;
}
