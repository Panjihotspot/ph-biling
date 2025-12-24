
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Zap,
  Globe,
  Users,
  Cpu,
  ArrowRightLeft
} from 'lucide-react';
import { InternetPackage, ServiceType, Customer, CompanyConfig, UserRole } from '../types';

interface PackageManagementProps {
  packages: InternetPackage[];
  setPackages: (p: InternetPackage[]) => void;
  customers: Customer[];
  companyConfig: CompanyConfig;
  role: UserRole;
}

const MOCK_MIKROTIK_PROFILES = [
  { name: 'HOME-30MBPS', rateLimit: '30M/30M', comment: 'Profile Otomatis 30Mbps' },
  { name: 'ULTRA-100MBPS', rateLimit: '100M/100M', comment: 'Profile High Speed Business' },
];

const PackageManagement: React.FC<PackageManagementProps> = ({ packages, setPackages, customers, companyConfig, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<InternetPackage | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const isAdmin = role === UserRole.ADMIN;

  const [formData, setFormData] = useState({
    name: '',
    speed: '',
    price: 0,
    description: '',
    type: ServiceType.PPPOE
  });

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        name: editingPackage.name,
        speed: editingPackage.speed,
        price: editingPackage.price,
        description: editingPackage.description,
        type: ServiceType.PPPOE
      });
    } else {
      setFormData({
        name: '',
        speed: '',
        price: 0,
        description: '',
        type: ServiceType.PPPOE
      });
    }
  }, [editingPackage, isModalOpen]);

  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.speed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerCount = (packageName: string) => {
    return customers.filter(c => c.profileName === packageName).length;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPackage) {
      setPackages(packages.map(p => p.id === editingPackage.id ? { ...p, ...formData } : p));
    } else {
      const newPkg: InternetPackage = {
        id: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        isMikrotikSynced: true
      };
      setPackages([...packages, newPkg]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 overflow-x-hidden">
      {/* Header Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 p-12 opacity-5 text-blue-600 hidden md:block">
           <Globe size={200} />
        </div>
        <div className="relative z-10 w-full text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-3">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center mb-3 sm:mb-0">
              <Zap size={28} className="text-white fill-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">Katalog Paket</h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs font-black uppercase tracking-widest mt-1">Layanan Fiber Optic Aktif</p>
            </div>
          </div>
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 relative z-10 w-full sm:w-auto">
            <button onClick={() => setIsScanning(true)} className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 active:scale-95 transition-all">
              <ArrowRightLeft className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>Sinkron</span>
            </button>
            <button onClick={() => { setEditingPackage(null); setIsModalOpen(true); }} className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none active:scale-95 transition-all">
              <Plus className="w-4 h-4" />
              <span>Paket Baru</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative w-full max-w-2xl mx-auto sm:mx-0">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input type="text" placeholder="Cari paket atau kecepatan..." className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] sm:rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/10 outline-none shadow-sm transition-all dark:text-slate-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        {filteredPackages.map(pkg => (
          <div key={pkg.id} className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-blue-700 transition-all group overflow-hidden flex flex-col min-h-[320px] sm:min-h-[380px]">
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-6 sm:mb-8">
                <div className="p-4 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-500">
                  <Cpu size={28} className="sm:size-32" />
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-800">PPPoE</span>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <h4 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 mb-1 truncate">{pkg.name}</h4>
                <div className="flex items-baseline space-x-1">
                   <span className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">{pkg.speed}</span>
                   <span className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mbps</span>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biaya Bulanan</p>
                   <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Rp {pkg.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[1.2rem] sm:rounded-2xl transition-colors">
                  <div className="flex items-center space-x-2">
                     <Users size={16} className="text-slate-400" />
                     <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pelanggan</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">{getCustomerCount(pkg.name)} Users</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal responsif dengan mobile-first (bottom sheet pada mobile) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-slate-900/80 backdrop-blur-md p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
            <div className={`px-8 py-6 flex items-center justify-between text-white ${editingPackage ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              <h3 className="font-black text-lg uppercase tracking-tighter">{editingPackage ? 'Edit Layanan' : 'Tambah Layanan'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={24}/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 sm:p-10 space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Label Layanan</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-100" placeholder="Misal: HOME-20MBPS" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Limit Speed</label>
                    <input type="text" required value={formData.speed} onChange={(e) => setFormData({...formData, speed: e.target.value})} className="w-full px-5 py-4 text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none dark:text-slate-100" placeholder="20M/20M" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tarif (Rp)</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full px-5 py-4 text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none dark:text-slate-100" />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex flex-col xs:flex-row gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Batal</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none active:scale-95 transition-all">Simpan Konfigurasi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManagement;
