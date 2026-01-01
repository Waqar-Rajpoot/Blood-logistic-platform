"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  ClipboardList,
  Trash2,
  Users,
  ShieldCheck,
  Phone,
  Loader2,
  MapPin,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// SHADCN COMPONENTS
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PotentialDonor {
  _id: string;
  username: string;
  phoneNumber: string;
  bloodGroup: string;
  location: {
    coordinates: [number, number];
  };
}

interface BloodRequest {
  _id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  isUrgent: boolean;
  status: "Pending" | "Fulfilled"; // Status check
  potentialDonors: PotentialDonor[];
  createdAt: string;
  location: {
    coordinates: [number, number];
  };
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A";
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
  const d = R * c;
  return d < 1 ? `${(d * 1000).toFixed(0)}m` : `${d.toFixed(1)}km`;
};

export default function MyRequests() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    action: () => void;
    variant: "default" | "destructive";
  } | null>(null);

  const fetchMyRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/receiver/my-requests");
      setRequests(res.data.requests || []);
    } catch (error: any) {
      toast.error(`Failed to load requests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const handleVerifyDonation = async (requestId: string, donorId: string) => {
    try {
      setVerifyingId(donorId);
      await axios.post("/api/receiver/verify", { requestId, donorId });

      // Update local state immediately for better UX
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "Fulfilled" } : req
        )
      );

      toast.success("Donation Verified!");
    } catch (error: any) {
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setVerifyingId(null);
      setDialogOpen(false);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/requests/${id}`);
      toast.success("Request removed");
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error: any) {
      toast.error(`Failed to delete request: ${error.message}`);
    } finally {
      setDeletingId(null);
      setDialogOpen(false);
    }
  };

  const triggerVerifyDialog = (requestId: string, donorId: string) => {
    setDialogConfig({
      title: "Verify Donation?",
      description:
        "Confirm you received blood. This marks the request as fulfilled.",
      variant: "default",
      action: () => handleVerifyDonation(requestId, donorId),
    });
    setDialogOpen(true);
  };

  const triggerDeleteDialog = (id: string) => {
    setDialogConfig({
      title: "Delete Request?",
      description:
        "This will permanently remove the request from the live feed.",
      variant: "destructive",
      action: () => deleteRequest(id),
    });
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent className="rounded-[2rem] bg-white border-none shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black text-gray-800">
                {dialogConfig?.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="font-semibold text-gray-500 text-base">
                {dialogConfig?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 mt-4">
              <AlertDialogCancel className="rounded-2xl font-bold py-6 border-gray-200">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  dialogConfig?.action();
                }}
                className={`rounded-2xl py-6 px-8 font-black transition-all ${
                  dialogConfig?.variant === "destructive"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="mb-10">
          <h1 className="text-4xl font-black flex items-center gap-3 tracking-tight">
            <ClipboardList className="text-red-600" size={36} /> My Requests
          </h1>
          <p className="text-gray-500 mt-2 font-bold text-lg">
            Monitor donor responses and verify contributions.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
            <p className="font-black text-gray-400 text-xl">
              Loading your requests...
            </p>
          </div>
        ) : requests.length > 0 ? (
          <div className="grid grid-cols-1 gap-10">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-200 overflow-hidden"
              >
                <div className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-red-600 text-white px-5 py-2 rounded-xl font-black text-lg shadow-lg shadow-red-200">
                        {req.bloodGroup}
                      </span>
                      {req.isUrgent && (
                        <span className="text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl uppercase border border-red-100 animate-pulse">
                          Emergency Case
                        </span>
                      )}
                      {req.status === "Fulfilled" && (
                        <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-xl uppercase border border-green-100 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                      {req.hospitalName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-gray-500 font-bold">
                      <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-lg text-sm">
                        <MapPin size={16} className="text-red-500" />{" "}
                        {req.patientName}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-lg text-sm">
                        <Users size={16} className="text-blue-500" />{" "}
                        {req.unitsRequired} Units Required
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={deletingId === req._id}
                    onClick={() => triggerDeleteDialog(req._id)}
                    className="p-5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-inner"
                  >
                    {deletingId === req._id ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>

                <div className="bg-gray-50/50 border-t border-gray-100 p-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] mb-4 flex items-center gap-3">
                    <Users size={16} className="text-blue-500" /> Responded
                    Donors ({req.potentialDonors?.length || 0})
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {req.potentialDonors?.map((donor) => {
                      const reqLat = req.location?.coordinates?.[1];
                      const reqLng = req.location?.coordinates?.[0];
                      const donorLat = donor.location?.coordinates?.[1];
                      const donorLng = donor.location?.coordinates?.[0];

                      const distance = calculateDistance(
                        reqLat,
                        reqLng,
                        donorLat,
                        donorLng
                      );
                      const isFulfilled = req.status === "Fulfilled";

                      return (
                        <div
                          key={donor._id}
                          className={`bg-white border p-4 rounded-[2.5rem] transition-all ${
                            isFulfilled
                              ? "border-green-100 bg-green-50/20 shadow-none"
                              : "border-gray-200 shadow-md hover:shadow-lg"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                              <p className="font-black text-gray-800 text-xl tracking-tight">
                                {donor.username}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="bg-blue-50 text-blue-700 text-sm font-black px-3 py-1 rounded-xl flex items-center gap-1.5 border border-blue-100">
                                  <Navigation
                                    size={12}
                                    className="fill-current"
                                  />{" "}
                                  {distance} away
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <a
                                href={`tel:${donor.phoneNumber}`}
                                className="p-3 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                              >
                                <Phone size={20} />
                              </a>
                              <p>{donor.phoneNumber}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              disabled={
                                isFulfilled || verifyingId === donor._id
                              }
                              onClick={() =>
                                triggerVerifyDialog(req._id, donor._id)
                              }
                              className={`flex-[2] py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
                                isFulfilled
                                  ? "bg-green-100 text-green-600 cursor-not-allowed"
                                  : "bg-gray-900 text-white hover:bg-black hover:scale-[1.02] active:scale-95 shadow-lg shadow-gray-200"
                              }`}
                            >
                              {verifyingId === donor._id ? (
                                <Loader2 className="animate-spin" size={18} />
                              ) : isFulfilled ? (
                                <CheckCircle2 size={18} />
                              ) : (
                                <ShieldCheck size={18} />
                              )}
                              {verifyingId === donor._id
                                ? "Processing..."
                                : isFulfilled
                                ? "Verified"
                                : "Verify Donation"}
                            </button>

                            {!isFulfilled && (
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${reqLat},${reqLng}&destination=${donorLat},${donorLng}&travelmode=driving`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-white border-2 border-gray-100 text-gray-600 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                              >
                                <MapPin size={18} /> Track
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-200">
            <ClipboardList className="mx-auto text-gray-200 mb-6" size={80} />
            <h2 className="text-3xl font-black text-gray-800">
              No active requests found.
            </h2>
            <p className="text-gray-500 mt-3 font-bold text-lg">
              Your blood requests will appear here once posted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
