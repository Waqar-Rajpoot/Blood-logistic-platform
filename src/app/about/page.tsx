"use client";
import React from "react";
import {
  Heart,
  Zap,
  CheckCircle,
  MapPin,
  ShieldAlert,
  Server,
  Smartphone,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  const values = [
    {
      icon: <Zap className="text-red-600" size={32} />,
      title: "Real-Time Matching",
      description:
        "Our proprietary algorithm connects recipients with the nearest available donors in milliseconds.",
    },
    {
      icon: <MapPin className="text-red-600" size={32} />,
      title: "Geospatial Accuracy",
      description:
        "Using advanced location indexing to minimize travel time and maximize the chance of a successful donation.",
    },
    {
      icon: <ShieldAlert className="text-red-600" size={32} />,
      title: "Urgency Response",
      description:
        "Critical requests get broadcasted to all matching donors within a 10km radius immediately.",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-red-100 selection:text-red-600">
      {/* --- Modern Hero Section --- */}
      <section className="relative bg-slate-900 py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-800 rounded-full filter blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6"
          >
            Engineering <span className="text-red-600 text-outline">Hope.</span>
          </motion.h1>
          <p className="text-xl max-w-3xl mx-auto text-slate-400 font-medium leading-relaxed">
            We are a technology-first platform dedicated to digitizing the blood
            donation ecosystem. By eliminating manual search barriers, we ensure
            life-saving blood is just a click away.
          </p>
        </div>
      </section>

      {/* --- The Problem & Solution Section --- */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge text="The Challenge" />
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
              Breaking the Chaos of Emergency Sourcing
            </h2>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
              In Pakistan, blood sourcing often relies on frantic social media
              posts and word-of-mouth. This delay can be fatal.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Instant Donor Discovery using Geo-location.",
                "Real-time Inventory tracking for hospitals.",
                "Verified journey tracking from donor to recipient.",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-slate-700 font-semibold"
                >
                  <CheckCircle className="text-emerald-500" size={20} />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Link
                href="/signup"
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
              >
                Become a Hero
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-red-100 rounded-[3rem] p-12 relative z-10 overflow-hidden">
              <Heart className="text-red-600 w-full h-auto opacity-20 absolute -right-20 -bottom-20" />
              <h3 className="text-2xl font-black text-red-600 mb-4">
                Our Tech Vision
              </h3>
              <p className="text-red-900 font-medium leading-relaxed">
                We did not just want to build a directory; we wanted to build a
                response engine. Every piece of code we write is optimized to
                save a human life.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-black text-red-600">98%</p>
                  <p className="text-[10px] font-bold text-red-400 uppercase">
                    Match Accuracy
                  </p>
                </div>
                <div className="text-center border-l border-red-200 pl-4">
                  <p className="text-2xl font-black text-red-600">{"< 2min"}</p>
                  <p className="text-[10px] font-bold text-red-400 uppercase">
                    Response Time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Technical Highlights (Job-Ready Section) --- */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              The Technology Stack
            </h2>
            <p className="text-slate-500 font-medium">
              Built with industry-standard tools for maximum reliability.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Next.js 14",
                desc: "Server-side rendering for instant loading.",
              },
              {
                icon: Server,
                title: "MongoDB",
                desc: "Geospatial indexing for location-based search.",
              },
              {
                icon: ShieldAlert,
                title: "JWT Auth",
                desc: "Secure data handling for donor privacy.",
              },
              {
                icon: BarChart3,
                title: "Tailwind CSS",
                desc: "Responsive, mobile-first design for all devices.",
              },
            ].map((tech, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
              >
                <tech.icon className="text-red-600 mb-4" size={24} />
                <h4 className="font-bold text-slate-900 mb-1">{tech.title}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Core Values Section --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-16 uppercase tracking-tighter">
            Why We Are Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div key={index} className="group cursor-default">
                <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Join the Movement --- */}
      <section className="bg-red-600 py-20 px-6 mx-4 rounded-[4rem] mb-20 text-center text-white">
        <h2 className="text-4xl font-black mb-6">
          Ready to make a difference?
        </h2>
        <p className="text-red-100 mb-10 max-w-xl mx-auto font-medium">
          Join our network of 1,000+ verified donors and help us ensure no
          emergency goes unanswered.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="bg-white text-red-600 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            Register as a Donor
          </Link>
        </div>
      </section>
    </div>
  );
}

// Helper Badge Component
function Badge({ text }: { text: string }) {
  return (
    <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-600 font-black text-[10px] uppercase tracking-widest mb-4">
      {text}
    </span>
  );
}
