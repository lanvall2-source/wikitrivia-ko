export type Category =
  | 'history'
  | 'entertainment'
  | 'games'
  | 'tech'
  | 'science'
  | 'business'
  | 'sports'
  | 'art'
  | 'leaders'
  | 'korea'
  | 'east_asia'
  | 'world'
  | 'it';

export interface HistoryEvent {
  id: string;
  title: string;
  year: number; // 기원전은 음수 (예: BC 221 -> -221)
  category: Category;
  tags?: string[]; // e.g. ['film', 'game', 'music', 'war', 'korean_leader']
  tmi: string;
  wikiTitleKo?: string;
  wikiTitleEn?: string;
  imageUrl?: string | null;
  imageCredit?: string | null;
}

export interface PlacedEvent extends HistoryEvent {
  status: 'correct' | 'wrong' | 'anchor';
}

export type GameMode = 'endless' | 'daily' | 'theme';

export type ThemeCategory =
  | 'all'
  | 'history'
  | 'entertainment'
  | 'games'
  | 'tech'
  | 'science'
  | 'business'
  | 'sports'
  | 'art'
  | 'leaders'
  | 'films'
  | 'music'
  | 'wars'
  | 'korean_leaders';

export interface GameState {
  mode: GameMode;
  theme: ThemeCategory;
  lives: number;
  score: number;
  streak: number;
  maxStreak: number;
  deck: HistoryEvent[];
  placedCards: PlacedEvent[];
  currentCard: HistoryEvent | null;
  historyResults: boolean[];
  isGameOver: boolean;
  isDailyCompleted: boolean;
}
