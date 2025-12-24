
import React, { useState } from 'react';
import { 
  Network, 
  Cpu, 
  Database, 
  RefreshCw, 
  Wifi, 
  Activity, 
  Zap,
  Server,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { Router, SystemLog } from '../types';

interface MikrotikProps {
  routers: Router[];
  logs: SystemLog[];
}

const MikrotikConfig: React.FC<MikrotikProps> = ({ routers, logs }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Server size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Infrastruktur Jaringan</h3>
        </div>
        <button 
          onClick={refreshStatus}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          <span>Sync Router</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routers.map(router => (
          <div key={router.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">{router.name}</h4>
                <p className="text-xs font-mono text-slate-400 dark:text-slate-500">{router.ip}</p>
              </div>
              <span className="flex items-center space-x-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>{router.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-1">
                  <Cpu size={14} />
                  <span className="text-[10px] font-bold uppercase">CPU Load</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{router.cpuLoad}%</span>
                  <div className="h-1 flex-1 max-w-[40px] bg-slate-200 dark:bg-slate-700 rounded-full mb-2 ml-2 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{width: `${router.cpuLoad}%`}}></div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-1">
                  <Database size={14} />
                  <span className="text-[10px] font-bold uppercase">Memory</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{router.memoryUsage}%</span>
                  <div className="h-1 flex-1 max-w-[40px] bg-slate-200 dark:bg-slate-700 rounded-full mb-2 ml-2 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{width: `${router.memoryUsage}%`}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Uptime</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">{router.uptime}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-medium">OS Version</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">7.12 Stable</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center space-x-1 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                <Activity size={14} />
                <span>Traffic</span>
              </button>
              <button className="flex items-center justify-center space-x-1 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors">
                <RefreshCw size={14} />
                <span>Reboot</span>
              </button>
            </div>
          </div>
        ))}

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-dashed flex flex-col items-center justify-center text-center space-y-4 transition-colors">
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600">
            <Network size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-400 dark:text-slate-500">Tambah Gateway</h4>
            <p className="text-xs text-slate-400 dark:text-slate-600 px-4">Integrasikan router MikroTik lain via API SSL.</p>
          </div>
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Konfigurasi Baru
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Sync & Event Logs</h3>
          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">REAL-TIME</span>
        </div>
        <div className="p-4 space-y-2 font-mono text-xs overflow-y-auto max-h-60 bg-slate-900 text-indigo-300 custom-scrollbar">
          <p className="opacity-50">[2024-05-20 10:00:01] Connection established to Core-Router...</p>
          <p className="text-emerald-400">[2024-05-20 10:00:02] API /ppp/secret/print - total 145 records synchronized</p>
          <p className="opacity-50">[2024-05-20 10:00:05] Starting auto-suspend check...</p>
          <p className="text-rose-400">[2024-05-20 10:00:06] SUSPEND: User 'rahmat_biz' disabled on R02 (API SUCCESS)</p>
          <p className="text-yellow-400">[2024-05-20 10:10:12] WARNING: High packet loss on gateway R01 (4.5%)</p>
          <div className="flex items-center space-x-1 animate-pulse">
            <span className="w-1 h-3 bg-indigo-500"></span>
            <span>Listening for gateway events...</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-4 rounded-xl flex items-start space-x-3 transition-colors">
        <AlertTriangle className="text-amber-500 shrink-0" size={20} />
        <div>
          <h5 className="text-sm font-bold text-amber-800 dark:text-amber-500">Kepatuhan Keamanan</h5>
          <p className="text-xs text-amber-700 dark:text-amber-600/70 leading-relaxed">Pastikan sertifikat SSL valid untuk enkripsi API demi mencegah kebocoran kredensial pelanggan di jaringan publik.</p>
        </div>
      </div>
    </div>
  );
};

export default MikrotikConfig;
