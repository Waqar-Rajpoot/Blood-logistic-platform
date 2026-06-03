"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User, Mail, Lock, Phone,
  Droplets, Briefcase, Eye, EyeOff, Map as MapIcon, AlertCircle, CheckCircle2
} from "lucide-react";
import PasswordStrength from "@/components/PasswordStrength";
import dynamic from "next/dynamic";
import { userRegisterSchema } from "@/schema/user";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">Loading Map...</div>
});

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Track errors and which fields the user has interacted with
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "donor" as "donor" | "receiver",
    bloodGroup: "",
    phoneNumber: "",
    city: "",
    area: "",
    latitude: null as number | null, 
    longitude: null as number | null,
  });

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setUser(prev => ({ ...prev, latitude: lat, longitude: lng }));
    setTouched(prev => ({ ...prev, location: true }));
  }, []);

  const getFormattedData = useCallback(() => {
    return {
      ...user,
      location: {
        type: "Point" as const,
        coordinates: (user.latitude !== null && user.longitude !== null) 
          ? [user.longitude, user.latitude] 
          : []
      }
    };
  }, [user]);

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched to show errors on click
    const allTouched: Record<string, boolean> = {};
    Object.keys(user).forEach(key => allTouched[key] = true);
    allTouched.location = true;
    setTouched(allTouched);

    const dataToValidate = getFormattedData();
    const validation = userRegisterSchema.safeParse(dataToValidate);
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      toast.error(validation.error.errors[0].message);
      return;
    }

    try {
      setLoading(true);
      const finalPayload = {
        ...dataToValidate,
        bloodGroup: user.role === "receiver" ? "N/A" : user.bloodGroup,
      };

      await axios.post("/api/users/signup", finalPayload);
      toast.success("Account created successfully!");
      const emailType = "VERIFY";
      router.replace(`/verify/${user.username}?emailType=${emailType}`);

    } catch (error: any) {
      toast.error(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dataToValidate = getFormattedData();
    const result = userRegisterSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  }, [getFormattedData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl w-full max-w-3xl border border-gray-100">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-red-50 p-4 rounded-2xl mb-3 text-red-600">
            <Droplets size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Join the Pulse</h1>
          <p className="text-gray-500 font-medium px-4">Create your account to start saving lives or requesting aid.</p>
        </div>

        <form onSubmit={onSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><User size={16} /> Username</label>
              <input 
                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-colors ${errors.username && touched.username ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-red-300"}`} 
                type="text" 
                value={user.username} 
                onBlur={() => handleBlur('username')}
                onChange={(e) => setUser({ ...user, username: e.target.value })} 
                placeholder="johndoe" 
              />
              {errors.username && touched.username && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Mail size={16} /> Email</label>
              <input 
                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-colors ${errors.email && touched.email ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-red-300"}`} 
                type="email" 
                value={user.email} 
                onBlur={() => handleBlur('email')}
                onChange={(e) => setUser({ ...user, email: e.target.value })} 
                placeholder="name@email.com" 
              />
              {errors.email && touched.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Lock size={16} /> Password</label>
              <div className="relative">
                <input 
                  className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-colors ${errors.password && touched.password ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-red-300"}`} 
                  type={showPassword ? "text" : "password"} 
                  value={user.password} 
                  onBlur={() => handleBlur('password')}
                  onChange={(e) => setUser({ ...user, password: e.target.value })} 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && touched.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password}</p>}
              <PasswordStrength password={user.password} />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Briefcase size={16} /> I am a</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-300 transition-colors cursor-pointer font-bold text-gray-700" 
                value={user.role} 
                onChange={(e) => setUser({...user, role: e.target.value as "donor" | "receiver", bloodGroup: e.target.value === "receiver" ? "" : user.bloodGroup})}
              >
                <option value="donor">Donor</option>
                <option value="receiver">Receiver / Hospital</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                   <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                     <MapIcon size={16} /> Pin Your Location
                   </label>
                   {user.latitude ? (
                     <span className="flex items-center gap-1 text-[10px] text-green-600 font-black uppercase bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                       <CheckCircle2 size={10} /> Selected
                     </span>
                   ) : (
                     <span className="flex items-center gap-1 text-[10px] text-red-600 font-black uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                       <AlertCircle size={10} /> Pin Required
                     </span>
                   )}
                </div>

                <div className={`rounded-2xl overflow-hidden border-2 h-[300px] transition-all duration-300 ${errors.location && touched.location ? "border-red-200 shadow-inner" : "border-green-100 shadow-sm"}`}>
                  <MapPicker 
                    onLocationSelect={handleLocationSelect} 
                    defaultLocation={user.latitude ? {lat: user.latitude, lng: user.longitude!} : undefined} 
                  />
                </div>
                {errors.location && touched.location && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1">Please select a point on the map</p>}
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">City</label>
                  <input 
                    className={`w-full p-3 bg-gray-50 border rounded-xl outline-none ${errors.city && touched.city ? "border-red-500" : "border-gray-200"}`} 
                    type="text" 
                    value={user.city} 
                    onBlur={() => handleBlur('city')}
                    onChange={(e) => setUser({ ...user, city: e.target.value })} 
                    placeholder="City" 
                  />
                  {errors.city && touched.city && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.city}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Area</label>
                  <input 
                    className={`w-full p-3 bg-gray-50 border rounded-xl outline-none ${errors.area && touched.area ? "border-red-500" : "border-gray-200"}`} 
                    type="text" 
                    value={user.area} 
                    onBlur={() => handleBlur('area')}
                    onChange={(e) => setUser({ ...user, area: e.target.value })} 
                    placeholder="Area/Street" 
                  />
                  {errors.area && touched.area && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.area}</p>}
                </div>
             </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Droplets size={16} className={user.role === "receiver" ? "text-gray-300" : "text-red-600"} /> 
                Blood Group
              </label>
              <select 
                disabled={user.role === "receiver"}
                className={`w-full p-3 border rounded-xl outline-none transition-all font-bold ${
                  user.role === "receiver" ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : errors.bloodGroup && touched.bloodGroup ? "border-red-500 bg-gray-50" : "bg-gray-50 border-gray-200"
                }`}
                value={user.role === "receiver" ? "" : user.bloodGroup} 
                onBlur={() => handleBlur('bloodGroup')}
                onChange={(e) => setUser({ ...user, bloodGroup: e.target.value })}
              >
                {user.role === "receiver" ? (
                  <option value="">Not Required</option>
                ) : (
                  <>
                    <option value="">Select Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                  </>
                )}
              </select>
              {errors.bloodGroup && touched.bloodGroup && user.role !== "receiver" && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.bloodGroup}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Phone size={16} /> Phone Number</label>
              <input 
                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none ${errors.phoneNumber && touched.phoneNumber ? "border-red-500" : "border-gray-200"}`} 
                type="text" 
                value={user.phoneNumber} 
                onBlur={() => handleBlur('phoneNumber')}
                onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })} 
                placeholder="+92..." 
              />
              {errors.phoneNumber && touched.phoneNumber && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div className="md:col-span-2 mt-6">
            <button
              disabled={loading}
              className={`w-full p-4 rounded-2xl font-black text-white transition-all uppercase tracking-widest text-sm shadow-lg ${
                loading 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-red-600 hover:bg-red-700 active:scale-[0.98] shadow-red-200"
              }`}
            >
              {loading ? "Creating Account..." : "Register & Save Lives"}
            </button>
            <p className="text-center text-gray-400 mt-6 text-xs font-bold">
              Already have an account? <Link href="/login" className="text-red-600 hover:underline">Sign In Now</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}