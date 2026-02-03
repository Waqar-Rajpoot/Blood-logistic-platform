"use client";
import React, { useState } from "react";
import { Search, PackagePlus, Loader2, CheckCircle, User, Info } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
          <PackagePlus className="text-emerald-600" /> Donation Processing
        </h1>

        {/* Instructions Section */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-8 flex gap-3 items-start">
          <Info className="text-blue-600 shrink-0 mt-1" size={20} />
          <div>
            <p className="text-blue-900 font-bold text-sm sm:text-base">
              Verification Required
            </p>
            <p className="text-blue-700 text-sm">
              Please enter the unique token provided to the volunteer here. This will verify the appointment they have taken and allow you to process the donation into the system.
            </p>
          </div>
        </div>

        {/* Search Bar - Responsive layout */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Enter Token (e.g. VOL-ABCD)"
              value={tokenSearch}
              onChange={(e) => setTokenSearch(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-emerald-500 font-bold text-sm sm:text-base"
            />
          </div>
          <button 
            onClick={searchToken}
            disabled={loading}
            className="bg-gray-900 text-white px-8 py-4 sm:py-0 rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify Token"}
          </button>
        </div>

        {/* Record Card */}
        {record && (
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm border border-emerald-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xl sm:text-2xl">
                  {record.bloodGroup}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Verified Volunteer</h3>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">Token: {record.token}</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase">
                {record.status}
              </span>
            </div>

            {/* Donor Name Section */}
            <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-6">
               <User size={20} className="text-emerald-600 shrink-0" />
               <p className="text-base sm:text-lg font-black text-gray-700 truncate">
                 Donor: {record.donorId?.username || "Anonymous"}
               </p>
            </div>

            {/* Details Grid - Responsive columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Donor HB Level</p>
                <p className="text-base sm:text-lg font-black text-gray-700">{record.hbLevel || "Not Provided"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Preferred Date</p>
                <p className="text-base sm:text-lg font-black text-gray-700">
                  {new Date(record.preferredDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button 
              onClick={handleCompleteDonation}
              disabled={processing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-all"
            >
              {processing ? <Loader2 className="animate-spin" /> : (
                <>
                  <CheckCircle size={20} /> 
                  <span className="text-sm sm:text-lg">Confirm Donation & Add to Stock</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}