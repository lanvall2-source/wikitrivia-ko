'use client';

import React, { useRef, useEffect } from 'react';
import { PlacedEvent } from '@/types/game';
import { EventCard } from './EventCard';
import { PlacementSlot } from './PlacementSlot';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineBoardProps {
  placedCards: PlacedEvent[];
  onPlace: (index: number) => void;
  isInteractable: boolean;
}

export const TimelineBoard: React.FC<TimelineBoardProps> = ({ placedCards, onPlace, isInteractable }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [placedCards.length]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col justify-end">
      {/* 타임라인 상단 네비게이션 & 방향 가이드바 */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 bg-slate-950/70">
        <button
          type="button"
          onClick={scrollLeft}
          className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 active:scale-95 transition-all cursor-pointer px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>과거 (←)</span>
        </button>

        <span className="text-[11px] font-black text-slate-300 tracking-tight">
          ⏳ 타임라인 ({placedCards.length}개 카드)
        </span>

        <button
          type="button"
          onClick={scrollRight}
          className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 active:scale-95 transition-all cursor-pointer px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750"
        >
          <span>(→) 미래</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 가로 스크롤 카드 보드 */}
      <div
        className="relative w-full overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-slate-700 select-none"
        ref={scrollRef}
      >
        {/* 타임라인 연결선 */}
        <div className="absolute top-[88px] left-6 right-6 h-1 bg-gradient-to-r from-indigo-400 via-amber-400 to-rose-400 -z-0 rounded-full opacity-60 pointer-events-none" />

        <div className="flex items-center min-w-max px-4 sm:px-8 space-x-2 relative z-10">
          <PlacementSlot index={0} onPlace={onPlace} disabled={!isInteractable} />

          {placedCards.map((card, idx) => (
            <React.Fragment key={`${card.id}-${idx}`}>
              <EventCard event={card} />
              <PlacementSlot index={idx + 1} onPlace={onPlace} disabled={!isInteractable} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
