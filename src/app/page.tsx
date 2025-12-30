"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HomePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/home-summary")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data)
    return (
      <div className="h-screen flex items-center justify-center text-red-600 animate-pulse font-bold text-3xl">
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
              className="mb-6 px-4 py-1 text-red-600 bg-red-100 border-red-100 uppercase tracking-widest text-[10px] font-black"
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
              "Lives Saved": data.stats.livesSaved,
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
                    {value}
                  </motion.h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- TECHNICAL ARCHITECTURE (FOR RECRUITERS) --- */}
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

            {/* LIVE INVENTORY GRID */}
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
