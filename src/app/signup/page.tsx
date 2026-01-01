"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User, Mail, Lock, Phone,
  Droplets, Briefcase, Eye, EyeOff, Map as MapIcon
} from "lucide-react";
import PasswordStrength from "@/components/PasswordStrength";
import dynamic from "next/dynamic";

// Dynamically import MapPicker to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import("@/components/MapPicker"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "donor",
    bloodGroup: "",
    phoneNumber: "",
    city: "",
    area: "",
    latitude: 30.66, // Default Sahiwal
    longitude: 73.10,
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    setUser(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        ...user,
        location: {
          type: "Point",
          coordinates: [user.longitude, user.latitude] // GeoJSON format: Longitude first
        }
      };

      const response = await axios.post("/api/users/signup", payload);
      toast.success("Account created successfully!");
      if (response.data.success) {
        setUser({
          username: "",
          email: "",
          password: "",
          role: "donor",
          bloodGroup: "",
          phoneNumber: "",
          city: "",
          area: "",
          latitude: 30.66,
          longitude: 73.10,
        });
      }
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isFormValid =
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length >= 8 &&
      user.phoneNumber.length > 0 &&
      user.city.length > 0 &&
      user.area.length > 0 &&
      (user.role !== "donor" || user.bloodGroup.length > 0);

    setButtonDisabled(!isFormValid);
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl w-full max-w-3xl border border-gray-100">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-red-50 p-4 rounded-2xl mb-3 text-red-600">
            <Droplets size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Join the Pulse</h1>
          <p className="text-gray-500 font-medium">Pin your location on the map to help us find you in emergencies.</p>
        </div>

        <form onSubmit={onSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Basic Info */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><User size={16} /> Username</label>
              <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" type="text" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} placeholder="johndoe" required />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Mail size={16} /> Email</label>
              <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="name@email.com" required />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Lock size={16} /> Password</label>
              <div className="relative">
                <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" type={showPassword ? "text" : "password"} value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <PasswordStrength password={user.password} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Briefcase size={16} /> I am a</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={user.role} onChange={(e) => setUser({...user, role: e.target.value})}>
                <option value="donor">Donor</option>
                <option value="receiver">Receiver / Hospital</option>
              </select>
            </div>
          </div>

          {/* Map Selection Side */}
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapIcon size={16} /> Pin Your Location
                </label>
                <MapPicker 
                  onLocationSelect={handleLocationSelect} 
                  defaultLocation={{lat: user.latitude, lng: user.longitude}} 
                />
                <div className="flex justify-between items-center px-1">
                  <p className="text-[10px] text-gray-400">Click map to move pin</p>
                  <p className="text-[10px] font-bold text-red-500 uppercase">Proximity search enabled</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">City</label>
                  <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" type="text" value={user.city} onChange={(e) => setUser({ ...user, city: e.target.value })} placeholder="Sahiwal" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Area</label>
                  <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" type="text" value={user.area} onChange={(e) => setUser({ ...user, area: e.target.value })} placeholder="Farid Town" required />
                </div>
             </div>
          </div>

          {/* Bottom Row */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Droplets size={16} className="text-red-600" /> Blood Group</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={user.bloodGroup} onChange={(e) => setUser({ ...user, bloodGroup: e.target.value })}>
                <option value="">Select Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Phone size={16} /> Phone Number</label>
              <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" type="text" value={user.phoneNumber} onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })} placeholder="+92..." required />
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              disabled={buttonDisabled || loading}
              className={`w-full p-4 rounded-2xl font-black text-white transition-all uppercase tracking-widest ${
                buttonDisabled || loading ? "bg-gray-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 shadow-xl shadow-red-100"
              }`}
            >
              {loading ? "Registering..." : "Register & Save Lives"}
            </button>
            <p className="text-center text-gray-500 mt-6 text-sm font-medium">
              Member already? <Link href="/login" className="text-red-600 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}