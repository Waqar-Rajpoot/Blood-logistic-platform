"use client";
import React, { useState, useEffect } from "react";
import {
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Loader2,
  Search,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface BloodRequestLog {
  _id: string;
  patientName: string;
  bloodGroup: string;
  hospitalName: string;
  city: string;
  isUrgent: boolean;
  status: "Pending" | "Fulfilled" | "Expired";
  createdAt: string;
  unitsRequired: number;
}

export default function RequestLogs() {
  const [logs, setLogs] = useState<BloodRequestLog[]>([]);
  const [stats, setStats] = useState({ pending: 0, fulfilled: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/requests");
      setLogs(res.data.requests);
      setStats(res.data.stats);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === "All" || log.status === filter;
    const matchesSearch =
      log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <History className="text-red-600" /> Request Audit Logs
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Monitoring global blood demand and fulfillment cycles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search patient or city..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 outline-none w-full"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              {["All", "Pending", "Fulfilled"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    filter === f
                      ? "bg-red-600 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border-l-4 border-orange-500 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Ongoing Needs
            </p>
            <p className="text-2xl font-black text-gray-800">
              {loading ? "..." : stats.pending} Pending
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-green-500 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Successful Missions
            </p>
            <p className="text-2xl font-black text-gray-800">
              {loading ? "..." : stats.fulfilled} Fulfilled
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-red-600 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Critical Now
            </p>
            <p className="text-2xl font-black text-red-600">
              {loading ? "..." : stats.urgent} Urgent
            </p>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-red-600" size={40} />
              <p className="text-gray-400 font-bold">
                Retrieving audit trail...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Patient & Location
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Blood Info
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Date Posted
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-800 flex items-center gap-2">
                            {log.patientName}
                            {log.isUrgent && (
                              <span className="bg-red-100 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-red-200">
                                URGENT
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                            <MapPin size={12} className="text-red-400" />{" "}
                            {log.hospitalName}, {log.city}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md shadow-red-100">
                            {log.bloodGroup}
                          </span>
                          <p className="text-xs font-bold text-gray-600">
                            {log.unitsRequired} Units
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-600 font-bold flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" />
                          {new Date(log.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-tight ${
                            log.status === "Fulfilled"
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-orange-50 text-orange-700 border border-orange-100"
                          }`}
                        >
                          {log.status === "Fulfilled" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <AlertCircle size={12} />
                          )}
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/requests/${log._id}`} 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all inline-block"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLogs.length === 0 && (
                <div className="py-20 text-center text-gray-400 font-medium">
                  No requests matching your current filter.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
