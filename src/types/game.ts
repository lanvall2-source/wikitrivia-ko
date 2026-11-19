export type Category =
  | 'korea'
  | 'world_history'
  | 'wars'
  | 'films'
  | 'music'
  | 'games'
  | 'tech'
  | 'science'
  | 'business'
  | 'sports'
  | 'art'
  | 'leaders'
  // legacy compatibility
  | 'history'
  | 'entertainment'
  | 'east_asia'
  | 'world'
  | 'it';

export interface HistoryEvent {
  id: string;
  title: string;
  year: number; // 기원전은 음수 (예: BC 221 -> -221)
  category: Category;
  tags?: string[];
  tmi: string;
  wikiTitleKo?: string;
  wikiTitleEn?: string;
  imageUrl?: string | null;
  imageCredit?: string | null;
}

export interface PlacedEvent extends HistoryEvent {
  status: 'correct' | 'wrong' | 'anchor';
}

export type GameMode = 'endless' | 'daily';

export type ThemeCategory =
  | 'all'
  | 'korea'
  | 'world_history'
  | 'films'
  | 'music'
  | 'games'
  | 'tech'
  | 'science'
  | 'business'
  | 'sports'
  | 'art'
  | 'leaders'
  | 'wars';

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
