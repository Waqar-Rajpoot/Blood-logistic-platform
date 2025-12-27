"use client";
import React from "react";
import { Heart, Users, Zap, CheckCircle, Droplets } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: <Zap className="text-red-600" size={32} />,
      title: "Speed",
      description: "In emergencies, every second counts. Our platform connects you to donors in real-time."
    },
    {
      icon: <Users className="text-red-600" size={32} />,
      title: "Community",
      description: "A growing network of heroes ready to donate and save lives across the country."
    },
    {
      icon: <CheckCircle className="text-red-600" size={32} />,
      title: "Verified Donors",
      description: "We ensure donor availability status is kept up-to-date for reliable search results."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-red-600 py-20 text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Our Mission</h1>
        <p className="text-xl max-w-2xl mx-auto text-red-100">
          Bridging the gap between blood donors and those in need. We use technology to make 
          life-saving connections faster and easier than ever before.
        </p>
      </section>

      {/* The Problem & Solution Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Why This Platform?</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Searching for blood during an emergency is often a chaotic process involving 
              countless phone calls, social media posts, and precious time lost. 
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our **Online Blood Donation and Management System** digitizes this search. 
              By allowing donors to register their location and blood group, we provide 
              recipients and hospitals with an instant, searchable database.
            </p>
            <div className="flex gap-4">
              <Link href="/signup" className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">
                Join as Donor
              </Link>
              <Link href="/login" className="border border-red-600 text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50">
                Learn More
              </Link>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
             <div className="relative">
                <Heart className="text-red-600 w-48 h-48 animate-pulse" />
                <Droplets className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-12 h-12" />
             </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Summary */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">Simple 3-Step Process</h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
          <div className="flex flex-col items-center z-10 bg-white p-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">1</div>
            <h4 className="font-bold text-gray-800">Register</h4>
            <p className="text-gray-500 text-sm text-center">Create a donor or receiver profile</p>
          </div>
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
          <div className="flex flex-col items-center z-10 bg-white p-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">2</div>
            <h4 className="font-bold text-gray-800">Search/Post</h4>
            <p className="text-gray-500 text-sm text-center">Find donors or flag urgent requests</p>
          </div>
          <div className="flex flex-col items-center z-10 bg-white p-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">3</div>
            <h4 className="font-bold text-gray-800">Save Life</h4>
            <p className="text-gray-500 text-sm text-center">Connect and complete the donation</p>
          </div>
        </div>
      </section>
    </div>
  );
}