'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HistoryEvent, PlacedEvent, GameMode, ThemeCategory } from '@/types/game';
import {
  shuffleDeck,
  getSeededRandom,
  getFilteredPool,
  pickNextCardWithCurve,
} from '@/lib/game-logic';
import { HomeScreen } from '@/components/HomeScreen';
import { EventCard } from '@/components/EventCard';
import { CurrentQuestionCard } from '@/components/CurrentQuestionCard';
import { TimelineBoard } from '@/components/TimelineBoard';
import { ResultModal } from '@/components/ResultModal';
import { CategoryBrowserModal } from '@/components/CategoryBrowserModal';
import { playCorrectSound, playWrongSound, playGameOverSound, getSoundMuted, setSoundMuted } from '@/lib/sound';
import { Heart, Flame, Calendar, Layers, Sparkles, ChevronDown, Trophy, Home, Volume2, VolumeX } from 'lucide-react';

const THEME_INFO: Record<ThemeCategory, { name: string; icon: string }> = {
  all: { name: '만물의 타임라인', icon: '🌐' },
  korea: { name: '한반도 5천년 실록', icon: '🇰🇷' },
  games: { name: '게이머즈 오디세이', icon: '🎮' },
  popculture: { name: '팝 컬처 & 엔터', icon: '🎬' },
  tech: { name: '실리콘밸리 & 테크', icon: '💻' },
  world: { name: '세계사 & 전장', icon: '🌍' },
  sports: { name: '불멸의 챔피언스', icon: '🏆' },
};

export default function TrivioPage() {
  const [view, setView] = useState<'home' | 'game'>('home');
  const [mode, setMode] = useState<GameMode>('endless');
  const [theme, setTheme] = useState<ThemeCategory>('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

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
      setIsMuted(getSoundMuted());
    }
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setSoundMuted(nextMuted);
  };

  const launchGame = useCallback(
    (targetMode: GameMode, targetTheme: ThemeCategory) => {
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
      setView('game');
    },
    []
  );

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
      playCorrectSound(streak);
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
      playWrongSound();
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
        playGameOverSound();
        setIsGameOver(true);
        setPlacedCards(newPlaced);
        return;
      }
    }

    setPlacedCards(newPlaced);

    if (mode === 'daily' && historyResults.length + 1 >= 10) {
      playGameOverSound();
      setIsGameOver(true);
      return;
    }

    if (deck.length > 0) {
      const turnCount = score + (3 - lives) + 1;
      const { picked, nextDeck } = pickNextCardWithCurve(deck, newPlaced, turnCount);
      setCurrentCard(picked);
      setDeck(nextDeck);
    } else {
      playGameOverSound();
      setIsGameOver(true);
    }
  };

  const currentThemeInfo = THEME_INFO[theme] || THEME_INFO.all;

  // 1. 처음 화면 (Landing / Selection Screen)
  if (view === 'home') {
    return (
      <>
        <HomeScreen
          highScore={highScore}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onStartDaily={() => launchGame('daily', 'all')}
          onOpenCategories={() => setIsCategoryModalOpen(true)}
          onStartFreePlay={() => launchGame('endless', 'all')}
        />

        {/* 카테고리 선택 모달 */}
        <CategoryBrowserModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          currentTheme={theme}
          onSelectTheme={(selectedTheme) => {
            setIsCategoryModalOpen(false);
            launchGame('endless', selectedTheme);
          }}
        />
      </>
    );
  }

  // 2. 퀴즈 게임 화면 (Game Play View)
  return (
    <main className="h-screen h-[100dvh] bg-slate-900 text-slate-100 flex flex-col justify-between select-none relative overflow-hidden">
      {/* 1. 상단 미니멀 통합 헤더바 */}
      <header className="px-3 py-2 sm:px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md z-30 flex items-center justify-between shrink-0">
        {/* 좌측: 홈 버튼 & 카테고리/모드 알약 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView('home')}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="홈 화면으로 나가기"
          >
            <Home className="w-4 h-4" />
          </button>

          {mode === 'endless' ? (
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 text-xs text-slate-200 cursor-pointer shadow-xs"
              title="카테고리 변경"
            >
              <span>{currentThemeInfo.icon}</span>
              <span className="font-extrabold text-white text-xs max-w-[80px] sm:max-w-none truncate">
                {currentThemeInfo.name}
              </span>
              <ChevronDown className="w-3 h-3 text-amber-400" />
            </button>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-300 font-bold">
              <Calendar className="w-3 h-3" />
              <span>데일리</span>
            </div>
          )}
        </div>

        {/* 중앙: 목숨 & 연속 정답 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" aria-label={`남은 목숨 ${lives}개`}>
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-700 fill-slate-800 scale-90'
                }`}
              />
            ))}
          </div>

          <span className="flex items-center gap-0.5 text-orange-400 font-black text-xs sm:text-sm" title="연속 정답(Streak)">
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            {streak}
          </span>
        </div>

        {/* 우측: 점수 & 사운드 음소거 */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/90 px-2.5 py-1 rounded-xl border border-slate-700/80 text-xs font-black text-amber-300">
            {score} <span className="text-[10px] text-slate-400 font-normal">점</span>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* 2. 중앙 문제 출제 영역 (모바일 가로 핏 카드) */}
      <div className="flex-1 flex flex-col justify-center items-center px-3 py-1 relative z-20">
        {feedbackMsg && (
          <div
            className={`text-xs font-black px-3 py-1 rounded-full mb-2 animate-bounce shadow-md ${
              feedbackMsg.type === 'correct'
                ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
                : 'bg-rose-500 text-white border border-rose-400'
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}

        {currentCard ? (
          <CurrentQuestionCard
            card={currentCard}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', currentCard.id);
            }}
          />
        ) : (
          <div className="w-full max-w-sm h-28 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
            <Layers className="w-6 h-6 mb-1 text-slate-400" />
            <span className="text-xs font-bold text-slate-300">모든 카드를 맞혔습니다!</span>
          </div>
        )}
      </div>

      {/* 3. 하단 타임라인 보드 (한눈에 2.5~3장 확인 & 원터치 삽입) */}
      <div className="w-full bg-slate-950/90 border-t border-slate-800 backdrop-blur-md shrink-0">
        <TimelineBoard
          placedCards={placedCards}
          onPlace={handlePlaceCard}
          isInteractable={!isGameOver && currentCard !== null}
        />
      </div>

      {/* 카테고리 브라우저 모달 */}
      <CategoryBrowserModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={(selectedTheme) => {
          setIsCategoryModalOpen(false);
          launchGame('endless', selectedTheme);
        }}
      />

      {/* 결과 모달 */}
      {isGameOver && (
        <ResultModal
          score={score}
          maxStreak={maxStreak}
          historyResults={historyResults}
          mode={mode}
          onRestart={() => launchGame(mode, theme)}
          onGoHome={() => setView('home')}
        />
      )}
    </main>
  );
}
