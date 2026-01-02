"use client";
import React, { useState } from "react";
import {
  HeartHandshake,
  Activity,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Download,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf"; // Import jsPDF

export default function VolunteerDonation() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");

  const [formData, setFormData] = useState({
    hbLevel: "",
    preferredDate: "",
    donorNote: "",
  });

  // PDF Generation Logic
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [100, 150], // Custom card size
    });

    // Design the PDF
    doc.setFillColor(16, 185, 129); // Emerald-500
    doc.rect(0, 0, 100, 20, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("DONATION TOKEN", 50, 12, { align: "center" });

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.text("LifeFlow Voluntary Donation", 50, 35, { align: "center" });

    doc.setFontSize(32);
    doc.setTextColor(5, 150, 105);
    doc.text(token, 50, 65, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Preferred Date:", 20, 90);
    doc.setTextColor(0, 0, 0);
    doc.text(formData.preferredDate, 80, 90, { align: "right" });

    doc.setDrawColor(200, 200, 200);
    doc.line(10, 105, 90, 105);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Please present this digital or printed card", 50, 120, {
      align: "center",
    });
    doc.text("at the blood bank reception.", 50, 125, { align: "center" });

    doc.save(`Donation_Token_${token}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.preferredDate) {
      return toast.error("Please select a preferred date");
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/donor/volunteer", formData);

      if (res.data.success) {
        setToken(res.data.token);
        setSubmitted(true);
        toast.success("Contribution recorded!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-xl text-center border-4 border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-emerald-600" size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-500 font-medium mb-8">
            Your offer to strengthen our blood inventory has been recorded.
          </p>

          <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-dashed border-emerald-200 mb-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Your Donation Token
            </span>
            <div className="text-4xl font-black text-emerald-700 mt-1 tracking-wider">
              {token}
            </div>
          </div>
          <button
            onClick={generatePDF}
            className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-4 rounded-2xl font-bold mb-4 hover:bg-emerald-100 border-2 border-emerald-200 transition-all"
          >
            <Download size={20} /> Download Token PDF
          </button>

          <button
            onClick={() => (window.location.href = "/donor")}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
          >
            Back to Dashboard
          </button>
          <p className="text-red-500 font-medium mt-8">
            Please download the token and present it at the blood bank
            reception.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* ... (rest of the form remains unchanged) ... */}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-red-100 rounded-3xl mb-4 text-red-600">
            <HeartHandshake size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900">
            Volunteer Donation
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Help us maintain a healthy inventory for future emergencies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Activity size={18} className="text-red-500" />
                Hemoglobin (HB) Level{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 16.5"
                value={formData.hbLevel}
                onChange={(e) =>
                  setFormData({ ...formData, hbLevel: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-lg"
              />
            </div>

            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Calendar size={18} className="text-red-500" />
                Preferred Donation Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={formData.preferredDate}
                onChange={(e) =>
                  setFormData({ ...formData, preferredDate: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-lg"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <MessageSquare size={18} className="text-red-500" />
                Additional Note
              </label>
              <textarea
                placeholder="Any specific time preference or health info..."
                rows={3}
                value={formData.donorNote}
                onChange={(e) =>
                  setFormData({ ...formData, donorNote: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-red-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Submit Offer <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
