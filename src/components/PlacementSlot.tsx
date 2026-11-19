'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface PlacementSlotProps {
  index: number;
  onPlace: (index: number) => void;
  disabled?: boolean;
}

export const PlacementSlot: React.FC<PlacementSlotProps> = ({ index, onPlace, disabled = false }) => {
  return (
    <div className="flex flex-col items-center justify-center px-1 shrink-0 self-center">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPlace(index)}
        className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-md hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        aria-label={`이 위치에 배치 (순서 ${index + 1})`}
      >
        <Plus className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 group-hover:scale-110" />
      </button>
      <span className="text-[10px] font-bold text-slate-400 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        배치
      </span>
    </div>
  );
};
