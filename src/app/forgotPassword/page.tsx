"use client";
import React, { useState } from "react";
import axios from "axios";
import { Mail, ArrowLeft, KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);
    
    try {
      const res = await axios.post("/api/users/forgotPassword", { email });
      setMessage(res.data.message || "Reset link sent! Please check your inbox.");
      setEmail("");
    } catch (error: any) {
      setIsError(true);
      setMessage(error.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10 relative overflow-hidden">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6 shadow-inner">
              <KeyRound size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Forgot Password?</h2>
            <p className="text-gray-500 font-medium text-sm mt-2 leading-relaxed">
              No worries! Enter the email associated with your account and we&apos;ll send a secure reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-bold text-gray-800"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Feedback Messages */}
          {message && (
            <div className={`mt-8 p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
              isError 
              ? "bg-orange-50 border-orange-100 text-orange-800" 
              : "bg-green-50 border-green-100 text-green-800"
            }`}>
              {isError ? <AlertCircle className="shrink-0 mt-0.5" size={18} /> : <CheckCircle2 className="shrink-0 mt-0.5" size={18} />}
              <p className="text-xs font-bold leading-relaxed">
                {message}
              </p>
            </div>
          )}
        </div>

        {/* Support Footer */}
        <p className="text-center mt-8 text-xs font-bold text-gray-400">
          Remembered your password? <Link href="/login" className="text-red-600 hover:underline pl-1">Sign In</Link>
        </p>
      </div>
    </div>
  );
}