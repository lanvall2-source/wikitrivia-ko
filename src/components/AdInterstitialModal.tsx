'use client';

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, X } from 'lucide-react';

interface AdInterstitialModalProps {
  isOpen: boolean;
  onCloseAndStart: () => void;
  gameTitle?: string;
}

export const AdInterstitialModal: React.FC<AdInterstitialModalProps> = ({
  isOpen,
  onCloseAndStart,
  gameTitle = '트리비오 타임라인 퀴즈',
}) => {
  const [countdown, setCountdown] = useState(3);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 text-center text-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* 상단 닫기/스킵 버튼 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>게임 준비 중...</span>
          </div>

          <button
            type="button"
            onClick={onCloseAndStart}
            className={`px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              canSkip
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {canSkip ? '건너뛰기 ✕' : `${countdown}초 후 시작`}
          </button>
        </div>

        {/* 퀴즈 타이틀 안내 */}
        <div className="mt-4 mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Upcoming Quiz
          </span>
          <h3 className="text-base font-black text-white mt-0.5">
            {gameTitle}
          </h3>
        </div>

        {/* 전면 광고 슬롯 컨테이너 (Google AdSense 300x250 규격) */}
        <div className="my-3 w-full h-[250px] mx-auto rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
          <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
            SPONSOR AD
          </span>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white mb-2 shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>

          <p className="text-xs font-bold text-slate-200">
            트리비오 공식 스폰서 영역
          </p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
            Google AdSense 및 파트너스 배너가 표시되는 전면 광고 슬롯입니다.
          </p>
        </div>

        {/* 바로 시작 버튼 */}
        <div className="mt-4">
          <button
            type="button"
            onClick={onCloseAndStart}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>퀴즈 시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
