import React from "react";

interface SearchFiltersProps {
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
}

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const SearchFilters = ({ selectedGroup, onGroupSelect }: SearchFiltersProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {bloodGroups.map((group) => (
        <button
          key={group}
          onClick={() => onGroupSelect(group === "All" ? "" : group)}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            selectedGroup === group || (group === "All" && !selectedGroup)
              ? "bg-red-600 text-white shadow-lg"
              : "bg-white text-slate-600 border border-slate-500"
          }`}
        >
          {group}
        </button>
      ))}
    </div>
  );
};