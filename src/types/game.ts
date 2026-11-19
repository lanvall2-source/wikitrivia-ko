export type Category = 'korea' | 'east_asia' | 'world' | 'science' | 'it';

export interface HistoryEvent {
  id: string;
  title: string;
  year: number; // 기원전은 음수 (예: BC 221 -> -221)
  category: Category;
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
export type ThemeCategory = 'all' | 'korea' | 'east_asia' | 'science_it';

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
