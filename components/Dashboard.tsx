
import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Lock, 
  ShieldCheck, 
  AlertCircle,
  Activity,
  Zap
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Customer, Invoice, CustomerStatus, PaymentStatus, CompanyConfig } from '../types';

interface DashboardProps {
  customers: Customer[];
  invoices: Invoice[];
  routers: any[];
  logs: any[];
  isAutoIsolirEnabled: boolean;
  autoIsolirTime: string;
  companyConfig: CompanyConfig;
  onViewLogs?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  customers, 
  invoices, 
  isAutoIsolirEnabled, 
  autoIsolirTime,
  companyConfig,
  onViewLogs
}) => {
  const today = new Date();
  const currentDay = today.getDate();

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === CustomerStatus.ACTIVE).length,
    revenueThisMonth: invoices.filter(inv => inv.status === PaymentStatus.PAID).reduce((acc, inv) => acc + inv.amount, 0),
    overdueCount: invoices.filter(inv => inv.status === PaymentStatus.OVERDUE).length,
  };

  const revenueData = [
    { name: 'Jan', value: 12000000 },
    { name: 'Feb', value: 15000000 },
    { name: 'Mar', value: 14000000 },
    { name: 'Apr', value: 18000000 },
    { name: 'Mei', value: stats.revenueThisMonth },
  ];

  const scheduledForToday = customers.filter(c => {
    const hasUnpaid = invoices.some(inv => inv.customerId === c.id && inv.status !== PaymentStatus.PAID);
    return c.billingCycleDay === currentDay && hasUnpaid && c.status === CustomerStatus.ACTIVE;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-700 dark:to-indigo-950 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-2xl shadow-blue-100 dark:shadow-none relative overflow-hidden flex flex-col justify-between min-h-[220px] sm:min-h-[280px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6 sm:mb-8">
               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-slate-100 rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                  {companyConfig.logoUrl ? (
                    <img src={companyConfig.logoUrl} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                  ) : (
                    <Activity className="text-blue-600" size={32} />
                  )}
               </div>
               <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none truncate">{companyConfig.name}</h3>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-blue-100 font-bold uppercase tracking-[0.2em] mt-1 opacity-90 truncate">{companyConfig.slogan}</p>
               </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] md:text-xs text-blue-100 font-black uppercase tracking-[0.2em] mb-1 sm:mb-2">Pendapatan Terverifikasi</p>
              <div className="flex items-baseline flex-wrap gap-2">
                <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none">Rp {stats.revenueThisMonth.toLocaleString()}</span>
                <span className="text-blue-200 text-xs sm:text-sm md:text-xl font-bold">/ Bulan</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-center space-x-4 sm:space-x-6 pt-4 sm:pt-6 border-t border-white/10 mt-6 overflow-x-auto no-scrollbar">
             <div className="flex items-center space-x-2 shrink-0">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-300">Gateway Online</span>
             </div>
             <div className="flex items-center space-x-2 shrink-0">
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-100 opacity-60 truncate">Update: Baru saja</span>
             </div>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
              <Users size={20} className="sm:size-24" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Pelanggan</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{stats.totalCustomers}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
              <Lock size={20} className="sm:size-24" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Menunggak</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{stats.overdueCount}</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Targeted Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Revenue Growth Chart */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 mb-8">
            <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base md:text-lg flex items-center space-x-3">
              <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
              <span>Analisis Pertumbuhan</span>
            </h4>
            <div className="flex items-center space-x-1.5">
               <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
               <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pendapatan Kotor</span>
            </div>
          </div>
          <div className="h-[200px] sm:h-[280px] md:h-[320px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '700'}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1e293b', color: '#f8fafc', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Scheduled Actions */}
        <div className="xl:col-span-4 space-y-6 sm:space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[300px] sm:h-full">
            <div className="flex items-center justify-between mb-6">
               <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs sm:text-sm md:text-base uppercase tracking-tight">Target Isolir</h4>
               <span className="text-[10px] font-black px-2.5 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-100 dark:border-rose-900/50">{scheduledForToday.length}</span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[250px] sm:max-h-[350px] custom-scrollbar pr-1">
               {scheduledForToday.length > 0 ? (
                 scheduledForToday.map(c => (
                   <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-[10px] text-slate-400 transition-all">{c.billingCycleDay}</div>
                        <div className="min-w-0">
                          <p className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-200 leading-none truncate mb-1">{c.name}</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono truncate uppercase">@{c.username}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <p className="text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-tighter">Late</p>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-10 text-center opacity-40">
                    <ShieldCheck size={40} className="mx-auto mb-3 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Semua Berjalan Normal</p>
                 </div>
               )}
            </div>
          </div>

          <button onClick={onViewLogs} className={`w-full p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border transition-all active:scale-[0.98] flex items-center space-x-4 text-left shadow-sm ${isAutoIsolirEnabled ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'}`}>
            <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 shadow-sm ${isAutoIsolirEnabled ? 'text-emerald-500' : 'text-amber-500'}`}>
              {isAutoIsolirEnabled ? <Zap size={22} className="fill-current" /> : <AlertCircle size={22} />}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-tight truncate">Mesin Otomatisasi</p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest truncate">Harian: {autoIsolirTime} WIB</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
