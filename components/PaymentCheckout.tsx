
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  ChevronRight, 
  Building, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Info
} from 'lucide-react';
import { Invoice, CompanyConfig } from '../types';

interface PaymentCheckoutProps {
  invoice: Invoice;
  companyConfig: CompanyConfig;
  onClose: () => void;
  onPaid: (id: string) => void;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ invoice, companyConfig, onClose, onPaid }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePay = () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onPaid(invoice.id);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Pembayaran Berhasil!</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">Terima kasih atas pembayaran Anda. Layanan internet Anda akan otomatis diperpanjang.</p>
        
        <div className="w-full max-w-sm bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
           <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase mb-4">
              <span>Detail Transaksi</span>
              <span>#{invoice.id}</span>
           </div>
           <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Total Bayar</span>
                <span className="text-sm font-black text-slate-800">Rp {invoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Metode</span>
                <span className="text-sm font-black text-slate-800 uppercase">{selectedMethod}</span>
              </div>
           </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full max-w-xs py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
        >
          Tutup Halaman
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Checkout Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center space-x-2">
          {companyConfig.logoUrl ? (
             <img src={companyConfig.logoUrl} className="w-8 h-8 object-contain" alt="Logo" />
          ) : (
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                {companyConfig.name.substring(0, 2)}
             </div>
          )}
          <span className="font-black text-slate-800 uppercase tracking-tighter">{companyConfig.name}</span>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-6 space-y-6">
        {/* Invoice Summary */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-white text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
                <Clock size={12} />
                <span>{formatTime(timeLeft)}</span>
              </div>
           </div>
           
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Tagihan Anda</p>
           <h1 className="text-4xl font-black text-slate-900 mb-6">Rp {invoice.amount.toLocaleString()}</h1>
           
           <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">ID Tagihan</p>
                <p className="text-xs font-black text-slate-700">{invoice.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Periode</p>
                <p className="text-xs font-black text-slate-700">{invoice.period}</p>
              </div>
           </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Metode Pembayaran</h3>
          
          {/* E-Wallets */}
          <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
             <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center space-x-2">
                <Wallet size={16} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">E-Wallet & QRIS</span>
             </div>
             <div className="divide-y divide-slate-50">
                <PaymentOption 
                  id="qris" 
                  label="QRIS (Gopay, OVO, Dana, LinkAja)" 
                  icon={<Smartphone className="text-blue-500" size={20} />} 
                  selected={selectedMethod === 'qris'} 
                  onSelect={setSelectedMethod}
                />
                <PaymentOption 
                  id="gopay" 
                  label="GoPay" 
                  icon={<div className="w-5 h-5 bg-blue-100 rounded-full"></div>} 
                  selected={selectedMethod === 'gopay'} 
                  onSelect={setSelectedMethod}
                />
             </div>
          </div>

          {/* Virtual Accounts */}
          <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
             <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center space-x-2">
                <Building size={16} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Virtual Account (Verifikasi Otomatis)</span>
             </div>
             <div className="divide-y divide-slate-50">
                <PaymentOption 
                  id="va-bca" 
                  label="BCA Virtual Account" 
                  icon={<div className="w-5 h-5 bg-blue-600 rounded-md"></div>} 
                  selected={selectedMethod === 'va-bca'} 
                  onSelect={setSelectedMethod}
                />
                <PaymentOption 
                  id="va-mandiri" 
                  label="Mandiri Virtual Account" 
                  icon={<div className="w-5 h-5 bg-amber-400 rounded-md"></div>} 
                  selected={selectedMethod === 'va-mandiri'} 
                  onSelect={setSelectedMethod}
                />
                <PaymentOption 
                  id="va-bni" 
                  label="BNI Virtual Account" 
                  icon={<div className="w-5 h-5 bg-orange-600 rounded-md"></div>} 
                  selected={selectedMethod === 'va-bni'} 
                  onSelect={setSelectedMethod}
                />
             </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start space-x-3">
          <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700 leading-relaxed font-medium">Pembayaran akan diverifikasi secara otomatis dalam 1-5 menit setelah dana diterima oleh sistem.</p>
        </div>
      </main>

      {/* Sticky Bottom Button */}
      <footer className="bg-white p-6 border-t border-slate-100 sticky bottom-0">
         <button 
           disabled={!selectedMethod || isProcessing}
           onClick={handlePay}
           className={`w-full py-4 rounded-[1.4rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-3 ${
             !selectedMethod ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
           }`}
         >
           {isProcessing ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
           ) : (
             <>
               <ShieldCheck size={18} />
               <span>Bayar Sekarang</span>
             </>
           )}
         </button>
      </footer>
    </div>
  );
};

const PaymentOption = ({ id, label, icon, selected, onSelect }: any) => (
  <button 
    onClick={() => onSelect(id)}
    className={`w-full px-6 py-5 flex items-center justify-between transition-all ${selected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
  >
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
         {icon}
      </div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
      selected ? 'border-blue-600 bg-blue-600' : 'border-slate-200'
    }`}>
      {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
    </div>
  </button>
);

export default PaymentCheckout;
