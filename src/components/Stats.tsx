"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Heart, Activity, Loader2 } from "lucide-react";

interface PublicStats {
  totalUsers: number;
  totalDonors: number;
  activeRequests: number;
  successfulMatches: number;
}

export default function Stats() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Calling the same stats API used by the admin dashboard
        const res = await axios.get("/api/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching live stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { 
      label: "Registered Members", 
      value: stats?.totalUsers || 0, 
      icon: <Users className="text-blue-600" size={24} />,
      suffix: "+"
    },
    { 
      label: "Ready Donors", 
      value: stats?.totalDonors || 0, 
      icon: <Heart className="text-red-600" size={24} />,
      suffix: ""
    },
    { 
      label: "Active Requests", 
      value: stats?.activeRequests || 0, 
      icon: <Activity className="text-orange-600" size={24} />,
      suffix: ""
    },
    { 
      label: "Lives Impacted", 
      value: stats?.successfulMatches || 0, 
      icon: <CheckCircle className="text-green-600" size={24} />,
      suffix: "+"
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Our Impact in Real-Time</h2>
          <p className="text-gray-500 font-medium mt-2">Every second counts. See how our community is growing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-all hover:-translate-y-1">
              <div className="p-4 bg-gray-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                {loading ? <Loader2 className="animate-spin text-gray-300" size={24} /> : item.icon}
              </div>
              <div className="text-4xl font-black text-gray-900 mb-1">
                {loading ? "..." : `${item.value}${item.suffix}`}
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Small helper component for the icon
function CheckCircle({ className, size }: { className?: string, size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}