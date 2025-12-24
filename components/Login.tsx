
import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';
import { SystemUser, CompanyConfig } from '../types';

interface LoginProps {
  onLogin: (user: SystemUser) => void;
  systemUsers: SystemUser[];
  companyConfig: CompanyConfig;
}

const Login: React.FC<LoginProps> = ({ onLogin, systemUsers, companyConfig }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user = systemUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
      const isValidPassword = user && user.password === password;

      if (user && isValidPassword) {
        onLogin(user);
      } else {
        setError('Kredensial tidak valid. Silakan periksa kembali username dan password Anda.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-10 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Elemen Dekoratif Background */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        {/* Branding Area */}
        <div className="text-center mb-8">
          <div className="inline-flex p-1 bg-white dark:bg-slate-800 rounded-[2.2rem] shadow-2xl shadow-blue-100 dark:shadow-none mb-6 border border-white dark:border-slate-700 overflow-hidden w-24 h-24 items-center justify-center transition-transform hover:scale-105 duration-500">
            {companyConfig.logoUrl ? (
              <img src={companyConfig.logoUrl} className="w-full h-full object-contain p-2" alt="Company Logo" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black uppercase">
                {companyConfig.name.substring(0, 2)}
              </div>
            )}
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase leading-tight">{companyConfig.name}</h1>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-bold mt-1 uppercase tracking-wider">{companyConfig.slogan}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1 uppercase tracking-widest">Sistem Manajemen & Billing Terpadu</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none">
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-2xl flex items-center space-x-3 text-rose-600 dark:text-rose-400 animate-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  required 
                  placeholder="Masukkan username" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none font-bold text-sm transition-all dark:text-slate-100" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none font-bold text-sm transition-all dark:text-slate-100" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className={`w-5 h-5 rounded-lg border-2 transition-all ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                    {rememberMe && (
                      <svg className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">Ingat Saya</span>
              </label>
              
              <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Lupa Password?</button>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center space-x-2 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Masuk Ke Sistem</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-slate-400 dark:text-slate-600">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Protected by SecureShield API</span>
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold mt-4 uppercase tracking-[0.2em]">&copy; 2024 PH BILING. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
