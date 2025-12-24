
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
  Layers,
  Sun,
  Moon,
  Server,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { UserRole, CustomerStatus, PaymentStatus, Customer, Invoice, Router, SystemLog, InternetPackage, CompanyConfig, SystemUser } from './types';
import { MOCK_CUSTOMERS, MOCK_INVOICES, MOCK_ROUTERS, MOCK_LOGS, MOCK_PACKAGES, MOCK_COMPANY_CONFIG, MOCK_SYSTEM_USERS } from './constants';
import Dashboard from './components/Dashboard';
import CustomerManagement from './components/CustomerManagement';
import BillingModule from './components/BillingModule';
import WhatsAppConfig from './components/WhatsAppConfig';
import Settings from './components/Settings';
import PackageManagement from './components/PackageManagement';
import UserManagement from './components/UserManagement';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import PaymentCheckout from './components/PaymentCheckout';
import MikrotikConfig from './components/MikrotikConfig';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [viewingCheckoutInvoice, setViewingCheckoutInvoice] = useState<Invoice | null>(null);
  
  // Sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop compact mode
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Desktop visibility toggle

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [users, setUsers] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES.map(inv => ({ 
    ...inv, 
    notifications: [],
    paymentUrl: inv.paymentUrl || `https://checkout.phbiling.com/pay/${inv.id}`
  })));
  const [routers, setRouters] = useState<Router[]>(MOCK_ROUTERS);
  const [logs, setLogs] = useState<SystemLog[]>(MOCK_LOGS);
  const [packages, setPackages] = useState<InternetPackage[]>(MOCK_PACKAGES);
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>(MOCK_COMPANY_CONFIG);

  const [isAutoIsolirEnabled, setIsAutoIsolirEnabled] = useState(true);
  const [autoIsolirTime, setAutoIsolirTime] = useState('00:00');
  const [autoIsolirGracePeriod, setAutoIsolirGracePeriod] = useState(3);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.title = `${companyConfig.name} - System`;
  }, [companyConfig.name]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const accessibleTabs = role === UserRole.ADMIN 
    ? ['dashboard', 'packages', 'customers', 'billing', 'whatsapp', 'infrastructure', 'users', 'profile', 'settings']
    : ['dashboard', 'packages', 'customers', 'profile'];

  const handleLogin = (user: SystemUser) => {
    setCurrentUser(user);
    setRole(user.role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
    setIsSidebarOpen(false);
  };

  const handlePayment = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: PaymentStatus.PAID } : inv));
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.status === CustomerStatus.ACTIVE ? CustomerStatus.SUSPENDED : CustomerStatus.ACTIVE;
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  if (viewingCheckoutInvoice) {
    return (
      <PaymentCheckout 
        invoice={viewingCheckoutInvoice} 
        companyConfig={companyConfig} 
        onClose={() => setViewingCheckoutInvoice(null)} 
        onPaid={(id) => {
          handlePayment(id);
          setTimeout(() => setViewingCheckoutInvoice(null), 2000);
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} systemUsers={users} companyConfig={companyConfig} />;
  }

  const sessionUser = currentUser || users[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-x-hidden">
      
      {/* MOBILE DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop: Collapsible, Mobile: Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl transition-all duration-300
        ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
        ${isSidebarCollapsed ? 'md:w-24' : 'md:w-72'}
        ${!isSidebarVisible ? 'md:-translate-x-full' : 'md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 h-24 flex items-center justify-between">
          <div className={`flex items-center space-x-3 overflow-hidden ${isSidebarCollapsed && 'md:justify-center md:space-x-0 w-full'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shrink-0">
              {companyConfig.logoUrl ? <img src={companyConfig.logoUrl} className="w-full h-full object-contain p-1.5" /> : companyConfig.name.substring(0, 1)}
            </div>
            {!isSidebarCollapsed && (
              <h1 className="text-lg font-black tracking-tighter truncate uppercase text-slate-800 dark:text-slate-100 animate-in fade-in duration-500">
                {companyConfig.name}
              </h1>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} accessibleTabs={accessibleTabs} isCollapsed={isSidebarCollapsed} />
          <NavItem id="packages" icon={Globe} label="Paket Internet" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} accessibleTabs={accessibleTabs} isCollapsed={isSidebarCollapsed} />
          <NavItem id="customers" icon={Users} label="Pelanggan" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} accessibleTabs={accessibleTabs} isCollapsed={isSidebarCollapsed} />
          <NavItem id="billing" icon={CreditCard} label="Penagihan" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} accessibleTabs={accessibleTabs} isCollapsed={isSidebarCollapsed} />
          <NavItem id="infrastructure" icon={Server} label="Infrastruktur" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} accessibleTabs={accessibleTabs} isCollapsed={isSidebarCollapsed} />
          <NavItem id="whatsapp" icon={MessageSquare} label="WhatsApp" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} accessibleTabs={accessibleTabs} isCollapsed={isSidebarCollapsed} />
          <NavItem id="users" icon={ShieldCheck} label="Staff" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} accessibleTabs={accessibleTabs} isCollapsed={isSidebarCollapsed} />
          <NavItem id="profile" icon={UserIcon} label="Profil" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} accessibleTabs={accessibleTabs} isCollapsed={isSidebarCollapsed} />
          <NavItem id="settings" icon={SettingsIcon} label="Sistem" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} accessibleTabs={accessibleTabs} isCollapsed={isSidebarCollapsed} />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button onClick={toggleTheme} className={`w-full flex items-center bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all hover:bg-slate-100 dark:hover:bg-slate-750 ${isSidebarCollapsed ? 'p-3 justify-center' : 'px-4 py-3 justify-between'}`}>
            <div className="flex items-center space-x-2">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {!isSidebarCollapsed && <span className="uppercase tracking-widest">{theme === 'light' ? 'Gelap' : 'Terang'}</span>}
            </div>
            {!isSidebarCollapsed && (
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'}`}>
                 <div className={`w-3 h-3 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
            )}
          </button>
          
          <button onClick={handleLogout} className={`w-full flex items-center justify-center space-x-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all ${isSidebarCollapsed ? 'p-3' : 'py-3'}`}>
            <LogOut size={16} />
            {!isSidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* TOP HEADER (Universal) */}
      <header className={`
        fixed top-0 right-0 z-[90] glass-effect dark:bg-slate-900/80 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 transition-all duration-300
        ${isSidebarVisible ? (isSidebarCollapsed ? 'md:left-24' : 'md:left-72') : 'left-0'}
      `}>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsSidebarOpen(true);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }
            }}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all active:scale-95"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:flex flex-col">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">PH Biling</h2>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">{activeTab.replace('-', ' ')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden xs:flex flex-col items-end text-right mr-2">
            <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 leading-none mb-1">{sessionUser.name}</span>
            <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{role}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">
            {sessionUser.name.charAt(0)}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className={`
        min-h-screen transition-all duration-300 pt-24
        ${isSidebarVisible ? (isSidebarCollapsed ? 'md:ml-24' : 'md:ml-72') : 'ml-0'}
      `}>
        <div className="p-4 sm:p-6 md:p-10 w-full max-w-7xl mx-auto page-enter pb-10">
          {activeTab === 'dashboard' && <Dashboard customers={customers} invoices={invoices} routers={routers} logs={logs} isAutoIsolirEnabled={isAutoIsolirEnabled} autoIsolirTime={autoIsolirTime} companyConfig={companyConfig} />}
          {activeTab === 'packages' && <PackageManagement packages={packages} setPackages={setPackages} customers={customers} companyConfig={companyConfig} role={role} />}
          {activeTab === 'customers' && <CustomerManagement customers={customers} setCustomers={setCustomers} toggleStatus={toggleCustomerStatus} invoices={invoices} role={role} />}
          {activeTab === 'billing' && role === UserRole.ADMIN && <BillingModule invoices={invoices} setInvoices={setInvoices} customers={customers} handlePayment={handlePayment} companyConfig={companyConfig} onPreviewCheckout={(inv) => setViewingCheckoutInvoice(inv)} />}
          {activeTab === 'infrastructure' && role === UserRole.ADMIN && <MikrotikConfig routers={routers} logs={logs} />}
          {activeTab === 'whatsapp' && role === UserRole.ADMIN && <WhatsAppConfig />}
          {activeTab === 'users' && role === UserRole.ADMIN && <UserManagement users={users} setUsers={setUsers} />}
          {activeTab === 'profile' && <UserProfile currentUser={sessionUser} onUpdate={(u) => setCurrentUser(u)} onLogout={handleLogout} />}
          {activeTab === 'settings' && role === UserRole.ADMIN && <Settings routers={routers} setRouters={setRouters} isAutoIsolirEnabled={isAutoIsolirEnabled} setIsAutoIsolirEnabled={setIsAutoIsolirEnabled} autoIsolirTime={autoIsolirTime} setAutoIsolirTime={setAutoIsolirTime} autoIsolirGracePeriod={autoIsolirGracePeriod} setAutoIsolirGracePeriod={setAutoIsolirGracePeriod} companyConfig={companyConfig} setCompanyConfig={setCompanyConfig} />}
        </div>
      </main>

      {/* VIEWPORT CONTROLLER (Floating Widget for Visibility Toggle on Desktop) */}
      <div className="hidden md:block fixed bottom-6 left-6 z-[120]">
        <button 
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl text-slate-400 hover:text-blue-600 transition-all hover:scale-110 active:scale-95"
          title={isSidebarVisible ? "Sembunyikan Menu" : "Tampilkan Menu"}
        >
          {isSidebarVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

    </div>
  );
};

const NavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, accessibleTabs, isCollapsed }: any) => {
  if (!accessibleTabs.includes(id)) return null;
  const isActive = activeTab === id;
  return (
    <button 
      type="button" 
      onClick={() => setActiveTab(id)} 
      className={`
        w-full flex items-center rounded-2xl transition-all duration-300 group relative
        ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 dark:shadow-none scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'}
        ${isCollapsed ? 'p-4 justify-center' : 'px-4 py-3.5 space-x-3'}
      `}
      title={isCollapsed ? label : ''}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
      {!isCollapsed && <span className="font-bold text-sm tracking-tight truncate">{label}</span>}
      
      {/* Tooltip for Collapsed Sidebar */}
      {isCollapsed && (
        <div className="absolute left-20 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:left-24 transition-all z-[150] shadow-2xl hidden md:block whitespace-nowrap">
          {label}
        </div>
      )}
    </button>
  );
};

export default App;
