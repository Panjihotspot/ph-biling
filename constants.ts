
import { CustomerStatus, PaymentStatus, ServiceType, Customer, Invoice, Router, SystemLog, InternetPackage, CompanyConfig, SystemUser, UserRole } from './types';

export const MOCK_COMPANY_CONFIG: CompanyConfig = {
  name: 'PH biling ISP',
  slogan: 'Koneksi Cepat, Harga Sahabat',
  address: 'Kawasan Digital No. 88, Jakarta Selatan',
  phone: '021-555-0123',
  email: 'billing@phbiling.com',
  logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80'
};

export const MOCK_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'USR001',
    name: 'Admin Utama',
    username: 'admin',
    password: 'admin123',
    role: UserRole.ADMIN,
    email: 'admin@phbiling.com',
    phone: '08123456789',
    address: 'Jakarta Selatan',
    status: 'ACTIVE',
    lastLogin: new Date().toISOString(),
    joinDate: '2023-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR002',
    name: 'Budi Teknisi',
    username: 'budi_tech',
    password: 'tech123',
    role: UserRole.TECHNICIAN,
    email: 'budi@phbiling.com',
    phone: '085566778899',
    address: 'Depok, Jawa Barat',
    status: 'ACTIVE',
    lastLogin: new Date().toISOString(),
    joinDate: '2023-05-20'
  }
];

export const MOCK_PACKAGES: InternetPackage[] = [
  {
    id: 'PKG001',
    name: 'HOME-10MBPS',
    speed: '10 Mbps',
    price: 150000,
    description: 'Paket internet rumah standar',
    type: ServiceType.PPPOE,
    isMikrotikSynced: true
  },
  {
    id: 'PKG002',
    name: 'HOME-20MBPS',
    speed: '20 Mbps',
    price: 250000,
    description: 'Paket internet rumah cepat',
    type: ServiceType.PPPOE,
    isMikrotikSynced: true
  },
  {
    id: 'PKG003',
    name: 'BIZ-50MBPS',
    speed: '50 Mbps',
    price: 450000,
    description: 'Paket bisnis prioritas',
    type: ServiceType.PPPOE,
    isMikrotikSynced: true
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST001',
    name: 'Budi Santoso',
    username: 'budi_home',
    password: 'ppp_password_123',
    email: 'budi@example.com',
    phone: '6281234567890',
    address: 'Jl. Merdeka No. 10',
    serviceType: ServiceType.PPPOE,
    profileName: 'HOME-10MBPS',
    ipAddress: '10.10.10.5',
    status: CustomerStatus.ACTIVE,
    monthlyFee: 150000,
    joinDate: '2023-10-15',
    billingCycleDay: 5,
    routerId: 'R01',
    isMikrotikSynced: true,
    latitude: -6.2088,
    longitude: 106.8456
  },
  {
    id: 'CUST003',
    name: 'Rahmat Hidayat',
    username: 'rahmat_biz',
    password: 'secret_password_99',
    email: 'rahmat@example.com',
    phone: '628551234567',
    address: 'Ruko Central No. 5',
    serviceType: ServiceType.PPPOE,
    profileName: 'BIZ-50MBPS',
    ipAddress: '10.10.10.10',
    status: CustomerStatus.SUSPENDED,
    monthlyFee: 450000,
    joinDate: '2023-05-10',
    billingCycleDay: 20,
    routerId: 'R02',
    isMikrotikSynced: true,
    latitude: -6.1751,
    longitude: 106.8650
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-001',
    customerId: 'CUST001',
    customerName: 'Budi Santoso',
    amount: 150000,
    dueDate: '2024-05-05',
    status: PaymentStatus.PAID,
    period: 'Mei 2024',
    createdAt: '2024-05-01',
    notifications: []
  },
  {
    id: 'INV-2024-002',
    customerId: 'CUST003',
    customerName: 'Rahmat Hidayat',
    amount: 450000,
    dueDate: '2024-05-20',
    status: PaymentStatus.OVERDUE,
    period: 'Mei 2024',
    createdAt: '2024-05-01',
    notifications: []
  }
];

export const MOCK_ROUTERS: Router[] = [
  {
    id: 'R01',
    name: 'Core-Router-Olt-A',
    ip: '192.168.10.1',
    status: 'ONLINE',
    uptime: '45d 12h 5m',
    cpuLoad: 12,
    memoryUsage: 45
  },
  {
    id: 'R02',
    name: 'Edge-Router-B',
    ip: '192.168.20.1',
    status: 'ONLINE',
    uptime: '12d 3h 20m',
    cpuLoad: 5,
    memoryUsage: 30
  }
];

export const MOCK_LOGS: SystemLog[] = [
  {
    id: 'L01',
    timestamp: new Date().toISOString(),
    level: 'INFO',
    module: 'BILLING',
    message: 'Generated 150 invoices for period June 2024'
  }
];
