"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, Droplet, Activity, CheckCircle, 
  AlertCircle, TrendingUp, Loader2,
  ArrowRight, HeartPulse, RefreshCw
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

interface ActivityItem {
  id: string;
  type: string;
  patientName: string;
  city: string;
  bloodGroup: string;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalDonors: number;
  activeRequests: number;
  successfulMatches: number;
  urgentRequests: number;
  pendingVerifications: number;
  recentActivity: ActivityItem[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      toast.error(`Failed to fetch admin stats: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative">
        <Loader2 className="animate-spin text-red-600" size={50} />
        <HeartPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-400" size={20} />
      </div>
      <p className="text-gray-500 font-black mt-4 tracking-widest uppercase text-xs">Synchronizing Core...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Admin Top Bar */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight">System Core</h1>
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Admin Authorization Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Server Time</p>
            <p className="text-sm font-bold text-gray-700">
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={fetchAdminData} 
            className="p-3 hover:bg-gray-100 rounded-2xl transition-all active:scale-90 border border-gray-100 shadow-sm"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 bg-gray-200">
        {/* Welcome Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter">System Overview</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-gray-500 font-bold">Monitoring {stats?.totalUsers || 0} active nodes in the donation network.</p>
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <AdminCard 
            title="Registry" 
            value={stats?.totalUsers || 0} 
            icon={<Users className="text-blue-600" />} 
            trend="Total Members"
            color="blue"
          />
          <AdminCard 
            title="Blood Donors" 
            value={stats?.totalDonors || 0} 
            icon={<Droplet className="text-red-600" />} 
            trend={`${Math.round(((stats?.totalDonors || 0) / (stats?.totalUsers || 1)) * 100)}% Participation`}
            color="red"
          />
          <AdminCard 
            title="Active Needs" 
            value={stats?.activeRequests || 0} 
            icon={<Activity className="text-orange-600" />} 
            trend={`${stats?.urgentRequests || 0} Critical Tags`}
            color="orange"
          />
          <AdminCard 
            title="Lives Impacted" 
            value={stats?.successfulMatches || 0} 
            icon={<CheckCircle className="text-green-600" />} 
            trend="Donations Finalized"
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                <TrendingUp size={24} className="text-red-600" /> Recent Activity
              </h3>
              <Link href="/admin/requests" className="text-xs font-black uppercase text-gray-900 hover:text-red-600 transition-colors">
                View All Records
              </Link>
            </div>

            <div className="space-y-1">
              {stats?.recentActivity?.length ? stats.recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                      {item.bloodGroup}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800">New Blood Request</p>
                      <p className="text-xs text-gray-500 font-medium">{item.patientName} • {item.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center text-gray-400 font-bold italic">
                  No activity packets detected in current cycle.
                </div>
              )}
            </div>
          </div>

          {/* Action Center Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <AlertCircle size={80} />
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                Action Center
              </h3>
              
              <div className="space-y-4">
                <div className="p-5 bg-orange-50 rounded-[2rem] border border-orange-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-black uppercase text-orange-700 tracking-widest">Identity Audit</p>
                    <span className="bg-orange-200 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-black">{stats?.pendingVerifications || 0}</span>
                  </div>
                  <p className="text-sm font-bold text-orange-900 leading-tight">Donors are awaiting profile verification.</p>
                  <Link href="/admin/users" className="mt-4 flex items-center gap-2 text-xs font-black text-orange-700 hover:gap-3 transition-all">
                    START AUDIT <ArrowRight size={14}/>
                  </Link>
                </div>

                <div className="p-5 bg-red-50 rounded-[2rem] border border-red-100">
                  <p className="text-xs font-black uppercase text-red-700 tracking-widest mb-2">Emergency Hub</p>
                  <p className="text-sm font-bold text-red-900 leading-tight">
                    {stats?.urgentRequests || 0} SOS alerts require immediate donor matching.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-gray-200">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Management Console</p>
              <div className="flex flex-col gap-3">
                <Link href="/admin/users" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                  <span className="text-sm font-bold">User Database</span>
                  <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                </Link>
                <Link href="/admin/requests" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                  <span className="text-sm font-bold">Request Logs</span>
                  <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
  color: 'blue' | 'red' | 'orange' | 'green';
}

function AdminCard({ title, value, icon, trend, color }: CardProps) {
  const colors = {
    blue: "hover:border-blue-200 group-hover:bg-blue-50",
    red: "hover:border-red-200 group-hover:bg-red-50",
    orange: "hover:border-orange-200 group-hover:bg-orange-50",
    green: "hover:border-green-200 group-hover:bg-green-50"
  };

  return (
    <div className={`bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all group ${colors[color]}`}>
      <div className="flex justify-between items-start mb-5">
        <div className={`p-4 bg-gray-50 rounded-2xl transition-colors ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{title}</h4>
      <p className="text-4xl font-black text-gray-900 mt-1 tracking-tighter">{value.toLocaleString()}</p>
      <div className="mt-3 flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <p className="text-xs font-bold text-gray-400">{trend}</p>
      </div>
    </div>
  );
}