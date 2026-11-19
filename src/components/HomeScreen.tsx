'use client';

import React from 'react';
import { Sparkles, Calendar, Play, Trophy, HelpCircle, Layers } from 'lucide-react';

interface HomeScreenProps {
  onStartDaily: () => void;
  onOpenCategories: () => void;
  onStartFreePlay: () => void;
  highScore: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartDaily,
  onOpenCategories,
  onStartFreePlay,
  highScore,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none relative overflow-hidden">
      {/* 배경 장식 원형 그라데이션 */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      {/* 1. 상단 미니 바 */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center font-black text-white text-sm shadow-md">
            T
          </div>
          <span className="text-xs font-black tracking-widest text-slate-400">TRIVIO</span>
        </div>

        {highScore > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/80 text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400">최고 기록</span>
            <strong className="text-amber-300 font-black">{highScore}점</strong>
          </div>
        )}
      </header>

      {/* 2. 중앙 히어로 섹션 (레퍼런스 이미지 디자인 완벽 재현) */}
      <div className="my-auto py-10 flex flex-col items-center text-center max-w-md mx-auto w-full relative z-10">
        {/* 서비스 로고 & 타이틀 */}
        <div className="mb-2">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400/90 block mb-1">
            Timeline Trivia Game
          </span>
          <h1 className="text-5xl sm:text-6xl font-serif font-black tracking-tight text-white">
            Trivio
          </h1>
          <p className="text-lg font-bold text-slate-300 mt-1">
            트리비오
          </p>
        </div>

        {/* 슬로건 */}
        <p className="text-sm sm:text-base font-medium text-slate-300 mt-3 leading-relaxed max-w-xs sm:max-w-sm">
          세상의 모든 지식과 순간을<br className="sm:hidden" /> 시간순으로 맞혀보세요.
        </p>
        <p className="text-xs text-slate-400 mt-1 font-normal tracking-tight">
          Put the world&apos;s knowledge in chronological order.
        </p>

        {/* 3. 모드 선택 버튼 2종 (DAILY & FREE PLAY) */}
        <div className="w-full max-w-xs mt-10 space-y-3">
          {/* DAILY BUTTON */}
          <button
            type="button"
            onClick={onStartDaily}
            className="w-full py-4 px-6 rounded-2xl bg-slate-100 hover:bg-white active:scale-98 text-slate-950 font-black text-sm tracking-widest uppercase transition-all shadow-xl hover:shadow-2xl cursor-pointer flex items-center justify-center gap-2 group"
          >
            <Calendar className="w-4 h-4 text-slate-950" />
            <span>DAILY</span>
          </button>

          {/* FREE PLAY BUTTON */}
          <button
            type="button"
            onClick={onOpenCategories}
            className="w-full py-4 px-6 rounded-2xl border-2 border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-800 active:scale-98 text-white font-black text-sm tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>FREE PLAY</span>
          </button>
        </div>

        {/* 카테고리 퀵 스타트 힌트 */}
        <div className="mt-4">
          <button
            type="button"
            onClick={onStartFreePlay}
            className="text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors cursor-pointer underline underline-offset-4"
          >
            모든 분야 믹스로 바로 시작하기 →
          </button>
        </div>
      </div>

      {/* 4. 하단 게임 가이드 & 특징 */}
      <footer className="w-full max-w-xl mx-auto pt-6 border-t border-slate-800/80 text-center relative z-10">
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
          <div className="flex flex-col items-center">
            <span className="text-base mb-1">❤️</span>
            <span className="font-bold text-slate-300 text-[11px]">목숨 3개</span>
            <span className="text-[10px] text-slate-400">오답 시 위치 자동 정렬</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base mb-1">🔄</span>
            <span className="font-bold text-slate-300 text-[11px]">3D 카드 뒤집기</span>
            <span className="text-[10px] text-slate-400">역사적 배경 힌트 확인</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base mb-1">📚</span>
            <span className="font-bold text-slate-300 text-[11px]">12개 카테고리</span>
            <span className="text-[10px] text-slate-400">영화·음악·게임·역사</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
