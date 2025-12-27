"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { 
  MapPin, 
  Droplets, 
  Phone,
  Loader2,
  Search as SearchIcon
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamically import Map with SSR disabled
const DonorMap = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
       Initializing Map Engine...
    </div>
  )
});

interface Donor {
  _id: string;
  username: string;
  bloodGroup: string;
  city: string;
  area: string;
  phoneNumber: string;
  latitude?: number; 
  longitude?: number;
}

// 1. Main Page Export with Suspense wrapper
export default function AdvancedSearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-red-600" size={32} />
      </div>
    }>
      <AdvancedSearchContent />
    </Suspense>
  );
}

// 2. The Actual Logic Component
function AdvancedSearchContent() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
  const [bloodGroup, setBloodGroup] = useState("");
  const [areaSearch, setAreaSearch] = useState("");

  // FIX: Wrap in useCallback to stabilize the function identity
  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/donors/search`, {
        params: { bloodGroup, area: areaSearch }
      });
      setDonors(res.data.donors || []);
    } catch (error: any) {
      toast.error(`Failed to fetch donors: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [bloodGroup, areaSearch]); // These are the dependencies for the callback

  // FIX: Add fetchDonors to the dependency array
  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
      {/* Top Search Bar */}
      <div className="p-4 border-b bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Droplets className="absolute left-3 top-3 text-red-600" size={18} />
              <select 
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black appearance-none font-medium"
              >
                <option value="">Blood Group (Any)</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search City or Area..." 
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black font-medium"
              />
            </div>
          </div>
          <button 
            onClick={fetchDonors}
            className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95"
          >
            <SearchIcon size={18} /> Search Donors
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Donor Cards */}
        <div className={`w-full md:w-96 border-r overflow-y-auto bg-gray-50 p-4 space-y-4 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {loading ? "Searching..." : `Results Found (${donors.length})`}
            </p>
            <div className="flex bg-gray-200 rounded-lg p-1">
               <button 
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === 'list' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>List</button>
               <button 
                onClick={() => setViewMode("map")}
                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === 'map' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}>Map</button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin text-red-600 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">Syncing...</p>
            </div>
          ) : donors.length > 0 ? (
            donors.map((donor) => (
              <div key={donor._id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-red-300 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-red-50 px-3 py-1 rounded-xl text-red-600 font-black text-lg shadow-sm">
                    {donor.bloodGroup}
                  </div>
                  <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-lg font-black uppercase tracking-tighter">Verified Donor</span>
                </div>
                <h4 className="font-black text-gray-800 text-lg leading-tight">{donor.username}</h4>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-red-400" /> {donor.area}, {donor.city}
                </p>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                  <Phone size={12} className="text-green-400" /> {donor.phoneNumber}
                </p>

                <div className="mt-5 flex gap-2">
                  <a 
                    href={`tel:${donor.phoneNumber}`}
                    className="flex-1 bg-gray-900 text-white text-[10px] uppercase tracking-widest py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
                  >
                    <Phone size={14} /> Call Now
                  </a>
                  <button className="flex-1 bg-gray-100 text-gray-700 text-[10px] uppercase tracking-widest py-3 rounded-xl font-black hover:bg-gray-200 transition-all">
                    Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 px-6">
                <SearchIcon className="text-gray-300 mx-auto mb-4" size={40} />
                <p className="text-gray-500 font-black">No donors found</p>
                <p className="text-[10px] text-gray-400 uppercase font-black mt-1">Try changing filters</p>
            </div>
          )}
        </div>

        {/* Right Section: The Map */}
        <div className={`flex-1 relative ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
            <button 
              onClick={() => setViewMode("list")}
              className="md:hidden absolute top-4 left-4 z-[1000] bg-white px-4 py-2 rounded-full shadow-xl font-black text-[10px] uppercase text-red-600 border border-red-100"
            >
              ← Back to List
            </button>
            
            <DonorMap donors={donors} />
        </div>
      </div>
    </div>
  );
}