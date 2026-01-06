"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  MapPin,
  Droplet,
  Clock,
  CheckCircle,
  Loader2,
  HandHelping,
  User,
  Navigation,
  ExternalLink,
  Star,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface BloodRequest {
  _id: string;
  patientName: string;
  bloodGroup: string;
  hospitalName: string;
  city: string;
  area: string;
  isUrgent: boolean;
  status: string;
  unitsRequired: number;
  contactNumber: string;
  createdAt: string;
  potentialDonors: string[]; 
  respondedDonors: string[]; 
  location?: {
    coordinates: [number, number];
  };
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance < 1
    ? `${(distance * 1000).toFixed(0)}m away`
    : `${distance.toFixed(1)} km away`;
};

export default function DonorAlerts() {
  const [alerts, setAlerts] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [donorId, setDonorId] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean>(true); // Track availability
  const [radius, setRadius] = useState("20");
  const [donorBloodGroup, setDonorBloodGroup] = useState("");
  const [donorCoords, setDonorCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const userRes = await axios.get("/api/users/me");
      const userData = userRes.data.data;
      
      // Store availability status
      setIsAvailable(userData.isAvailable);

      if (!userData.bloodGroup) {
        toast.error("Update your blood group in profile to see alerts.");
        setLoading(false);
        return;
      }

      setDonorBloodGroup(userData.bloodGroup);
      setDonorId(userData._id);

      if (userData.location?.coordinates?.length === 2) {
        setDonorCoords({
          lng: userData.location.coordinates[0],
          lat: userData.location.coordinates[1],
        });
      }

      const response = await axios.get(`/api/donor/matching-requests`, {
        params: { bloodGroup: userData.bloodGroup, radius: radius },
      });
      setAlerts(response.data.requests || []);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to sync live alerts");
    } finally {
      setLoading(false);
    }
  }, [radius]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleRespond = async (requestId: string) => {
    // Restriction Check: Availability
    if (!isAvailable) {
      toast.error("You are currently marked as unavailable for donation. Please update your profile status to help.", {
        duration: 4000,
        icon: '⚠️'
      });
      return;
    }

    try {
      const res = await axios.post("/api/donor/respond", { requestId });
      if (res.data.success) {
        toast.success("Interest sent! The receiver can now see your contact.");
        fetchAlerts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to respond");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <Bell className="text-red-600 animate-pulse" /> Urgent Alerts
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Matches for{" "}
              <span className="text-red-600 font-bold px-2 py-0.5 bg-red-50 rounded-lg">
                {donorBloodGroup}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 shadow-sm">
              <MapPin size={16} className="text-gray-400 mr-2" />
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="py-3 bg-transparent font-bold text-gray-600 text-sm outline-none cursor-pointer pr-2"
              >
                <option value="10">10 KM</option>
                <option value="20">20 KM</option>
                <option value="30">30 KM</option>
                <option value="50">50 KM</option>
                <option value="10000">Anywhere</option>
              </select>
            </div>
            
            <button
              onClick={fetchAlerts}
              className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:rotate-180 transition-all duration-500"
              title="Refresh Alerts"
            >
              <Clock
                size={20}
                className={loading ? "animate-spin text-red-500" : "text-gray-400"}
              />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
              <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Scanning for matches...</p>
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((request) => {
              const hasResponded = request.respondedDonors?.includes(donorId);
              const isDirectInvite = request.potentialDonors?.includes(donorId);

              const hasValidCoords =
                donorCoords && request.location?.coordinates?.length === 2;
              const distanceLabel = hasValidCoords
                ? calculateDistance(
                    donorCoords!.lat,
                    donorCoords!.lng,
                    request.location!.coordinates[1],
                    request.location!.coordinates[0]
                  )
                : null;

              return (
                <div
                  key={request._id}
                  className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm border-l-[12px] relative transition-all hover:shadow-md ${
                    request.isUrgent ? "border-red-600" : "border-orange-500"
                  }`}
                >
                  {isDirectInvite && !hasResponded && (
                    <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-bl-2xl font-black text-[10px] uppercase flex items-center gap-1.5 border-b border-l border-amber-200">
                      <Star size={12} fill="currentColor" /> Hand-Picked for you
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-gray-900 text-2xl">
                            {request.hospitalName}
                          </h3>
                          {request.isUrgent && (
                            <span className="bg-red-100 text-red-600 font-bold text-[10px] px-2 py-0.5 rounded-md">
                              URGENT
                            </span>
                          )}
                        </div>
                        {distanceLabel && (
                          <div className="flex items-center gap-1.5 text-red-600 font-bold text-sm">
                            <Navigation size={14} fill="currentColor" />{" "}
                            {distanceLabel}
                          </div>
                        )}
                      </div>
                      <div className="bg-red-600 text-white min-w-[3.5rem] h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                        {request.bloodGroup}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                        <User size={18} className="text-gray-400" />
                        <span className="font-bold text-sm text-gray-700">
                          Patient: {request.patientName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                        <Droplet size={18} className="text-red-500" />
                        <span className="font-bold text-sm text-gray-700">
                          {request.unitsRequired} Units Required
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                        <MapPin size={18} className="text-gray-400" />
                        <span className="font-bold text-sm text-gray-700">
                          {request.area}, {request.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                        <Clock size={18} className="text-gray-400" />
                        <span className="font-bold text-sm text-gray-700 capitalize">
                          Status: {request.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {hasResponded ? (
                        <div className="flex-1 bg-green-100 text-green-700 py-4 rounded-2xl font-black flex items-center justify-center gap-2 border border-green-200">
                          <CheckCircle size={20} /> Response Sent
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRespond(request._id)}
                          className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                        >
                          <HandHelping size={20} />{" "}
                          {isDirectInvite ? "Accept Request" : "I can Donate"}
                        </button>
                      )}
                      <a
                        href={
                          hasValidCoords
                            ? `https://www.google.com/maps/dir/?api=1&origin=${donorCoords?.lat},${donorCoords?.lng}&destination=${request.location?.coordinates[1]},${request.location?.coordinates[0]}&travelmode=driving`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 bg-white border border-gray-200 text-gray-800 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all hover:bg-gray-50 ${!hasValidCoords && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <ExternalLink size={20} className="text-red-600" />{" "}
                        Track Route
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-16 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
              <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-800">
                No Pending Requests
              </h3>
              <p className="text-gray-500 mt-2">
                Check back later or increase your search radius.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}