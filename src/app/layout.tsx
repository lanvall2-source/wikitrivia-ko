import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '위키트리비아 코리아 (WikiTrivia Korea) | 역사 타임라인 퀴즈 게임',
  description: '한국사, 중국사, 세계사, 과학, IT 사건을 시간순으로 배치하는 두뇌 자극 타임라인 PWA 웹게임',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '위키트리비아',
  },
  openGraph: {
    title: '위키트리비아 코리아 | 역사 타임라인 퀴즈 게임',
    description: '당신의 역사 감각을 시험해보세요! 3개의 목숨으로 어디까지 맞힐 수 있을까요?',
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
