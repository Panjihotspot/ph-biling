
export enum UserRole {
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  CUSTOMER = 'CUSTOMER'
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE'
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  OVERDUE = 'OVERDUE'
}

export enum ServiceType {
  PPPOE = 'PPPoE'
}

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  password?: string; // Menambahkan password untuk kredensial login
  role: UserRole;
  email: string;
  phone: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
  joinDate: string;
  avatarUrl?: string;
}

export interface CompanyConfig {
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  slogan: string;
}

export interface InternetPackage {
  id: string;
  name: string;
  speed: string;
  price: number;
  description: string;
  type: ServiceType;
  isMikrotikSynced: boolean;
}

export interface Customer {
  id: string;
  name: string;
  username: string;
  password?: string; // Password PPPoE MikroTik
  email: string;
  phone: string;
  address: string;
  serviceType: ServiceType;
  profileName: string;
  ipAddress?: string;
  status: CustomerStatus;
  monthlyFee: number;
  joinDate: string;
  billingCycleDay: number; // Tanggal jatuh tempo tiap bulan (1-31)
  routerId: string;
  isMikrotikSynced: boolean;
  activePaymentUrl?: string; // Link pembayaran untuk tagihan yang belum lunas
  latitude?: number;
  longitude?: number;
}

export interface NotificationLog {
  id: string;
  type: 'INVOICE' | 'REMINDER' | 'ISOLATE' | 'PAYMENT_SUCCESS';
  timestamp: string;
  status: 'SENT' | 'FAILED';
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  period: string;
  createdAt: string;
  notifications: NotificationLog[];
  paymentUrl?: string;
}

export interface Router {
  id: string;
  name: string;
  ip: string;
  status: 'ONLINE' | 'OFFLINE';
  uptime: string;
  cpuLoad: number;
  memoryUsage: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  module: string;
  message: string;
}
