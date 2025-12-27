"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Lock, ShieldCheck, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

// 1. Wrap the logic in a Suspense Boundary for Next.js 15 Build Compatibility
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-red-600" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

// 2. Main Logic Component
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/users/resetPassword", {
        token,
        newPassword,
      });

      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }
      
      toast.success("Security Credentials Updated!");
      setNewPassword("");
      setConfirmPassword("");
      
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 mx-auto shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Secure Reset</h2>
            <p className="text-gray-500 font-medium text-sm mt-2">
              Create a strong password to protect your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-bold text-gray-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-bold text-gray-800"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !token}
              className="w-full bg-red-600 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating System...
                </>
              ) : (
                <>
                  Confirm New Password <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {!token && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
              <div className="text-orange-600 mt-0.5">⚠️</div>
              <p className="text-[10px] font-bold text-orange-800 leading-relaxed uppercase tracking-wider">
                Invalid session. Please request a new reset link from the forgot password page.
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
          Secure Terminal Access
        </p>
      </div>
    </div>
  );
}