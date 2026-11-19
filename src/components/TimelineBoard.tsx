'use client';

import React, { useRef, useEffect } from 'react';
import { PlacedEvent } from '@/types/game';
import { EventCard } from './EventCard';
import { PlacementSlot } from './PlacementSlot';

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

  return (
    <div className="relative w-full overflow-x-auto pb-6 pt-4 scrollbar-thin scrollbar-thumb-slate-700" ref={scrollRef}>
      <div className="absolute top-[82px] left-8 right-8 h-1 bg-gradient-to-r from-indigo-300 via-amber-300 to-rose-300 -z-0 rounded-full" />

      <div className="flex items-center min-w-max px-6 sm:px-12 space-x-2 relative z-10">
        <PlacementSlot index={0} onPlace={onPlace} disabled={!isInteractable} />

        {placedCards.map((card, idx) => (
          <React.Fragment key={`${card.id}-${idx}`}>
            <EventCard event={card} />
            <PlacementSlot index={idx + 1} onPlace={onPlace} disabled={!isInteractable} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
