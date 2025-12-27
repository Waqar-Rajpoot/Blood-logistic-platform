"use client";
import React, { useState, useEffect, useCallback } from "react";
import { 
  Bell, AlertTriangle, MapPin, Droplet, Phone, Clock, 
  Info, CheckCircle, Loader2, HandHelping, 
  User
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface BloodRequest {
  _id: string;
  patientName: string;
  bloodGroup: string;
  hospitalName: string;
  city: string;
  area: string;
  isUrgent: boolean;
  status: string;
  unitsRequired: number;
  contactNumber: string;
  createdAt: string;
  potentialDonors: string[];
}

export default function DonorAlerts() {
  const [alerts, setAlerts] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [donorId, setDonorId] = useState("");
  const [donorBloodGroup, setDonorBloodGroup] = useState("");

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Get current logged-in donor info
      const userRes = await axios.get("/api/users/me");
      const group = userRes.data.data.bloodGroup;
      const id = userRes.data.data._id;

      // CRITICAL FIX: If group is null/empty, don't proceed to the next call
      if (!group) {
        toast.error("Please update your blood group in profile to see alerts.");
        setLoading(false);
        return;
      }

      setDonorBloodGroup(group);
      setDonorId(id);

      // 2. Fetch matching requests ONLY after we have a valid group
      // Using 'params' object is cleaner than string templates
      const response = await axios.get(`/api/donor/matching-requests`, {
        params: { bloodGroup: group }
      });
      
      setAlerts(response.data.requests || []);
    } catch (error: any) {
      console.error("Fetch error:", error);
      // Only show toast if it's not the initial mount race condition
      if (error.response?.status !== 400) {
        toast.error("Failed to sync live alerts");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleRespond = async (requestId: string) => {
    try {
      const res = await axios.post("/api/donor/respond", { requestId });
      if (res.data.success) {
        toast.success("Interest sent! The receiver can now see your contact.");
        fetchAlerts(); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to respond");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <Bell className="text-red-600 animate-swing" /> Urgent Alerts
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Showing requests for <span className="text-red-600 font-bold px-2 py-0.5 bg-red-50 rounded-lg">{donorBloodGroup || "Detecting..."}</span>
            </p>
          </div>
          <button 
            onClick={fetchAlerts}
            disabled={loading}
            className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <Clock size={20} className={`${loading ? 'animate-spin' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin mb-4 text-red-600" size={40} />
                <p className="font-bold uppercase tracking-widest text-xs">Scanning Live Database...</p>
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((request) => {
              const hasResponded = request.potentialDonors?.includes(donorId);

              return (
                <div 
                  key={request._id} 
                  className={`bg-white rounded-[2.5rem] mb-4 overflow-hidden shadow-sm border-l-[12px] transition-all hover:shadow-md ${
                    request.isUrgent === true ? 'border-red-600' : 'border-orange-500'
                  }`}
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${request.isUrgent === true ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                          <AlertTriangle size={24} />
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900 text-xl leading-tight">{request.hospitalName}</h3>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 uppercase tracking-widest font-black mt-1">
                            <Clock size={12} /> Posted {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`${request.isUrgent === true ? 'bg-red-500 text-white' : 'bg-orange-500 text-orange-600'} text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-red-200`}>
                        {request.bloodGroup}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <User size={20} className="text-red-500" />
                        <span className="font-bold text-sm">{request.patientName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <Phone size={20} className="text-green-500" />
                        {request.contactNumber} 
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <MapPin size={20} className="text-red-500" />
                        <span className="font-bold text-sm">{request.area}, {request.city}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <Droplet size={20} className="text-blue-500" />
                        <span className="font-bold text-sm">{request.unitsRequired} Units Required</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <Clock size={20} className="text-blue-500" />
                        <span className="font-bold text-sm">{request.isUrgent ? 'Urgent' : 'Not Urgent'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <Clock size={20} className="text-blue-500" />
                        <span className="font-bold text-sm">Status: {request.status} </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {hasResponded ? (
                        <div className="flex-1 bg-green-50 text-green-700 py-4 rounded-2xl font-black flex items-center justify-center gap-2 border border-green-100">
                          <CheckCircle size={20} /> You have Responded
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleRespond(request._id)}
                          className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <HandHelping size={20} /> I can Donate
                        </button>
                      )}
                      
                      <a 
                        href={`tel:${request.contactNumber}`}
                        className="flex-1 bg-white border-2 border-gray-100 hover:border-red-200 text-gray-800 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all"
                      >
                        <Phone size={20} className="text-red-600" /> Contact Receiver
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-16 rounded-[3rem] text-center shadow-sm border-2 border-dashed border-gray-200">
              <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-500 w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-gray-800">No Matches Found</h3>
              <p className="text-gray-500 max-w-xs mx-auto mt-2 font-medium">
                There are currently no requests for {donorBloodGroup || "your blood group"}. We will alert you when someone needs your help!
              </p>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="mt-10 bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex gap-4 shadow-sm">
          <div className="bg-blue-500 p-2 rounded-xl text-white h-fit">
            <Info size={20} />
          </div>
          <p className="text-sm text-blue-900 leading-relaxed font-medium">
            <strong>Privacy Note:</strong> Clicking I can Donate will share your contact number and blood group with the family of patient  so they can coordinate.
          </p>
        </div>
      </div>
    </div>
  );
}