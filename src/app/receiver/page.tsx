"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Activity,
  Clock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Users,
  MapPin,
  ShieldAlert,
  HeartPulse,
  TrendingUp,
  Info,
} from "lucide-react";
import axios from "axios";
import ReceiverJourneyManager from "@/components/ReceiverJourneyManager";

export default function ReceiverMainPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeRequests: 0,
    unitsFulfilled: 0,
    totalDonors: 0,
    pendingVerification: 0,
  });
  const [latestRequest, setLatestRequest] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [requestsRes, donorCountRes] = await Promise.all([
        axios.get("/api/receiver/my-requests"),
        axios.get("/api/donors/count"),
      ]);

      const requests = requestsRes.data.requests;
      const donorCount = donorCountRes.data.count;

      const active = requests.filter((r: any) => r.status === "Pending").length;
      const pendingVerify = requests.filter(
        (r: any) => r.status === "Accepted"
      ).length;
      const fulfilled = requests
        .filter((r: any) => r.status === "Fulfilled")
        .reduce((acc: number, curr: any) => acc + curr.unitsRequired, 0);

      const mostRecent = requests[0];

      setStats({
        activeRequests: active,
        unitsFulfilled: fulfilled,
        totalDonors: donorCount,
        pendingVerification: pendingVerify,
      });
      setLatestRequest(mostRecent);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* 1. HERO SECTION: URGENT ACTIONS */}
      <div className="bg-gray-900 rounded-[3rem] p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
        {/* Abstract background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[120px] rounded-full" />

        <div className="flex-1 z-10">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <ShieldAlert size={14} /> Emergency Response System
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Save Lives with <br />
            Precision Sourcing.
          </h1>
          <p className="text-gray-400 text-lg max-w-md mb-8">
            Deploy urgent requests to {stats.totalDonors} verified donors in
            your immediate vicinity.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/receiver/request"
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-900/40"
            >
              <PlusCircle size={22} /> POST URGENT REQUEST
            </Link>
            <Link
              href="/receiver/search"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all"
            >
              <Search size={22} /> BROWSE DONORS
            </Link>
          </div>
        </div>

        {/* Dynamic Counter Cards */}
        <div className="grid grid-cols-2 gap-4 z-10 w-full md:w-auto">
          {[
            {
              label: "Active Donors",
              val: stats.totalDonors,
              icon: <Users className="text-blue-400" />,
              bg: "bg-blue-500/10",
            },
            {
              label: "Units Secured",
              val: stats.unitsFulfilled,
              icon: <CheckCircle2 className="text-green-400" />,
              bg: "bg-green-500/10",
            },
            {
              label: "Pending",
              val: stats.activeRequests,
              icon: <Clock className="text-orange-400" />,
              bg: "bg-orange-500/10",
            },
            {
              label: "Needs Review",
              val: stats.pendingVerification,
              icon: <Activity className="text-red-400" />,
              bg: "bg-red-500/10",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`${item.bg} p-6 rounded-[2.5rem] border border-white/5 text-center min-w-[140px]`}
            >
              <div className="mb-2 flex justify-center">{item.icon}</div>
              <p className="text-3xl font-black">
                {loading ? "..." : item.val}
              </p>
              <p className="text-gray-500 text-[9px] uppercase font-black tracking-tighter">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. LIVE TRACKER SECTION */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                  Active Request Tracker
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  Real-time status of your most recent post
                </p>
              </div>
              <Link
                href="/receiver/my-requests"
                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-2xl transition-all"
              >
                <ArrowRight size={20} className="text-gray-400" />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 text-gray-400 gap-3">
                <Loader2 className="animate-spin" />{" "}
                <span className="font-bold">Syncing live data...</span>
              </div>
            ) : latestRequest ? (
              <div className="relative">
                <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 group hover:border-red-100 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="bg-red-600 text-white w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-2xl shadow-red-200">
                        {latestRequest.bloodGroup}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md text-red-600">
                        <HeartPulse size={16} fill="currentColor" />
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-xl">
                        {latestRequest.unitsRequired} Units •
                        {latestRequest.patientName}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm font-bold text-gray-500 flex items-center gap-1">
                          <MapPin size={14} className="text-red-500" />{" "}
                          {latestRequest.city}
                        </span>
                        <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                          <Users size={14} />
                          {latestRequest.potentialDonors?.length || 0} Responses
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/receiver/my-requests`}
                    className="mt-6 md:mt-0 bg-white border-2 border-gray-200 px-6 py-3 rounded-2xl font-black text-sm hover:border-red-600 hover:text-red-600 transition-all"
                  >
                    VIEW DETAILS
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center border-4 border-dashed border-gray-50 rounded-[3rem]">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <PlusCircle size={32} />
                </div>
                <p className="text-gray-400 font-black text-lg">
                  No active broadcast found.
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Your requests will appear here once posted.
                </p>
                <Link
                  href="/receiver/request"
                  className="text-red-600 font-black underline underline-offset-4"
                >
                  Create First Request
                </Link>
              </div>
            )}
          </section>

          {/* 3. BLOOD AVAILABILITY ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-800">Donor Heatmap</h4>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <div className="space-y-4">
                {["A+", "B+", "O-", "AB+"].map((group) => (
                  <div key={group} className="flex items-center gap-4">
                    <span className="text-xs font-black text-gray-400 w-8">
                      {group}
                    </span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="bg-red-500 h-full rounded-full"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-4 italic">
                  Live coverage across {stats.totalDonors} users
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
              <Info className="mb-4 opacity-50" size={32} />
              <h4 className="text-xl font-black mb-2">Hospital Pro Tip</h4>
              <p className="text-blue-100 text-sm leading-relaxed font-medium">
                Donors are 40% more likely to respond to requests marked as{" "}
                <span className="text-white font-bold">Urgent</span> with a
                specific Hospital name provided.
              </p>
              <button className="mt-6 text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all w-full text-center">
                Read Sourcing Guide
              </button>
            </div>
          </div>
        </div>

        {/* 4. SIDEBAR: POLICY & SUPPORT */}
        <div className="space-y-6">
          <div className="bg-red-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-red-200 flex flex-col justify-between h-full min-h-[400px]">
            <div>
              <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-8">
                <ShieldAlert size={28} />
              </div>
              <h3 className="text-2xl font-black leading-tight mb-4">
                Critical <br />
                Verification Policy
              </h3>
              <p className="text-red-100/80 text-sm font-medium leading-relaxed mb-6">
                Post-donation verification is mandatory. It resets the 90-day of
                donor recovery clock. Failing to verify prevents donors from
                helping others.
              </p>

              <ul className="space-y-4">
                {[
                  "Verify within 24 hours of receipt",
                  "Report no-show donors",
                  "Keep hospital name accurate",
                ].map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-xs font-bold"
                  >
                    <CheckCircle2 size={16} className="text-red-300 shrink-0" />{" "}
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <button className="mt-10 bg-white text-red-600 w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-red-50 transition-all shadow-xl active:scale-95">
              I Understand the Policy
            </button>
          </div>
        </div>
      </div>
    <ReceiverJourneyManager />
    </div>
  );
}
