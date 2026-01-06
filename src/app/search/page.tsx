"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, MapPin, Loader2, HeartPulse, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// Component Imports
import { DonorCard } from "@/components/search/DonorCard";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SelectionBar } from "@/components/search/SelectionBar";
import { RequestModal } from "@/components/search/RequestModal";

interface Donor {
  _id: string;
  username: string;
  bloodGroup: string;
  city: string;
  area: string;
  phoneNumber: string;
  isAvailable: boolean;
  points: number;
  location: {
    coordinates: [number, number];
  };
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
  
  // States
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonorIds, setSelectedDonorIds] = useState<string[]>([]);
  const [lockedBloodGroup, setLockedBloodGroup] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const [requestData, setRequestData] = useState({
    patientName: "",
    hospitalName: "",
    unitsRequired: 1,
    contactNumber: "",
    city: "",
    area: "",
  });

  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get("bloodGroup") || "",
    city: searchParams.get("city") || "",
    maxDistance: "",
  });

  // Fetch Logic
  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.bloodGroup && filters.bloodGroup !== "All") params.append("bloodGroup", filters.bloodGroup);
      if (filters.city) params.append("city", filters.city);

      const response = await axios.get(`/api/donors/search?${params.toString()}`);
      setDonors(response.data.donors || []);
      setCurrentPage(1);
      setSelectedDonorIds([]);
      setLockedBloodGroup(null);
    } catch (error: any) {
      toast.error(`${error.response?.data?.error || "Failed to fetch donors"}`);
    } finally {
      setLoading(false);
    }
  }, [filters.bloodGroup, filters.city]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  // Selection Logic
  const toggleSelection = (donor: Donor) => {
    if (!session) {
      toast.error("Please login to select donors");
      return;
    }
    if (!donor.isAvailable) {
      toast.error(`${donor.username} is currently on a break.`);
      return;
    }
    if (lockedBloodGroup && donor.bloodGroup !== lockedBloodGroup) {
      toast.error(`Selection locked to ${lockedBloodGroup}`);
      return;
    }

    if (selectedDonorIds.includes(donor._id)) {
      const newList = selectedDonorIds.filter((id) => id !== donor._id);
      setSelectedDonorIds(newList);
      if (newList.length === 0) setLockedBloodGroup(null);
    } else {
      setSelectedDonorIds((prev) => [...prev, donor._id]);
      setLockedBloodGroup(donor.bloodGroup);
    }
  };

  // Submit Logic
  const handleSendRequests = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requestData.contactNumber.length < 10) {
      toast.error("Enter a valid phone number");
      return;
    }
    
    try {
      setRequestLoading(true);
      const payload = {
        donorIds: selectedDonorIds,
        ...requestData,
        bloodGroup: lockedBloodGroup,
        location: session?.user?.location,
        isUrgent: true,
      };

      const res = await axios.post("/api/donors/multi-request", payload);
      if (res.data.success) {
        toast.success(`Alert sent to ${selectedDonorIds.length} donors!`);
        setSelectedDonorIds([]);
        setLockedBloodGroup(null);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setRequestLoading(false);
    }
  };

  const openGoogleMaps = (dLat: number, dLon: number) => {
    const rLat = session?.user?.location?.coordinates[1];
    const rLon = session?.user?.location?.coordinates[0];
    if (!rLat || !rLon) {
      toast.error("Location required.");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&origin=${rLat},${rLon}&destination=${dLat},${dLon}`;
    window.open(url, "_blank");
  };

  // Distance Filtering Logic
  const filteredDonors = donors.filter((donor) => {
    if (!filters.maxDistance) return true;
    const rCoords = session?.user?.location?.coordinates;
    const dCoords = donor?.location?.coordinates;
    if (!rCoords || !dCoords) return false;
    return calculateDistance(rCoords[1], rCoords[0], dCoords[1], dCoords[0]) <= parseInt(filters.maxDistance);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentDonors = filteredDonors.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-32">
      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter">Find Your Match</h1>
          <p className="text-slate-500 font-medium italic text-sm">Select donors for an emergency broadcast.</p>
        </div>

        {/* Blood Group Filters */}
        <SearchFilters 
          selectedGroup={filters.bloodGroup}
          onGroupSelect={(group) => setFilters({ ...filters, bloodGroup: group })}
        />

        {/* Search Bar */}
        <div className="sticky top-20 z-40 mb-12 max-w-5xl mx-auto bg-slate-900 p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="City..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border-none rounded-xl text-white font-bold outline-none text-sm"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />
          </div>
          <select
            className="px-4 py-3 bg-slate-800 border-none rounded-xl text-white font-bold outline-none cursor-pointer text-sm"
            value={filters.maxDistance}
            onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })}
          >
            <option value="">Anywhere</option>
            <option value="10">10 KM</option>
            <option value="30">30 KM</option>
            <option value="50">50 KM</option>
          </select>
          <button onClick={fetchDonors} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-black transition-colors flex justify-center">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          </button>
        </div>

        {/* Donor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDonors.map((donor) => {
            const rCoords = session?.user?.location?.coordinates;
            const dCoords = donor.location?.coordinates;
            const distance = rCoords?.[1] && dCoords?.[1] 
              ? calculateDistance(rCoords[1], rCoords[0], dCoords[1], dCoords[0]).toFixed(1) 
              : null;

            return (
              <DonorCard
                key={donor._id}
                donor={donor}
                isSelected={selectedDonorIds.includes(donor._id)}
                onToggle={toggleSelection}
                distance={distance}
                onOpenMap={openGoogleMaps}
              />
            );
          })}
        </div>

        {/* Floating Selection Bar */}
        <SelectionBar 
          selectedCount={selectedDonorIds.length}
          bloodGroup={lockedBloodGroup}
          onClear={() => { setSelectedDonorIds([]); setLockedBloodGroup(null); }}
          onOpenModal={() => setIsModalOpen(true)}
        />

        {/* Request Modal */}
        <RequestModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSendRequests}
          requestData={requestData}
          setRequestData={setRequestData}
          loading={requestLoading}
          selectedCount={selectedDonorIds.length}
          bloodGroup={lockedBloodGroup}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button 
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} 
              disabled={currentPage === 1} 
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} 
              disabled={currentPage === totalPages} 
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}