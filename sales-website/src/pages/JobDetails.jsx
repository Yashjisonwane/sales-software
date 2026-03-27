import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  FileText,
  FileEdit,
  Calculator,
  CreditCard,
  CheckCircle,
  Lock,
  Unlock,
  ChevronRight,
  Upload,
  User,
  Phone,
  Settings,
  Clock,
  MapPin,
  Send,
  ArrowRight,
  ClipboardList,
  X,
  Mail,
  AlertCircle,
  Hash,
  ShoppingBag,
  List,
  Plus,
  ArrowLeft,
  PartyPopper
} from 'lucide-react';

const JobDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);

  // Form States (UI only)
  const [invoiceItems, setInvoiceItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [invoiceTax, setInvoiceTax] = useState(0.1);

  const steps = [
    { id: 1, name: 'Schedule Job', icon: <Calendar />, desc: 'Book service slot, customer info, location.' },
    { id: 2, name: 'Documentation', icon: <FileText />, desc: 'Photos, technical notes, materials.' },
    { id: 3, name: 'Inspection', icon: <ClipboardList />, desc: 'Safety, structural, electrical checks.' },
    { id: 4, name: 'Estimate', icon: <FileEdit />, desc: 'Labor, parts breakdown, optional costs.' },
    { id: 5, name: 'Invoice', icon: <CreditCard />, desc: 'Billing, line items, tax, payment.' },
    { id: 6, name: 'Done', icon: <CheckCircle />, desc: 'Final job summary and confirmation.' },
  ];

  useEffect(() => {
    const stepId = parseInt(searchParams.get('step'));
    if (stepId && stepId >= 1 && stepId <= 6) {
      const step = steps.find(s => s.id === stepId);
      if (step) {
        handleStepClick(step);
        const newParams = new URLSearchParams(window.location.search);
        newParams.delete('step');
        setSearchParams(newParams);
      }
    }
  }, [searchParams]);

  const getStepStatus = (id) => {
    if (completedSteps.includes(id)) return 'completed';
    if (id === currentStep) return 'active';
    return 'locked';
  };

  const progressPercentage = ((completedSteps.length) / (steps.length)) * 100;

  const handleStepClick = (step) => {
    const status = getStepStatus(step.id);
    if (status === 'locked') return;

    setSelectedStep(step);
    setShowModal(true);
  };

  const completeStep = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      if (stepId < steps.length) setCurrentStep(stepId + 1);
      if (stepId === 6) {
        setTimeout(() => setShowSuccess(true), 300);
      }
    }
    setShowModal(false);
  };

  const addInvoiceItem = () => setInvoiceItems([...invoiceItems, { desc: '', qty: 1, price: 0 }]);

  const calculateInvoiceTotal = () => {
    const subtotal = invoiceItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const tax = subtotal * invoiceTax;
    return { subtotal, tax, total: subtotal + tax };
  };

  const renderForm = () => {
    switch (selectedStep?.id) {
      case 1:
        return (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); completeStep(1); }}>
            <h3 className="text-lg font-black">Schedule Job</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" className="w-full p-3 border rounded-lg bg-gray-50 text-sm outline-none" placeholder="Customer Name" required />
              <input type="tel" className="w-full p-3 border rounded-lg bg-gray-50 text-sm outline-none" placeholder="Phone Number" required />
              <input type="datetime-local" className="w-full p-3 border rounded-lg bg-gray-50 text-sm outline-none" required />
              <select className="w-full p-3 border rounded-lg bg-gray-50 text-sm outline-none">
                <option>Standard Urgency</option>
                <option>Emergency (2-4 hrs)</option>
                <option>Same Day</option>
              </select>
              <input type="text" className="w-full p-3 border rounded-lg bg-gray-50 text-sm outline-none col-span-2" placeholder="Job Location / Address" required />
              <select className="w-full p-3 border rounded-lg bg-gray-50 text-sm outline-none col-span-2">
                <option value="">Select Job Role</option>
                <option>Plumber</option>
                <option>Electrician</option>
                <option>Cleaning</option>
                <option>Painting</option>
                <option>HVAC / AC Repair</option>
                <option>Wall Covering</option>
                <option>Flooring</option>
                <option>General Maintenance</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-black text-white p-3 rounded-xl font-bold mt-4 text-sm">Save & Continue</button>
          </form>
        );
      case 2:
        return (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); completeStep(2); }}>
            <h3 className="text-lg font-black">Documentation</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 text-center">
                <Upload className="text-gray-400 mb-1" size={18} />
                <p className="text-[10px] text-gray-400 font-bold uppercase">Before Photos</p>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 text-center">
                <Upload className="text-gray-400 mb-1" size={18} />
                <p className="text-[10px] text-gray-400 font-bold uppercase">After Photos (Optional)</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Materials Used</label>
              <textarea className="w-full p-3 border rounded-lg bg-gray-50 text-sm min-h-[60px]" placeholder="List parts, model numbers..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Technical Notes</label>
              <textarea className="w-full p-3 border rounded-lg bg-gray-50 text-sm min-h-[80px]" placeholder="Detailed work description..."></textarea>
            </div>
            <button type="submit" className="w-full bg-black text-white p-3 rounded-xl font-bold text-sm">Update Documentation</button>
          </form>
        );
      case 3:
        return (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); completeStep(3); }}>
            <h3 className="text-lg font-black">Inspection</h3>
            <div className="space-y-2">
              {[
                { label: 'Safety Protocols Verified', cat: 'Safety' },
                { label: 'Electrical Wiring Checked', cat: 'Technical' },
                { label: 'Structural Integrity Verified', cat: 'Maintenance' },
                { label: 'Leakage / Water Check done', cat: 'Plumbing' },
                { label: 'Tools and Area Cleaned', cat: 'Closing' }
              ].map((item, i) => (
                <label key={i} className="flex items-center p-3 border rounded-lg bg-gray-50 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="checkbox" className="mr-3 w-4 h-4 rounded" />
                  <div className="flex flex-col">
                    <span className="font-bold text-xs">{item.label}</span>
                    <span className="text-[10px] text-gray-400 uppercase">{item.cat}</span>
                  </div>
                </label>
              ))}
            </div>
            <textarea className="w-full p-3 border rounded-lg bg-gray-50 text-sm min-h-[60px]" placeholder="Specific remarks or issues..."></textarea>
            <button type="submit" className="w-full bg-black text-white p-3 rounded-xl font-bold text-sm">Confirm Inspection</button>
          </form>
        );
      case 4:
        return (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); completeStep(4); }}>
            <h3 className="text-lg font-black">Estimate</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Labor Cost ($)</label>
                <input type="number" className="w-full p-3 border rounded-lg bg-gray-50 text-sm" placeholder="0.00" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Parts & Replacements ($)</label>
                <input type="number" className="w-full p-3 border rounded-lg bg-gray-50 text-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Discount (%)</label>
                <input type="number" className="w-full p-3 border rounded-lg bg-gray-50 text-sm" placeholder="0" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Estimated Total ($)</label>
                <div className="w-full p-3 border rounded-lg bg-green-50 text-sm font-bold text-green-700">$0.00</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button type="button" onClick={() => completeStep(4)} className="p-3 border rounded-xl font-bold text-xs uppercase text-gray-400">Skip Step</button>
              <button type="submit" className="bg-black text-white p-3 rounded-xl font-bold text-sm">Save Estimate</button>
            </div>
          </form>
        );
      case 5:
        const { subtotal, tax, total } = calculateInvoiceTotal();
        return (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); completeStep(5); }}>
            <h3 className="text-lg font-black">Invoice Details</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Line Items</label>
              {invoiceItems.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input type="text" className="flex-1 p-2 border rounded bg-gray-50 text-xs" placeholder="Description"
                    value={item.desc} onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[idx].desc = e.target.value;
                      setInvoiceItems(newItems);
                    }}
                  />
                  <input type="number" className="w-16 p-2 border rounded bg-gray-50 text-xs" placeholder="Qty"
                    value={item.qty} onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[idx].qty = Number(e.target.value);
                      setInvoiceItems(newItems);
                    }}
                  />
                  <input type="number" className="w-20 p-2 border rounded bg-gray-50 text-xs" placeholder="$"
                    value={item.price} onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[idx].price = Number(e.target.value);
                      setInvoiceItems(newItems);
                    }}
                  />
                </div>
              ))}
              <button type="button" onClick={addInvoiceItem} className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1 mt-1">
                <Plus size={12} /> Add Item
              </button>
            </div>

            <div className="p-3 bg-gray-50 border rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-gray-500"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax (10%):</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-black border-t pt-1 mt-1"><span>Total Payable:</span><span>${total.toFixed(2)}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button type="button" className="p-3 border rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                <Send size={14} /> Send Email
              </button>
              <button type="submit" className="bg-black text-white p-3 rounded-xl font-bold text-sm">Mark as Paid</button>
            </div>
          </form>
        );
      case 6:
        return (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-xl font-black mb-1 text-black">Job Completed!</h3>
            <p className="text-gray-400 text-xs mb-6 font-medium">Work order #84920 has been finalized and reported.</p>
            <button onClick={() => completeStep(6)} className="w-full bg-black text-white p-4 rounded-xl font-bold text-sm hover:bg-gray-900 shadow-lg transition-transform active:scale-[0.98]">Finish & Close</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Header with Top Coverage */}
      <div className="border-b bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group">
                <ArrowLeft size={16} className="text-gray-400 group-hover:text-black" />
              </Link>
              <div>
                <h1 className="text-sm font-black leading-none">Job Flow Control</h1>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Order ID: #84920</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded tracking-tighter shrink-0">{Math.round(progressPercentage)}% DONE</span>
            </div>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-black mb-1">Process Steps</h2>
          <p className="text-xs text-gray-400 font-medium">Complete tools to finalize order.</p>
        </div>

        {/* Tight Vertical List */}
        <div className="flex flex-col gap-2">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <div key={step.id} onClick={() => handleStepClick(step)}
                className={`
                  flex items-center p-4 rounded-xl border transition-all duration-200
                  ${status === 'locked' ? 'bg-gray-50/50 opacity-40 border-gray-100 grayscale pointer-events-none' : 'bg-white border-gray-100 cursor-pointer hover:border-black active:scale-[0.99]'}
                  ${status === 'active' ? 'border-2 border-black bg-white shadow-sm' : ''}
                  ${status === 'completed' ? 'bg-white border-green-50' : ''}
                `}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 
                  ${status === 'completed' ? 'bg-green-100 text-green-600' : (status === 'active' ? 'bg-black text-white' : 'bg-gray-100 text-gray-300')}
                `}>
                  {status === 'completed' ? <CheckCircle size={20} /> : React.cloneElement(step.icon, { size: 20 })}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-bold ${status === 'locked' ? 'text-gray-300' : 'text-gray-900'}`}>{step.name}</h3>
                  <p className="text-[10px] text-gray-400 line-clamp-1 font-medium italic">{step.desc}</p>
                </div>
                <div className="ml-2">
                  {status === 'locked' ? <Lock size={16} className="text-gray-200" /> : <ChevronRight size={18} className="text-gray-300" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Form Modal - Top Layer */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-slide-up my-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-300 hover:text-black transition-colors p-1"><X size={20} /></button>
            <div className="p-1">
              {renderForm()}
            </div>
          </div>
        </div>
      )}
      {/* Celebration / Final Success Pop-up */}
      {showSuccess && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-center">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-slide-up">
            <div className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-12">
              <PartyPopper size={40} />
            </div>
            <h2 className="text-2xl font-black mb-1 text-black">Job Finished!</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Order #84920 is 100% complete</p>
            <Link to="/" className="w-full bg-black text-white p-4 rounded-xl font-bold text-sm tracking-wide hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
              BACK TO HOME <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
