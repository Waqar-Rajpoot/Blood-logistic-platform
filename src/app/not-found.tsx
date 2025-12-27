"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FileQuestion, MoveLeft } from "lucide-react";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-xl rounded-[2.5rem] p-10 w-full max-w-md border border-gray-100 text-center">
        
        {/* Icon Container matching your theme's style */}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-blue-50 text-blue-600">
          <FileQuestion size={40} />
        </div>

        {/* Large "404" Sub-header */}
        <span className="text-red-600 font-black uppercase tracking-[0.1em] text-lg mb-2 block">
          Error 404
        </span>

        {/* Main Heading */}
        <h1 className="text-3xl font-black text-center mb-2 text-gray-800 tracking-tighter">
          Page Not Found
        </h1>
        
        {/* Description */}
        <p className="text-gray-500 text-center text-sm font-medium mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Button matching your theme's styling */}
        <button 
          onClick={() => router.push('/')}
          className="group flex items-center justify-center gap-2 w-full bg-gray-900 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-[0.98]"
        >
          <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Homepage
        </button>

      </div>
      
      {/* Subtle Footer matching the loader text style */}
      <p className="mt-8 text-gray-400 font-black uppercase tracking-widest text-[10px]">
        Global Connectivity &bull; Secure Access
      </p>
    </div>
  );
};

export default NotFoundPage;