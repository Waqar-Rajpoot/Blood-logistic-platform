"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import axios from "axios";
import Link from "next/link";


export default function Hero() {
  const [latestRequest, setLatestRequest] = useState<{patientName: string, bloodGroup: string} | null>(null);


  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get("/api/admin/stats");
        if (res.data?.recentActivity?.length > 0) {
          setLatestRequest(res.data.recentActivity[0]);
        }
      } catch (error) {
        console.error("Ticker fetch failed", error);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="relative bg-red-600 pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Live Ticker Tag */}
        {latestRequest && (
          <div className="inline-flex items-center gap-2 bg-red-700/50 backdrop-blur-md border border-red-400/30 px-4 py-1.5 rounded-full mb-8 animate-bounce">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest">
              Live Need: {latestRequest.bloodGroup} for {latestRequest.patientName}
            </p>
          </div>
        )}

        <h1 className="text-5xl font-black sm:text-6xl md:text-7xl mb-6 tracking-tighter">
          Every Drop Counts. <br />
          <span className="text-red-200 underline decoration-yellow-400 underline-offset-8">Save a Life Today.</span>
        </h1>
        
        <p className="mt-4 text-lg md:text-xl text-red-100 max-w-2xl mx-auto font-medium leading-relaxed">
          The fastest digital bridge between blood donors and recipients. 
          Find emergency donors in your city within seconds.
        </p>

        {/* Secondary Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="w-full sm:w-auto">
            <button className="bg-yellow-400 hover:bg-white hover:text-red-600 text-red-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 w-full">
              <AlertCircle size={18} /> Emergency Request
            </button>
          </Link>
          
          <Link href="/signup" className="w-full sm:w-auto">
            <button className="bg-red-700/40 hover:bg-red-700/60 border border-red-400/30 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all w-full">
              Become a Donor <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
