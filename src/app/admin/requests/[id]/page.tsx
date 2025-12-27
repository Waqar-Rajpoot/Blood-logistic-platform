"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { 
  ArrowLeft, MapPin, Phone, Mail, 
  Calendar, Trash2, Clock, 
  AlertTriangle, User 
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function RequestDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/admin/requests/${id}`);
        setData(res.data);
      } catch (err) {
        toast.error(`Failed to fetch request details: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`/api/admin/requests/${id}`);
      toast.success("Request Deleted");
      router.push("/admin/requests");
    } catch (err) {
      toast.error(`Failed to delete request: ${err}`);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading Details...</div>;
  if (!data) return <div className="p-20 text-center">Request not found.</div>;

  const { data: request, creator } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> Back to Logs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    request.isUrgent ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    {request.isUrgent ? "Emergency" : "Standard"}
                  </span>
                  <h1 className="text-4xl font-black text-gray-900 mt-4">{request.patientName}</h1>
                  <p className="text-gray-500 font-medium flex items-center gap-2 mt-2">
                    <MapPin size={16} className="text-red-500" /> {request.hospitalName}, {request.city}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600 text-white rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg shadow-red-200">
                    {request.bloodGroup}
                  </div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mt-2 tracking-tighter">Required Group</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50">
                <DetailItem icon={<Clock size={18}/>} label="Units Required" value={`${request.unitsRequired} Units`} />
                <DetailItem icon={<Calendar size={18}/>} label="Posted On" value={new Date(request.createdAt).toLocaleDateString()} />
              </div>
            </div>
            {/* Poster Details */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <User size={22} className="text-red-600" /> Requester Profile
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                        {creator?.username[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{creator?.username || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">Registered Member</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 pl-2">
                    <p className="text-sm text-gray-600 flex items-center gap-3 font-medium"><Mail size={16}/> {creator?.email}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-3 font-medium"><Phone size={16}/> {request?.contactNumber || "No phone provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-xl">
              <h3 className="text-lg font-black mb-6">Request Status</h3>
              <div className="space-y-4">
                <StatusBadge status={request.status} />
                <p className="text-xs text-gray-400 font-medium">
                  Current system status for this entry. Admins can moderate or remove this record if it violates terms.
                </p>
                <div className="pt-4 space-y-3">
                    <button 
                      onClick={handleDelete}
                      className="w-full py-4 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 size={18} /> Delete Entry
                    </button>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100">
                <div className="flex items-center gap-2 text-orange-700 font-black mb-2">
                    <AlertTriangle size={20} />
                    <span>Admin Note</span>
                </div>
                <p className="text-xs text-orange-800 font-medium leading-relaxed">
                    Always verify hospital details before manually coordinating donors. Fraudulent requests can be deleted immediately.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-red-500">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        Pending: "bg-orange-500",
        Fulfilled: "bg-green-500",
        Expired: "bg-gray-500"
    };
    return (
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${colors[status]}`}></div>
            <span className="font-black text-xl uppercase tracking-widest">{status}</span>
        </div>
    );
}