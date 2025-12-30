"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, Circle, Heart } from "lucide-react";

export default function DonorJourneyTracker() {
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("/api/donor/my-donations");
        setDonation(res.data.donation);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-400">Loading your life-saving journey...</div>;
  if (!donation) return null;

  const stages = [
    { key: "Donated", label: "Blood Collected", desc: "Your donation is registered at the hospital." },
    { key: "Tested", label: "Screening & Testing", desc: "Safety checks for infectious diseases." },
    { key: "Processed", label: "Component Processing", desc: "Blood is separated into Plasma/RBC/Platelets." },
    { key: "Dispatched", label: "Dispatched", desc: "Your blood is moving to the emergency ward." },
    { key: "Life Saved", label: "Life Saved!", desc: "The transfusion is complete. Mission accomplished." },
  ];

  // Logic to determine if a stage is completed or active
  const currentStageIndex = stages.findIndex(s => s.key === donation.journeyStatus);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
      <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
        <Heart className="text-red-500" fill="currentColor" /> Your Blood Journey
      </h3>

      <div className="space-y-8 relative">
        {/* The Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

        {stages.map((stage, index) => {
          const isCompleted = index <= currentStageIndex;
          const isCurrent = index === currentStageIndex;

          return (
            <div key={stage.key} className="relative flex gap-6 items-start group">
              {/* Icon Container */}
              <div className="z-10">
                {isCompleted ? (
                  <div className="bg-green-500 rounded-full p-1 text-white ring-4 ring-green-50">
                    <CheckCircle2 size={16} />
                  </div>
                ) : (
                  <div className="bg-white rounded-full p-1 text-gray-300 ring-4 ring-gray-50 border">
                    <Circle size={16} />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className={`${isCurrent ? "opacity-100" : "opacity-60"}`}>
                <p className={`font-black uppercase text-xs tracking-widest ${isCompleted ? "text-green-600" : "text-gray-500"}`}>
                  {stage.label}
                </p>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {stage.desc}
                </p>
                {isCurrent && (
                  <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full animate-pulse">
                    CURRENT STAGE
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}