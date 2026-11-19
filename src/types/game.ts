export type Category =
  | 'korea'
  | 'world_history'
  | 'films'
  | 'music'
  | 'games'
  | 'tech'
  | 'science'
  | 'business'
  | 'sports';

export type ThemeCategory =
  | 'all'
  | 'popculture'
  | 'games'
  | 'korea'
  | 'world'
  | 'tech'
  | 'sports';

export interface HistoryEvent {
  id: string;
  title: string;
  year: number; // 기원전은 음수 (예: BC 221 -> -221)
  category: Category;
  theme: ThemeCategory;
  tmi: string;
  imageUrl?: string | null;
  imageCredit?: string | null;
}

export interface PlacedEvent extends HistoryEvent {
  status: 'correct' | 'wrong' | 'anchor';
}

export type GameMode = 'endless' | 'daily';

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
