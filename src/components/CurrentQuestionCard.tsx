'use client';

import React, { useState } from 'react';
import { HistoryEvent } from '@/types/game';
import { playCardFlipSound } from '@/lib/sound';
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
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
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

interface CurrentQuestionCardProps {
  card: HistoryEvent;
  onDragStart?: (e: React.DragEvent) => void;
}

export const CurrentQuestionCard: React.FC<CurrentQuestionCardProps> = ({ card, onDragStart }) => {
  const [imgError, setImgError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const config = CATEGORY_STYLES[card.category] || CATEGORY_STYLES.world;
  const { Icon } = config;

  // 연도 스포일러 방지 (예: "1945년" -> "??년")
  const sanitizedHint = card.tmi.replace(/\b(1\d{3}|20\d{2}|BC\s*\d+)\s*년/g, '??년');

  const toggleHint = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCardFlipSound();
    setShowHint(!showHint);
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="w-full max-w-sm sm:max-w-md mx-auto px-3 select-none"
    >
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border-2 border-amber-400/90 shadow-xl shadow-amber-500/10 p-3 sm:p-3.5 transition-all">
        {/* 상단: 이미지 + 사건 정보 */}
        <div className="flex items-start gap-3">
          {/* 썸네일 이미지 */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 shrink-0 flex items-center justify-center shadow-md">
            {card.imageUrl && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.imageUrl}
                alt={card.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover pointer-events-none"
                loading="eager"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${config.iconBg}`}>
                <Icon className="w-8 h-8 opacity-80" />
              </div>
            )}
            <span className="absolute bottom-1 right-1 text-[9px] font-black bg-slate-950/80 text-amber-300 px-1.5 py-0.5 rounded backdrop-blur-xs">
              출제
            </span>
          </div>

          {/* 우측 텍스트 & 컨트롤 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className={`text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${config.badge}`}>
                {config.name}
              </span>

              <button
                type="button"
                onClick={toggleHint}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>{showHint ? '힌트 닫기' : '힌트 보기'}</span>
                {showHint ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* 사건 제목 */}
            <h3 className="text-sm sm:text-base font-black text-white leading-snug line-clamp-2 mt-0.5">
              {card.title}
            </h3>

            {/* 안내 문구 */}
            <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mt-1.5 tracking-tight">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>언제 일어났을까요? 아래 슬롯(⬇)을 터치하세요!</span>
            </p>
          </div>
        </div>

        {/* 힌트 토글 영역 */}
        {showHint && (
          <div className="mt-2.5 pt-2 border-t border-slate-700/80 text-xs leading-relaxed text-amber-200/90 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-400/20 animate-fadeIn">
            <p className="font-semibold flex items-center gap-1 text-amber-300 text-[11px] mb-0.5">
              <Lightbulb className="w-3.5 h-3.5 shrink-0" /> 역사적 배경 힌트 (스포일러 방지)
            </p>
            <p className="line-clamp-3">{sanitizedHint}</p>
          </div>
        )}
      </div>
    </div>
  );
};
