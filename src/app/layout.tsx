import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  referrer: 'no-referrer',
  title: '트리비오 (Trivio) | 시간순 타임라인 퀴즈 게임',
  description: '역사, 영화, 음악, 비디오 게임, IT 기술, 스포츠, 비즈니스! 세상의 모든 순간을 시간순으로 맞히는 타임라인 퀴즈 PWA 웹게임',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '트리비오',
  },
  openGraph: {
    title: '트리비오 (Trivio) | 시간순 타임라인 퀴즈 게임',
    description: '역사, 영화, 음악, 게임, 스포츠! 3개의 목숨으로 시간의 타임라인을 완성해보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased font-sans bg-slate-900 text-slate-100 overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
