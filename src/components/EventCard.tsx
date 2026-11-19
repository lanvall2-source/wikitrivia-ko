'use client';

import React, { useState } from 'react';
import { HistoryEvent, PlacedEvent, Category } from '@/types/game';
import { formatYear } from '@/lib/game-logic';
import { Landmark, Swords, Globe2, FlaskConical, Cpu, Info } from 'lucide-react';

const CATEGORY_STYLES: Record<Category, { name: string; badge: string; iconBg: string; Icon: React.ComponentType<{ className?: string }> }> = {
  korea: { name: '한국사', badge: 'bg-blue-100 text-blue-800 border-blue-200', iconBg: 'bg-blue-50 text-blue-600', Icon: Landmark },
  east_asia: { name: '동아시아사', badge: 'bg-rose-100 text-rose-800 border-rose-200', iconBg: 'bg-rose-50 text-rose-600', Icon: Swords },
  world: { name: '세계사', badge: 'bg-purple-100 text-purple-800 border-purple-200', iconBg: 'bg-purple-50 text-purple-600', Icon: Globe2 },
  science: { name: '발명·과학', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', iconBg: 'bg-emerald-50 text-emerald-600', Icon: FlaskConical },
  it: { name: 'IT·기술', badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', iconBg: 'bg-cyan-50 text-cyan-600', Icon: Cpu },
};

interface EventCardProps {
  event: HistoryEvent | PlacedEvent;
  isCurrent?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isCurrent = false }) => {
  const [imgError, setImgError] = useState(false);
  const [showCredit, setShowCredit] = useState(false);

  const isPlaced = 'status' in event;
  const status = isPlaced ? (event as PlacedEvent).status : null;
  const config = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.world;
  const { Icon } = config;

  return (
    <div
      className={`relative w-[210px] sm:w-[230px] shrink-0 rounded-2xl bg-white p-3 shadow-md border transition-all duration-300 select-none ${
        isCurrent
          ? 'ring-4 ring-amber-400 shadow-xl scale-[1.02]'
          : status === 'wrong'
          ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-300'
          : status === 'anchor'
          ? 'border-indigo-400 bg-indigo-50/20'
          : 'border-slate-200'
      }`}
    >
      {/* 카테고리 뱃지 & 연도 */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${config.badge}`}>
          {config.name}
        </span>
        {isPlaced && (
          <span className="text-xs font-black tracking-tight text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
            {formatYear(event.year)}
          </span>
        )}
      </div>

      {/* 이미지 영역 또는 아이콘 Fallback */}
      <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
        {event.imageUrl && !imgError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.imageUrl}
              alt={event.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {event.imageCredit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCredit(!showCredit);
                }}
                className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-xs"
                title="이미지 저작권 정보"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            )}
            {showCredit && (
              <div className="absolute inset-0 bg-slate-900/90 text-white p-2.5 flex flex-col justify-center text-[11px] z-10 leading-tight">
                <p className="font-semibold text-slate-300 mb-1">이미지 출처</p>
                <p className="line-clamp-3 text-slate-200">{event.imageCredit}</p>
                <span className="text-[9px] text-amber-300 mt-2 block">터치하여 닫기</span>
              </div>
            )}
          </>
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center ${config.iconBg}`}>
            <Icon className="w-10 h-10 stroke-[1.8] opacity-80" />
          </div>
        )}
      </div>

      {/* 사건 제목 */}
      <div className="mt-2.5">
        <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 min-h-[2.5rem]">
          {event.title}
        </h4>
      </div>

      {/* 공개된 TMI 영역 */}
      {isPlaced ? (
        <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] leading-relaxed text-slate-600 line-clamp-3">
          💡 {event.tmi}
        </div>
      ) : (
        <div className="mt-2 pt-2 border-t border-dashed border-slate-200 text-center">
          <span className="text-xs font-semibold text-amber-600 animate-pulse">
            어디에 들어갈까요? ❓
          </span>
        </div>
      )}
    </div>
  );
};
