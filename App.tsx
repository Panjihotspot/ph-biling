
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  LayoutDashboard, 
  MessageSquare, 
  Settings as SettingsIcon, 
  X,
  Globe,
  ShieldCheck, 
  User as UserIcon, 
  LogOut,
  Sun,
  Moon,
  Server,
  ChevronLeft,
  ChevronRight,
  Menu,
  Zap
} from 'lucide-react';

// Import dengan ekstensi lengkap penting untuk browser native ESM
import { UserRole, CustomerStatus, PaymentStatus, Customer, Invoice, Router, SystemLog, InternetPackage, CompanyConfig, SystemUser } from './types.ts';
import { MOCK_CUSTOMERS, MOCK_INVOICES, MOCK_ROUTERS, MOCK_LOGS, MOCK_PACKAGES, MOCK_COMPANY_CONFIG, MOCK_SYSTEM_USERS } from './constants.ts';

import Dashboard from './components/Dashboard.tsx';
import CustomerManagement from './components/CustomerManagement.tsx';
import BillingModule from './components/BillingModule.tsx';
import WhatsAppConfig from './components/WhatsAppConfig.tsx';
import Settings from './components/Settings.tsx';
import PackageManagement from './components/PackageManagement.tsx';
import UserManagement from './components/UserManagement.tsx';
import UserProfile from './components/UserProfile.tsx';
import Login from './components/Login.tsx';
import PaymentCheckout from './components/PaymentCheckout.tsx';
import MikrotikConfig from './components/MikrotikConfig.tsx';

// Fix: Menambahkan export default App dan melengkapi komponen App yang terpotong
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  
  // Data States
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [routers, setRouters] = useState<Router[]>(MOCK_ROUTERS);
  const [packages, setPackages] = useState<InternetPackage[]>(MOCK_PACKAGES);
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>(MOCK_COMPANY_CONFIG);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);
  
  // Config States
  const [isAutoIsolirEnabled, setIsAutoIsolirEnabled] = useState(true);
  const [autoIsolirTime, setAutoIsolirTime] = useState('00:00');
  const [autoIsolirGracePeriod, setAutoIsolirGracePeriod] = useState(3);

  const [checkoutInvoice, setCheckoutInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleStatus = (id: string) => {
    setCustomers(customers.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === CustomerStatus.ACTIVE ? CustomerStatus.SUSPENDED : CustomerStatus.ACTIVE
        };
      }
      return c;
    }));
  };

  const handlePayment = (invoiceId: string) => {
    setInvoices(invoices.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: PaymentStatus.PAID };
      }
      return inv;
    }));
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} systemUsers={systemUsers} companyConfig={companyConfig} />;
  }

  if (checkoutInvoice) {
    return (
      <PaymentCheckout 
        invoice={checkoutInvoice} 
        companyConfig={companyConfig} 
        onClose={() => setCheckoutInvoice(null)} 
        onPaid={(id) => {
          handlePayment(id);
        }}
      />
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Pelanggan', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'packages', label: 'Paket Internet', icon: Zap },
    { id: 'mikrotik', label: 'Mikrotik', icon: Server },
    { id: 'whatsapp', label: 'Notifikasi', icon: MessageSquare },
    { id: 'users', label: 'Staff Internal', icon: ShieldCheck, adminOnly: true },
    { id: 'settings', label: 'Pengaturan', icon: SettingsIcon, adminOnly: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          customers={customers} 
          invoices={invoices} 
          routers={routers} 
          logs={MOCK_LOGS} 
          isAutoIsolirEnabled={isAutoIsolirEnabled}
          autoIsolirTime={autoIsolirTime}
          companyConfig={companyConfig}
          onViewLogs={() => setActiveTab('mikrotik')}
        />;
      case 'customers':
        return <CustomerManagement customers={customers} setCustomers={setCustomers} toggleStatus={toggleStatus} invoices={invoices} role={currentUser.role} />;
      case 'billing':
        return <BillingModule 
          invoices={invoices} 
          setInvoices={setInvoices} 
          customers={customers} 
          handlePayment={handlePayment} 
          companyConfig={companyConfig}
          onPreviewCheckout={(inv) => setCheckoutInvoice(inv)}
        />;
      case 'packages':
        return <PackageManagement packages={packages} setPackages={setPackages} customers={customers} companyConfig={companyConfig} role={currentUser.role} />;
      case 'mikrotik':
        return <MikrotikConfig routers={routers} logs={MOCK_LOGS} />;
      case 'whatsapp':
        return <WhatsAppConfig />;
      case 'users':
        return <UserManagement users={systemUsers} setUsers={setSystemUsers} />;
      case 'settings':
        return <Settings 
          routers={routers} 
          setRouters={setRouters} 
          isAutoIsolirEnabled={isAutoIsolirEnabled} 
          setIsAutoIsolirEnabled={setIsAutoIsolirEnabled}
          autoIsolirTime={autoIsolirTime}
          setAutoIsolirTime={setAutoIsolirTime}
          autoIsolirGracePeriod={autoIsolirGracePeriod}
          setAutoIsolirGracePeriod={setAutoIsolirGracePeriod}
          companyConfig={companyConfig}
          setCompanyConfig={setCompanyConfig}
        />;
      case 'profile':
        return <UserProfile currentUser={currentUser} onUpdate={setCurrentUser} onLogout={() => setCurrentUser(null)} />;
      default:
        return <Dashboard customers={customers} invoices={invoices} routers={routers} logs={MOCK_LOGS} isAutoIsolirEnabled={isAutoIsolirEnabled} autoIsolirTime={autoIsolirTime} companyConfig={companyConfig} />;
    }
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans`}>
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-40 fixed inset-y-0 lg:relative`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 dark:shadow-none">
              <Globe className="text-white" size={24} />
            </div>
            {isSidebarOpen && (
              <span className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-xl">PH BILING</span>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => {
            if (item.adminOnly && currentUser.role !== UserRole.ADMIN) return null;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none font-black' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 font-bold'
                }`}
              >
                <item.icon size={22} className={activeTab === item.id ? 'scale-110' : ''} />
                {isSidebarOpen && <span className="text-sm uppercase tracking-widest">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
           >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              {isSidebarOpen && <span className="text-sm font-bold">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
           </button>
           <button 
             onClick={() => setActiveTab('profile')}
             className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-slate-100 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
           >
              <UserIcon size={20} />
              {isSidebarOpen && (
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate uppercase">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate uppercase">{currentUser.role}</p>
                </div>
              )}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-4 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
              <Menu size={24} />
            </button>
            <h2 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-lg">
              {menuItems.find(i => i.id === activeTab)?.label || 'Profile'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Gateway Connected</span>
             </div>
             <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 relative">
                <ShieldCheck size={20} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">3</div>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
