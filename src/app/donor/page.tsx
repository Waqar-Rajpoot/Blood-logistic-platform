"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Activity,
  Droplet,
  Zap,
  ShieldCheck,
  Circle,
  CheckCircle2,
  Download,
  Trophy,
  Star,
  Medal,
  Crown,
  MapPin,
  Phone,
  Fingerprint,
  LayoutDashboard,
  Calendar,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

const getDonorRank = (livesSaved: number) => {
  if (livesSaved >= 50) 
    return { 
      name: "Platinum", 
      color: "#f8fafc",
      bg: "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
      icon: <Crown size={18} className="text-blue-400" />, 
      bonus: "Priority Support" 
    };
  if (livesSaved >= 20) 
    return { 
      name: "Gold", 
      color: "#451a03",
      bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", 
      icon: <Trophy size={18} className="text-amber-900" />, 
      bonus: "Premium Badge" 
    };
  if (livesSaved >= 5) 
    return { 
      name: "Silver", 
      color: "#1e293b",
      bg: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)",
      icon: <Medal size={18} className="text-slate-700" />, 
      bonus: "Elite List" 
    };
  return { 
    name: "Bronze", 
    color: "#450a0a",
    bg: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)", 
    icon: <Star size={18} className="text-red-900" />, 
    bonus: "Active Donor" 
  };
};

export default function DonorDashboard() {
  const [donor, setDonor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [userRes, journeyRes] = await Promise.all([
          axios.get("/api/users/me"),
          axios.get("/api/donor/my-donations"),
        ]);
        setDonor(userRes.data.data);
        setDonation(journeyRes.data.donation);
      } catch (error: any) {
        toast.error(`Failed to load dashboard: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const downloadIDCard = async () => {
    if (!cardRef.current) return;
    const loadId = toast.loading("Forging your digital pass...");
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 4,
        backgroundColor: null,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", [85, 55]);
      pdf.addImage(imgData, "PNG", 0, 0, 85, 55);
      pdf.save(`${donor?.username}_Verified_Donor.pdf`);
      toast.success("ID Card Saved!", { id: loadId });
    } catch (err) {
      toast.error(`Error: ${err}`, { id: loadId });
    }
  };

  const stages = [
    { key: "Donated", label: "Collected", desc: "Arrived at Lab" },
    { key: "Tested", label: "Tested", desc: "Safety Verified" },
    { key: "Processed", label: "Processed", desc: "Units Ready" },
    { key: "Dispatched", label: "Dispatched", desc: "Out for Patient" },
    { key: "Life Saved", label: "Saved!", desc: "Impact Made" },
  ];

  const currentStageIndex = donation ? stages.findIndex((s) => s.key === donation.journeyStatus) : -1;
  const rank = getDonorRank(donor?.points || 0);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
      <div className="relative mb-4">
        <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-red-600 animate-spin"></div>
        <Droplet className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 animate-pulse" size={24} />
      </div>
      <p className="text-slate-400 font-black text-[10px] tracking-[0.4em] uppercase">Initializing LifeLink</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 lg:p-12 text-slate-900 selection:bg-red-100">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP BAR / NAVIGATION HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-red-600 mb-1">
                <LayoutDashboard size={18} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Donor Command Center</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
              Hello, {donor?.username.split(' ')[0]}
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-2">
                <div style={{ background: rank.bg, color: rank.color }} className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg shadow-slate-200 border border-white/20">
                    {rank.icon} {rank.name} Tier
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                    <MapPin size={14} className="text-red-500" /> {donor?.city}
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase bg-emerald-50 px-3 py-1 rounded-full">
                    <Phone size={14} /> {donor?.phoneNumber}
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase bg-emerald-50 px-3 py-1 rounded-full">
                    <ShieldCheck size={14} /> Identity Verified
                </div>
            </div>
          </div>
          
          <button onClick={downloadIDCard} className="group bg-slate-900 hover:bg-red-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-2xl shadow-slate-300 active:scale-95">
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            <span className="font-black text-xs uppercase tracking-widest">Export ID Pass</span>
          </button>
        </header>

        {/* CORE ANALYTICS GRID */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
          {[
            { label: "Blood Group", val: donor?.bloodGroup, icon: <Droplet />, bg: "bg-red-50", text: "text-red-600" },
            { label: "Impact Score", val: donor?.points, icon: <Zap />, bg: "bg-amber-50", text: "text-amber-600" },
            { label: "Lives Impacted", val: donor?.donationsCount, icon: <Heart />, bg: "bg-blue-50", text: "text-blue-600" },
            { label: "Donor Status", val: donor?.isAvailable ? "Ready" : "Away", icon: <Activity />, bg: "bg-emerald-50", text: "text-emerald-600" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all group">
              <div className={`${item.bg} ${item.text} w-10 h-10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">{item.val}</h2>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* MAIN COLUMN: TRACKER & JOURNEY */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* JOURNEY CARD */}
            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Live Donation Journey</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Real-time status of your last unit</p>
                </div>
                {donation && (
                    <div className="bg-red-50 text-red-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase border border-red-100">
                        {donation.hospitalName}
                    </div>
                )}
              </div>

              {donation ? (
                <div className="relative flex flex-col md:flex-row justify-between gap-10 md:gap-2">
                  <div className="absolute top-6 left-6 right-6 h-[2px] bg-slate-100 hidden md:block"></div>
                  {stages.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex && index !== stages.length - 1;
                    return (
                      <div key={stage.key} className="flex flex-row md:flex-col items-center gap-6 md:gap-4 z-10 md:w-full">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative ${
                          isCompleted ? "bg-red-600 text-white shadow-lg shadow-red-200 scale-110" : "bg-slate-50 text-slate-200 border border-slate-100"
                        }`}>
                          {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={18} />}
                          {isCurrent && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white"></span>
                            </span>
                          )}
                        </div>
                        <div className="text-left md:text-center">
                          <p className={`text-[11px] font-black uppercase tracking-tight ${isCompleted ? "text-slate-900" : "text-slate-300"}`}>{stage.label}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase hidden md:block mt-1">{stage.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <Calendar size={32} className="text-slate-300 mb-3" />
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No active units in transit</p>
                </div>
              )}
            </div>

            {/* INFO GRID */}
            <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] text-white">
               <h3 className="text-xl font-black uppercase italic tracking-tighter mb-10 flex items-center gap-3">
                 <Fingerprint className="text-red-500" size={24} /> Verified Health Record
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {[
                    { label: "Digital UID", val: `UID-${donor?.username.slice(0,3)}-${donor?.bloodGroup}`.toUpperCase() },
                    { label: "Emergency Email", val: donor?.email },
                    { label: "Member Since", val: donor?.createdAt ? new Date(donor.createdAt).getFullYear() : "2024" }
                  ].map((info, i) => (
                    <div key={i} className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{info.label}</p>
                        <p className="text-sm font-bold tracking-tight truncate">{info.val}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* SIDEBAR: ID CARD & PROGRESS */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* CARD PREVIEW */}
            <div className="flex flex-col items-center gap-6">
              <div
                ref={cardRef}
                className="w-[340px] h-[210px] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between"
                style={{ background: "linear-gradient(135deg, #020617 0%, #1e1b4b 100%)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-red-600 rounded-xl flex items-center justify-center">
                      <Droplet size={20} fill="white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-black uppercase m-0 leading-none italic">LifePass</p>
                      <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">Universal Registry</p>
                    </div>
                  </div>
                  <div style={{ background: rank.bg, color: rank.color }} className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {rank.name}
                  </div>
                </div>

                <div className="z-10">
                  <p className="text-[8px] uppercase text-slate-500 font-black mb-1">Identity Holder</p>
                  <h3 className="text-[22px] font-black uppercase leading-none tracking-tighter">{donor?.username}</h3>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="bg-red-600 px-3 py-1 rounded-lg text-[13px] font-black tracking-widest">{donor?.bloodGroup} POS</div>
                    <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">VERIFIED BIOMETRIC</div>
                  </div>
                </div>

                <div className="flex justify-between items-end z-10">
                    <Fingerprint size={28} className="text-red-500 opacity-40" />
                    <div className="text-right">
                        <p className="text-[7px] text-slate-500 font-black uppercase mb-1">Status</p>
                        <p className="text-[10px] font-black tracking-widest uppercase">Active Donor</p>
                    </div>
                </div>
                <ShieldCheck size={200} className="absolute -right-16 -bottom-16 opacity-[0.03] text-white" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ID Pass Preview</p>
            </div>

            {/* PROGRESS BOX */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div style={{ background: rank.bg }} className="h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                        {rank.icon}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Rank</p>
                        <h4 className="text-xl font-black italic uppercase">{rank.name} Class</h4>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Points Gained</span>
                            <span className="text-2xl font-black text-slate-900">{donor?.points}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Goal</span>
                            <span className="text-xs font-black text-red-600 uppercase italic">Next: 20</span>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div 
                            className="bg-red-600 h-full transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${Math.min(((donor?.points || 0) / 20) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                        <Trophy size={16} className="text-amber-500" />
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
                            Bonus: <span className="text-red-600">{rank.bonus}</span>
                        </p>
                    </div>
                </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}