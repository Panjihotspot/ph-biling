
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Key, 
  Save, 
  Camera,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { SystemUser, UserRole } from '../types';

interface UserProfileProps {
  currentUser: SystemUser;
  onUpdate: (updatedUser: SystemUser) => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUser, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState<SystemUser>(currentUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {/* Cover Header */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white dark:bg-slate-900 rounded-3xl shadow-lg transition-colors">
             <div className="w-24 h-24 rounded-[1.4rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={40} className="text-slate-300 dark:text-slate-600" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={20} />
                </div>
             </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{formData.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">@{formData.username}</p>
            </div>
            <div className="flex items-center space-x-2">
               <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                 formData.role === UserRole.ADMIN ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
               }`}>
                 {formData.role}
               </span>
               <button 
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
               >
                 {isEditing ? 'Batal' : 'Edit Profil'}
               </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-60 font-bold text-sm dark:text-slate-100"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input 
                      type="email" 
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-60 font-bold text-sm dark:text-slate-100"
                    />
                  </div>
               </div>
             </div>

             <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">No. WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-60 font-bold text-sm dark:text-slate-100"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">ID Staff</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input 
                      type="text" 
                      disabled
                      value={formData.id}
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-mono text-xs font-bold text-slate-500 dark:text-slate-500"
                    />
                  </div>
               </div>
             </div>

             {isEditing && (
               <div className="md:col-span-2 flex justify-end">
                  <button 
                    type="submit"
                    className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    <Save size={18} />
                    <span>Simpan Perubahan</span>
                  </button>
               </div>
             )}
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
           <h4 className="font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
             <Key size={20} className="text-amber-500" />
             <span>Keamanan Akun</span>
           </h4>
           <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Kelola otentikasi dan ubah kata sandi akses sistem Anda secara berkala.</p>
           <button type="button" className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-750 transition-all group active:scale-[0.98]">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Ubah Password Akses</span>
              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/20 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 shadow-sm space-y-4 flex flex-col justify-between transition-colors">
           <div>
              <h4 className="font-black text-rose-800 dark:text-rose-400 flex items-center space-x-2">
                <LogOut size={20} className="text-rose-500" />
                <span>Keluar Sesi</span>
              </h4>
              <p className="text-xs text-rose-600/70 dark:text-rose-400/50 leading-relaxed mt-2">Pastikan Anda telah menyimpan seluruh pekerjaan sebelum mengakhiri sesi.</p>
           </div>
           <button 
             type="button"
             onClick={onLogout}
             className="w-full py-4 bg-white dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-2"
           >
              <LogOut size={16} />
              <span>Log Out</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
