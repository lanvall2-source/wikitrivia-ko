'use client';

import React from 'react';
import { ThemeCategory } from '@/types/game';
import { X, ChevronRight, Check } from 'lucide-react';

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
  icon: string;
}

// Section 1: 대분류 탐색 (BROWSE)
const BROWSE_CATEGORIES: CategoryOption[] = [
  { key: 'all', titleKo: '전체 믹스 (모든 분야)', titleEn: 'ALL IN ONE', icon: '🌐' },
  { key: 'korea', titleKo: '한국사', titleEn: 'KOREAN HISTORY', icon: '🇰🇷' },
  { key: 'world', titleKo: '세계사 & 문명', titleEn: 'WORLD HISTORY', icon: '🌍' },
  { key: 'tech', titleKo: 'IT & 과학기술', titleEn: 'TECH & SCIENCE', icon: '💻' },
];

// Section 2: 인기 테마 컬렉션 (FEATURED)
const FEATURED_CATEGORIES: CategoryOption[] = [
  { key: 'games', titleKo: '비디오 게임', titleEn: 'VIDEO GAMES', icon: '🎮' },
  { key: 'popculture', titleKo: '영화 & 대중음악', titleEn: 'FILMS & MUSIC', icon: '🎬' },
  { key: 'sports', titleKo: '스포츠 & 올림픽', titleEn: 'SPORT', icon: '🏆' },
];

export const CategoryBrowserModal: React.FC<CategoryBrowserModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-7 shadow-2xl text-slate-100 flex flex-col justify-between animate-in zoom-in-95 duration-150 scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              TRIVIO <span className="text-slate-600">/</span> <strong className="text-slate-200">CATEGORY SELECT</strong>
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              카테고리 선택
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

        {/* Section 1: SELECT / BROWSE */}
        <div className="mt-5">
          <div className="text-center mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              SELECT <span className="text-slate-600">/</span> <strong className="text-slate-200">BROWSE</strong>
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
                  className={`group relative flex items-center justify-between px-5 py-3.5 rounded-full border transition-all text-left cursor-pointer active:scale-98 ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{cat.icon}</span>
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60 truncate">
                        {cat.titleEn}
                      </span>
                      <span className="text-sm font-bold tracking-tight truncate">
                        {cat.titleKo}
                      </span>
                    </div>
                  </div>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-slate-950 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: SELECT / FEATURED */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-center mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              SELECT <span className="text-slate-600">/</span> <strong className="text-slate-200">FEATURED</strong>
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
                  className={`group relative flex items-center justify-between px-5 py-3.5 rounded-full border transition-all text-left cursor-pointer active:scale-98 ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{cat.icon}</span>
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60 truncate">
                        {cat.titleEn}
                      </span>
                      <span className="text-sm font-bold tracking-tight truncate">
                        {cat.titleKo}
                      </span>
                    </div>
                  </div>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-slate-950 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
