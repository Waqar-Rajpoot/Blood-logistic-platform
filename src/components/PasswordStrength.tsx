"use client";
import React from "react";
import { Check, ShieldCheck, ShieldAlert } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  // 1. Define the 5 specific security requirements
  const requirements = [
    { label: "8+ characters", test: password.length >= 8 },
    { label: "Uppercase", test: /[A-Z]/.test(password) },
    { label: "Lowercase", test: /[a-z]/.test(password) },
    { label: "Number", test: /[0-9]/.test(password) },
    { label: "Special symbol", test: /[@$!%*#?&]/.test(password) },
  ];

  // 2. Calculate strength score and percentage
  const strengthScore = requirements.filter((req) => req.test).length;
  const strengthPercentage = (strengthScore / requirements.length) * 100;

  // 3. Helper to determine the color and label based on score
  const getStrengthData = () => {
    if (password.length === 0) return { color: "bg-gray-200", label: "Not Entered", text: "text-gray-400" };
    if (strengthScore <= 2) return { color: "bg-red-500", label: "Weak", text: "text-red-500" };
    if (strengthScore <= 4) return { color: "bg-yellow-500", label: "Fair", text: "text-yellow-600" };
    return { color: "bg-green-500", label: "Strong", text: "text-green-600" };
  };

  const { color, label, text } = getStrengthData();

  return (
    <div className="w-full mt-3 animate-in fade-in duration-500">
      {/* Percentage and Label Header */}
      <div className="flex justify-between items-end mb-1.5 px-0.5">
        <div className="flex items-center gap-1.5">
          {strengthScore === 5 ? (
            <ShieldCheck size={14} className="text-green-600" />
          ) : (
            <ShieldAlert size={14} className="text-amber-500" />
          )}
          <span className={`text-[11px] font-bold uppercase tracking-wider ${text}`}>
            {label}
          </span>
        </div>
        <span className="text-[10px] font-mono font-medium text-gray-400">
          {strengthPercentage}%
        </span>
      </div>

      {/* The Dynamic Progress Bar */}
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
        <div
          className={`h-full transition-all duration-700 ease-in-out ${color}`}
          style={{ width: `${strengthPercentage}%` }}
        ></div>
      </div>

      {/* Requirements Mini-Badges */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className={`transition-colors duration-300 ${req.test ? "text-green-500" : "text-gray-300"}`}>
              <Check size={10} strokeWidth={4} />
            </div>
            <span className={`text-[10px] transition-colors duration-300 ${req.test ? "text-gray-700" : "text-gray-400"}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}