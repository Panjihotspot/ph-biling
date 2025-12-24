
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Edit2, 
  Trash2, 
  X, 
  UserPlus,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { SystemUser, UserRole } from '../types';

interface UserManagementProps {
  users: SystemUser[];
  setUsers: (u: SystemUser[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    role: UserRole.TECHNICIAN,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setShowPass(false);
    setFormData({
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      address: '',
      role: UserRole.TECHNICIAN,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: SystemUser) => {
    setEditingUser(user);
    setShowPass(false);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || '',
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser: SystemUser = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        lastLogin: 'Never',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user staff ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Manajemen User Internal</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Kelola akses staff Admin dan Teknisi Lapangan.</p>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah User Staff</span>
        </button>
      </div>

      <div className="relative max-w-xl">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Cari nama, username, atau email staff..."
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/10 outline-none shadow-sm transition-all dark:text-slate-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">User Staff</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kontak</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Terakhir Login</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black overflow-hidden ${
                        user.role === UserRole.ADMIN ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100">{user.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center"><Mail size={12} className="mr-1.5 opacity-40" /> {user.email}</p>
                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center"><Phone size={12} className="mr-1.5 opacity-40" /> {user.phone}</p>
                     </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                      user.role === UserRole.ADMIN ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{user.lastLogin || 'Belum pernah'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                      <span className={`text-[10px] font-bold uppercase ${user.status === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className={`px-8 py-6 flex items-center justify-between text-white ${editingUser ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <UserPlus size={20} />
                </div>
                <h3 className="font-black text-lg uppercase tracking-tighter">{editingUser ? 'Edit User Staff' : 'Tambah Staff Baru'}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5 overflow-y-auto max-h-[75vh] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nama Lengkap</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm dark:text-slate-100" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Username Sistem</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm dark:text-slate-100" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"} 
                        required={!editingUser}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm dark:text-slate-100" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                      <input 
                        type="email" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-slate-100" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nomor WA</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-slate-100" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Role</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-slate-100"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                    >
                      <option value={UserRole.ADMIN}>ADMINISTRATOR</option>
                      <option value={UserRole.TECHNICIAN}>TEKNISI LAPANGAN</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors text-xs uppercase tracking-widest">Batal</button>
                <button type="submit" className={`flex-1 py-4 text-white font-bold rounded-2xl transition-all shadow-xl dark:shadow-none active:scale-95 text-xs uppercase tracking-widest ${editingUser ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  {editingUser ? 'Simpan Perubahan' : 'Terbitkan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
