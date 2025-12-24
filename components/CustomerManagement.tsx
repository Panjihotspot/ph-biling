
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Wifi, 
  ToggleLeft,
  ToggleRight,
  Edit2,
  AlertCircle
} from 'lucide-react';
import { Customer, CustomerStatus, ServiceType, Invoice, UserRole } from '../types';

interface CustomerManagementProps {
  customers: Customer[];
  setCustomers: (c: Customer[]) => void;
  toggleStatus: (id: string) => void;
  invoices: Invoice[];
  role: UserRole;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers, setCustomers, toggleStatus, invoices, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const isAdmin = role === UserRole.ADMIN;

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    billingCycleDay: 5,
    monthlyFee: 150000,
    profileName: 'HOME-10MBPS',
    ipAddress: '',
    address: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined
  });

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        name: editingCustomer.name || '',
        username: editingCustomer.username || '',
        password: editingCustomer.password || '',
        email: editingCustomer.email || '',
        phone: editingCustomer.phone || '',
        billingCycleDay: editingCustomer.billingCycleDay || 5,
        monthlyFee: editingCustomer.monthlyFee || 0,
        profileName: editingCustomer.profileName || 'HOME-10MBPS',
        ipAddress: editingCustomer.ipAddress || '',
        address: editingCustomer.address || '',
        latitude: editingCustomer.latitude,
        longitude: editingCustomer.longitude
      });
    } else {
      setFormData({
        name: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        billingCycleDay: 5,
        monthlyFee: 150000,
        profileName: 'HOME-10MBPS',
        ipAddress: '',
        address: '',
        latitude: undefined,
        longitude: undefined
      });
    }
  }, [editingCustomer, isModalOpen]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEdit = (customer: Customer) => {
    if (!isAdmin) return;
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c));
    } else {
      const newCustomer: Customer = {
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        email: formData.email || `${formData.username}@isp.net`,
        phone: formData.phone || '628',
        serviceType: ServiceType.PPPOE,
        status: CustomerStatus.ACTIVE,
        joinDate: new Date().toISOString().split('T')[0],
        routerId: 'R01',
        isMikrotikSynced: true
      };
      setCustomers([...customers, newCustomer]);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 overflow-x-hidden">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-800 dark:to-blue-950 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 p-10 opacity-10 hidden sm:block">
           <Wifi size={120} />
        </div>
        <div className="flex items-center space-x-4 w-full relative z-10">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
            <Wifi className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black truncate uppercase tracking-tighter leading-none mb-1">Database Pelanggan</h3>
            <p className="text-indigo-100 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest opacity-80">Sinkronisasi MikroTik Aktif</p>
          </div>
        </div>
        <div className="w-full sm:w-auto relative z-10">
          {isAdmin && (
            <button onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }} className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest border border-white shadow-xl active:scale-95 transition-all">
              <Plus className="w-4 h-4" />
              <span>Tambah Pelanggan</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative w-full max-w-2xl mx-auto sm:mx-0">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input type="text" placeholder="Cari nama atau username..." className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] sm:rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/10 outline-none shadow-sm transition-all dark:text-slate-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* MOBILE CARD VIEW - Tampil di layar < 768px */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.length > 0 ? filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-12 h-12 shrink-0 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-[1.2rem] flex items-center justify-center font-black text-lg">{customer.name.charAt(0)}</div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-800 dark:text-slate-100 text-sm truncate uppercase tracking-tight leading-none mb-1">{customer.name}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono tracking-widest uppercase">ID: {customer.username}</p>
                  </div>
                </div>
                <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shrink-0 border ${customer.status === CustomerStatus.ACTIVE ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900'}`}>{customer.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Paket Internet</p>
                  <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 truncate uppercase">{customer.profileName}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Tgl Jatuh Tempo</p>
                  <p className="text-[11px] font-black text-slate-700 dark:text-slate-300">Setiap Tgl {customer.billingCycleDay}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                 <button onClick={() => handleOpenEdit(customer)} className="flex items-center space-x-2 px-5 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"><Edit2 size={16} /> <span>Edit Data</span></button>
                 <button onClick={() => toggleStatus(customer.id)} className={`transition-all ${customer.status === CustomerStatus.ACTIVE ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {customer.status === CustomerStatus.ACTIVE ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
                 </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center opacity-30">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p className="font-black text-xs uppercase tracking-[0.2em]">Tidak Ada Data</p>
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW - Tampil di layar >= 768px */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Informasi Pelanggan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kredensial MikroTik</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Paket & IP</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Tgl Tempo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-black text-lg">{customer.name.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate uppercase">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">USER: {customer.username}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">PASS: ••••••••</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">{customer.profileName}</p>
                    <p className="text-[10px] text-blue-500 font-mono font-bold uppercase">{customer.ipAddress || 'STATIC-LEASE'}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">Tgl {customer.billingCycleDay}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button onClick={() => toggleStatus(customer.id)} className={`transition-all ${customer.status === CustomerStatus.ACTIVE ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {customer.status === CustomerStatus.ACTIVE ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleOpenEdit(customer)} className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl"><Edit2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
