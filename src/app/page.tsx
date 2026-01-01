"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Zap, Activity, Globe, 
  Crown, Trophy, Medal, Star, ArrowUpRight, 
  BadgeIcon,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Shared Ranking Logic
const getDonorRank = (livesSaved: number) => {
  if (livesSaved >= 24) 
    return { 
      name: "Platinum", 
      color: "#f8fafc",
      bg: "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
      icon: <Crown size={16} className="text-blue-400" />, 
    };
  if (livesSaved >= 12) 
    return { 
      name: "Gold", 
      color: "#451a03",
      bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", 
      icon: <Trophy size={16} className="text-amber-900" />, 
    };
  if (livesSaved >= 6) 
    return { 
      name: "Silver", 
      color: "#1e293b",
      bg: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)",
      icon: <Medal size={16} className="text-slate-700" />, 
    };
  return { 
    name: "Bronze", 
    color: "#ffffff",
    bg: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)", 
    icon: <Star size={16} className="text-white" />, 
  };
};

export default function HomePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/home-summary")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data)
    return (
      <div className="h-screen flex items-center justify-center text-red-600 animate-pulse font-bold text-lg">
        Synchronizing Data...
      </div>
    );

  return (
    <div className="min-h-screen bg-white selection:bg-red-100 selection:text-red-600">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-8 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1 text-red-600 bg-red-200 border-red-200 uppercase tracking-widest text-[10px] font-black"
            >
              System Status: Active & Responding
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.85]">
              Bridging the Gap Between <br />
              <span className="text-red-600">Life and Hope.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium mb-10 leading-relaxed">
              Our matching engine connects critical blood requests with verified
              donors using geospatial precision.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-700 h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-red-200"
              >
                <Link href="/signup">Donate Blood</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-10 rounded-2xl text-lg font-bold border-slate-400"
              >
                <Link href="/search">Find Blood</Link>
              </Button>
            </div>
          </motion.div>

          {/* --- LIVE STATS COUNTER --- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Object.entries({
              "Lives Saved": data.stats.livesSaved * 3,
              "Verified Donors": data.stats.verifiedDonors,
              "Matches Made": data.stats.successfulMatches,
              "Active Units": data.stats.activeUnits,
            }).map(([label, value]) => (
              <Card
                key={label}
                className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] bg-white"
              >
                <CardContent className="p-8">
                  <motion.h3
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-black text-slate-900 mb-2"
                  >
                    {value}+
                  </motion.h3>
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
                    {label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- ELITE DONOR RANKINGS SECTION --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                TOP TIER <br /> <span className="text-red-600">CONTRIBUTORS</span>
              </h2>
              <p className="text-slate-500 font-medium mt-2">Recognizing our most dedicated life-savers based on impact points.</p>
            </div>
            <Link href="/search" className="flex items-center gap-2 text-sm font-black text-slate-900 hover:text-red-600 transition-colors uppercase tracking-widest">
              View All Donors <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.topDonors?.map((donor: any, idx: number) => {
              const currentPoints = donor.points || 0;
              const rank = getDonorRank(currentPoints);
              
              return (
                <motion.div 
                  key={donor._id || idx}
                  whileHover={{ y: -5 }}
                  className="relative group bg-white border border-slate-200 p-8 rounded-[3rem] shadow-xl shadow-slate-200/50"
                >
                  {/* Floating Rank Icon */}
                  <div 
                    style={{ background: rank.bg }} 
                    className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300"
                  >
                    {rank.icon}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">
                      {donor.bloodGroup || 'O+'}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase truncate max-w-[150px]">
                        {donor.username}
                      </h4>
                      <Badge className={`bg-slate-200 text-blue-500 border-none text-[12px] font-bold`}>
                        <BadgeIcon />
                        {rank.name}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lives Saved</span>
                      <span className="text-2xl font-black text-slate-900">{currentPoints}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((currentPoints / 50) * 100, 100)}%` }}
                        className="h-full bg-red-600 transition-all duration-1000" 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      <span>
                        <Globe size={14} className="inline-block mr-1" />
                        {donor.city}
                      </span>
                      <span className="ml-2">
                        <MapPin size={14} className="inline-block mr-1" />
                        {donor.area}
                      </span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- TECHNICAL ARCHITECTURE --- */}
      <section className="py-24 bg-slate-900 text-white rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8 tracking-tighter">
                ENGINEERED FOR <br />
                URGENCY
              </h2>
              <div className="space-y-10">
                {[
                  {
                    icon: Globe,
                    title: "Geospatial Indexing",
                    desc: "We match donors within a 10km radius of hospitals using MongoDB 2dsphere indexing for sub-second response times.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Verification Pipeline",
                    desc: "Every donation lifecycle is tracked. Status only shifts to 'Fulfilled' after multi-party verification.",
                  },
                  {
                    icon: Zap,
                    title: "Urgency Algorithm",
                    desc: "isUrgent: true triggers immediate broadcast notifications to available donors in the specific area.",
                  },
                ].map((tech, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="bg-red-600/20 p-4 rounded-3xl h-fit">
                      <tech.icon className="text-red-500" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{tech.title}</h4>
                      <p className="text-slate-400 leading-relaxed">
                        {tech.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem]">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <Activity className="text-emerald-500" /> LIVE INVENTORY
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {data.inventory.map((item: any) => (
                  <div
                    key={item._id}
                    className="bg-white/5 p-4 rounded-2xl border border-white/5"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-2xl font-black">
                        {item.bloodGroup}
                      </span>
                      <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[10px]">
                        SAFE
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                      {item.units} Units Available
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMMUNITY HEROES WALL --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-16 tracking-tight">
          RECENT LIFE-SAVERS
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.recentDonations.map((don: any) => (
            <motion.div
              key={don._id}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 text-red-600 font-black">
                {don.donorId.username[0].toUpperCase()}
              </div>
              <h4 className="font-black text-slate-900">
                {don.donorId.username}
              </h4>
              <p className="text-xs font-bold text-slate-400 mb-4">
                {don.donorId.area}
              </p>
              <Badge
                variant="outline"
                className="border-red-100 text-red-600 bg-white"
              >
                {don.unitsDonated} Unit Donated
              </Badge>
              <p className="mt-4 text-[10px] font-black text-slate-400 uppercase">
                at {don.hospitalName}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}