'use client';

import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, ExternalLink, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // 1. Desktop guard: run check on client only
    if (typeof window === 'undefined') return;

    // Check if running in standalone mode (already installed as PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return;
    }

    // Check dismissed cool-off (7 days)
    const dismissedTime = localStorage.getItem('trivio_pwa_dismissed');
    if (dismissedTime) {
      const diff = Date.now() - parseInt(dismissedTime, 10);
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Check if mobile device
    const ua = navigator.userAgent;
    const isMobileDevice =
      /Android|iPhone|iPad|iPod|Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
      (window.innerWidth < 768 && 'ontouchstart' in window);

    if (!isMobileDevice) {
      // Desktop user: do not show
      return;
    }

    // Detect iOS & In-App browser
    const iosCheck = /iPhone|iPad|iPod/i.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const inAppCheck = /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line/i.test(ua);

    setIsIOS(iosCheck);
    setIsInAppBrowser(inAppCheck);

    // Handler for Android / Chrome beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setIsVisible(false);
      localStorage.setItem('trivio_pwa_dismissed', Date.now().toString());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS or browsers that don't emit beforeinstallprompt immediately,
    // show the mobile guide after a slight delay (2.5s) so the user experiences the app first
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setIsVisible(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIosGuide(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('trivio_pwa_dismissed', Date.now().toString());
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstalled(true);
          handleDismiss();
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isIOS) {
      setShowIosGuide((prev) => !prev);
    } else {
      // Other Android/browser without prompt captured
      alert('브라우저 우측 상단 메뉴(⋮)를 누른 뒤 [홈 화면에 추가] 또는 [앱 설치]를 선택해주세요!');
    }
  };

  if (!isVisible || installed) return null;

  return (
    <aside
      role="complementary"
      aria-label="홈 화면 앱 설치 안내"
      className="fixed bottom-4 left-3 right-3 z-50 md:hidden max-w-md mx-auto animate-in fade-in slide-in-from-bottom-5 duration-300 select-none"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-slate-100">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center font-black text-white text-lg shadow-md shrink-0">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider uppercase text-amber-400">PWA APP</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-1.5 py-0.5 rounded-full border border-indigo-500/30">
                  무료 무설치
                </span>
              </div>
              <h2 className="text-sm font-bold text-white leading-tight">
                홈 화면에 앱으로 추가하기
              </h2>
              <p className="text-[11px] text-slate-400 leading-snug">
                주소창 없이 전체화면으로 더 빠르고 쾌적하게 즐기세요!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* In-App Browser notice (Kakao/Naver) */}
        {isInAppBrowser && (
          <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-200 flex items-start gap-2">
            <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
            <span>
              현재 인앱 브라우저입니다. 상단 또는 하단 <strong>메뉴(⋮ 또는 ⋯)</strong>에서 <strong>&apos;다른 브라우저로 열기(Safari / Chrome)&apos;</strong>를 누르시면 원클릭 앱 설치가 가능합니다.
            </span>
          </div>
        )}

        {/* iOS Step-by-Step Guide Accordion */}
        {showIosGuide && isIOS && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2.5 animate-in fade-in duration-200">
            <p className="font-bold text-amber-300 text-[11px]">
              📱 아이폰(iOS) Safari 3초 홈 화면 추가 방법:
            </p>
            <ol className="space-y-2 text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 shrink-0">1</span>
                <span>
                  사파리 화면 하단의 <strong className="text-white inline-flex items-center gap-0.5 bg-slate-800 px-1 py-0.5 rounded border border-slate-700"><Share2 className="w-3 h-3 text-sky-400" /> 공유</strong> 버튼 터치
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 shrink-0">2</span>
                <span>
                  메뉴에서 <strong className="text-white inline-flex items-center gap-0.5 bg-slate-800 px-1 py-0.5 rounded border border-slate-700"><PlusSquare className="w-3 h-3 text-amber-400" /> 홈 화면에 추가</strong> 선택
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 shrink-0">3</span>
                <span>
                  오른쪽 상단 <strong className="text-indigo-300 font-bold">&apos;추가&apos;</strong>를 누르면 바탕화면에 앱 아이콘 생성 완료!
                </span>
              </li>
            </ol>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-600 hover:to-amber-600 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            {isIOS ? (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{showIosGuide ? '가이드 닫기' : '홈 화면 추가 방법 보기'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>홈 화면에 앱 설치하기</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-medium text-xs transition-colors cursor-pointer"
          >
            나중에
          </button>
        </div>
      </div>
    </aside>
  );
};
