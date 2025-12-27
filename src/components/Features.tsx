"use client";
import React from "react";
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Smartphone,
  BellRing,
} from "lucide-react";
import Link from "next/link";

export default function Features() {
  const features = [
    { 
      icon: <Search className="text-blue-600" />, 
      title: "Real-time Matching", 
      desc: "Our algorithm filters thousands of donors by blood group and city in milliseconds.",
      color: "bg-blue-50"
    },
    { 
      icon: <BellRing className="text-orange-600" />, 
      title: "Instant Broadcast", 
      desc: "Emergency requests are instantly pushed to all matching donors via our notification engine.",
      color: "bg-orange-50"
    },
    { 
      icon: <MapPin className="text-red-600" />, 
      title: "Geo-Location Proximity", 
      desc: "Identify donors closest to the hospital to minimize transportation time during critical hours.",
      color: "bg-red-50"
    },
    { 
      icon: <ShieldCheck className="text-green-600" />, 
      title: "Verified Profiles", 
      desc: "Every donor goes through an admin audit to ensure data accuracy and reliability.",
      color: "bg-green-50"
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <p className="text-red-600 font-black text-xs uppercase tracking-[0.3em] mb-3">System Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              Engineering a <br /> Faster Response.
            </h2>
          </div>
          <p className="text-gray-500 font-medium max-w-md">
            We have removed the manual hurdles of blood donation. Our platform automates the search so you can focus on the patient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="group p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:border-red-100 hover:shadow-2xl hover:shadow-red-100/50 transition-all duration-500"
            >
              <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                {React.cloneElement(f.icon as React.ReactElement)}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black text-gray-300">0{i + 1}</span>
                <h3 className="font-black text-xl text-gray-800 tracking-tight">{f.title}</h3>
              </div>
              
              <p className="text-gray-500 text-sm leading-relaxed font-medium mb-6">
                {f.desc}
              </p>
              <Link href="/login" className="inline-block mt-auto">
              <div className="flex items-center text-xs font-black text-gray-400 group-hover:text-red-600 transition-colors uppercase tracking-widest cursor-pointer">
                Learn More <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA for Features */}
        <div className="mt-20 p-1 bg-gray-50 rounded-[3rem] inline-flex items-center gap-2 pr-6">
            <div className="bg-white px-6 py-3 rounded-[2.5rem] shadow-sm flex items-center gap-3">
                <Smartphone size={18} className="text-red-600" />
                <span className="text-xs font-black text-gray-800 uppercase tracking-tight">Mobile Responsive</span>
            </div>
            <p className="text-xs font-bold text-gray-400 ml-2">Access the database from any device, anywhere.</p>
        </div>
      </div>
    </section>
  );
}