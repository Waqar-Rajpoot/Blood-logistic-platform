import React from "react";
import { MapPin, Activity, Navigation, Map, CheckCircle2, Crown, Trophy, Medal, Star } from "lucide-react";

const getDonorRank = (livesSaved: number) => {
  if (livesSaved >= 50) return { name: "Platinum", color: "#f8fafc", bg: "linear-gradient(135deg, #334155 0%, #0f172a 100%)", border: "border-slate-400/30", icon: <Crown size={12} className="text-blue-400" /> };
  if (livesSaved >= 20) return { name: "Gold", color: "#451a03", bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", border: "border-yellow-400/50", icon: <Trophy size={12} className="text-amber-900" /> };
  if (livesSaved >= 5) return { name: "Silver", color: "#1e293b", bg: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)", border: "border-slate-300/50", icon: <Medal size={12} className="text-slate-700" /> };
  return { name: "Bronze", color: "#ffffff", bg: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)", border: "border-red-400/40", icon: <Star size={12} className="text-white" /> };
};

export const DonorCard = ({ donor, isSelected, onToggle, distance, onOpenMap }: any) => {
  const rank = getDonorRank(donor.points || 0);

  return (
    <div
      onClick={() => onToggle(donor)}
      className={`relative bg-white border p-5 rounded-[1.5rem] shadow-md transition-all flex flex-col cursor-pointer ${
        isSelected ? "border-red-600 ring-4 ring-red-50" : "border-slate-100 hover:border-red-200"
      } ${!donor.isAvailable ? "opacity-60 grayscale cursor-not-allowed" : ""}`}
    >
      <div className={`absolute top-3 right-3 z-10 transition-all ${isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
        <CheckCircle2 size={24} className="text-red-600 fill-white" />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${donor.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
          <Activity size={12} className={donor.isAvailable ? "animate-pulse" : ""} />
          {donor.isAvailable ? "Ready" : "On Break"}
        </div>
        <div style={{ background: rank.bg, color: rank.color }} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${rank.border}`}>
          {rank.icon} {rank.name}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-inner ${isSelected ? "bg-slate-900" : "bg-red-500"}`}>
          {donor.bloodGroup}
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-black text-slate-900 uppercase truncate text-sm">{donor.username}</h3>
          <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase truncate">
            <MapPin size={10} className="text-red-500" /> {donor.area}, {donor.city}
          </div>
        </div>
      </div>

      <div className="mb-4">
        {distance ? (
          <div className="flex items-center justify-between bg-blue-50/50 p-2 rounded-xl border border-blue-100">
            <div className="flex items-center gap-1.5 text-blue-700 font-black text-[10px]">
              <Navigation size={12} fill="currentColor" /> {distance} KM
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onOpenMap(donor.location.coordinates[1], donor.location.coordinates[0]); }} 
              className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1"
            >
              <Map size={10} /> Route
            </button>
          </div>
        ) : (
          <div className="text-[9px] text-slate-400 italic bg-slate-50 p-1.5 rounded-lg text-center font-bold">Location Hidden</div>
        )}
      </div>

      <button className={`w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${!donor.isAvailable ? "bg-slate-100 text-slate-400" : isSelected ? "bg-red-600 text-white" : "bg-slate-900 text-white"}`}>
        {!donor.isAvailable ? "Unavailable" : isSelected ? "Selected" : "Select Donor"}
      </button>
    </div>
  );
};