"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  CheckCircle,
  AlertCircle,
  Activity,
  Droplet,
  Zap,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface DonorData {
  username: string;
  bloodGroup: string;
  isAvailable: boolean;
  lastDonationDate: string | null;
  totalDonations: number;
  livesSaved: number;
  city: string;
  area: string;
  isVerified: boolean;
}

export default function DonorDashboard() {
  const [donor, setDonor] = useState<DonorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users/me");
        setDonor(response.data.data);
      } catch (error: any) {
        toast.error(`Failed to load dashboard: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDonorData();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <p className="text-gray-500 font-bold animate-pulse">
          Calculating Your Impact...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Verification Badge */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-gray-800">
                Hello, {donor?.username}!
              </h1>
              {donor?.isVerified && (
                <ShieldCheck className="text-blue-500" size={24} />
              )}
            </div>
            <p className="text-gray-500 font-medium">
              Your donations have saved approximately {donor?.livesSaved} lives.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Current Area
            </p>
            <p className="text-sm font-bold text-gray-700">{donor?.area}</p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border-b-4 border-red-600">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              Blood Group
            </p>
            <div className="flex justify-between items-center mt-1">
              <h2 className="text-4xl font-black text-red-600">
                {donor?.bloodGroup}
              </h2>
              <Droplet className="text-red-600 fill-red-50" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border-b-4 border-yellow-500">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              Impact Level
            </p>
            <div className="flex justify-between items-center mt-1">
              <h2 className="text-4xl font-black text-yellow-500">
                {donor?.totalDonations}
              </h2>
              <Zap className="text-yellow-500 fill-yellow-50" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border-b-4 border-blue-500">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              Lives Saved
            </p>
            <div className="flex justify-between items-center mt-1">
              <h2 className="text-4xl font-black text-blue-500">
                {donor?.livesSaved}
              </h2>
              <Heart className="text-blue-500 fill-blue-50" size={32} />
            </div>
          </div>

          <div
            className={`bg-white p-6 rounded-[2rem] shadow-sm border-b-4 ${
              donor?.isAvailable ? "border-green-500" : "border-gray-300"
            }`}
          >
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              Availability
            </p>
            <div className="flex justify-between items-center mt-1">
              <h2
                className={`text-lg font-black ${
                  donor?.isAvailable ? "text-green-600" : "text-gray-400"
                }`}
              >
                {donor?.isAvailable ? "Ready" : "On Break"}
              </h2>
              {donor?.isAvailable ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <AlertCircle className="text-gray-300" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary & Eligibility */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <Activity size={24} className="text-red-600" /> Health &
                Location
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      Last Donation Date
                    </span>
                    <span className="font-bold text-gray-700">
                      {donor?.lastDonationDate
                        ? new Date(donor.lastDonationDate).toDateString()
                        : "Never donated"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      Registered City
                    </span>
                    <span className="font-bold text-gray-700">
                      {donor?.city}
                    </span>
                  </div>
                </div>
                <div className="bg-blue-100 p-6 rounded-3xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 flex items-center gap-2 mb-2">
                    <AlertCircle size={14} /> Eligibility Note
                  </p>
                  <p className="text-xs text-blue-600 leading-relaxed font-medium">
                    You are eligible to donate whole blood every 56 days. Based
                    on your records, our system will notify you when you are
                    ready again.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Large Action Button */}
          <div
            onClick={() => (window.location.href = "/donor/alerts")}
            className="bg-red-600 p-8 rounded-[2.5rem] text-white flex flex-col justify-between cursor-pointer hover:bg-red-700 transition-all group"
          >
            <div className="flex justify-between items-start">
              <Heart
                size={40}
                className="group-hover:scale-110 transition-transform"
              />
              <div className="bg-white/20 p-2 rounded-full">
                <Activity size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Find Requests</h3>
              <p className="text-red-100 text-sm font-medium">
                There are pending requests in {donor?.city}. View and respond
                now.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
