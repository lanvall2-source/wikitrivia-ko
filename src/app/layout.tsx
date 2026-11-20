import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';

export const metadata: Metadata = {
  metadataBase: new URL('https://wikitrivia-ko.vercel.app'),
  referrer: 'no-referrer',
  title: '트리비오 (Trivio) | 시간순 타임라인 퀴즈 게임 - 한국사·세계사·영화·게임',
  description:
    '세상의 모든 지식과 순간을 시간순으로 맞혀보세요! 한국사, 세계사, 영화, 음악, 비디오 게임, IT 기술, 스포츠까지 150종의 엄선된 사건 카드 타임라인 배치 퀴즈 게임 트리비오(Trivio). 100% 무료 무설치 PWA 웹게임.',
  keywords: [
    '트리비오',
    'Trivio',
    '타임라인 게임',
    '타임라인 퀴즈',
    '위키트리비아',
    'wikitrivia',
    '위키트리비아 한글',
    '위키트리비아 한국어',
    '역사 퀴즈',
    '역사 순서 맞추기',
    '상식 퀴즈',
    '한국사 퀴즈',
    '세계사 퀴즈',
    '영화 퀴즈',
    '게임 퀴즈',
    '무료 웹게임',
    '데일리 퀴즈',
    '지식 퀴즈 게임',
    '타임라인 보드게임',
  ],
  authors: [{ name: '트리비오 (Trivio)' }],
  creator: '트리비오 (Trivio)',
  publisher: '트리비오 (Trivio)',
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '트리비오',
  },
  openGraph: {
    title: '트리비오 (Trivio) | 시간순 타임라인 퀴즈 게임',
    description:
      '역사, 영화, 음악, 게임, 테크, 스포츠! 3개의 목숨으로 150종의 시간 타임라인을 완성해보세요. 매일 새로운 데일리 챌린지 무료 플레이!',
    url: 'https://wikitrivia-ko.vercel.app',
    siteName: '트리비오 (Trivio)',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '트리비오 (Trivio) 타임라인 퀴즈 게임',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '트리비오 (Trivio) | 시간순 타임라인 퀴즈 게임',
    description:
      '세상의 모든 순간을 시간순으로 맞히는 퀴즈 게임! 한국사·세계사·영화·게임·테크·스포츠 타임라인 챌린지',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'MXxK7Skf_b4dZ_lDgqkenVyyTW97jUhCA5c1kDphQow',
    other: {
      'naver-site-verification': '494dec9680c99b9f0ea91bd99f50e4416fb5bd21',
    },
  },
  other: {
    'naver-site-verification': '494dec9680c99b9f0ea91bd99f50e4416fb5bd21',
    'google-site-verification': 'MXxK7Skf_b4dZ_lDgqkenVyyTW97jUhCA5c1kDphQow',
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
  // Schema.org 구조화된 데이터 (WebApplication + FAQPage)
  const jsonLdWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '트리비오 (Trivio)',
    alternateName: ['Trivio', '위키트리비아 한글판', '타임라인 퀴즈'],
    url: 'https://wikitrivia-ko.vercel.app/',
    description:
      '한국사, 세계사, 영화, 음악, 비디오 게임, IT 기술, 스포츠 역사적 사건들을 시간순으로 맞히는 타임라인 퀴즈 웹게임',
    applicationCategory: 'GameApplication',
    genre: ['Trivia', 'Educational', 'Puzzle', 'History Game'],
    operatingSystem: 'All (Web, iOS, Android, Windows, macOS)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    inLanguage: 'ko-KR',
    featureList: [
      '150종의 엄선된 역사·문화·기술 사건 카드',
      '매일 새로운 10문제가 출제되는 데일리 챌린지',
      '한국사, 세계사, 팝컬처, 게임, 테크, 스포츠 6대 테마 덱',
      '연도 스포일러 없는 3D 카드 뒤집기 역사 배경 힌트',
      '경쾌한 웹 오디오 사운드 효과 및 모바일 네이티브 공유',
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '트리비오(Trivio)는 어떤 게임인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '트리비오는 주어진 역사적 사건, 대중문화 명작, 기술 혁신, 비디오 게임 출시 등의 카드를 연도순(과거에서 미래로) 올바른 위치에 배치하는 타임라인 퀴즈 게임입니다. 목숨 3개로 최대한 많은 카드를 성공적으로 배치하여 최고 점수와 역사 칭호에 도전해보세요.',
        },
      },
      {
        '@type': 'Question',
        name: '위키트리비아(WikiTrivia)와 어떤 점이 다른가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '트리비오는 한국 사용자들을 위해 정통 한국사(단군왕검부터 KTX까지) 덱을 대폭 강화하였으며, 3D 카드 뒤집기를 통한 스포일러 방지 힌트, 6대 전문 테마 덱 선택, 매일 새로운 10문제 데일리 모드, 그리고 경쾌한 효과음을 제공합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '어떤 카테고리의 퀴즈를 즐길 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '한반도 5천년 실록(한국사), 세계사 & 문명, 팝 컬처 & 엔터(영화·음악), 게이머즈 오디세이(비디오 게임), 실리콘밸리 & 테크(IT·과학기술), 불멸의 챔피언스(스포츠) 등 6대 테마 및 모든 분야가 섞인 종합 모드를 즐길 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '모바일에서도 무료로 이용할 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네, 별도의 앱 설치나 회원가입 없이 스마트폰, 태블릿, PC 브라우저에서 100% 무료로 즉시 플레이할 수 있습니다. PWA를 지원하므로 홈 화면에 추가하면 앱처럼 전체 화면으로 쾌적하게 즐기실 수 있습니다.',
        },
      },
    ],
  };

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* 구조화된 데이터 (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="antialiased font-sans bg-slate-900 text-slate-100 overflow-x-hidden min-h-screen">
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
