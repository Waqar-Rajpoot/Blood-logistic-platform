"use client";
import React, { useState } from "react";
import { 
  PlusCircle, 
  MapPin, 
  Droplet, 
  User, 
  Phone, 
  AlertCircle, 
  Hospital,
  Send
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
    isUrgent: false,
    additionalNotes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Logic to save the request to MongoDB and trigger notifications
      await axios.post("/api/requests/create", formData);
      toast.success("Blood request posted successfully! Alerts sent to donors.");
      router.push("/receiver/my-requests");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white p-8 rounded-t-3xl border-b border-gray-100 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-2xl text-red-600">
            <PlusCircle size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create Blood Request</h1>
            <p className="text-gray-500 text-sm">Fill in the details to notify matching donors immediately.</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-3xl shadow-sm space-y-6">
          
          {/* Urgency Toggle */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${formData.isUrgent ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className={formData.isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-400'} />
                <div>
                  <h3 className={`font-bold ${formData.isUrgent ? 'text-red-700' : 'text-gray-700'}`}>Urgent Emergency Flag</h3>
                  <p className="text-xs text-gray-500">Enable this to prioritize your request in donor feeds.</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="w-6 h-6 accent-red-600 cursor-pointer"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <User size={16} /> Patient Name
              </label>
              <input 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black"
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Droplet size={16} className="text-red-600" /> Required Blood Group
              </label>
              <select 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
              >
                <option value="">Select Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Units & Contact */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Units Required (Bags)</label>
              <input 
                type="number" min="1" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
                value={formData.unitsRequired}
                onChange={(e) => setFormData({...formData, unitsRequired: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Phone size={16} /> Contact Number
              </label>
              <input 
                type="tel" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
                placeholder="+92 XXX XXXXXXX"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              />
            </div>
          </div>

          {/* Hospital & Location */}
          <div className="space-y-1 pt-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Hospital size={16} /> Hospital Name & Address
            </label>
            <input 
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
              placeholder="e.g. Mayo Hospital, Hall Road"
              value={formData.hospitalName}
              onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <MapPin size={16} /> City
              </label>
              <input 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <MapPin size={16} /> Area
              </label>
              <input 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
              loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 active:scale-95'
            }`}
          >
            {loading ? "Sending Alerts..." : <><Send size={20} /> Post Blood Request</>}
          </button>
        </form>
      </div>
    </div>
  );
}