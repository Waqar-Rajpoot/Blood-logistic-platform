"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Droplets,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react";
import PasswordStrength from "@/components/PasswordStrength";

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
  });

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (user.role === "donor" && !user.bloodGroup) {
        toast.error("Donors must select a blood group");
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/users/signup", user);
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
    // Password Validation Logic
    const hasUpperCase = /[A-Z]/.test(user.password);
    const hasLowerCase = /[a-z]/.test(user.password);
    const hasNumber = /[0-9]/.test(user.password);
    const hasSpecialChar = /[@$!%*#?&]/.test(user.password);
    const isPasswordSecure =
      user.password.length >= 8 &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar;

    const isFormValid =
      user.username.length > 0 &&
      user.email.length > 0 &&
      isPasswordSecure && // Submit only if password meets all criteria
      user.phoneNumber.length > 0 &&
      user.city.length > 0 &&
      (user.role !== "donor" || user.bloodGroup.length > 0);

    setButtonDisabled(!isFormValid);
  }, [user]);

  const handleRoleChange = (val: string) => {
    setUser({
      ...user,
      role: val,
      bloodGroup: val === "receiver" ? "" : user.bloodGroup,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-100 p-3 rounded-full mb-2">
            <Droplets className="text-red-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm">
            Join the life-saving community
          </p>
        </div>

        <form
          onSubmit={onSignup}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User size={16} /> Username
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-black"
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="johndoe"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-black"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="name@example.com"
              required
            />
          </div>

          {/* Password with Eye Toggle and Strength Meter */}
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock size={16} /> Password
            </label>
            <div className="relative">
              <input
                className="w-full p-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-black"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password Strength Component */}
            <PasswordStrength password={user.password} />
          </div>

          {/* Role Selection */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Briefcase size={16} /> Register As
            </label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-black"
              value={user.role}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="donor">Donor</option>
              <option value="receiver">Receiver / Hospital</option>
            </select>
          </div>

          {/* Blood Group */}
          <div className="space-y-1">
            <label
              className={`text-sm font-medium flex items-center gap-2 ${
                user.role === "receiver" ? "text-gray-400" : "text-gray-700"
              }`}
            >
              <Droplets size={16} /> Blood Group
            </label>
            <select
              disabled={user.role === "receiver"}
              className={`w-full p-2.5 border rounded-lg outline-none transition-all ${
                user.role === "receiver"
                  ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 focus:ring-2 focus:ring-red-500 text-black"
              }`}
              value={user.bloodGroup}
              onChange={(e) => setUser({ ...user, bloodGroup: e.target.value })}
            >
              <option value="">Select Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone size={16} /> Phone Number
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-black"
              type="text"
              value={user.phoneNumber}
              onChange={(e) =>
                setUser({ ...user, phoneNumber: e.target.value })
              }
              placeholder="+1 234 567 890"
              required
            />
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={16} /> City
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-black"
              type="text"
              value={user.city}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
              placeholder="Enter City"
              required
            />
          </div>

          {/* Area */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={16} /> Area
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-black"
              type="text"
              value={user.area}
              onChange={(e) => setUser({ ...user, area: e.target.value })}
              placeholder="Neighborhood/Street"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              disabled={buttonDisabled || loading}
              className={`w-full p-3 rounded-lg font-bold text-white transition-all ${
                buttonDisabled || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 shadow-lg active:scale-95"
              }`}
            >
              {loading ? "Creating Account..." : "Register Now"}
            </button>

            <p className="text-center text-gray-600 mt-4 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-red-600 font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
