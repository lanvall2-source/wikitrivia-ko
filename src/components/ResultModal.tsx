'use client';

import React, { useState } from 'react';
import { getHistoryTitle } from '@/lib/game-logic';
import { GameMode } from '@/types/game';
import { Share2, RotateCcw, Check, Trophy, Sparkles } from 'lucide-react';

interface ResultModalProps {
  score: number;
  maxStreak: number;
  historyResults: boolean[];
  mode: GameMode;
  onRestart: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ score, maxStreak, historyResults, mode, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const { title, emoji } = getHistoryTitle(score);

  const emojiGrid = historyResults.map((r) => (r ? '🟩' : '🟥')).join('');

  const handleShare = async () => {
    const today = new Date().toISOString().split('T')[0];
    const modeName = mode === 'daily' ? `데일리 챌린지 (${today})` : '종합 뇌정지 모드';
    const text = `[한글 WikiTrivia 타임라인 챌린지]\n모드: ${modeName}\n점수: ${score}점 (${title} ${emoji})\n최대 연승: ${maxStreak}연승\n결과: ${emojiGrid}\n\n당신의 역사 감각을 시험해보세요! 👇\n${typeof window !== 'undefined' ? window.location.origin : ''}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border border-slate-100 text-slate-800 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
          <Trophy className="w-9 h-9 stroke-[2.2]" />
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Challenge Result</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">
          {score}장의 사건 배치 성공!
        </h3>

        {/* 칭호 박스 */}
        <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80">
          <span className="text-xs font-bold text-amber-800 block">획득한 역사 칭호</span>
          <div className="text-lg font-black text-slate-900 mt-0.5 flex items-center justify-center gap-1.5">
            <span>{emoji}</span>
            <span>{title}</span>
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
        </div>

        {/* 이모지 그리드 */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 mb-5 text-sm tracking-widest break-all font-mono">
          {emojiGrid || '🏁'}
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? '결과 복사 완료! 붙여넣기 해보세요' : '결과 공유하기 (클립보드 복사)'}</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 도전하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
