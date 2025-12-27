"use client";
import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Trash2,
  Clock,
  Users,
  AlertCircle,
  ShieldCheck,
  Phone,
  Loader2,
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
}

interface BloodRequest {
  _id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  isUrgent: boolean;
  status: "Pending" | "Fulfilled";
  potentialDonors: PotentialDonor[];
  createdAt: string;
}

export default function MyRequests() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // State to manage the Shadcn Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    action: () => void;
    variant: "default" | "destructive";
  } | null>(null);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/receiver/my-requests");
      setRequests(res.data.requests);
    } catch (error: any) {
      toast.error(`Failed to load requests: ${error.message}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger for Verify Dialog
  const triggerVerifyDialog = (requestId: string, donorId: string) => {
    setDialogConfig({
      title: "Verify Donation?",
      description:
        "Confirm that you have received blood from this donor. This will mark the request as fulfilled and update the donor's history.",
      variant: "default",
      action: () => handleVerifyDonation(requestId, donorId),
    });
    setDialogOpen(true);
  };

  // Trigger for Delete Dialog
  const triggerDeleteDialog = (id: string) => {
    setDialogConfig({
      title: "Delete Request?",
      description:
        "Are you sure? This action cannot be undone. This request will be permanently removed from the live feed.",
      variant: "destructive",
      action: () => deleteRequest(id),
    });
    setDialogOpen(true);
  };

  const handleVerifyDonation = async (requestId: string, donorId: string) => {
    try {
      setVerifyingId(donorId);
      await axios.post("/api/receiver/verify", { requestId, donorId });
      toast.success("Donation Verified!");
      fetchMyRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Verification failed");
    } finally {
      setVerifyingId(null);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/requests/${id}`);
      toast.success("Request removed successfully");
      setRequests(requests.filter((req) => req._id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* SHADCN ALERT DIALOG */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent className="rounded-[2rem]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-black">
                {dialogConfig?.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="font-medium text-gray-500">
                {dialogConfig?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="rounded-xl font-bold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={dialogConfig?.action}
                className={`rounded-xl font-black ${
                  dialogConfig?.variant === "destructive"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <ClipboardList className="text-red-600" /> My Blood Requests
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Manage your posts and verify incoming donors.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
            <p className="font-bold animate-pulse">Syncing with database...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
              >
                {/* Main Content Area */}
                <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-red-600 text-white px-4 py-1.5 rounded-xl font-black text-lg">
                        {req.bloodGroup}
                      </span>
                      {req.isUrgent && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-lg uppercase tracking-wider animate-pulse">
                          <AlertCircle size={12} /> Emergency
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider border ${
                          req.status === "Fulfilled"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-orange-50 text-orange-600 border-orange-100"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">
                      {req.patientName}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <p className="flex items-center gap-1">
                        <Clock size={14} />{" "}
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-1 font-bold text-gray-600">
                        {req.unitsRequired} Units Required
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerDeleteDialog(req._id)}
                    disabled={deletingId === req._id}
                    className="p-4 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    {deletingId === req._id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 size={24} />
                    )}
                  </button>
                </div>

                {/* Donor Section */}
                <div className="bg-gray-50/70 border-t border-gray-100 p-8">
                  <h4 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" /> Responded
                    Donors ({req.potentialDonors?.length || 0})
                  </h4>

                  {req.potentialDonors?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {req.potentialDonors.map((donor) => (
                        <div
                          key={donor._id}
                          className="bg-white border border-gray-200 p-5 rounded-[1.5rem] flex items-center justify-between shadow-sm"
                        >
                          <div>
                            <p className="font-bold text-gray-800">
                              {donor.username}
                            </p>
                            <a
                              href={`tel:${donor.phoneNumber}`}
                              className="text-sm text-blue-600 font-bold flex items-center gap-1 hover:text-blue-800"
                            >
                              <Phone size={12} /> {donor.phoneNumber}
                            </a>
                          </div>
                          {req.status === "Pending" && (
                            <button
                              onClick={() =>
                                triggerVerifyDialog(req._id, donor._id)
                              }
                              disabled={!!verifyingId}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 disabled:bg-gray-300"
                            >
                              {verifyingId === donor._id ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <ShieldCheck size={14} />
                              )}
                              {verifyingId === donor._id
                                ? "Processing..."
                                : "Verify"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-[2rem] bg-white/50 italic text-gray-400">
                      Waiting for donors...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <ClipboardList size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-800">
              No Active Posts
            </h2>
            <button
              onClick={() => (window.location.href = "/receiver/request")}
              className="mt-8 bg-red-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg"
            >
              Post Request Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
