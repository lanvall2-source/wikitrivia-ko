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
  Info,
  RotateCw,
  Lightbulb,
  ArrowLeft,
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

  // legacy fallbacks
  history: { name: '역사', badge: 'bg-amber-100 text-amber-800 border-amber-200', iconBg: 'bg-amber-50 text-amber-600', border: 'border-amber-400', Icon: Landmark },
  entertainment: { name: '대중문화', badge: 'bg-pink-100 text-pink-800 border-pink-200', iconBg: 'bg-pink-50 text-pink-600', border: 'border-pink-400', Icon: Clapperboard },
  east_asia: { name: '동아시아사', badge: 'bg-rose-100 text-rose-800 border-rose-200', iconBg: 'bg-rose-50 text-rose-600', border: 'border-rose-400', Icon: Swords },
  world: { name: '세계사', badge: 'bg-purple-100 text-purple-800 border-purple-200', iconBg: 'bg-purple-50 text-purple-600', border: 'border-purple-400', Icon: Globe2 },
  it: { name: 'IT·기술', badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', iconBg: 'bg-cyan-50 text-cyan-600', border: 'border-cyan-400', Icon: Cpu },
};

interface EventCardProps {
  event: HistoryEvent | PlacedEvent;
  isCurrent?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isCurrent = false,
  onDragStart,
  onDragEnd,
}) => {
  const [imgError, setImgError] = useState(false);
  const [showCredit, setShowCredit] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const isPlaced = 'status' in event;
  const status = isPlaced ? (event as PlacedEvent).status : null;
  const config = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.world;
  const { Icon } = config;

  // 출제 카드에서 힌트 볼 때 연도 스포일러 방지 (예: "1946년" -> "??년")
  const getSanitizedHint = (text: string) => {
    if (isPlaced) return text;
    return text.replace(/\b(1\d{3}|20\d{2}|BC\s*\d+)\s*년/g, '??년');
  };

  const handleFlipToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`relative w-[210px] sm:w-[230px] shrink-0 perspective-1000 select-none ${
        isCurrent ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      draggable={isCurrent}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div
        className={`w-full min-h-[310px] sm:min-h-[330px] rounded-2xl transform-style-3d transition-transform duration-500 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ===================== [ 앞면 (Front Face) ] ===================== */}
        <div
          className={`backface-hidden w-full h-full rounded-2xl bg-white p-3 shadow-md border transition-all duration-300 flex flex-col justify-between ${
            isCurrent
              ? 'ring-4 ring-amber-400 shadow-2xl scale-[1.01]'
              : status === 'wrong'
              ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-300'
              : status === 'anchor'
              ? 'border-indigo-400 bg-indigo-50/20'
              : 'border-slate-200'
          }`}
        >
          <div>
            {/* 카테고리 뱃지 & 연도 */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${config.badge}`}>
                {config.name}
              </span>
              {isPlaced ? (
                <span className="text-xs font-black tracking-tight text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                  {formatYear(event.year)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleFlipToggle}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                  title="카드를 뒤집어 힌트 보기"
                >
                  <Lightbulb className="w-3 h-3 text-amber-500 fill-amber-400" />
                  <span>힌트</span>
                  <RotateCw className="w-2.5 h-2.5 ml-0.5 text-amber-600" />
                </button>
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
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                  {event.imageCredit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCredit(!showCredit);
                      }}
                      className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-xs cursor-pointer z-10"
                      title="이미지 저작권 정보"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {showCredit && (
                    <div className="absolute inset-0 bg-slate-900/90 text-white p-2.5 flex flex-col justify-center text-[11px] z-20 leading-tight">
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
          </div>

          {/* 하단 정보 / 힌트 바 */}
          <div className="mt-2 pt-2 border-t border-slate-100">
            {isPlaced ? (
              <div className="text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                💡 {event.tmi}
              </div>
            ) : (
              <div className="text-center py-0.5">
                <span className="text-[11px] font-semibold text-amber-600 tracking-tight">
                  타임라인 슬롯(⬇)으로 이동하세요
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ===================== [ 뒷면 (Back Face - 힌트 및 세부 정보) ] ===================== */}
        <div
          className={`backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4 border border-amber-400/50 text-white shadow-2xl flex flex-col justify-between ${
            isCurrent ? 'ring-4 ring-amber-400/80' : ''
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badge}`}>
                {config.name}
              </span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                힌트 & 단서
              </span>
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-black text-slate-100 line-clamp-2 mb-2">
                {event.title}
              </h4>
              <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700 text-xs text-slate-300 leading-relaxed shadow-inner">
                <p className="text-amber-300 font-semibold mb-1 flex items-center gap-1">
                  <span>💡 사건 단서:</span>
                </p>
                <p className="leading-relaxed">
                  {getSanitizedHint(event.tmi)}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleFlipToggle}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>앞면으로 돌아가기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
