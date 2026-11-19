'use client';

import React from 'react';
import { ThemeCategory } from '@/types/game';
import { X, Sparkles, Dices, ChevronRight, Play, Flame } from 'lucide-react';

interface CategoryBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeCategory;
  onSelectTheme: (theme: ThemeCategory) => void;
}

interface DeckOption {
  key: ThemeCategory;
  name: string;
  subname: string;
  icon: string;
  difficulty: string;
  badge: string;
  description: string;
  tags: string[];
  gradient: string;
  accentColor: string;
}

const THEME_DECKS: DeckOption[] = [
  {
    key: 'all',
    name: '만물의 타임라인',
    subname: 'ALL IN ONE DECK',
    icon: '🌐',
    difficulty: '★★★★★',
    badge: '종합 끝판왕',
    description: '역사, 영화, 게임, 테크, 스포츠가 종횡무진 교차하는 궁극의 타임라인!',
    tags: ['전 분야 믹스', '상식 챌린지', '무한 모드'],
    gradient: 'from-amber-500/20 via-purple-500/20 to-indigo-500/20',
    accentColor: 'border-amber-400 text-amber-300',
  },
  {
    key: 'korea',
    name: '한반도 5천년 실록',
    subname: 'KOREAN HISTORY',
    icon: '🇰🇷',
    difficulty: '★★★★☆',
    badge: '정통 한국사',
    description: '단군왕검 고조선부터 삼국, 세종대왕, 독립운동, 대한민국 현대사까지!',
    tags: ['고조선·삼국', '훈민정음', '광복'],
    gradient: 'from-blue-600/20 via-indigo-600/20 to-slate-900',
    accentColor: 'border-blue-400 text-blue-300',
  },
  {
    key: 'games',
    name: '게이머즈 오디세이',
    subname: 'VIDEO GAMES',
    icon: '🎮',
    difficulty: '★★★☆☆',
    badge: '인기 팩 🔥',
    description: '퐁, 마리오, 스타크래프트, 롤(LoL), 스위치까지! 세상을 바꾼 게임들',
    tags: ['닌텐도·소니', 'e스포츠', '콘솔 역사'],
    gradient: 'from-indigo-600/25 via-violet-600/20 to-slate-900',
    accentColor: 'border-indigo-400 text-indigo-300',
  },
  {
    key: 'popculture',
    name: '팝 컬처 & 엔터',
    subname: 'FILMS & MUSIC',
    icon: '🎬',
    difficulty: '★★★☆☆',
    badge: '명작 컬렉션',
    description: '비틀즈, 스타워즈, 타이타닉, 기생충, BTS! 스크린과 무대의 전설들',
    tags: ['오스카 명작', '빌보드 1위', 'K-POP'],
    gradient: 'from-pink-600/25 via-rose-600/20 to-slate-900',
    accentColor: 'border-pink-400 text-pink-300',
  },
  {
    key: 'tech',
    name: '실리콘밸리 & 테크',
    subname: 'TECH & SCIENCE',
    icon: '💻',
    difficulty: '★★★☆☆',
    badge: '혁신과 미래',
    description: '백열전구와 달 착륙부터 애플, 윈도우 95, 아이폰, ChatGPT까지!',
    tags: ['애플·구글', '스마트폰', '생성형 AI'],
    gradient: 'from-cyan-600/25 via-teal-600/20 to-slate-900',
    accentColor: 'border-cyan-400 text-cyan-300',
  },
  {
    key: 'world',
    name: '세계사 & 격동의 전장',
    subname: 'WORLD HISTORY',
    icon: '🌍',
    difficulty: '★★★★☆',
    badge: '인류 문명사',
    description: '진시황, 카이사르, 몽골 제국, 대항해시대, 프랑스 혁명, 세계대전',
    tags: ['고대 제국', '프랑스 혁명', '세계대전'],
    gradient: 'from-purple-600/25 via-amber-600/20 to-slate-900',
    accentColor: 'border-purple-400 text-purple-300',
  },
  {
    key: 'sports',
    name: '불멸의 챔피언스',
    subname: 'SPORTS HEROES',
    icon: '🏆',
    difficulty: '★★☆☆☆',
    badge: '짜릿한 승부',
    description: '올림픽, 월드컵, 손흥민 득점왕, 김연아 피겨, 메시 월드컵 우승!',
    tags: ['올림픽', '2002 월드컵', '손흥민·메시'],
    gradient: 'from-amber-600/25 via-orange-600/20 to-slate-900',
    accentColor: 'border-amber-400 text-amber-300',
  },
];

export const CategoryBrowserModal: React.FC<CategoryBrowserModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  // 🎲 랜덤 테마 룰렛
  const handleRandomSelect = () => {
    const poolWithoutAll = THEME_DECKS.filter((d) => d.key !== 'all');
    const randomPick = poolWithoutAll[Math.floor(Math.random() * poolWithoutAll.length)];
    onSelectTheme(randomPick.key);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 p-5 sm:p-7 shadow-2xl text-slate-100 flex flex-col justify-between animate-in zoom-in-95 duration-200 scrollbar-thin">
        {/* 모달 상단 헤더 */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>TRIVIO THEME DECKS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
              도전할 테마 덱을 선택하세요
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 🎲 독창적인 기능: 랜덤 테마 룰렛 버튼 */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleRandomSelect}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 active:scale-98 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer group"
          >
            <Dices className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
            <span>무엇을 할지 고민된다면? 🎲 운명의 랜덤 덱 뽑기!</span>
          </button>
        </div>

        {/* 테마 덱 쇼케이스 카드 그리드 */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {THEME_DECKS.map((deck) => {
            const isSelected = currentTheme === deck.key;
            return (
              <div
                key={deck.key}
                onClick={() => {
                  onSelectTheme(deck.key);
                  onClose();
                }}
                className={`relative rounded-2xl p-4 border transition-all duration-300 text-left cursor-pointer flex flex-col justify-between group overflow-hidden bg-gradient-to-br ${
                  deck.gradient
                } ${
                  isSelected
                    ? 'ring-3 ring-amber-400 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.01]'
                    : 'border-slate-700/80 hover:border-slate-500 hover:scale-[1.01] hover:shadow-lg'
                }`}
              >
                <div>
                  {/* 상단 뱃지 & 난이도 */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-amber-300">
                      {deck.badge}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 tracking-wider">
                      난이도 {deck.difficulty}
                    </span>
                  </div>

                  {/* 테마 제목 & 아이콘 */}
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {deck.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                        {deck.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        {deck.subname}
                      </span>
                    </div>
                  </div>

                  {/* 설명 카피 */}
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {deck.description}
                  </p>
                </div>

                {/* 하단 태그 & 플레이 액션 */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {deck.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800/70 text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="text-[11px] font-black text-amber-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>플레이</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
