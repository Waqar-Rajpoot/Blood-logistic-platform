"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import toast from "react-hot-toast";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

// 1. Main Export wrapped in Suspense
const VerifyEmailPage = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="mt-4 text-gray-500 font-black uppercase tracking-widest text-xs">
          Loading Verification Module...
        </p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
};

// 2. The component containing the logic
const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = useCallback(async (tokenToVerify: string) => {
    try {
      setLoading(true);
      await axios.post("/api/users/verifyemail", { token: tokenToVerify });
      setVerified(true);
      toast.success("Email verified successfully!");
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(true);
      const errorMsg = err.response?.data?.error || "Verification failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail(token);
    }
  }, [token, verifyUserEmail]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-xl rounded-[2.5rem] p-10 w-full max-w-md border border-gray-100">
        
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${
          verified ? "bg-green-50 text-green-600" : error ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
        }`}>
          {verified ? <CheckCircle size={40} /> : error ? <AlertTriangle size={40} /> : <Loader2 className="animate-spin" size={40} />}
        </div>

        <h1 className="text-3xl font-black text-center mb-2 text-gray-800 tracking-tighter">
          {verified ? "Verification Success" : error ? "Verification Failed" : "Checking Token..."}
        </h1>
        
        <p className="text-gray-500 text-center text-sm font-medium mb-8">
          {verified 
            ? "Your account is now active. Redirecting you to login..." 
            : error 
            ? "The link is invalid or has expired." 
            : "Please wait while we sync your credentials with our database."}
        </p>

        {loading && (
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        )}

        {error && (
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-black transition-all"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;