"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Droplet,
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2,
  HeartPulse,
  RefreshCw,
  Database,
  ShieldAlert,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

// Data types based on your JSON objects
interface DashboardStats {
  totalUsers: number;
  donorsCount: number;
  receiversCount: number;
  inventoryUnits: number;
  pendingRequests: number;
  successfulDonations: number;
  bloodGroupStats: { group: string; units: number }[];
  recentActivities: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/stats");
      setStats(res.data);
    } catch (error) {
      toast.error(`Failed to load dashboard stats: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="relative">
          <Loader2 className="animate-spin text-red-600" size={60} />
          <HeartPulse
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-400"
            size={24}
          />
        </div>
        <p className="text-gray-400 font-black mt-6 tracking-[0.3em] uppercase text-[10px]">
          Accessing Secure Core...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* SECTION 1: HEADER & QUICK ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Command Center
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Network Status:{" "}
            <span className="text-gray-900">
              {stats?.totalUsers} Nodes Active
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAdminData}
            className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </button>
          <Link
            href="/admin/process-donation"
            className="flex items-center gap-2 px-6 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
          >
            <Database size={16} /> Update Inventory
          </Link>
        </div>
      </div>

      {/* SECTION 2: THE PULSE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Global Registry"
          value={stats?.totalUsers || 0}
          sub={`Donors: ${stats?.donorsCount}`}
          icon={<Users />}
          color="blue"
        />
        <StatCard
          title="Life Inventory"
          value={stats?.inventoryUnits || 0}
          sub="Units Available"
          icon={<Droplet />}
          color="red"
        />
        <StatCard
          title="Active Needs"
          value={stats?.pendingRequests || 0}
          sub="Pending Fulfillment"
          icon={<Activity />}
          color="orange"
        />
        <StatCard
          title="Saved Lives"
          value={stats?.successfulDonations || 0}
          sub="Total Verified"
          icon={<CheckCircle />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SECTION 3: BLOOD GROUP INVENTORY HEALTH */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <Database size={24} className="text-red-600" /> Inventory
              Analytics
            </h3>
            <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
              Real-time Stock
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats?.bloodGroupStats.map((item) => (
              <div
                key={item.group}
                className="p-4 rounded-3xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-red-100 transition-all group"
              >
                <p className="text-xs font-black text-gray-400 group-hover:text-red-500">
                  {item.group}
                </p>
                <p className="text-2xl font-black text-gray-900">
                  {item.units}{" "}
                  <span className="text-[10px] text-gray-400">Units</span>
                </p>
                <div className="mt-2 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.units < 5 ? "bg-orange-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(item.units * 10, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: SYSTEM ALERTS */}
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <ShieldAlert
            className="absolute -bottom-4 -right-4 text-white/5"
            size={120}
          />
          <h3 className="text-lg font-black mb-6">Critical Alerts</h3>
          <div className="space-y-4 relative z-10">
            {stats?.pendingRequests ? (
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle size={16} className="text-orange-400" />
                  <p className="text-xs font-black uppercase tracking-widest">
                    Urgent Fulfillment
                  </p>
                </div>
                <p className="text-sm text-gray-300 font-medium">
                  There are {stats.pendingRequests} requests tagged as URGENT
                  requiring immediate donor matching.
                </p>
              </div>
            ) : null}
            <Link
              href="/admin/verifications"
              className="block p-4 bg-red-600 rounded-2xl hover:bg-red-500 transition-colors"
            >
              <p className="text-xs font-black uppercase tracking-widest text-center">
                Open Audit Logs
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean Stats
function StatCard({
  title,
  value,
  sub,
  icon,
  color,
}: {
  title: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50",
    red: "text-red-600 bg-red-50",
    orange: "text-orange-600 bg-orange-50",
    green: "text-green-600 bg-green-50",
  };

  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        {title}
      </h4>
      <p className="text-4xl font-black text-gray-900 tracking-tighter mt-1">
        {value.toLocaleString()}
      </p>
      <p className="text-xs font-bold text-gray-400 mt-2">{sub}</p>
    </div>
  );
}
