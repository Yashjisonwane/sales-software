import { X, Printer, Download, ShoppingBag, Calendar, CheckCircle, Clock, ShieldCheck, Zap } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, invoice }) => {
    if (!isOpen || !invoice) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-700"
                onClick={onClose}
            />

            {/* Modal Content - High-Fidelity Invoice */}
            <div className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-3xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 border border-white">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-[600px] bg-slate-50/50 -translate-y-1/2 rounded-full blur-[100px] -z-10" />

                <div className="flex flex-col h-full max-h-[95vh] overflow-hidden">
                    {/* Sticky Header */}
                    <div className="flex items-center justify-between p-10 border-b border-slate-50 bg-white/50 backdrop-blur-md">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary-600 text-white rounded-[1.5rem] shadow-2xl shadow-primary-200">
                                <ShoppingBag size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Settlement <span className="text-primary-600">Vault</span></h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Official Digital Transaction Certificate</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-4 bg-white border border-slate-100 hover:bg-slate-50 text-slate-500 rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-200/50">
                                <Printer size={20} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-4 bg-white border border-slate-100 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-200/50"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 lg:p-14 custom-scrollbar">
                        <div className="space-y-14">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                                <div className="space-y-8 max-w-sm">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={18} className="text-emerald-500" />
                                        <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            Account {invoice.status === 'Paid' ? 'Synchronized' : 'Pending Calibration'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Invoice <span className="text-slate-300">#{invoice.id}</span></h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Distribution Date: {invoice.date}</p>
                                    </div>
                                </div>

                                <div className="text-right p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-3xl shadow-slate-900/20 relative overflow-hidden group min-w-[300px]">
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Aggregate Valuation</p>
                                        <h4 className="text-5xl font-black text-white tracking-tighter italic">${invoice.amount.toLocaleString()}</h4>
                                        <div className="mt-6 flex items-center justify-end gap-3 text-primary-400">
                                            <Zap size={14} className="animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">Verified Settlement Matrix</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl -translate-y-10 translate-x-10" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-12 border-y border-slate-100 relative">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-6">Strategic Debtor</p>
                                    <h4 className="font-black text-slate-900 text-xl uppercase tracking-tight">Globex Integration Solutions</h4>
                                    <p className="text-slate-500 font-bold leading-relaxed mt-4 uppercase text-[10px] tracking-[0.2em]">
                                        Strategic Operations Node<br />
                                        123 Quantum Blvd, Suite 400<br />
                                        Silicon Matrix, CA 94025
                                    </p>
                                </div>
                                <div className="flex flex-col justify-end">
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 italic font-black">ID</div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Transaction Entity</p>
                                            <p className="text-xs font-black text-slate-900 uppercase">USR-8829-MOD-K</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">Allocation Breakdown</h4>
                                <div className="bg-slate-50 rounded-[2.5rem] p-10 lg:p-12 relative overflow-hidden border border-slate-100 group">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="pb-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Description Vector</th>
                                                <th className="pb-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-right">Unit Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200/50">
                                            <tr>
                                                <td className="py-10">
                                                    <h5 className="font-black text-slate-900 text-lg uppercase tracking-tight">Hyper-Scale Operations Tier</h5>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 max-w-sm leading-relaxed">Global access protocols, multi-layer node synchronization, and priority intelligence bandwidth.</p>
                                                </td>
                                                <td className="py-10 text-right">
                                                    <span className="font-black text-slate-900 text-2xl tracking-tighter italic">${invoice.amount.toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t-[3px] border-slate-900">
                                                <td className="pt-10 font-black text-slate-900 uppercase tracking-[0.4em] text-xs">Gross Aggregate</td>
                                                <td className="pt-10 text-right">
                                                    <div className="text-4xl font-black text-slate-900 tracking-tighter italic">${invoice.amount.toLocaleString()}</div>
                                                    <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest mt-2">All system taxes included</p>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-[80px] -z-10 group-hover:scale-125 transition-transform duration-1000" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-10 lg:p-12 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-10">
                        <div className="flex items-center space-x-4 text-slate-400">
                            <Calendar size={20} className="text-primary-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Dossier active since {invoice.date}</span>
                        </div>
                        <button className="w-full sm:w-auto flex items-center justify-center space-x-4 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[12px] transition-all shadow-3xl shadow-primary-900/20">
                            <Download size={22} />
                            <span>Export Dossier (PDF)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
