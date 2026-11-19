'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HistoryEvent, PlacedEvent, GameMode, ThemeCategory } from '@/types/game';
import {
  shuffleDeck,
  getSeededRandom,
  getFilteredPool,
  pickNextCardWithCurve,
} from '@/lib/game-logic';
import { EventCard } from '@/components/EventCard';
import { TimelineBoard } from '@/components/TimelineBoard';
import { ResultModal } from '@/components/ResultModal';
import { CategoryBrowserModal } from '@/components/CategoryBrowserModal';
import { Heart, Flame, Calendar, Layers, Sparkles, LayoutGrid, ChevronDown } from 'lucide-react';

const THEME_NAMES: Record<ThemeCategory, string> = {
  all: '전체 무한',
  history: '역사 & 세계사',
  entertainment: '엔터테인먼트',
  games: '비디오 게임',
  tech: '기술 & IT',
  science: '과학 & 발명',
  business: '기업 & 브랜드',
  sports: '스포츠',
  art: '예술 & 랜드마크',
  leaders: '지도자 & 인물',
  films: '영화',
  music: '음악 & K-POP',
  wars: '전쟁 & 전투사',
  korean_leaders: '한국사 & 인물',
};

export default function TrivioPage() {
  const [mode, setMode] = useState<GameMode>('endless');
  const [theme, setTheme] = useState<ThemeCategory>('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);

  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const [deck, setDeck] = useState<HistoryEvent[]>([]);
  const [placedCards, setPlacedCards] = useState<PlacedEvent[]>([]);
  const [currentCard, setCurrentCard] = useState<HistoryEvent | null>(null);
  const [historyResults, setHistoryResults] = useState<boolean[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'correct' | 'wrong' } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHigh = localStorage.getItem('trivio_high_score') || localStorage.getItem('wt_high_score');
      if (savedHigh) setHighScore(parseInt(savedHigh, 10));
    }
  }, []);

  const startNewGame = useCallback(
    (targetMode: GameMode = mode, targetTheme: ThemeCategory = theme) => {
      const pool = getFilteredPool(targetTheme);
      let shuffled: HistoryEvent[];

      if (targetMode === 'daily') {
        const todayStr = new Date().toISOString().split('T')[0];
        const rng = getSeededRandom(todayStr);
        shuffled = shuffleDeck(pool, rng).slice(0, 11);
      } else {
        shuffled = shuffleDeck(pool);
      }

      if (shuffled.length < 2) return;

      const [anchor, ...restDeck] = shuffled;
      const initialPlaced: PlacedEvent[] = [{ ...anchor, status: 'anchor' }];
      const { picked, nextDeck } = pickNextCardWithCurve(restDeck, initialPlaced, 1);

      setMode(targetMode);
      setTheme(targetTheme);
      setLives(3);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setPlacedCards(initialPlaced);
      setCurrentCard(picked);
      setDeck(nextDeck);
      setHistoryResults([]);
      setIsGameOver(false);
      setFeedbackMsg(null);
    },
    [mode, theme]
  );

  useEffect(() => {
    startNewGame('endless', 'all');
  }, [startNewGame]);

  const handlePlaceCard = (targetIndex: number) => {
    if (!currentCard || isGameOver) return;

    const prevYear = targetIndex > 0 ? placedCards[targetIndex - 1].year : -Infinity;
    const nextYear = targetIndex < placedCards.length ? placedCards[targetIndex].year : Infinity;

    const isCorrect = currentCard.year >= prevYear && currentCard.year <= nextYear;

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(isCorrect ? 40 : [80, 50, 80]);
    }

    const newPlaced = [...placedCards];

    if (isCorrect) {
      newPlaced.splice(targetIndex, 0, { ...currentCard, status: 'correct' });
      const nextScore = score + 1;
      const nextStreak = streak + 1;

      setScore(nextScore);
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      if (nextScore > highScore) {
        setHighScore(nextScore);
        if (typeof window !== 'undefined') {
          localStorage.setItem('trivio_high_score', nextScore.toString());
        }
      }
      setHistoryResults((prev) => [...prev, true]);
      setFeedbackMsg({ text: '정답입니다! 👏', type: 'correct' });
    } else {
      const correctIndex = placedCards.findIndex((c) => c.year > currentCard.year);
      const insertAt = correctIndex === -1 ? placedCards.length : correctIndex;
      newPlaced.splice(insertAt, 0, { ...currentCard, status: 'wrong' });

      const nextLives = lives - 1;
      setLives(nextLives);
      setStreak(0);
      setHistoryResults((prev) => [...prev, false]);
      setFeedbackMsg({
        text: `아쉽습니다! 올바른 위치로 배치되었습니다. (${currentCard.year < 0 ? `BC ${Math.abs(currentCard.year)}년` : `${currentCard.year}년`})`,
        type: 'wrong',
      });

      if (nextLives <= 0) {
        setIsGameOver(true);
        setPlacedCards(newPlaced);
        return;
      }
    }

    setPlacedCards(newPlaced);

    if (mode === 'daily' && historyResults.length + 1 >= 10) {
      setIsGameOver(true);
      return;
    }

    if (deck.length > 0) {
      const turnCount = score + (3 - lives) + 1;
      const { picked, nextDeck } = pickNextCardWithCurve(deck, newPlaced, turnCount);
      setCurrentCard(picked);
      setDeck(nextDeck);
    } else {
      setIsGameOver(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      {/* 1. 상단 글로벌 헤더 & 상태바 */}
      <header className="px-4 py-3 sm:px-8 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 flex items-center justify-center font-black text-white text-lg shadow-md">
            T
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              트리비오 <span className="text-[10px] bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-1.5 py-0.5 rounded-sm">TRIVIO</span>
            </h1>
          </div>
        </div>

        {/* 점수 & 목숨 상태 */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1" aria-label={`남은 목숨 ${lives}개`}>
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-transform ${
                  i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-700 fill-slate-800 scale-90'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-orange-400 font-bold" title="연속 정답(Streak)">
              <Flame className="w-4 h-4 fill-orange-400" />
              {streak}
            </span>
            <span className="font-extrabold text-white text-base">
              {score} <span className="text-xs text-slate-400 font-normal">점</span>
            </span>
          </div>
        </div>
      </header>

      {/* 2. 게임 모드 & 카테고리 브라우저 셀렉터 */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => startNewGame('endless', 'all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              mode === 'endless' && theme === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            전체 무한
          </button>
          <button
            type="button"
            onClick={() => startNewGame('daily', 'all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer ${
              mode === 'daily'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            데일리 10
          </button>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer ${
              theme !== 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-700/60 text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{theme !== 'all' ? THEME_NAMES[theme] : '카테고리 탐색'}</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          최고 기록: <strong className="text-amber-300">{highScore}점</strong>
        </span>
      </div>

      {/* 3. 중앙 출제 카드 영역 */}
      <div className="my-auto py-4 flex flex-col items-center">
        {feedbackMsg && (
          <div
            className={`text-xs font-bold px-3 py-1 rounded-full mb-3 animate-bounce ${
              feedbackMsg.type === 'correct'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}

        <div className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>카드를 드래그하거나 타임라인 슬롯(⬇)을 눌러 이동하세요 (💡 힌트 보기 지원)</span>
        </div>

        {currentCard ? (
          <EventCard
            event={currentCard}
            isCurrent
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', currentCard.id);
            }}
          />
        ) : (
          <div className="w-[220px] h-[240px] rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
            <Layers className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">덱의 모든 카드를 소진했습니다!</span>
          </div>
        )}
      </div>

      {/* 4. 하단 타임라인 보드 */}
      <div className="w-full bg-slate-950/60 border-t border-slate-800/80 backdrop-blur-md">
        <TimelineBoard
          placedCards={placedCards}
          onPlace={handlePlaceCard}
          isInteractable={!isGameOver && currentCard !== null}
        />
      </div>

      {/* 5. 카테고리 브라우저 모달 (FREE PLAY / BROWSE & FEATURED) */}
      <CategoryBrowserModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={(selectedTheme) => {
          startNewGame(selectedTheme === 'all' ? 'endless' : 'theme', selectedTheme);
        }}
      />

      {/* 6. 결과 모달 */}
      {isGameOver && (
        <ResultModal
          score={score}
          maxStreak={maxStreak}
          historyResults={historyResults}
          mode={mode}
          onRestart={() => startNewGame(mode, theme)}
        />
      )}
    </main>
  );
}
