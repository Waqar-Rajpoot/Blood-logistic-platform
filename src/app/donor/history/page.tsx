"use client";
import React, { useState, useEffect } from "react";
import { 
  History, Calendar, MapPin, Award,
  Droplets, CheckCircle, Loader2
} from "lucide-react";
import axios from "axios";

interface DonationRecord {
  _id: string;
  date: string;
  location: string;
  recipientName: string;
  status: string;
  units: number;
  city: string;
}

export default function DonationHistory() {
  const [history, setHistory] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/donor/history");
        setHistory(response.data.history);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <History className="text-red-600" /> Donation History
            </h1>
            <p className="text-gray-500 mt-1 font-medium">A timeline of your life-saving contributions.</p>
          </div>
          <div className="bg-gray-900 text-white px-8 py-4 rounded-[2rem] shadow-xl flex items-center gap-4 border border-white/10">
            <Award size={28} className="text-yellow-400" />
            <div>
              <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Total Impact</p>
              <p className="text-2xl font-black">{history.length} Contributions</p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin mb-4 text-red-600" size={40} />
                <p className="font-bold uppercase tracking-widest text-xs">Retrieving Records...</p>
            </div>
          ) : history.length > 0 ? (
            history.map((record) => (
              <div 
                key={record._id} 
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-all group border-b-4 border-b-green-500"
              >
                <div className="flex items-center gap-6 w-full">
                  <div className="bg-red-50 p-5 rounded-3xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                    <Droplets size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-gray-800 text-xl">{record.location}</h3>
                      <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> {record.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                      <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                        <Calendar size={16} className="text-red-400" /> 
                        {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                        <MapPin size={16} className="text-red-400" /> {record.recipientName} ({record.city})
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</p>
                    <p className="text-lg font-black text-red-600">{record.units} Units</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-16 rounded-[3rem] text-center shadow-sm border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="text-gray-300 w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-gray-800">Your Journey Starts Here</h3>
              <p className="text-gray-500 max-w-sm mx-auto mt-3 font-medium">
                You have not made any donations through the platform yet. When you save a life, your contribution will be honored here.
              </p>
              <button 
                onClick={() => window.location.href = "/donor/alerts"}
                className="mt-8 bg-red-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100"
              >
                View Urgent Alerts →
              </button>
            </div>
          )}
        </div>

        {/* Health Note */}
        <div className="mt-12 bg-gray-900 p-8 rounded-[2.5rem] text-white flex gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Droplets size={120} />
          </div>
          <Award className="text-yellow-400 shrink-0" size={32} />
          <p className="text-sm text-gray-300 leading-relaxed relative z-10">
            <strong className="text-white">Did you know?</strong> A single blood donation can save up to three lives. To maintain your health, we recommend waiting at least <span className="text-yellow-400 font-bold">56 to 90 days</span> before your next donation.
          </p>
        </div>
      </div>
    </div>
  );
}