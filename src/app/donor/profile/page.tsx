"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  User, 
  MapPin, 
  Droplets, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Save,
  Clock
} from "lucide-react";

export default function DonorProfile() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    bloodGroup: "",
    city: "",
    area: "",
    isAvailable: true,
  });

  // Load initial data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setProfile(response.data.data);
      } catch (error: any) {
        toast.error(`Failed to load profile: ${error.message}`);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put("/api/users/update-profile", profile);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center items-center h-screen">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-red-600 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              <p className="text-red-100 italic">Manage your donor presence</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-8">
          
          {/* 1. Availability Toggle (The most important feature) */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${profile.isAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                  {profile.isAvailable ? <CheckCircle2 /> : <XCircle />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Donation Availability</h3>
                  <p className="text-sm text-gray-500">Toggle this off if you recently donated or are unwell.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, isAvailable: !profile.isAvailable })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  profile.isAvailable ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`${
                    profile.isAvailable ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
          </div>

          {/* 2. Personal & Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Droplets size={16} className="text-red-600" /> Blood Group
              </label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black cursor-not-allowed"
                disabled // Usually blood group doesn't change
                value={profile.bloodGroup}
              >
                <option>{profile.bloodGroup}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Phone size={16} className="text-gray-400" /> Phone Number
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          {/* 3. Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" /> City
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" /> Area
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black"
                value={profile.area}
                onChange={(e) => setProfile({ ...profile, area: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700 active:scale-95"
              }`}
            >
              {loading ? <Clock className="animate-spin" /> : <Save size={20} />}
              {loading ? "Updating..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}