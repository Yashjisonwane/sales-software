import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
    Search, 
    CheckCircle, 
    XCircle, 
    Mail, 
    Phone, 
    MapPin, 
    Briefcase, 
    User, 
    Calendar,
    Zap,
    ShieldAlert,
    X,
    FileText,
    Copy,
    Check
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminProfessionalRequests = () => {
    const { 
        professionalRequests, 
        approveProfessionalRequest, 
        rejectProfessionalRequest 
    } = useMarketplace();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [approvalDetails, setApprovalDetails] = useState(null); // To store {user, generatedPassword}
    const [copied, setCopied] = useState(false);

    const filtered = professionalRequests.filter(req => {
        const matchSearch = (req.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (req.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (req.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'All' || req.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleApprove = async () => {
        if (!selectedRequest) return;
        const res = await approveProfessionalRequest(selectedRequest.id);
        if (res) {
            setApprovalDetails(res);
            setIsApproveOpen(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        await rejectProfessionalRequest(selectedRequest.id);
        setIsRejectOpen(false);
        setSelectedRequest(null);
    };

    const copyPassword = () => {
        if (approvalDetails?.generatedPassword) {
            navigator.clipboard.writeText(approvalDetails.generatedPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Professional Requests</h1>
                <p className="text-sm text-gray-500 mt-1">Review and approve new service provider applications from the website.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, business, or email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2">
                    {['PENDING', 'APPROVED', 'REJECTED', 'All'].map(s => (
                        <button 
                            key={s} 
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                statusFilter === s 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            {s === 'All' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Request Cards/Table */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filtered.map(req => (
                    <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                                        {req.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{req.name}</h3>
                                        <p className="text-xs text-info-600 font-bold uppercase tracking-wider">{req.businessName}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                    req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {req.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="text-gray-600 truncate">{req.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="text-gray-600">{req.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Briefcase size={16} className="text-gray-400" />
                                    <span className="text-gray-600 font-bold">{req.category}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Zap size={16} className="text-gray-400" />
                                    <span className="text-purple-600 font-bold">{req.preferredPlan} Plan</span>
                                </div>
                                <div className="col-span-2 flex items-start gap-3 text-sm">
                                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                    <span className="text-gray-600 leading-tight">
                                        {req.address}, {req.city}, {req.state} - {req.pincode}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <Calendar size={12} />
                                Applied on {new Date(req.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        {req.status === 'PENDING' && (
                            <div className="bg-gray-50 p-4 flex gap-3">
                                <button 
                                    onClick={() => { setSelectedRequest(req); setIsApproveOpen(true); }}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                                >
                                    <CheckCircle size={16} /> Approve Application
                                </button>
                                <button 
                                    onClick={() => { setSelectedRequest(req); setIsRejectOpen(true); }}
                                    className="px-4 py-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <FileText size={48} className="mx-auto mb-4 text-gray-200" />
                        <p className="font-bold text-gray-500 text-lg">No matching requests found</p>
                        <p className="text-sm text-gray-400">Applications from the website will appear here for your review.</p>
                    </div>
                )}
            </div>

            {/* Success Modal with Credentials */}
            {approvalDetails && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
                        <div className="bg-green-600 p-8 text-center text-white relative">
                            <div className="absolute top-0 right-0 p-4">
                                <button onClick={() => setApprovalDetails(null)} className="text-white/50 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <CheckCircle size={32} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Professional Approved!</h2>
                            <p className="text-green-100 text-sm font-medium mt-1">An account has been provisioned.</p>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Account Email</label>
                                    <p className="font-bold text-gray-900">{approvalDetails.user.email}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 relative group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1 block">Generated Password</label>
                                    <p className="font-black text-blue-700 text-xl tracking-wider font-mono">
                                        {approvalDetails.generatedPassword}
                                    </p>
                                    <button 
                                        onClick={copyPassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white text-blue-600 shadow-md rounded-xl hover:scale-110 transition-all active:scale-95"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                                <ShieldAlert size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-700 leading-relaxed font-bold">
                                    IMPORTANT: Please provide these credentials to <span className="text-yellow-800">{approvalDetails.user.name}</span>. For security, we do not store the plain-text password.
                                </p>
                            </div>

                            <button 
                                onClick={() => setApprovalDetails(null)}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black transition-all hover:bg-black active:scale-95 shadow-xl shadow-gray-200"
                            >
                                Done & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isApproveOpen}
                onClose={() => setIsApproveOpen(false)}
                onConfirm={handleApprove}
                title="Approve Professional"
                message={`Are you sure you want to approve ${selectedRequest?.name}? This will create a worker account and generate a login password.`}
                confirmText="Approve & Generate Password"
                icon={CheckCircle}
                type="success"
            />

            <ConfirmationModal
                isOpen={isRejectOpen}
                onClose={() => setIsRejectOpen(false)}
                onConfirm={handleReject}
                title="Reject Request"
                message={`Are you sure you want to reject the application from ${selectedRequest?.name}?`}
                confirmText="Reject Application"
                icon={XCircle}
                type="danger"
            />
        </div>
    );
};

export default AdminProfessionalRequests;
