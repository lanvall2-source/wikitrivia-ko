'use client';

import React, { useState } from 'react';
import { ArrowDown, CornerDownLeft } from 'lucide-react';

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
      className={`shrink-0 flex items-center justify-center transition-all duration-300 ${
        isDragOver
          ? 'w-24 sm:w-28'
          : 'w-10 sm:w-12 hover:w-16 sm:hover:w-20'
      }`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPlace(index)}
        className={`group relative flex flex-col items-center justify-center w-full min-h-[220px] rounded-2xl border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
          isDragOver
            ? 'border-amber-400 bg-amber-500/25 scale-105 shadow-xl shadow-amber-500/20'
            : 'border-dashed border-slate-700/80 hover:border-amber-400/90 hover:bg-slate-800/60'
        }`}
        aria-label={`이 위치로 이동 및 배치 (순서 ${index + 1})`}
      >
        {isDragOver ? (
          <div className="flex flex-col items-center gap-1.5 text-amber-300 animate-pulse">
            <ArrowDown className="w-6 h-6 stroke-[2.5]" />
            <span className="text-xs font-black tracking-tight">여기에 놓기</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 group-hover:bg-amber-500 group-hover:border-amber-400 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shadow-sm">
              <ArrowDown className="w-4 h-4 stroke-[2.2] group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-300 opacity-60 group-hover:opacity-100 transition-opacity tracking-tighter writing-vertical">
              이동
            </span>
          </div>
        )}
      </button>
    </div>
  );
};
