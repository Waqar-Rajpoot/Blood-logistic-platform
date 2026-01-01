"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Search, MapPin, Phone, 
  Loader2, Navigation, Lock,
  HeartPulse, Activity, Crown, Trophy, Medal, Star,
  Globe, ChevronLeft, ChevronRight
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

interface Donor {
  _id: string;
  username: string;
  bloodGroup: string;
  city: string;
  area: string;
  phoneNumber: string;
  isAvailable: boolean;
  points: number;
  lastDonationDate?: string;
  location: {
    coordinates: [number, number];
  };
}

const getDonorRank = (livesSaved: number) => {
  if (livesSaved >= 50) 
    return { 
      name: "Platinum", 
      color: "#f8fafc",
      bg: "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
      border: "border-slate-400/30",
      icon: <Crown size={12} className="text-blue-400" />, 
      bonus: "Priority" 
    };
  if (livesSaved >= 20) 
    return { 
      name: "Gold", 
      color: "#451a03",
      bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", 
      border: "border-yellow-400/50",
      icon: <Trophy size={12} className="text-amber-900" />, 
      bonus: "Premium" 
    };
  if (livesSaved >= 5) 
    return { 
      name: "Silver", 
      color: "#1e293b",
      bg: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)",
      border: "border-slate-300/50",
      icon: <Medal size={12} className="text-slate-700" />, 
      bonus: "Elite" 
    };
  return { 
    name: "Bronze", 
    color: "#ffffff",
    bg: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)", 
    border: "border-red-400/40",
    icon: <Star size={12} className="text-white" />, 
    bonus: "Active" 
  };
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function SearchLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfd]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        <HeartPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600" size={24} />
      </div>
      <p className="mt-6 text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Scanning Database...</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get("bloodGroup") || "",
    city: searchParams.get("city") || "",
    maxDistance: "", 
  });

  const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.bloodGroup && filters.bloodGroup !== "All") {
        params.append("bloodGroup", filters.bloodGroup);
      }
      if (filters.city) params.append("city", filters.city);

      const response = await axios.get(`/api/donors/search?${params.toString()}`);
      setDonors(response.data.donors || []);
      setCurrentPage(1);
    } catch (error: any) {
      toast.error(`${error.response?.data?.error || "Failed to fetch donors"}`);
    } finally {
      setLoading(false);
    }
  }, [filters.bloodGroup, filters.city]);

  useEffect(() => { fetchDonors(); }, [fetchDonors]);

  // SAFE RADIUS FILTERING
  const filteredDonors = donors.filter((donor) => {
    if (!filters.maxDistance) return true;

    const rLat = session?.user?.location?.coordinates?.[1];
    const rLon = session?.user?.location?.coordinates?.[0];
    const dLat = donor?.location?.coordinates?.[1];
    const dLon = donor?.location?.coordinates?.[0];

    // If coordinates are missing for either user or donor, hide from radius results to prevent errors
    if (rLat === undefined || rLon === undefined || dLat === undefined || dLon === undefined) {
      return false; 
    }
    
    const distance = calculateDistance(rLat, rLon, dLat, dLon);
    return distance <= parseInt(filters.maxDistance);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonors = filteredDonors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4">Find Your Match</h1>
          <p className="text-slate-500">Helping you find the nearest blood donor in seconds.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {bloodGroups.map((group) => (
            <button
              key={group}
              onClick={() => setFilters({ ...filters, bloodGroup: group === "All" ? "" : group })}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                (filters.bloodGroup === group || (group === "All" && !filters.bloodGroup))
                  ? "bg-red-600 text-white shadow-lg shadow-red-200 scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-red-300"
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Sticky Search Bar with KM Filter */}
        <div className="sticky top-6 z-50 mb-16 max-w-4xl mx-auto bg-slate-900 p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                  type="text" 
                  placeholder="Search by City or Area..."
                  className="w-full pl-12 pr-6 py-4 bg-slate-800 border-none rounded-2xl text-white font-bold outline-none"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
              />
            </div>

            {/* Radius Select */}
            <select 
                className="px-6 py-4 bg-slate-800 border-none rounded-2xl text-white font-bold outline-none appearance-none cursor-pointer min-w-[160px]"
                value={filters.maxDistance}
                onChange={(e) => {
                  if(!session) {
                    toast.error("Please login to use the distance filter");
                    return;
                  }
                  setFilters({...filters, maxDistance: e.target.value});
                }}
            >
                <option value="">All Distance</option>
                <option value="10">10 KM Radius</option>
                <option value="20">20 KM Radius</option>
                <option value="30">30 KM Radius</option>
                <option value="50">50 KM Radius</option>
            </select>

            <button onClick={fetchDonors} className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-2xl font-black">
                {loading ? <Loader2 className="animate-spin" /> : <Search />}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentDonors.map((donor) => {
            const rank = getDonorRank(donor.points || 0);
            const rCoords = session?.user?.location?.coordinates;
            const dCoords = donor.location?.coordinates;
            let distance = null;

            if (rCoords?.[1] && rCoords?.[0] && dCoords?.[1] && dCoords?.[0]) {
                distance = calculateDistance(rCoords[1], rCoords[0], dCoords[1], dCoords[0]).toFixed(1);
            }

            return (
              <div key={donor._id} className="bg-white border p-6 rounded-[2rem] shadow-xl border-red-200 transition-all flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-tighter ${donor.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    <Activity size={14} className={donor.isAvailable ? 'animate-pulse' : ''} />
                    {donor.isAvailable ? 'Ready' : 'On Break'}
                  </div>
                  <div style={{ background: rank.bg, color: rank.color }} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${rank.border}`}>
                    {rank.icon} {rank.name}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                    {donor.bloodGroup}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 uppercase truncate">{donor.username}</h3>
                    <div className="flex items-center gap-1 text-slate-600 text-sm">
                      <MapPin size={12} /> {donor.city}
                      <div className="w-1 h-1 rounded-full bg-slate-600" />
                      <Globe size={12} /> {donor.area}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                    {distance ? (
                        <div className="flex items-center gap-2 text-blue-600 font-black text-sm bg-blue-100 p-3 rounded-xl border border-blue-100">
                            <Navigation size={14} fill="currentColor" />
                            {distance} KM away
                        </div>
                    ) : (
                        <div className="text-[10px] text-slate-400 italic bg-slate-50 p-2 rounded-lg text-center">
                            {session ? "Location missing" : "Login for distance"}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[12px] uppercase font-bold text-slate-600">Phone</p>
                        <div className="flex items-center justify-center gap-1">
                          <Phone size={14} />
                          <p className="text-sm font-black text-slate-600">{donor.phoneNumber || "-"}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[12px] uppercase font-bold text-slate-600">Benefit</p>
                        <p className="text-sm font-black text-red-600">{rank.bonus}</p>
                    </div>
                </div>

                {session ? (
                  <a href={donor.isAvailable ? `tel:${donor.phoneNumber}` : "#"} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${donor.isAvailable ? 'bg-slate-900 text-white hover:bg-red-600 shadow-lg transition-all' : 'bg-slate-300 text-slate-600 cursor-not-allowed'}`}>
                    <Phone size={14} /> {donor.isAvailable ? 'Contact Donor' : 'Unavailable'}
                  </a>
                ) : (
                  <Link href="/login" className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs text-center flex items-center justify-center gap-2">
                    <Lock size={14} /> Login to Call
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 transition-all hover:bg-slate-50"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${
                    currentPage === i + 1 
                      ? "bg-slate-900 text-white scale-110" 
                      : "bg-white text-slate-400 border border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 transition-all hover:bg-slate-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {!loading && filteredDonors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm mt-10">
            <p className="text-slate-400 font-bold">No donors found matching these filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}