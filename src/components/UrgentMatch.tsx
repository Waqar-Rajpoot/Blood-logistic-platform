"use client";
import React, { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { Search, MapPin, Droplet, Navigation, Loader2, Phone } from "lucide-react";
import { calculateDistance } from "@/utils/distance"; // We'll use that math utility
import toast from "react-hot-toast";

const ProximityMap = dynamic(() => import("./ProximityMap"), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-[2.5rem] flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function UrgentMatch() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("O+");
  const [userLoc, setUserLoc] = useState({ lat: 23.8103, lng: 90.4125 }); // Default
  const [isLocating, setIsLocating] = useState(false);

  // Get Hospital/Receiver's actual current location
  const getBrowserLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
        toast.success("Current location synced!");
      },
      () => {
        setIsLocating(false);
        toast.error("Using default location (Dhaka)");
      }
    );
  };

  const findNearby = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/donors/proximity?lat=${userLoc.lat}&lng=${userLoc.lng}&bloodGroup=${encodeURIComponent(selectedGroup)}`
      );
      setDonors(res.data);
      if(res.data.length === 0) toast("No donors found in this radius", { icon: '🔍' });
    } catch (err) {
      toast.error(`Failed to fetch nearby donors ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Controls & List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <Search className="text-red-600" /> Emergency Finder
            </h2>
            
            <div className="space-y-4">
              {/* Blood Group Selector */}
              <div>
                <label className="text-xs font-black uppercase text-gray-400 ml-1">Required Blood Group</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setSelectedGroup(bg)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedGroup === bg ? "bg-red-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Sync */}
              <button 
                onClick={getBrowserLocation}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-red-300 hover:text-red-600 transition-all text-sm font-bold"
              >
                {isLocating ? <Loader2 className="animate-spin" size={18}/> : <Navigation size={18}/>}
                {isLocating ? "Detecting GPS..." : "Sync My Location"}
              </button>

              <button 
                onClick={findNearby}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Droplet size={20} />}
                {loading ? "Scanning..." : "Search Nearby Donors"}
              </button>
            </div>
          </div>

          {/* Donor Cards List */}
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Results ({donors.length})
            </p>
            {donors.map((donor: any) => {
              const distance = calculateDistance(
                userLoc.lat, userLoc.lng, 
                donor.location.coordinates[1], donor.location.coordinates[0]
              );

              return (
                <div key={donor._id} className="group p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                     <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                       {donor.bloodGroup}
                     </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-gray-400">
                      {donor.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{donor.username}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={12}/> {donor.city} • <span className="text-red-600 font-bold">{distance} km away</span>
                      </p>
                      <div className="flex gap-2 mt-4">
                         <a href={`tel:${donor.phoneNumber}`} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all">
                            <Phone size={16}/>
                         </a>
                         <button className="text-xs font-bold px-4 py-2 bg-gray-900 text-white rounded-xl">View Profile</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {donors.length === 0 && !loading && (
              <div className="text-center py-10 opacity-40">
                <MapPin size={40} className="mx-auto mb-2" />
                <p className="font-bold">No donors found nearby</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Map */}
        <div className="lg:col-span-8">
          <div className="sticky top-8">
            <ProximityMap hospitalLoc={userLoc} donors={donors} />
          </div>
        </div>

      </div>
    </div>
  );
}