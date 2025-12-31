"use client";
import React, { useState, } from "react";
import { 
  PlusCircle, Droplet, User, Phone, 
  AlertCircle, Hospital, Send, Map as MapIcon 
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import MapPicker to prevent SSR issues with Leaflet
const MapPicker = dynamic(() => import("@/components/MapPicker"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">Initialising Map...</div>
});

export default function RequestBloodPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    unitsRequired: 1,
    hospitalName: "",
    city: "",
    area: "",
    contactNumber: "",
    isUrgent: true,
    latitude: 30.66,
    longitude: 73.10,
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        ...formData,
        location: {
          type: "Point",
          coordinates: [formData.longitude, formData.latitude]
        }
      };
      
      const response = await axios.post("/api/urgent-request", payload);
      
      if (response.data.success) {
        toast.success(`Priority alert broadcasted to nearby donors!`);
        router.push("/receiver/my-requests");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to broadcast request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-t-[2.5rem] border-b border-gray-100 flex items-center gap-4">
          <div className="bg-red-50 p-4 rounded-2xl text-red-600">
            <PlusCircle size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create Emergency Request</h1>
            <p className="text-gray-500 text-sm font-medium italic">Your blood will be needed urgently</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-[2.5rem] shadow-xl shadow-gray-200/50 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left side: Form Inputs */}
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} /> Patient Name
                </label>
                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Ali Khan" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Droplet size={14} className="text-red-600" /> Group
                  </label>
                  <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none appearance-none" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option value="">Select</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">Units</label>
                  <input type="number" min="1" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" value={formData.unitsRequired} onChange={(e) => setFormData({...formData, unitsRequired: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Hospital size={14} /> Hospital Name
                </label>
                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" placeholder="e.g. DHQ Hospital" value={formData.hospitalName} onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} /> Contact
                </label>
                <input type="tel" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" placeholder="+92..." value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} />
              </div>
            </div>

            {/* Right side: Map Picker */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <MapIcon size={14} className="text-red-600" /> Pin Exact Location
              </label>
              
              <div className="rounded-3xl overflow-hidden border-4 border-gray-50 shadow-inner">
                 <MapPicker 
                   onLocationSelect={handleLocationSelect} 
                   defaultLocation={{lat: formData.latitude, lng: formData.longitude}} 
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <input required placeholder="Area" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} />
              </div>

              <div className="p-4 bg-red-100 rounded-2xl border border-red-100">
                <p className="text-[10px] text-red-600 font-bold leading-tight uppercase tracking-tighter flex items-center gap-2">
                  <AlertCircle size={14} /> This is an emergency request. Nearby donors will be notified immediately to help save lives.
                </p>
              </div>
            </div>

          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-[2rem] font-black text-white flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] shadow-2xl ${
              loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-200 active:scale-[0.98]'
            }`}
          >
            {loading ? "Notifying Nearby Donors..." : <><Send size={20} /> Launch Emergency Alert</>}
          </button>
        </form>
      </div>
    </div>
  );
}