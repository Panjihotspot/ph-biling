
import React, { useState, useRef } from 'react';
import { 
  Server, 
  Plus, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  Wifi, 
  X,
  Save,
  Network,
  Lock,
  Globe,
  RefreshCw,
  Clock,
  Zap,
  Building,
  Image as ImageIcon,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Router, CompanyConfig } from '../types';

interface SettingsProps {
  routers: Router[];
  setRouters: (r: Router[]) => void;
  isAutoIsolirEnabled: boolean;
  setIsAutoIsolirEnabled: (val: boolean) => void;
  autoIsolirTime: string;
  setAutoIsolirTime: (val: string) => void;
  autoIsolirGracePeriod: number;
  setAutoIsolirGracePeriod: (val: number) => void;
  companyConfig: CompanyConfig;
  setCompanyConfig: (val: CompanyConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  routers, 
  setRouters, 
  isAutoIsolirEnabled, 
  setIsAutoIsolirEnabled, 
  autoIsolirTime, 
  setAutoIsolirTime,
  autoIsolirGracePeriod,
  setAutoIsolirGracePeriod,
  companyConfig,
  setCompanyConfig
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRouter, setEditingRouter] = useState<Router | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [routerFormData, setRouterFormData] = useState({
    name: '',
    ip: '',
    username: 'admin',
    password: '',
    port: '8728'
  });

  const [companyForm, setCompanyForm] = useState<CompanyConfig>(companyConfig);

  const handleOpenModal = (router?: Router) => {
    if (router) {
      setEditingRouter(router);
      setRouterFormData({
        name: router.name,
        ip: router.ip,
        username: 'admin',
        password: '',
        port: '8728'
      });
    } else {
      setEditingRouter(null);
      setRouterFormData({
        name: '',
        ip: '',
        username: 'admin',
        password: '',
        port: '8728'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmitRouter = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRouter) {
      setRouters(routers.map(r => r.id === editingRouter.id ? { ...r, name: routerFormData.name, ip: routerFormData.ip } : r));
    } else {
      const newRouter: Router = {
        id: `R0${routers.length + 1}`,
        name: routerFormData.name,
        ip: routerFormData.ip,
        status: 'ONLINE',
        uptime: '0s',
        cpuLoad: 0,
        memoryUsage: 0
      };
      setRouters([...routers, newRouter]);
    }
    setIsModalOpen(false);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyConfig(companyForm);
    alert('Profil perusahaan berhasil disimpan!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Profil Perusahaan */}
      <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Building size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Profil Perusahaan</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Identitas ini akan muncul pada Dashboard dan Invoice pelanggan.</p>
          </div>
        </div>

        <form onSubmit={handleSaveCompany} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Nama Perusahaan</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold dark:text-slate-100" 
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Slogan Perusahaan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Koneksi Tanpa Batas"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold dark:text-slate-100" 
                  value={companyForm.slogan}
                  onChange={(e) => setCompanyForm({...companyForm, slogan: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Email Perusahaan</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all font-bold dark:text-slate-100" 
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Nomor Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all font-bold dark:text-slate-100" 
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({...companyForm, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Alamat Kantor</label>
                <textarea 
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all font-bold dark:text-slate-100 min-h-[100px]" 
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none"
              >
                Simpan Profil
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Scheduler Otomasi */}
      <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className={`p-3 rounded-2xl ${isAutoIsolirEnabled ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Auto Isolir & Scheduler</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Otomasi penonaktifan pelanggan berdasarkan status tagihan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Status Otomasi</h4>
                <button 
                  onClick={() => setIsAutoIsolirEnabled(!isAutoIsolirEnabled)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isAutoIsolirEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isAutoIsolirEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Waktu Eksekusi Harian</label>
                  <input type="time" value={autoIsolirTime} onChange={(e) => setAutoIsolirTime(e.target.value)} disabled={!isAutoIsolirEnabled} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all disabled:opacity-50 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Masa Tenggang (Hari)</label>
                  <input type="number" min="0" value={autoIsolirGracePeriod} onChange={(e) => setAutoIsolirGracePeriod(parseInt(e.target.value) || 0)} disabled={!isAutoIsolirEnabled} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none dark:text-slate-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manajemen Router */}
      <section>
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Server size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Router MikroTik</h3>
          </div>
          <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg active:scale-95">
            Tambah Router
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routers.map(router => (
            <div key={router.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative group transition-colors">
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(router)} className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg"><Edit2 size={16} /></button>
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">{router.name}</h4>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-4">{router.ip}</p>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                <span>ONLINE</span>
                <span>{router.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Router */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="px-8 py-6 bg-blue-600 flex items-center justify-between text-white">
              <h3 className="font-black text-lg uppercase tracking-tighter">{editingRouter ? 'Edit Router' : 'Tambah Router'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmitRouter} className="p-8 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Nama Router</label>
                  <input type="text" required value={routerFormData.name} onChange={(e) => setRouterFormData({...routerFormData, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none dark:text-slate-100 font-bold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Alamat IP</label>
                  <input type="text" required value={routerFormData.ip} onChange={(e) => setRouterFormData({...routerFormData, ip: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none dark:text-slate-100 font-mono" />
                </div>
              </div>
              <div className="pt-6 flex flex-col gap-3">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest shadow-xl shadow-blue-100 dark:shadow-none">Simpan Router</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-4 text-slate-400 font-bold uppercase text-xs">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
