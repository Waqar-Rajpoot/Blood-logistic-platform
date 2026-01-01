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
  Fingerprint,
  Phone,
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
      border: "border-slate-400/30",
      icon: <Crown size={16} className="text-blue-400" />, 
      bonus: "Priority Support" 
    };
  if (livesSaved >= 20) 
    return { 
      name: "Gold", 
      color: "#451a03",
      bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", 
      border: "border-yellow-400/50",
      icon: <Trophy size={16} className="text-amber-900" />, 
      bonus: "Premium Badge" 
    };
  if (livesSaved >= 5) 
    return { 
      name: "Silver", 
      color: "#1e293b",
      bg: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)",
      border: "border-slate-300/50",
      icon: <Medal size={16} className="text-slate-700" />, 
      bonus: "Elite List" 
    };
  return { 
    name: "Bronze", 
    color: "#450a0a",
    bg: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)", 
    border: "border-red-400/40",
    icon: <Star size={16} className="text-red-900" />, 
    bonus: "Active Donor" 
  };
};

interface DonorData {
  username: string;
  email?: string;
  phoneNumber?: string;
  bloodGroup: string;
  isAvailable: boolean;
  lastDonationDate: string | null;
  totalDonations: number;
  livesSaved: number;
  city: string;
  area: string;
  isVerified: boolean;
  createdAt?: string;
}

export default function DonorDashboard() {
  const [donor, setDonor] = useState<DonorData | null>(null);
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
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", [85, 55]);
      pdf.addImage(imgData, "PNG", 0, 0, 85, 55);
      pdf.save(`${donor?.username}_Verified_Donor.pdf`);
      toast.success("ID Card Saved!", { id: loadId });
    } catch (err) {
      toast.error(`Failed to download ID Card ${err}`, { id: loadId });
    }
  };

  const stages = [
    { key: "Donated", label: "Collected", desc: "Arrived at Lab" },
    { key: "Tested", label: "Tested", desc: "Safety Verified" },
    { key: "Processed", label: "Processed", desc: "Components Ready" },
    { key: "Dispatched", label: "Dispatched", desc: "Out for Patient" },
    { key: "Life Saved", label: "Saved!", desc: "Impact Confirmed" },
  ];

  const currentStageIndex = donation
    ? stages.findIndex((s) => s.key === donation.journeyStatus)
    : -1;
  const isFinalStage = currentStageIndex === stages.length - 1;
  const rank = getDonorRank(donor?.livesSaved || 0);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white gap-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-red-100 border-t-red-600 animate-spin"></div>
          <Droplet
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 animate-pulse"
            size={24}
          />
        </div>
        <p className="text-gray-400 font-black text-xs tracking-[0.3em] uppercase italic">
          Syncing Health Profile...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-slate-900">
                {donor?.username}
              </h1>
              <div
                style={{ background: rank.bg, color: rank.color }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-sm border border-white/50"
              >
                {rank.icon} {rank.name} Tier
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-red-500" /> {donor?.area},{" "}
                {donor?.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} /> {donor?.phoneNumber || "+92 3XX XXXXXXX"}
              </span>
              <span className="flex items-center gap-1.5 text-blue-600">
                <ShieldCheck size={14} /> Verified Identity
              </span>
            </div>
          </div>

          <button
            onClick={downloadIDCard}
            className="w-full md:w-auto group flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl overflow-hidden transition-all hover:bg-red-600 shadow-xl"
          >
            <Download size={18} />
            <span className="font-black text-xs uppercase tracking-[0.1em]">
              Export Donor Pass
            </span>
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            {
              label: "Blood Group",
              val: donor?.bloodGroup,
              icon: <Droplet />,
              color: "border-red-500",
              text: "text-red-600",
            },
            {
              label: "Impact Score",
              val: donor?.totalDonations,
              icon: <Zap />,
              color: "border-amber-500",
              text: "text-amber-600",
            },
            {
              label: "Lives Saved",
              val: donor?.livesSaved,
              icon: <Heart />,
              color: "border-blue-500",
              text: "text-blue-600",
            },
            {
              label: "Status",
              val: donor?.isAvailable ? "Ready" : "Unavailable",
              icon: <Activity />,
              color: "border-emerald-500",
              text: "text-emerald-600",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-white p-5 md:p-7 rounded-[2rem] border-b-[6px] ${item.color} shadow-lg shadow-slate-200/50`}
            >
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {item.label}
              </p>
              <h2 className="text-2xl md:text-4xl font-black mt-2 tracking-tighter">
                {item.val}
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: JOURNEY & DETAILS */}
          <div className="lg:col-span-8 space-y-8">
            {/* ENHANCED JOURNEY TRACKER */}
            {donation ? (
              <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                    <span className="h-8 w-1.5 bg-red-600 rounded-full"></span>{" "}
                    Live Blood Journey
                  </h3>
                  <div className="hidden md:block bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic">
                    Hospital: {donation.hospitalName}
                  </div>
                </div>

                {/* JOURNEY FLOW: RESPONSIVE */}
                <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-0">
                  {/* Progress Line (Desktop) */}
                  <div className="absolute top-5 left-10 right-10 h-[2px] bg-slate-100 hidden md:block"></div>

                  {stages.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex;
                    const isActive =
                      index === currentStageIndex && !isFinalStage;

                    return (
                      <div
                        key={stage.key}
                        className="flex flex-row md:flex-col items-center gap-4 md:gap-0 z-10 md:w-full"
                      >
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 ${
                              isCompleted
                                ? "bg-red-600 text-white shadow-xl shadow-red-200"
                                : "bg-slate-50 border-2 border-slate-100 text-slate-300"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={24} strokeWidth={2.5} />
                            ) : (
                              <Circle size={20} />
                            )}
                          </div>
                          {/* Blinking Dot Logic */}
                          {isActive && (
                            <div className="absolute -top-1 -right-1 flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                            </div>
                          )}
                        </div>
                        <div className="text-left md:text-center mt-0 md:mt-4">
                          <p
                            className={`text-[11px] font-black uppercase tracking-tighter ${
                              isCompleted ? "text-slate-900" : "text-slate-300"
                            }`}
                          >
                            {stage.label}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase hidden md:block">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center opacity-60">
                <Droplet size={40} className="text-slate-300 mb-4" />
                <p className="font-black text-xs uppercase text-slate-400 tracking-widest">
                  No Active Logistics Found
                </p>
              </div>
            )}

            {/* MORE USER DETAILS */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3 text-slate-800">
                <span className="h-8 w-1.5 bg-blue-600 rounded-full"></span>{" "}
                Extended Health Data
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Registered Email
                  </p>
                  <p className="font-bold text-slate-700 text-sm">
                    {donor?.email || "user@bloodlink.com"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Donor ID
                  </p>
                  <p className="font-bold text-slate-700 text-sm uppercase tracking-widest">
                    ID-#{donor?.username.slice(0, 3)}-{donor?.bloodGroup}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Emergency Contact
                  </p>
                  <p className="font-bold text-slate-700 text-sm italic">
                    Verified on File
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ID CARD & RANK */}
          <div className="lg:col-span-4 space-y-8">
            {/* THE DONOR PASS */}
            <div className="flex flex-col items-center">
              <div
                ref={cardRef}
                style={{
                  width: "340px",
                  height: "210px",
                  background:
                    "linear-gradient(135deg, #020617 0%, #1e1b4b 100%)",
                  borderRadius: "24px",
                  padding: "24px",
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* ID Card Header */}
                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <Droplet size={18} fill="white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-black uppercase tracking-tighter m-0 italic">
                        LifePass
                      </p>
                      <p className="text-[7px] text-slate-400 font-bold uppercase m-0">
                        National Blood Registry
                      </p>
                    </div>
                  </div>
                  <div
                    style={{ background: rank.bg, color: rank.color }}
                    className="px-3 py-1 rounded-md text-[9px] font-black uppercase"
                  >
                    {rank.name}
                  </div>
                </div>

                {/* ID Card Content */}
                <div className="mt-8 z-10">
                  <p className="text-[8px] uppercase text-slate-400 font-black mb-1">
                    Identity Holder
                  </p>
                  <h3 className="text-[20px] font-black uppercase tracking-tight leading-none">
                    {donor?.username}
                  </h3>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="bg-red-600 px-2 py-1 rounded text-[12px] font-black tracking-widest">
                      {donor?.bloodGroup} POS
                    </div>
                    <div className="text-[8px] text-slate-300 font-bold uppercase">
                      UID: 2025-{donor?.city.slice(0, 2).toUpperCase()}-982
                    </div>
                  </div>
                </div>

                {/* Footer with Fingerprint icon */}
                <div className="mt-auto flex justify-between items-end z-10">
                  <div className="flex items-center gap-3">
                    <Fingerprint
                      size={24}
                      className="text-red-500 opacity-50"
                    />
                    <div className="text-[8px] font-bold text-slate-400 uppercase leading-none">
                      Biometric Verified
                      <br />
                      <span className="text-white">Active Status</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] text-slate-400 font-black uppercase m-0">
                      Valid Since
                    </p>
                    <p className="text-[12px] font-black m-0">
                      {donor?.createdAt
                        ? new Date(donor.createdAt).getFullYear()
                        : "2025"}
                    </p>
                  </div>
                </div>

                {/* Abstract Watermark */}
                <ShieldCheck
                  size={180}
                  className="absolute -right-12 -bottom-12 opacity-[0.03] text-white"
                />
              </div>
              <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Universal Healthcare Passport
              </p>
            </div>

            {/* BEAUTIFIED RANK CARD */}
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 group">
              <div className="flex items-center gap-5 mb-8">
                <div
                  style={{ background: rank.bg }}
                  className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-slate-200 transform group-hover:rotate-12 transition-transform"
                >
                  {rank.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Impact Milestones
                  </p>
                  <h4 className="text-2xl font-black italic uppercase text-slate-900">
                    {rank.name} Class
                  </h4>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Progress
                    </span>
                    <span className="text-xl font-black">
                      {donor?.livesSaved} Lives Saved
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Next Rank
                    </span>
                    <p className="text-xs font-black text-red-600 italic">
                      20 Saved
                    </p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-xl overflow-hidden p-1">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-800 h-full rounded-lg transition-all duration-1000"
                    style={{
                      width: `${Math.min(
                        ((donor?.livesSaved || 0) / 20) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                  <Star size={16} className="text-amber-500" />
                  <p className="text-[10px] font-bold text-slate-600 uppercase">
                    Benefit:{" "}
                    <span className="text-slate-900">{rank.bonus}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
