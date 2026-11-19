import fs from 'node:fs/promises';

const updates = [
  // Films (e27, e30, e37, e45, e53) + new films
  { id: 'e27', category: 'films' },
  { id: 'e30', category: 'films' },
  { id: 'e37', category: 'films' },
  { id: 'e45', category: 'films' },
  { id: 'e53', category: 'films' },

  // Music (e32, e38, e52, e54) + new music
  { id: 'e32', category: 'music' },
  { id: 'e38', category: 'music' },
  { id: 'e52', category: 'music' },
  { id: 'e54', category: 'music' },

  // Games (e35, e39, e40, e44, e46, e50)
  { id: 'e35', category: 'games' },
  { id: 'e39', category: 'games' },
  { id: 'e40', category: 'games' },
  { id: 'e44', category: 'games' },
  { id: 'e46', category: 'games' },
  { id: 'e50', category: 'games' },

  // Korea (e4, e5, e6, e8, e9, e12, e25, e31)
  { id: 'e4', category: 'korea' },
  { id: 'e5', category: 'korea' },
  { id: 'e6', category: 'korea' },
  { id: 'e8', category: 'korea' },
  { id: 'e9', category: 'korea' },
  { id: 'e12', category: 'korea' },
  { id: 'e25', category: 'korea' },
  { id: 'e31', category: 'korea' },

  // World History (e1, e2, e3, e7, e10, e13, e14, e15, e42)
  { id: 'e1', category: 'world_history' },
  { id: 'e2', category: 'world_history' },
  { id: 'e3', category: 'world_history' },
  { id: 'e7', category: 'world_history' },
  { id: 'e10', category: 'world_history' },
  { id: 'e13', category: 'world_history' },
  { id: 'e14', category: 'world_history' },
  { id: 'e15', category: 'world_history' },
  { id: 'e42', category: 'world_history' },

  // Wars (e26)
  { id: 'e26', category: 'wars' },

  // Art (e11, e20, e21)
  { id: 'e11', category: 'art' },
  { id: 'e20', category: 'art' },
  { id: 'e21', category: 'art' },

  // Leaders (e16, e17)
  { id: 'e16', category: 'leaders' },
  { id: 'e17', category: 'leaders' },

  // Science (e18, e23, e34)
  { id: 'e18', category: 'science' },
  { id: 'e23', category: 'science' },
  { id: 'e34', category: 'science' },

  // Business (e19, e24, e33)
  { id: 'e19', category: 'business' },
  { id: 'e24', category: 'business' },
  { id: 'e33', category: 'business' },

  // Sports (e22, e28, e29, e41, e48, e51, e56)
  { id: 'e22', category: 'sports' },
  { id: 'e28', category: 'sports' },
  { id: 'e29', category: 'sports' },
  { id: 'e41', category: 'sports' },
  { id: 'e48', category: 'sports' },
  { id: 'e51', category: 'sports' },
  { id: 'e56', category: 'sports' },

  // Tech (e36, e43, e47, e49, e55)
  { id: 'e36', category: 'tech' },
  { id: 'e43', category: 'tech' },
  { id: 'e47', category: 'tech' },
  { id: 'e49', category: 'tech' },
  { id: 'e55', category: 'tech' },
];

// Additional rich events to ensure all categories have plenty of cards
const additionalEvents = [
  // Films
  {
    id: 'e57',
    title: "영화 '바람과 함께 사라지다' 개봉",
    year: 1939,
    category: 'films',
    tags: ['films', 'entertainment'],
    tmi: "\"내일은 내일의 태양이 뜬다\"라는 명대사를 남기며 인플레이션 반영 역대 전 세계 흥행 1위를 지키고 있습니다.",
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Poster_-_Gone_With_the_Wind_01.jpg/500px-Poster_-_Gone_With_the_Wind_01.jpg',
    imageCredit: 'Metro-Goldwyn-Mayer / Public domain'
  },
  {
    id: 'e58',
    title: "스티븐 스필버그 영화 '쥬라기 공원' 개봉",
    year: 1993,
    category: 'films',
    tags: ['films', 'entertainment'],
    tmi: "컴퓨터 그래픽(CGI) 기술로 공룡을 스크린에 되살려 전 세계 관객에게 충격을 주며 흥행 신기록을 세웠습니다.",
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'e59',
    title: "크리스토퍼 놀란 영화 '인터스텔라' 개봉",
    year: 2014,
    category: 'films',
    tags: ['films', 'entertainment'],
    tmi: "물리학자 킵 손의 자문을 받아 블랙홀 가르간튀아를 시각화했으며, 한국에서만 천만 관객을 돌파했습니다.",
    imageUrl: null,
    imageCredit: null
  },
  // Music
  {
    id: 'e60',
    title: "퀸(Queen) 'Bohemian Rhapsody' 싱글 발매",
    year: 1975,
    category: 'music',
    tags: ['music', 'entertainment'],
    tmi: "6분이 넘는 파격적인 오페라 록 구성으로 음반사들의 반대를 뚫고 영국 차트 9주 연속 1위를 차지했습니다.",
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'e61',
    title: "너바나(Nirvana) 전설의 앨범 'Nevermind' 발매",
    year: 1991,
    category: 'music',
    tags: ['music', 'entertainment'],
    tmi: "'Smells Like Teen Spirit'의 폭발적 반응으로 마이클 잭슨을 제치고 빌보드 앨범 차트 1위에 올랐습니다.",
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'e62',
    title: "원더걸스 'Tell Me' 국민 댄스 열풍",
    year: 2007,
    category: 'music',
    tags: ['music', 'entertainment'],
    tmi: "UCC 열풍과 함께 남녀노소 '어머나' 댄스를 따라 하며 2세대 K-POP 걸그룹 전성기를 열었습니다.",
    imageUrl: null,
    imageCredit: null
  },
  // Video Games
  {
    id: 'e63',
    title: "소니 '플레이스테이션(PlayStation)' 1세대 일본 발매",
    year: 1994,
    category: 'games',
    tags: ['games', 'tech'],
    tmi: "CD-ROM 매체 기반의 3D 그래픽 혁신으로 비디오 게임기 역사상 최초로 1억 대 출하를 달성했습니다.",
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/PSX-Console-wController.jpg/500px-PSX-Console-wController.jpg',
    imageCredit: 'Evan-Amos / Public domain'
  },
  {
    id: 'e64',
    title: "모장 '마인크래프트' 정식 버전 출시",
    year: 2011,
    category: 'games',
    tags: ['games', 'tech'],
    tmi: "샌드박스 인디 게임으로 시작해 3억 장 이상 판매되며 역사상 가장 많이 팔린 단일 비디오 게임이 되었습니다.",
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'e65',
    title: "닌텐도 스위치 & '젤다의 전설 야생의 숨결' 출시",
    year: 2017,
    category: 'games',
    tags: ['games', 'tech'],
    tmi: "휴대용과 거치형을 결합한 하이브리드 콘솔과 오픈월드의 새 지평을 연 명작으로 게임 대상을 휩쓸었습니다.",
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Nintendo_Switch_Console.png/500px-Nintendo_Switch_Console.png',
    imageCredit: 'Evan-Amos / Public domain'
  },
  // Korean History
  {
    id: 'e66',
    title: "왕건, 고려 건국",
    year: 918,
    category: 'korea',
    tags: ['korea', 'history', 'leaders'],
    tmi: "궁예를 몰아내고 철원에서 건국한 뒤 이듬해 송악(개성)으로 천도하며 후삼국 통일의 기틀을 닦았습니다.",
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'e67',
    title: "3·1 만세 운동 & 대한민국 임시정부 수립",
    year: 1919,
    category: 'korea',
    tags: ['korea', 'history'],
    tmi: "비폭력 독립 만세 운동의 열기를 이어받아 중국 상하이에서 대한민국 임시정부가 공식 출범했습니다.",
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/3.1_movement.jpg/500px-3.1_movement.jpg',
    imageCredit: 'Unknown / Public domain'
  },
  // Sports
  {
    id: 'e68',
    title: "박세리, 맨발 투혼 US 여자오픈 최연소 우승",
    year: 1998,
    category: 'sports',
    tags: ['sports'],
    tmi: "워터 해저드에 양말을 벗고 들어가 샷을 성공시키며 IMF 외환위기로 지친 전 국민에게 희망을 안겨주었습니다.",
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'e69',
    title: "박지성, 맨체스터 유나이티드 입단",
    year: 2005,
    category: 'sports',
    tags: ['sports'],
    tmi: "한국인 최초로 잉글랜드 프리미어리그(EPL) 명문 맨유에 입단해 '산소탱크'라는 별명으로 챔피언스리그를 제패했습니다.",
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Park_Ji-sung_2011.jpg/500px-Park_Ji-sung_2011.jpg',
    imageCredit: 'Steindy / CC BY-SA 3.0'
  },
  {
    id: 'e70',
    title: "손흥민, 아시아인 최초 프리미어리그(EPL) 득점왕 등극",
    year: 2022,
    category: 'sports',
    tags: ['sports'],
    tmi: "페널티킥 없이 순수 필드골 23골로 골든부트를 수상하며 아시아 축구 역사를 새로 썼습니다.",
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Son_Heung-min_2022.jpg/500px-Son_Heung-min_2022.jpg',
    imageCredit: 'Ailura / CC BY-SA 3.0 AT'
  },
  // Tech & Business
  {
    id: 'e71',
    title: "마이크로소프트, '윈도우 95(Windows 95)' 출시",
    year: 1995,
    category: 'tech',
    tags: ['tech', 'business'],
    tmi: "시작 메뉴와 작업 표시줄을 최초로 도입하며 개인용 컴퓨터(PC)의 대중화를 이끈 결정적 OS입니다.",
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'e72',
    title: "마크 저커버그, '페이스북(Facebook)' 서비스 런칭",
    year: 2004,
    category: 'tech',
    tags: ['tech', 'business'],
    tmi: "하버드 기숙사 방에서 대학생 네트워크로 시작해 전 세계 30억 명이 사용하는 SNS 거인이 되었습니다.",
    imageUrl: null,
    imageCredit: null
  }
];

async function run() {
  const fileRaw = './data/events-raw.json';
  const fileProcessed = './data/events-with-images.json';

  const raw = JSON.parse(await fs.readFile(fileProcessed, 'utf8'));
  const mapUpdates = new Map(updates.map(u => [u.id, u.category]));

  for (const item of raw) {
    if (mapUpdates.has(item.id)) {
      item.category = mapUpdates.get(item.id);
    }
  }

  // add additional events if not already present
  for (const add of additionalEvents) {
    if (!raw.some(r => r.id === add.id)) {
      raw.push(add);
    }
  }

  await fs.writeFile(fileProcessed, JSON.stringify(raw, null, 2), 'utf8');
  await fs.writeFile(fileRaw, JSON.stringify(raw, null, 2), 'utf8');
  console.log(`Updated ${raw.length} events successfully!`);
}

run();
