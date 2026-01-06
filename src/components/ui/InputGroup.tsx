import React from "react";

export const InputGroup = ({ label, icon: Icon, error, type, ...props }: any) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-1 flex-1">
      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1.5">
        <Icon size={10} className="text-red-500" />
        {label}
      </label>
      <input
        {...props}
        type={type}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl outline-none transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300 ${
          error ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-red-500 focus:ring-4 focus:ring-red-50"
        }`}
      />
    </div>
  );
};