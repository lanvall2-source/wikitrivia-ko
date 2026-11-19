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
import { TimelineBoard } from '@/components/TimelineBoard';
import { ResultModal } from '@/components/ResultModal';
import { CategoryBrowserModal } from '@/components/CategoryBrowserModal';
import { AdInterstitialModal } from '@/components/AdInterstitialModal';
import { AdBanner } from '@/components/AdBanner';
import { Heart, Flame, Calendar, Layers, Sparkles, ChevronDown, Trophy, Home } from 'lucide-react';

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
  const [isAdOpen, setIsAdOpen] = useState<boolean>(false);
  const [pendingGame, setPendingGame] = useState<{ mode: GameMode; theme: ThemeCategory } | null>(null);

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

  // 게임 시작 트리거: 광고 인터스티셜 팝업 노출 후 게임 진입
  const triggerStartWithAd = (targetMode: GameMode, targetTheme: ThemeCategory) => {
    setPendingGame({ mode: targetMode, theme: targetTheme });
    setIsAdOpen(true);
  };

  const handleAdFinishedAndStart = () => {
    setIsAdOpen(false);
    if (pendingGame) {
      launchGame(pendingGame.mode, pendingGame.theme);
      setPendingGame(null);
    } else {
      launchGame(mode, theme);
    }
  };

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

  const currentThemeInfo = THEME_INFO[theme] || THEME_INFO.all;

  // 1. 처음 화면 (Landing / Selection Screen)
  if (view === 'home') {
    return (
      <>
        <HomeScreen
          highScore={highScore}
          onStartDaily={() => triggerStartWithAd('daily', 'all')}
          onOpenCategories={() => setIsCategoryModalOpen(true)}
          onStartFreePlay={() => triggerStartWithAd('endless', 'all')}
        />

        {/* 카테고리 선택 모달 */}
        <CategoryBrowserModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          currentTheme={theme}
          onSelectTheme={(selectedTheme) => {
            setIsCategoryModalOpen(false);
            triggerStartWithAd('endless', selectedTheme);
          }}
        />

        {/* 게임 시작 전 광고 인터스티셜 */}
        <AdInterstitialModal
          isOpen={isAdOpen}
          onCloseAndStart={handleAdFinishedAndStart}
          gameTitle={
            pendingGame?.mode === 'daily'
              ? '데일리 챌린지 퀴즈'
              : `${THEME_INFO[pendingGame?.theme || 'all'].name} 퀴즈`
          }
        />
      </>
    );
  }

  // 2. 퀴즈 게임 화면 (Game Play View)
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      {/* 1. 상단 글로벌 헤더 & 상태바 */}
      <header className="px-4 py-3 sm:px-8 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView('home')}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="홈 화면으로 나가기"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 flex items-center justify-center font-black text-white text-sm shadow-md shrink-0">
              T
            </div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
              트리비오 <span className="text-[9px] bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-1.5 py-0.5 rounded-sm">TRIVIO</span>
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

      {/* 2. 상단 게임 모드 & 카테고리 컨트롤바 (모바일 반응형 최적화) */}
      <div className="max-w-xl mx-auto w-full px-4 pt-2.5 space-y-2">
        {/* 모드 탭 (무한 모드 / 데일리 퀴즈) & 최고 기록 */}
        <div className="flex items-center justify-between gap-2">
          {/* 세그먼트 모드 탭 */}
          <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs shadow-inner shrink-0">
            <button
              type="button"
              onClick={() => triggerStartWithAd('endless', theme)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                mode === 'endless'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              무한 모드
            </button>
            <button
              type="button"
              onClick={() => triggerStartWithAd('daily', 'all')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                mode === 'daily'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>데일리 퀴즈</span>
            </button>
          </div>

          {/* 최고 기록 */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/60 text-xs shrink-0 whitespace-nowrap">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-semibold">최고</span>
            <strong className="text-amber-300 font-black">{highScore}점</strong>
          </div>
        </div>

        {/* 카테고리 선택 알약 버튼 */}
        {mode === 'endless' ? (
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 active:bg-slate-700 border border-slate-700/80 hover:border-amber-400/60 transition-all text-xs text-slate-200 cursor-pointer shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{currentThemeInfo.icon}</span>
              <span className="font-extrabold text-white text-xs">{currentThemeInfo.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">카테고리</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300">
              <span>변경</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
            </div>
          </button>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-center text-[11px] text-indigo-300 font-medium">
            📅 오늘 날짜 고정 출제 (총 10문제 챌린지)
          </div>
        )}
      </div>

      {/* 3. 중앙 출제 카드 영역 */}
      <div className="my-auto py-2 flex flex-col items-center">
        {feedbackMsg && (
          <div
            className={`text-xs font-bold px-3 py-1 rounded-full mb-2.5 animate-bounce ${
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

      {/* 카테고리 브라우저 모달 */}
      <CategoryBrowserModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={(selectedTheme) => {
          setIsCategoryModalOpen(false);
          triggerStartWithAd('endless', selectedTheme);
        }}
      />

      {/* 게임 시작 전 광고 인터스티셜 */}
      <AdInterstitialModal
        isOpen={isAdOpen}
        onCloseAndStart={handleAdFinishedAndStart}
        gameTitle={
          pendingGame?.mode === 'daily'
            ? '데일리 챌린지 퀴즈'
            : `${THEME_INFO[pendingGame?.theme || 'all'].name} 퀴즈`
        }
      />

      {/* 결과 모달 */}
      {isGameOver && (
        <ResultModal
          score={score}
          maxStreak={maxStreak}
          historyResults={historyResults}
          mode={mode}
          onRestart={() => triggerStartWithAd(mode, theme)}
          onGoHome={() => setView('home')}
        />
      )}
    </main>
  );
}
