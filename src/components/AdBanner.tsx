'use client';

import React from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'banner' | 'rectangle';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'banner',
  className = '',
}) => {
  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center text-slate-400 select-none ${
        format === 'rectangle' ? 'w-full max-w-[300px] h-[250px]' : 'w-full max-w-2xl h-[56px] sm:h-[64px]'
      } ${className}`}
    >
      <span className="absolute top-1 right-2 text-[9px] font-bold tracking-wider text-slate-400 uppercase">
        AD / 스폰서
      </span>

      {/* 실제 애드센스 코드가 들어갈 컨테이너 */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-[11px] font-semibold text-slate-300">
          🎯 트리비오 타임라인 스폰서 영역
        </span>
        <span className="text-[10px] text-slate-400 mt-0.5">
          Google AdSense & 배너 광고 연동 슬롯
        </span>
      </div>
    </div>
  );
};
