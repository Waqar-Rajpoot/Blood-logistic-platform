import React from "react";
import { X, Send } from "lucide-react";

interface SelectionBarProps {
  selectedCount: number;
  bloodGroup: string | null;
  onClear: () => void;
  onOpenModal: () => void;
}

export const SelectionBar = ({
  selectedCount,
  bloodGroup,
  onClear,
  onOpenModal,
}: SelectionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-bottom-5">
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-2xl shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3 ml-2">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-lg">
            {selectedCount}
          </div>
          <div>
            <h4 className="text-white font-black uppercase text-[10px] tracking-tighter">
              Group {bloodGroup}
            </h4>
            <p className="text-slate-400 text-[8px] font-bold">Broadcast Ready</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onClear}
            className="p-3 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <button
            onClick={onOpenModal}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2"
          >
            <Send size={14} /> Send Alert
          </button>
        </div>
      </div>
    </div>
  );
};