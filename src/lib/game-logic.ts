import { HISTORY_EVENTS } from '@/data/events';
import { HistoryEvent, PlacedEvent, ThemeCategory } from '@/types/game';

// 날짜 문자열(YYYY-MM-DD) 기반 시드 의사 난수 생성기 (Mulberry32)
export function getSeededRandom(seedStr: string): () => number {
  let h = 1779033703 ^ seedStr.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function shuffleDeck<T>(array: T[], rng = Math.random): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getFilteredPool(theme: ThemeCategory): HistoryEvent[] {
  if (theme === 'all') return HISTORY_EVENTS;

  const filtered = HISTORY_EVENTS.filter((e) => {
    if (e.category === theme) return true;
    if (e.tags && e.tags.includes(theme)) return true;
    return false;
  });

  return filtered.length >= 2 ? filtered : HISTORY_EVENTS;
}

// 1~5턴은 기존 배치 카드들과 최소 100년 이상 격차 우선 선별
export function pickNextCardWithCurve(
  deck: HistoryEvent[],
  placedCards: PlacedEvent[],
  turnCount: number
): { picked: HistoryEvent; nextDeck: HistoryEvent[] } {
  if (deck.length === 0) throw new Error('No more cards');

  if (turnCount <= 5) {
    const easyIndex = deck.findIndex((candidate) =>
      placedCards.every((placed) => Math.abs(candidate.year - placed.year) >= 100)
    );
    if (easyIndex !== -1) {
      const picked = deck[easyIndex];
      const nextDeck = deck.filter((_, idx) => idx !== easyIndex);
      return { picked, nextDeck };
    }
  }

  const [picked, ...nextDeck] = deck;
  return { picked, nextDeck };
}

export function formatYear(year: number): string {
  if (year < 0) {
    return `BC ${Math.abs(year)}년`;
  }
  return `${year}년`;
}

export function getHistoryTitle(score: number): { title: string; emoji: string } {
  if (score >= 15) return { title: '시간의 절대 지배자', emoji: '👑' };
  if (score >= 10) return { title: '살아있는 백과사전', emoji: '⚡' };
  if (score >= 6) return { title: '만능 시간 여행자', emoji: '⏳' };
  if (score >= 3) return { title: '상식 탐험가', emoji: '🧭' };
  return { title: '트리비오 입문자', emoji: '📜' };
}
