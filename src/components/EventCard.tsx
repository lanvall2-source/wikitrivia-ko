'use client';

import React, { useState } from 'react';
import { HistoryEvent, PlacedEvent } from '@/types/game';
import { formatYear } from '@/lib/game-logic';
import {
  Landmark,
  Globe2,
  Swords,
  Clapperboard,
  Music,
  Gamepad2,
  Cpu,
  FlaskConical,
  Building2,
  Trophy,
  Palette,
  Crown,
} from 'lucide-react';

const CATEGORY_STYLES: Record<
  string,
  { name: string; badge: string; iconBg: string; border: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  korea: { name: '한국사', badge: 'bg-blue-100 text-blue-800 border-blue-200', iconBg: 'bg-blue-50 text-blue-600', border: 'border-blue-400', Icon: Landmark },
  world_history: { name: '세계사', badge: 'bg-purple-100 text-purple-800 border-purple-200', iconBg: 'bg-purple-50 text-purple-600', border: 'border-purple-400', Icon: Globe2 },
  wars: { name: '전쟁사', badge: 'bg-rose-100 text-rose-800 border-rose-200', iconBg: 'bg-rose-50 text-rose-600', border: 'border-rose-400', Icon: Swords },
  films: { name: '영화', badge: 'bg-pink-100 text-pink-800 border-pink-200', iconBg: 'bg-pink-50 text-pink-600', border: 'border-pink-400', Icon: Clapperboard },
  music: { name: '음악', badge: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200', iconBg: 'bg-fuchsia-50 text-fuchsia-600', border: 'border-fuchsia-400', Icon: Music },
  games: { name: '비디오 게임', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', iconBg: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-400', Icon: Gamepad2 },
  tech: { name: 'IT·기술', badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', iconBg: 'bg-cyan-50 text-cyan-600', border: 'border-cyan-400', Icon: Cpu },
  science: { name: '과학·발명', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', iconBg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-400', Icon: FlaskConical },
  business: { name: '기업·브랜드', badge: 'bg-sky-100 text-sky-800 border-sky-200', iconBg: 'bg-sky-50 text-sky-600', border: 'border-sky-400', Icon: Building2 },
  sports: { name: '스포츠', badge: 'bg-amber-100 text-amber-800 border-amber-200', iconBg: 'bg-amber-50 text-amber-600', border: 'border-amber-400', Icon: Trophy },
  art: { name: '예술·건축', badge: 'bg-teal-100 text-teal-800 border-teal-200', iconBg: 'bg-teal-50 text-teal-600', border: 'border-teal-400', Icon: Palette },
  leaders: { name: '인물·지도자', badge: 'bg-violet-100 text-violet-800 border-violet-200', iconBg: 'bg-violet-50 text-violet-600', border: 'border-violet-400', Icon: Crown },
  history: { name: '역사', badge: 'bg-amber-100 text-amber-800 border-amber-200', iconBg: 'bg-amber-50 text-amber-600', border: 'border-amber-400', Icon: Landmark },
  entertainment: { name: '대중문화', badge: 'bg-pink-100 text-pink-800 border-pink-200', iconBg: 'bg-pink-50 text-pink-600', border: 'border-pink-400', Icon: Clapperboard },
  world: { name: '세계사', badge: 'bg-purple-100 text-purple-800 border-purple-200', iconBg: 'bg-purple-50 text-purple-600', border: 'border-purple-400', Icon: Globe2 },
};

interface EventCardProps {
  event: HistoryEvent | PlacedEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [imgError, setImgError] = useState(false);
  const [showTmi, setShowTmi] = useState(false);

  const isPlaced = 'status' in event;
  const status = isPlaced ? (event as PlacedEvent).status : null;
  const config = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.world;
  const { Icon } = config;

  return (
    <div
      onClick={() => setShowTmi(!showTmi)}
      className={`relative w-[115px] sm:w-[140px] md:w-[165px] h-[160px] sm:h-[195px] shrink-0 rounded-2xl p-2 sm:p-2.5 shadow-md border transition-all duration-200 flex flex-col justify-between select-none cursor-pointer hover:shadow-lg ${
        status === 'wrong'
          ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-400'
          : status === 'anchor'
          ? 'border-indigo-400 bg-indigo-50/40'
          : 'border-slate-300 bg-white'
      }`}
    >
      {/* 상단: 연도 뱃지 + 카테고리 태그 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] sm:text-xs font-black tracking-tight text-slate-950 bg-amber-400 px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs">
            {formatYear(event.year)}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${config.badge}`}>
            {config.name}
          </span>
        </div>

        {/* 썸네일 이미지 */}
        <div className="relative w-full h-14 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center">
          {event.imageUrl && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt={event.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover pointer-events-none"
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${config.iconBg}`}>
              <Icon className="w-6 h-6 opacity-80" />
            </div>
          )}
        </div>
      </div>

      {/* 하단: 사건 제목 */}
      <div className="mt-1">
        <h4 className="text-[11px] sm:text-xs font-black text-slate-800 leading-tight line-clamp-2">
          {event.title}
        </h4>
      </div>

      {/* TMI 팝오버 (터치 시 표시) */}
      {showTmi && event.tmi && (
        <div className="absolute inset-0 bg-slate-900/95 text-white p-2 rounded-2xl flex flex-col justify-between text-[10px] sm:text-[11px] z-30 leading-snug animate-fadeIn">
          <div>
            <span className="font-bold text-amber-300 block mb-1">💡 사건 배경</span>
            <p className="line-clamp-4 text-slate-200">{event.tmi}</p>
          </div>
          <span className="text-[9px] text-slate-400 text-center">터치하여 닫기</span>
        </div>
      )}
    </div>
  );
};
