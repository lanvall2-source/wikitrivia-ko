'use client';

import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';

interface PlacementSlotProps {
  index: number;
  onPlace: (index: number) => void;
  disabled?: boolean;
}

export const PlacementSlot: React.FC<PlacementSlotProps> = ({ index, onPlace, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
    onPlace(index);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`shrink-0 flex items-center justify-center transition-all duration-200 ${
        isDragOver ? 'w-20 sm:w-24' : 'w-11 sm:w-14'
      }`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPlace(index)}
        className={`group relative flex flex-col items-center justify-center w-full h-[160px] sm:h-[195px] rounded-2xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer ${
          isDragOver
            ? 'border-amber-400 bg-amber-500/30 scale-105 shadow-xl shadow-amber-500/30'
            : 'border-dashed border-amber-400/50 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/25 active:scale-95'
        }`}
        aria-label={`이 위치에 배치 (순서 ${index + 1})`}
      >
        <div className="flex flex-col items-center justify-center gap-1.5">
          {/* 둥근 버튼 아이콘 */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-110 group-active:scale-90 transition-transform">
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
          </div>

          <span className="text-[11px] font-black text-amber-300 tracking-tight group-hover:text-amber-200">
            여기
          </span>
        </div>
      </button>
    </div>
  );
};
