import React from "react";
import { X, AlertCircle, Droplets, User, Building2, MapPin, Navigation, Phone, Send, Loader2 } from "lucide-react";
import { InputGroup } from "../ui/InputGroup";

export const RequestModal = ({ isOpen, onClose, onSubmit, requestData, setRequestData, loading, selectedCount, bloodGroup }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] p-5 sm:p-7 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl"><AlertCircle size={20} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Request Details</h2>
              <div className="flex items-center gap-1 text-red-600 text-[9px] font-bold uppercase">
                <Droplets size={10} /> {bloodGroup} Emergency
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 overflow-y-auto pr-1 pb-4 scrollbar-hide">
          <InputGroup
            label="Patient Name"
            icon={User}
            required
            type="text"
            placeholder="e.g. John Doe"
            value={requestData.patientName}
            onChange={(e: any) => setRequestData({ ...requestData, patientName: e.target.value })}
          />
          <InputGroup
            label="Hospital & Ward"
            icon={Building2}
            required
            type="text"
            placeholder="City Hospital, Ward 5"
            value={requestData.hospitalName}
            onChange={(e: any) => setRequestData({ ...requestData, hospitalName: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <InputGroup
              label="City"
              icon={MapPin}
              required
              type="text"
              placeholder="City Name"
              value={requestData.city}
              onChange={(e: any) => setRequestData({ ...requestData, city: e.target.value })}
            />
            <InputGroup
              label="Area"
              icon={Navigation}
              required
              type="text"
              placeholder="Sector/Block"
              value={requestData.area}
              onChange={(e: any) => setRequestData({ ...requestData, area: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputGroup
              label="Units Needed"
              icon={Droplets}
              required
              type="number"
              min="1"
              max="10"
              value={requestData.unitsRequired}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  setRequestData({ ...requestData, unitsRequired: Math.min(Math.max(val, 1), 10) });
                } else if (e.target.value === "") {
                  setRequestData({ ...requestData, unitsRequired: "" as any });
                }
              }}
            />
            <InputGroup
              label="Contact Phone"
              icon={Phone}
              required
              type="tel"
              placeholder="03XXXXXXXXX"
              value={requestData.contactNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const sanitized = e.target.value.replace(/\D/g, "");
                setRequestData({ ...requestData, contactNumber: sanitized });
              }}
            />
          </div>
          <div className="pt-2 sticky bottom-0 bg-white">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Blast Alert to {selectedCount} Donors</>}
            </button>
            <p className="text-center text-slate-400 text-[8px] font-bold uppercase mt-3 tracking-widest">Immediate Notification System</p>
          </div>
        </form>
      </div>
    </div>
  );
};