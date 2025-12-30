"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  CheckCircle, ArrowRight, Loader2, Microscope, Truck, 
  HeartPulse, User, Calendar, Building2, Activity, ChevronLeft, ChevronRight 
} from "lucide-react";
import toast from "react-hot-toast";

export default function ReceiverJourneyManager() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchIncomingDonations = async () => {
    try {
      const res = await axios.get("/api/donations/receiver-list");
      setDonations(res.data.donations);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncomingDonations(); }, []);

  // 1. DYNAMIC COUNT CALCULATIONS
  const counts = useMemo(() => {
    return {
      All: donations.length,
      Pending: donations.filter((d: any) => !d.journeyStatus || d.journeyStatus === "Donated").length,
      Tested: donations.filter((d: any) => d.journeyStatus === "Tested").length,
      Processed: donations.filter((d: any) => d.journeyStatus === "Processed").length,
      Dispatched: donations.filter((d: any) => d.journeyStatus === "Dispatched").length,
      "Life Saved": donations.filter((d: any) => d.journeyStatus === "Life Saved").length,
    };
  }, [donations]);

  const filteredDonations = useMemo(() => {
    if (activeTab === "All") return donations;
    if (activeTab === "Pending") return donations.filter((d: any) => !d.journeyStatus || d.journeyStatus === "Donated");
    return donations.filter((d: any) => d.journeyStatus === activeTab);
  }, [donations, activeTab]);

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = filteredDonations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const updateStatus = async (id: string, nextStatus: string) => {
    setUpdating(id);
    try {
      await axios.patch("/api/donations/update-journey", { donationId: id, newStatus: nextStatus });
      toast.success(`Moved to ${nextStatus}`);
      await fetchIncomingDonations();
    } catch (err) {
      toast.error(`Failed to move to ${nextStatus}: ${err}`);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-red-600" size={32} /></div>;

  const tabs = [
    { name: "All", count: counts.All },
    { name: "Pending", count: counts.Pending },
    { name: "Tested", count: counts.Tested },
    { name: "Processed", count: counts.Processed },
    { name: "Dispatched", count: counts.Dispatched },
    { name: "Life Saved", count: counts["Life Saved"] },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-4 md:p-8 border border-gray-100 shadow-sm">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Activity size={24} className="text-red-600" /> Donation Pipeline
        </h3>
        
        {/* TAB SYSTEM WITH COUNTS */}
        <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-3xl border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => { setActiveTab(tab.name); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all hover:cursor-pointer ${
                activeTab === tab.name 
                ? "bg-white text-red-600 shadow-md ring-1 ring-gray-100 scale-105" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
              }`}
            >
              {tab.name}
              <span className={`px-2 py-0.5 rounded-lg text-md ${
                activeTab === tab.name ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* DONATION LIST */}
      <div className="space-y-4 min-h-[450px]">
        {paginatedDonations.length > 0 ? (
          paginatedDonations.map((d: any) => (
            <div key={d._id} className="group p-5 bg-gray-50 rounded-[2.5rem] flex flex-col lg:flex-row justify-between gap-6 border border-transparent hover:border-red-100 hover:bg-white hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
              {/* Donor Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="bg-white p-4 rounded-2xl shadow-sm text-red-600 border border-gray-100 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-800 text-lg uppercase tracking-tight italic">
                    {d.donorId?.username || "Donor"}
                  </h4>
                  <p className="text-md text-gray-500 font-medium mb-3">{d.donorId?.email}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      <Calendar size={12} /> {new Date(d.donationDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      <Building2 size={12} /> {d.hospitalName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions Container */}
              <div className="flex flex-col sm:flex-row items-center gap-4 lg:min-w-[300px] justify-end">
                <div className="text-center sm:text-right px-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current State</p>
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter ${
                    d.journeyStatus === 'Life Saved' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {d.journeyStatus || "Donated"}
                  </span>
                </div>

                <div className="w-full sm:w-[180px]">
                  {updating === d._id ? (
                    <div className="flex items-center justify-center gap-2 text-red-600 font-bold text-xs"><Loader2 className="animate-spin" size={16} /></div>
                  ) : (
                    <div className="w-full">
                        {(!d.journeyStatus || d.journeyStatus === "Donated") && (
                          <button onClick={() => updateStatus(d._id, "Tested")} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-xs font-black hover:bg-red-600 transition-all shadow-lg shadow-gray-200">
                            <Microscope size={14} /> MARK TESTED
                          </button>
                        )}
                        {d.journeyStatus === "Tested" && (
                          <button onClick={() => updateStatus(d._id, "Processed")} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-xs font-black hover:bg-purple-600 transition-all shadow-lg shadow-gray-200">
                            <Truck size={14} /> PROCESS UNIT
                          </button>
                        )}
                        {d.journeyStatus === "Processed" && (
                          <button onClick={() => updateStatus(d._id, "Dispatched")} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-xs font-black hover:bg-orange-500 transition-all shadow-lg shadow-gray-200">
                            <ArrowRight size={14} /> DISPATCH
                          </button>
                        )}
                        {d.journeyStatus === "Dispatched" && (
                          <button onClick={() => updateStatus(d._id, "Life Saved")} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black hover:bg-green-600 transition-all shadow-lg shadow-red-200">
                            <HeartPulse size={14} /> COMPLETE
                          </button>
                        )}
                        {d.journeyStatus === "Life Saved" && (
                          <div className="flex items-center justify-center gap-1 text-green-600 font-black text-xs uppercase bg-green-50 py-2.5 rounded-2xl border border-green-100 italic">
                            <CheckCircle size={16} /> Finalized
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300">
            <Activity size={64} className="mb-4 opacity-10" />
            <p className="font-black uppercase tracking-widest text-sm">No Units In {activeTab}</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="group flex items-center gap-2 text-xs font-black text-gray-500 disabled:opacity-20 hover:text-red-600 transition-all"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> PREV
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="group flex items-center gap-2 text-xs font-black text-gray-500 disabled:opacity-20 hover:text-red-600 transition-all"
            >
              NEXT <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}