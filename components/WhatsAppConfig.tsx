
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Settings, 
  Send, 
  Copy, 
  Save, 
  RefreshCcw,
  Smartphone,
  CheckCircle,
  XCircle,
  BrainCircuit,
  Hash,
  Link as LinkIcon
} from 'lucide-react';
import { generateWhatsAppTemplate } from '../services/geminiService';

const WhatsAppConfig: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState('invoice');
  const [templateContent, setTemplateContent] = useState('Halo {{nama}},\n\nTagihan internet Anda periode {{bulan}} sebesar Rp {{jumlah}} telah terbit.\n\nSilakan melakukan pembayaran sebelum {{jatuh_tempo}} melalui link otomatis berikut:\n{{link_pembayaran}}\n\nTerima kasih.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('CONNECTED');

  const templates = [
    { id: 'invoice', label: 'Invoice + Link Bayar', icon: MessageSquare },
    { id: 'reminder', label: 'Reminder Jatuh Tempo', icon: RefreshCcw },
    { id: 'suspend', label: 'Notif Penonaktifan', icon: XCircle },
    { id: 'success', label: 'Pembayaran Berhasil', icon: CheckCircle },
  ];

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    const result = await generateWhatsAppTemplate(activeTemplate, { 
      name: 'Customer', 
      period: 'Mei 2024',
      instruction: 'Sertakan link pembayaran otomatis {{link_pembayaran}}'
    });
    setTemplateContent(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Connection Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center space-x-2">
              <Smartphone size={20} />
              <span>Koneksi WhatsApp</span>
            </h3>
            
            <div className="flex flex-col items-center text-center space-y-4 mb-6">
              <div className="relative">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center ${
                  status === 'CONNECTED' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
                }`}>
                  <MessageSquare size={48} />
                </div>
                {status === 'CONNECTED' && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center text-white">
                    <CheckCircle size={16} />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Meta Cloud API</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Status: Terverifikasi</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Gateway</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">{status}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Uptime</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">99.9%</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Restart Sesi
            </button>
          </div>

          <div className="bg-indigo-600 dark:bg-indigo-800 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="font-bold mb-2 flex items-center space-x-2">
              <Hash size={18} />
              <span>Variabel Pintar</span>
            </h4>
            <div className="space-y-2 text-xs opacity-90">
              <p><code>{"{{nama}}"}</code> : Nama Pelanggan</p>
              <p><code>{"{{jumlah}}"}</code> : Total Tagihan</p>
              <p><code>{"{{link_pembayaran}}"}</code> : Link Bayar</p>
            </div>
          </div>
        </div>

        {/* Right Column: Template Editor */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            {templates.map(t => (
              <button 
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={`px-6 py-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                  activeTemplate === t.id ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900' : 'border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <t.icon size={16} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="p-8 flex-1 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-xs">Editor Template</h4>
              <button 
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <BrainCircuit size={14} className={isGenerating ? 'animate-pulse' : ''} />
                <span>AI Auto-Write</span>
              </button>
            </div>
            
            <textarea 
              className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700 dark:text-slate-200 leading-relaxed shadow-inner transition-colors"
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
            ></textarea>

            <div className="flex items-center justify-between pt-4">
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Copy size={16} />
                  <span>Copy</span>
                </button>
              </div>
              <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-95">
                <Save size={18} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConfig;
