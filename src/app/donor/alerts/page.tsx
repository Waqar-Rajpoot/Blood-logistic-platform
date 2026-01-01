"use client";
import React, { useState, useEffect, useCallback } from "react";
import { 
  Bell, MapPin, Droplet, Clock, 
  Info, CheckCircle, Loader2, HandHelping, 
  User, Navigation, ExternalLink
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// The Model Interface matching your MongoDB GeoJSON structure
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
  location?: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Haversine Distance Formula: Calculates distance in KM between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
  const [donorBloodGroup, setDonorBloodGroup] = useState("");
  const [donorCoords, setDonorCoords] = useState<{lat: number, lng: number} | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      
      const userRes = await axios.get("/api/users/me");
      const userData = userRes.data.data;
      
      if (!userData.bloodGroup) {
        toast.error("Update your blood group in profile to see alerts.");
        setLoading(false);
        return;
      }

      setDonorBloodGroup(userData.bloodGroup);
      setDonorId(userData._id);
      
      if (userData.location?.coordinates && userData.location.coordinates.length === 2) {
        setDonorCoords({
          lng: userData.location.coordinates[0],
          lat: userData.location.coordinates[1]
        });
      }

      const response = await axios.get(`/api/donor/matching-requests`, {
        params: { bloodGroup: userData.bloodGroup }
      });
      
      setAlerts(response.data.requests || []);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to sync live alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleRespond = async (requestId: string) => {
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
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <Bell className="text-red-600 animate-pulse" /> Urgent Alerts
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Matches for <span className="text-red-600 font-bold px-2 py-0.5 bg-red-50 rounded-lg">{donorBloodGroup}</span>
            </p>
          </div>
          <button onClick={fetchAlerts} className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm hover:rotate-180 transition-all duration-500">
            <Clock size={20} className={`${loading ? 'animate-spin' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
              <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">Finding nearest requests...</p>
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((request) => {
              const hasResponded = request.potentialDonors?.includes(donorId);
              
              // Safely calculate distance only if both donor and request have valid coordinates
              const hasValidCoords = donorCoords && request.location?.coordinates?.length === 2;
              const distanceLabel = hasValidCoords 
                ? calculateDistance(
                    donorCoords!.lat, donorCoords!.lng, 
                    request.location!.coordinates[1], request.location!.coordinates[0]
                  )
                : null;

              return (
                <div key={request._id} className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm border-l-[12px] hover:shadow-xl transition-all ${request.isUrgent ? 'border-red-600' : 'border-orange-500'}`}>
                  <div className="p-8">
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h3 className="font-black text-gray-900 text-2xl">{request.hospitalName}</h3>
                           {request.isUrgent && <span className="bg-red-600 text-[10px] text-white px-2 py-1 rounded-full animate-bounce">URGENT</span>}
                        </div>
                        {distanceLabel && (
                          <div className="flex items-center gap-1.5 text-red-600 font-bold text-sm bg-red-50 w-fit px-3 py-1 rounded-full">
                            <Navigation size={14} className="fill-current" />
                            {distanceLabel}
                          </div>
                        )}
                      </div>
                      <div className="bg-red-600 text-white w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl shadow-lg">
                        {request.bloodGroup}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <User size={18} className="text-gray-400" />
                        <span className="font-bold text-sm text-gray-700">Patient: {request.patientName}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <Droplet size={18} className="text-red-500" />
                        <span className="font-bold text-sm text-gray-700">{request.unitsRequired} Units Needed</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <MapPin size={18} className="text-gray-400" />
                        <span className="font-bold text-sm text-gray-700">{request.area}, {request.city}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <Clock size={18} className="text-gray-400" />
                        <span className="font-bold text-sm text-gray-700">Status: {request.status}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {hasResponded ? (
                        <div className="flex-1 bg-green-50 text-green-700 py-4 rounded-2xl font-black flex items-center justify-center gap-2 border border-green-200">
                          <CheckCircle size={20} /> Response Sent
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleRespond(request._id)}
                          className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                        >
                          <HandHelping size={20} /> I can Donate
                        </button>
                      )}
                      
                      {/* Fixed Google Maps URL and safe coordination access */}
                      <a 
                        href={request.location?.coordinates 
                          ? `https://www.google.com/maps/search/?api=1&query=${request.location.coordinates[1]},${request.location.coordinates[0]}`
                          : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if(!request.location?.coordinates) {
                            e.preventDefault();
                            toast.error("Hospital location coordinates missing");
                          }
                        }}
                        className={`flex-1 bg-white border-2 border-gray-100 hover:border-red-200 text-gray-800 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${!request.location?.coordinates && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <ExternalLink size={20} className="text-red-600" /> Get Directions
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
              <h3 className="text-xl font-black text-gray-800">Everything is Balanced</h3>
              <p className="text-gray-500 max-w-xs mx-auto mt-2">No active requests for {donorBloodGroup} in your area right now.</p>
            </div>
          )}
        </div>

        <div className="mt-10 bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex gap-4">
          <Info className="text-blue-500 shrink-0" size={24} />
          <p className="text-sm text-blue-900 font-medium leading-relaxed">
            Distances are calculated in a straight line from your registered profile location to the hospital pin. Travel time may vary based on traffic.
          </p>
        </div>
      </div>
    </div>
  );
}