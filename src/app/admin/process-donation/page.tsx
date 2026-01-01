"use client";
import React, { useState } from "react";
import { Search, PackagePlus, Loader2, CheckCircle, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminDonationManager() {
  const [tokenSearch, setTokenSearch] = useState("");
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const searchToken = async () => {
    if (!tokenSearch) return;
    try {
      setLoading(true);
      // Endpoint to find the volunteer request by token
      const res = await axios.get(`/api/admin/volunteer/find?token=${tokenSearch}`);
      setRecord(res.data.data);
    } catch (error: any) {
      toast.error(`Token not found or already processed ${error}`);
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDonation = async () => {
    try {
      setProcessing(true);
      const res = await axios.patch("/api/admin/volunteer/confirm", {
        volunteerId: record._id,
        adminNote: "Donation verified and added to stock."
      });

      if (res.data.success) {
        toast.success("Inventory Updated!");
        setRecord(null);
        setTokenSearch("");
      }
    } catch (error: any) {
      toast.error(`Failed to update inventory: ${error}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
          <PackagePlus className="text-emerald-600" /> Donation Processing
        </h1>

        {/* Search Bar */}
        <div className="flex gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Enter Token (e.g. VOL-ABCD)"
              value={tokenSearch}
              onChange={(e) => setTokenSearch(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-emerald-500 font-bold"
            />
          </div>
          <button 
            onClick={searchToken}
            disabled={loading}
            className="bg-gray-900 text-white px-8 rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify Token"}
          </button>
        </div>

        {/* Record Card */}
        {record && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-emerald-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-2xl">
                  {record.bloodGroup}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Verified Volunteer</h3>
                  <p className="text-gray-400 text-sm font-medium">Token: {record.token}</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase">
                {record.status}
              </span>
            </div>

            {/* Donor Name Section */}
            <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-6">
               <User size={20} className="text-emerald-600" />
               <p className="text-lg font-black text-gray-700">
                 Donor: {record.donorId?.username || "Anonymous"}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Donor HB Level</p>
                <p className="text-lg font-black text-gray-700">{record.hbLevel || "Not Provided"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Preferred Date</p>
                <p className="text-lg font-black text-gray-700">
                  {new Date(record.preferredDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button 
              onClick={handleCompleteDonation}
              disabled={processing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all"
            >
              {processing ? <Loader2 className="animate-spin" /> : (
                <><CheckCircle size={20} /> Confirm Donation & Add to Stock</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}