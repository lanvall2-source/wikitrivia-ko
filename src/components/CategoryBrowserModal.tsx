'use client';

import React from 'react';
import { ThemeCategory } from '@/types/game';
import { X, Sparkles, ChevronRight } from 'lucide-react';

interface CategoryBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeCategory;
  onSelectTheme: (theme: ThemeCategory) => void;
}

interface CategoryOption {
  key: ThemeCategory;
  titleKo: string;
  titleEn: string;
  countHint?: string;
}

const BROWSE_CATEGORIES: CategoryOption[] = [
  { key: 'all', titleKo: '전체 카테고리', titleEn: 'ALL CATEGORIES' },
  { key: 'history', titleKo: '역사 & 세계사', titleEn: 'HISTORY' },
  { key: 'entertainment', titleKo: '엔터테인먼트', titleEn: 'ENTERTAINMENT' },
  { key: 'leaders', titleKo: '지도자 & 인물', titleEn: 'LEADERS & PEOPLE' },
  { key: 'art', titleKo: '예술 & 랜드마크', titleEn: 'ART & LANDMARKS' },
  { key: 'business', titleKo: '기업 & 브랜드', titleEn: 'BUSINESS' },
  { key: 'tech', titleKo: '기술 & IT', titleEn: 'TECHNOLOGY' },
  { key: 'science', titleKo: '과학 & 발명', titleEn: 'SCIENCE & ENGINEERING' },
  { key: 'sports', titleKo: '스포츠', titleEn: 'SPORT' },
];

const FEATURED_CATEGORIES: CategoryOption[] = [
  { key: 'films', titleKo: '영화', titleEn: 'FILMS' },
  { key: 'music', titleKo: '음악 & K-POP', titleEn: 'MUSIC' },
  { key: 'games', titleKo: '비디오 게임', titleEn: 'VIDEO GAMES' },
  { key: 'wars', titleKo: '전쟁 & 전투사', titleEn: 'WARS' },
  { key: 'korean_leaders', titleKo: '한국사 & 인물', titleEn: 'KOREAN HISTORY' },
];

export const CategoryBrowserModal: React.FC<CategoryBrowserModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 p-5 sm:p-7 shadow-2xl text-slate-100 flex flex-col justify-between animate-in zoom-in-95 duration-200 scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-amber-400" />
              Trivio Browse
            </span>
            <h2 className="text-xl font-black text-white mt-0.5">
              카테고리 탐색
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: FREE PLAY / BROWSE */}
        <div className="mt-5">
          <div className="text-center mb-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              FREE PLAY <span className="text-slate-600">/</span> <strong className="text-slate-200">BROWSE</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BROWSE_CATEGORIES.map((cat) => {
              const isSelected = currentTheme === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    onSelectTheme(cat.key);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-[1.01]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60">
                      {cat.titleEn}
                    </span>
                    <span className="text-sm font-black tracking-tight">
                      {cat.titleKo}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      isSelected ? 'text-slate-950' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: FREE PLAY / FEATURED */}
        <div className="mt-7 pt-5 border-t border-slate-800/80">
          <div className="text-center mb-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              FREE PLAY <span className="text-slate-600">/</span> <strong className="text-amber-400">FEATURED</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FEATURED_CATEGORIES.map((cat) => {
              const isSelected = currentTheme === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    onSelectTheme(cat.key);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-[1.01]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60">
                      {cat.titleEn}
                    </span>
                    <span className="text-sm font-black tracking-tight">
                      {cat.titleKo}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      isSelected ? 'text-slate-950' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
