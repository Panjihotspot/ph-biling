
import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Printer,
  AlertCircle,
  Building,
  X,
  FileDown
} from 'lucide-react';
import { Invoice, PaymentStatus, Customer, CompanyConfig } from '../types';

interface BillingProps {
  invoices: Invoice[];
  setInvoices: (i: Invoice[]) => void;
  customers: Customer[];
  handlePayment: (invoiceId: string) => void;
  companyConfig: CompanyConfig;
  onPreviewCheckout: (invoice: Invoice) => void;
}

const BillingModule: React.FC<BillingProps> = ({ invoices, setInvoices, customers, handlePayment, companyConfig, onPreviewCheckout }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const getStatusLabel = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return 'LUNAS';
      case PaymentStatus.UNPAID: return 'BELUM BAYAR';
      case PaymentStatus.OVERDUE: return 'MENUNGGAK';
      default: return status;
    }
  };

  const handleOpenPreview = () => {
    if (!currentSelected) {
      alert("Pilih invoice terlebih dahulu!");
      return;
    }
    setIsPreviewModalOpen(true);
  };

  const generateBulkInvoices = () => {
    const today = new Date();
    const month = today.toLocaleString('id-ID', { month: 'long' });
    const year = today.getFullYear();
    const period = `${month} ${year}`;

    const newInvoices: Invoice[] = customers.map(c => {
      const invId = `INV-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      const dueDate = new Date(year, today.getMonth(), c.billingCycleDay);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      return {
        id: invId,
        customerId: c.id,
        customerName: c.name,
        amount: c.monthlyFee,
        dueDate: dueDateStr,
        status: PaymentStatus.UNPAID,
        period: period,
        createdAt: new Date().toISOString().split('T')[0],
        paymentUrl: `https://checkout.phbiling.com/pay/${invId}`,
        notifications: []
      };
    });
    setInvoices([...invoices, ...newInvoices]);
    alert(`${newInvoices.length} invoice berhasil dibuat.`);
  };

  const currentSelected = invoices.find(inv => inv.id === selectedInvoice?.id);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 overflow-x-hidden">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 no-print">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-800 shadow-sm shrink-0">
            <CreditCard size={28} />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-slate-800 dark:text-slate-100 tracking-tight text-lg sm:text-xl md:text-2xl uppercase">Manajemen Tagihan</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Otomasi Billing & Laporan Laba</p>
          </div>
        </div>
        <button onClick={generateBulkInvoices} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-blue-100 dark:shadow-none active:scale-95">
          <FileText size={18} />
          <span>Generate Massal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 no-print">
        {/* Invoice List - Responsif: List pada mobile, Scrollable List pada Desktop */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 className="font-black text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">Daftar Tagihan Terkini</h3>
              <span className="text-[10px] font-black px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 rounded-lg">{invoices.length} Transaksi</span>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[500px] sm:max-h-[650px] overflow-y-auto custom-scrollbar">
              {invoices.map(inv => (
                <div key={inv.id} onClick={() => setSelectedInvoice(inv)} className={`px-6 sm:px-8 py-5 flex items-center justify-between cursor-pointer transition-all ${selectedInvoice?.id === inv.id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-600' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20 border-l-4 border-transparent'}`}>
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className={`p-2.5 rounded-xl shrink-0 ${inv.status === PaymentStatus.PAID ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`}>
                      {inv.status === PaymentStatus.PAID ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 truncate">{inv.customerName}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-tighter">#{inv.id}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">Rp {inv.amount.toLocaleString()}</p>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter border ${inv.status === PaymentStatus.PAID ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>{getStatusLabel(inv.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel - Responsif: Mengikuti scroll pada Desktop, Sticky di Mobile jika diperlukan */}
        <div className="space-y-6 lg:sticky lg:top-10 h-fit">
          {currentSelected ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col animate-in fade-in slide-in-from-right-4 transition-all duration-300">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Dokumen</h4>
                <div className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border ${currentSelected.status === PaymentStatus.PAID ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800'}`}>
                  {getStatusLabel(currentSelected.status)}
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Nama Pelanggan</p>
                  <p className="font-black text-slate-900 dark:text-slate-100 text-lg leading-tight truncate">{currentSelected.customerName}</p>
                </div>
                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                  <p className="text-[9px] text-blue-400 dark:text-blue-500 font-black uppercase tracking-widest mb-1">Jumlah Bayar</p>
                  <p className="font-black text-blue-600 dark:text-blue-400 text-2xl leading-none">Rp {currentSelected.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-8">
                <button onClick={handleOpenPreview} className="w-full flex items-center justify-center space-x-3 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                  <Printer size={18} />
                  <span>Pratinjau / Cetak</span>
                </button>
                {currentSelected.status !== PaymentStatus.PAID && (
                  <button onClick={() => handlePayment(currentSelected.id)} className="w-full flex items-center justify-center space-x-3 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-100 dark:shadow-none">
                    <CheckCircle size={18} />
                    <span>Konfirmasi Lunas</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 text-center h-64 flex flex-col items-center justify-center">
              <AlertCircle size={32} className="text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[10px]">Pilih tagihan untuk mengelola transaksi</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL INVOICE PREVIEW - Sinkronisasi Full Screen Mobile & Centered Desktop */}
      {isPreviewModalOpen && currentSelected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-0 sm:p-4 no-print overflow-hidden">
          <div className="bg-white rounded-none sm:rounded-[2.5rem] w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header Modal */}
            <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
               <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <FileDown size={20} />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tighter text-xs sm:text-sm">Dokumen Billing</h3>
               </div>
               <div className="flex items-center space-x-3">
                  <button onClick={() => window.print()} className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                    <Printer size={16} />
                    <span className="hidden sm:inline">Cetak PDF</span>
                  </button>
                  <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
                    <X size={24} />
                  </button>
               </div>
            </div>

            {/* Scrollable Area for Invoice */}
            <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-800 p-4 sm:p-10 flex justify-center custom-scrollbar">
               <div className="bg-white w-full max-w-[800px] shadow-2xl p-6 sm:p-12 md:p-16 border border-slate-200 printable-card h-fit text-slate-900 animate-in fade-in slide-in-from-bottom-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start border-b-4 border-slate-900 pb-10 mb-10 gap-8">
                     <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden shrink-0 shadow-inner">
                          {companyConfig.logoUrl ? (
                            <img src={companyConfig.logoUrl} className="w-full h-full object-contain p-2" />
                          ) : (
                            <Building size={40} className="text-blue-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                           <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1 truncate">{companyConfig.name}</h1>
                           <p className="text-[10px] sm:text-xs text-blue-600 font-black uppercase tracking-widest mb-3">{companyConfig.slogan}</p>
                           <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold max-w-[250px] leading-relaxed line-clamp-2">{companyConfig.address}</p>
                        </div>
                     </div>
                     <div className="text-left sm:text-right w-full sm:w-auto">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-widest leading-none">INVOICE</h2>
                        <p className="text-xs sm:text-base font-mono font-black text-slate-400 mt-2">#{currentSelected.id}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Penerima Tagihan:</p>
                        <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2">{currentSelected.customerName}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Internet Fiber - Broadband Home</p>
                     </div>
                     <div className="text-left sm:text-right flex flex-col justify-center space-y-3">
                        <div className="flex justify-between sm:justify-end sm:space-x-10 border-b border-slate-100 pb-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Terbit</span>
                           <span className="text-xs sm:text-sm font-black text-slate-800">{currentSelected.createdAt}</span>
                        </div>
                        <div className="flex justify-between sm:justify-end sm:space-x-10 border-b border-slate-100 pb-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo</span>
                           <span className="text-xs sm:text-sm font-black text-rose-600">{currentSelected.dueDate}</span>
                        </div>
                     </div>
                  </div>

                  <div className="border-t-4 border-slate-900 mb-12 overflow-x-auto no-scrollbar">
                    <table className="w-full min-w-[500px]">
                       <thead>
                          <tr className="bg-slate-50">
                             <th className="px-6 py-5 text-[10px] font-black uppercase text-left tracking-widest">Layanan Internet</th>
                             <th className="px-6 py-5 text-[10px] font-black uppercase text-right tracking-widest">Harga</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y-2 divide-slate-50">
                          <tr>
                             <td className="px-6 py-8">
                                <p className="text-base sm:text-lg font-black text-slate-900">Broadband Internet Unlimited</p>
                                <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-tight">Periode Penagihan: {currentSelected.period}</p>
                             </td>
                             <td className="px-6 py-8 text-right text-sm sm:text-lg font-black text-slate-900">Rp {currentSelected.amount.toLocaleString()}</td>
                          </tr>
                       </tbody>
                       <tfoot>
                          <tr className="border-t-4 border-slate-900 bg-slate-900 text-white">
                             <td className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Total Harus Dibayar</td>
                             <td className="px-6 py-5 text-right text-xl font-black">Rp {currentSelected.amount.toLocaleString()}</td>
                          </tr>
                       </tfoot>
                    </table>
                  </div>

                  <div className="text-center pt-10 border-t-2 border-slate-100 mt-10">
                     <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Sistem Penagihan Otomatis PH BILING - Versi 3.0</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingModule;
