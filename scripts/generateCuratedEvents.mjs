import fs from 'node:fs/promises';

// 6대 명확한 테마 덱으로 전면 정비
// popculture, games, korea, world, tech, sports
const CURATED_EVENTS = [
  // ==========================================
  // 1. [korea] 한반도 5천년 실록 (12개)
  // ==========================================
  {
    id: 'kr_1',
    title: '단군왕검, 고조선 건국 (청동기 문명)',
    year: -2333,
    category: 'korea',
    theme: 'korea',
    tmi: '삼국유사에 기록된 한민족 최초의 국가로, 홍익인간(널리 인간을 이롭게 한다)의 건국 이념을 세웠습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'kr_2',
    title: '박혁거세, 신라 건국 (기원전 57년)',
    year: -57,
    category: 'korea',
    theme: 'korea',
    tmi: '카이사르가 로마에서 활약하던 시기, 한반도 동남부 경주 평야에서 알에서 태어났다는 설화와 함께 건국되었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'kr_3',
    title: '장수왕, 광개토대왕비 건립',
    year: 414,
    category: 'korea',
    theme: 'korea',
    tmi: '고구려 전성기를 이끈 부왕 광개토대왕의 정복 사업을 기리기 위해 국내성(지안)에 1,775자의 비문을 세웠습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Gwanggaeto_Stele_rubbing.jpg/500px-Gwanggaeto_Stele_rubbing.jpg',
    imageCredit: 'National Museum of Korea / Public domain'
  },
  {
    id: 'kr_4',
    title: '을지문덕 장군, 살수대첩 대승',
    year: 612,
    category: 'korea',
    theme: 'korea',
    tmi: '수나라 우중문에게 지은 5언시를 보내고 30만 별동대를 청천강(살수)에서 궤멸시켜 수나라를 멸망으로 몰아넣었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'kr_5',
    title: '신라, 기벌포 해전 승리로 삼국통일 완성',
    year: 676,
    category: 'korea',
    theme: 'korea',
    tmi: '나당전쟁에서 당나라 수군을 금강 하구 기벌포에서 최종 격퇴하여 대동강 이남의 영토를 확정 지었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'kr_6',
    title: '태조 왕건, 고려 왕조 건국',
    year: 918,
    category: 'korea',
    theme: 'korea',
    tmi: '궁예를 몰아내고 철원에서 건국한 뒤 이듬해 송악(개성)으로 천도하며 후삼국 재통일의 기틀을 다졌습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'kr_7',
    title: '태조 이성계, 조선 왕조 건국',
    year: 1392,
    category: 'korea',
    theme: 'korea',
    tmi: '위화도 회군으로 실권을 장악한 뒤 한양을 도읍으로 삼아 500년 유교 국가 조선을 건국했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Flag_of_Korea_%281893%29.svg/500px-Flag_of_Korea_%281893%29.svg.png',
    imageCredit: 'Lumia1234 / CC BY-SA 4.0'
  },
  {
    id: 'kr_8',
    title: '세종대왕, 훈민정음(한글) 창제',
    year: 1443,
    category: 'korea',
    theme: 'korea',
    tmi: '백성을 가르치는 바른 소리 28자를 친제했으며, 3년 뒤인 1446년에 반포했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Korea_Yeouido_Summer_20140805_11_%2814862134703%29.jpg/500px-Korea_Yeouido_Summer_20140805_11_%2814862134703%29.jpg',
    imageCredit: 'Republic of Korea / CC BY-SA 2.0'
  },
  {
    id: 'kr_9',
    title: '이순신 장군, 한산도 대첩 (학익진 전법)',
    year: 1592,
    category: 'korea',
    theme: 'korea',
    tmi: '임진왜란 초기 왜선 59척을 격침시키며 남해 제해권을 완벽히 장악하고 곡창지대 호남을 지켜냈습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Busanjinsunjeoldo.jpg/500px-Busanjinsunjeoldo.jpg',
    imageCredit: 'Byeon Bak / Public domain'
  },
  {
    id: 'kr_10',
    title: '3·1 만세 운동 & 대한민국 임시정부 수립',
    year: 1919,
    category: 'korea',
    theme: 'korea',
    tmi: '탑골공원에서 독립선언서가 낭독되며 전 민족적 항일 운동이 일어났고, 그 결실로 상하이 임시정부가 출범했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/3.1_movement.jpg/500px-3.1_movement.jpg',
    imageCredit: 'Unknown / Public domain'
  },
  {
    id: 'kr_11',
    title: '8·15 광복 (대한민국 해방)',
    year: 1945,
    category: 'korea',
    theme: 'korea',
    tmi: '일제 패망과 함께 35년간의 식민 통치에서 벗어나 민족의 자유와 독립을 되찾았습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_Map_of_Japan_and_Korea_%281910_-_1945%29.png/500px-Flag_Map_of_Japan_and_Korea_%281910_-_1945%29.png',
    imageCredit: 'DrRandomFactor / CC BY-SA 3.0'
  },
  {
    id: 'kr_12',
    title: '대한민국 정부 수립 선포',
    year: 1948,
    category: 'korea',
    theme: 'korea',
    tmi: '5·10 총선거로 제헌 국회를 구성하고 헌법을 제정한 뒤 8월 15일 대한민국 정부 수립을 공식 선포했습니다.',
    imageUrl: null,
    imageCredit: null
  },

  // ==========================================
  // 2. [world] 세계사 & 격동의 전장 (12개)
  // ==========================================
  {
    id: 'wo_1',
    title: '진시황, 중국 최초 천하통일',
    year: -221,
    category: 'world_history',
    theme: 'world',
    tmi: '만리장성과 병마용갱을 축조하고 도량형과 문자를 통일하며 황제 칭호를 처음 사용했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Qinshihuang.jpg/500px-Qinshihuang.jpg',
    imageCredit: 'Unknown artist / Public domain'
  },
  {
    id: 'wo_2',
    title: '율리우스 카이사르 암살 (로마 공화정 말기)',
    year: -44,
    category: 'world_history',
    theme: 'world',
    tmi: '"브루투스 너마저..."라는 탄식과 함께 원로원 의원들에게 암살당하며 로마 제정의 서막이 올랐습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Retrato_de_Julio_C%C3%A9sar_%2826724093101%29.jpg/500px-Retrato_de_Julio_C%C3%A9sar_%2826724093101%29.jpg',
    imageCredit: 'Ángel M. Felicísimo / Public domain'
  },
  {
    id: 'wo_3',
    title: '삼국지 적벽대전 (유비·손권 연합군의 화공)',
    year: 208,
    category: 'world_history',
    theme: 'world',
    tmi: '조조의 수군을 주유와 제갈량이 화공으로 격파하며 위·촉·오 삼국 정립의 분수령이 되었습니다.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Chibi.jpg',
    imageCredit: 'User Jie / CC BY-SA 3.0'
  },
  {
    id: 'wo_4',
    title: '칭기즈 칸, 몽골 제국 건국',
    year: 1206,
    category: 'world_history',
    theme: 'world',
    tmi: '오논강 유역에서 전 몽골 부족을 통합하고 유라시아 대륙을 아우르는 인류 최대의 제국을 열었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/YuanEmperorAlbumGenghisPortrait.jpg/500px-YuanEmperorAlbumGenghisPortrait.jpg',
    imageCredit: 'Unknown author / Public domain'
  },
  {
    id: 'wo_5',
    title: '콜럼버스, 대서양 횡단 후 신대륙 도착',
    year: 1492,
    category: 'world_history',
    theme: 'world',
    tmi: '산타마리아호를 타고 바하마 군도에 도달하며 유럽의 대항해시대와 세계화의 문을 열었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Portrait_of_a_Man%2C_Said_to_be_Christopher_Columbus.jpg/500px-Portrait_of_a_Man%2C_Said_to_be_Christopher_Columbus.jpg',
    imageCredit: 'Sebastiano del Piombo / Public domain'
  },
  {
    id: 'wo_6',
    title: '일본 세키가하라 전투',
    year: 1600,
    category: 'world_history',
    theme: 'world',
    tmi: '도쿠가와 이에야스의 동군이 승리하며 260여 년간 이어지는 에도 막부의 기틀을 완성했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Sekigaharascreen.jpg/500px-Sekigaharascreen.jpg',
    imageCredit: 'Archive of History Sekigahara / Public domain'
  },
  {
    id: 'wo_7',
    title: '미국 독립선언서 발표 (필라델피아)',
    year: 1776,
    category: 'world_history',
    theme: 'world',
    tmi: '토머스 제퍼슨이 기초한 선언문에서 모든 인간의 생명, 자유, 행복 추구권을 천명했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/United_States_Declaration_of_Independence.jpg/500px-United_States_Declaration_of_Independence.jpg',
    imageCredit: 'William Stone / Public domain'
  },
  {
    id: 'wo_8',
    title: '프랑스 대혁명 (바스티유 감옥 함락)',
    year: 1789,
    category: 'world_history',
    theme: 'world',
    tmi: '절대왕정의 상징인 바스티유를 파리 시민들이 습격하며 자유·평등·박애의 근대 민주주의가 시작되었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Prise_de_la_Bastille.jpg/500px-Prise_de_la_Bastille.jpg',
    imageCredit: 'Jean-Pierre Houël / Public domain'
  },
  {
    id: 'wo_9',
    title: '나폴레옹 보나파르트, 프랑스 황제 즉위',
    year: 1804,
    category: 'world_history',
    theme: 'world',
    tmi: '노트르담 대성당에서 교황 피우스 7세가 보는 앞에서 스스로 관을 쓰며 제1제정을 수립했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/500px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg',
    imageCredit: 'Jacques-Louis David / Public domain'
  },
  {
    id: 'wo_10',
    title: '에이브러햄 링컨, 게티스버그 연설',
    year: 1863,
    category: 'world_history',
    theme: 'world',
    tmi: '\'국민의, 국민에 의한, 국민을 위한 정부\'라는 명문장으로 남북전쟁의 대의를 밝혔습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Abraham_Lincoln_November_1863.jpg/500px-Abraham_Lincoln_November_1863.jpg',
    imageCredit: 'Alexander Gardner / Public domain'
  },
  {
    id: 'wo_11',
    title: '제1차 세계대전 발발 (사라예보 사건)',
    year: 1914,
    category: 'world_history',
    theme: 'world',
    tmi: '오스트리아 황태자 암살을 계기로 참호전, 독가스, 비행기가 투입된 전면전이 시작되었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Cheshire_Regiment_trench_1916.jpg/500px-Cheshire_Regiment_trench_1916.jpg',
    imageCredit: 'John Warwick Brooke / Public domain'
  },
  {
    id: 'wo_12',
    title: '베를린 장벽 붕괴 & 냉전 종식',
    year: 1989,
    category: 'world_history',
    theme: 'world',
    tmi: '동독 대변인의 오선언으로 수만 명의 시민이 몰려들어 장벽을 허물고 44년 만에 독일이 통일되었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Berlinermauer.jpg/500px-Berlinermauer.jpg',
    imageCredit: 'Noir / CC BY-SA 3.0'
  },

  // ==========================================
  // 3. [popculture] 팝 컬처 & 엔터 (12개)
  // ==========================================
  {
    id: 'pop_1',
    title: '세계 최초 유성 영화 \'재즈 싱어\' 개봉',
    year: 1927,
    category: 'films',
    theme: 'popculture',
    tmi: '"잠깐만요! 아직 아무것도 못 들으셨잖아요!"라는 대사로 무성영화 시대를 끝냈습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/The_Jazz_Singer_1927_Poster.jpg/500px-The_Jazz_Singer_1927_Poster.jpg',
    imageCredit: 'Warner Bros. / Public domain'
  },
  {
    id: 'pop_2',
    title: '디즈니 \'백설공주와 일곱 난쟁이\' 개봉',
    year: 1937,
    category: 'films',
    theme: 'popculture',
    tmi: '세계 최초의 장편 풀컬러 애니메이션으로 극장용 애니메이션 역사를 열었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Snow_white_1937_trailer_screenshot.jpg/500px-Snow_white_1937_trailer_screenshot.jpg',
    imageCredit: 'Walt Disney Productions / Public domain'
  },
  {
    id: 'pop_3',
    title: '영화 \'바람과 함께 사라지다\' 개봉',
    year: 1939,
    category: 'films',
    theme: 'popculture',
    tmi: '"내일은 내일의 태양이 뜬다"는 대사를 남기며 인플레이션 반영 역대 전 세계 흥행 1위를 지키고 있습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Poster_-_Gone_With_the_Wind_01.jpg/500px-Poster_-_Gone_With_the_Wind_01.jpg',
    imageCredit: 'Metro-Goldwyn-Mayer / Public domain'
  },
  {
    id: 'pop_4',
    title: '비틀즈(The Beatles) 데뷔 앨범 발매',
    year: 1963,
    category: 'music',
    theme: 'popculture',
    tmi: '영국 차트 30주 연속 1위를 차지하며 팝 역사상 가장 거대한 현상 \'비틀마니아\'를 촉발했습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'pop_5',
    title: '퀸(Queen) \'Bohemian Rhapsody\' 발매',
    year: 1975,
    category: 'music',
    theme: 'popculture',
    tmi: '6분에 달하는 파격적인 오페라 록 구성으로 영국 차트 9주 연속 1위에 오른 불후의 명곡입니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'pop_6',
    title: '조지 루카스 영화 \'스타워즈: 새로운 희망\' 개봉',
    year: 1977,
    category: 'films',
    theme: 'popculture',
    tmi: '개봉 첫날 43개 극장에서만 상영되었으나 전 세계적인 신드롬을 일으킨 SF의 전설입니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'pop_7',
    title: '마이클 잭슨, 역대 최다 판매 음반 \'Thriller\' 발매',
    year: 1982,
    category: 'music',
    theme: 'popculture',
    tmi: '전 세계 7천만 장 이상 판매되어 기네스북 역사상 가장 많이 팔린 앨범으로 공인되었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'pop_8',
    title: '너바나(Nirvana) 명반 \'Nevermind\' 발매',
    year: 1991,
    category: 'music',
    theme: 'popculture',
    tmi: '\'Smells Like Teen Spirit\'의 메가히트로 얼터너티브 록과 그런지 음악의 황금기를 열었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'pop_9',
    title: '제임스 카메론 영화 \'타이타닉\' 개봉',
    year: 1997,
    category: 'films',
    theme: 'popculture',
    tmi: '아카데미상 11개 부문을 휩쓸고 영화 사상 최초로 글로벌 박스오피스 10억 달러를 돌파했습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'pop_10',
    title: '싸이 \'강남스타일\', 유튜브 전 세계 최초 10억 뷰',
    year: 2012,
    category: 'music',
    theme: 'popculture',
    tmi: '말춤 열풍과 함께 유튜브의 32비트 조회수 시스템을 64비트로 바꾸게 만든 세기의 바이럴 곡입니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'pop_11',
    title: '봉준호 감독 \'기생충\', 아카데미 4관왕 석권',
    year: 2020,
    category: 'films',
    theme: 'popculture',
    tmi: '한국 영화 최초로 칸 황금종려상에 이어 오스카 작품상·감독상·각본상·국제영화상을 동시 석권했습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'pop_12',
    title: 'BTS \'Dynamite\', 한국인 최초 빌보드 핫 100 1위',
    year: 2020,
    category: 'music',
    theme: 'popculture',
    tmi: '발매 첫 주 빌보드 메인 싱글 차트 1위(Hot Shot Debut)에 직행하며 글로벌 팝 역사를 새로 썼습니다.',
    imageUrl: null,
    imageCredit: null
  },

  // ==========================================
  // 4. [games] 게이머즈 오디세이 (12개)
  // ==========================================
  {
    id: 'gm_1',
    title: '세계 최초 상용 아케이드 게임 \'퐁(Pong)\' 출시',
    year: 1972,
    category: 'games',
    theme: 'games',
    tmi: '탁구를 본뜬 2인용 비디오 게임으로, 출시 직후 동전통이 넘쳐 기계가 멈추는 진풍경을 낳았습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Pong_arcade_cabinet.jpg/500px-Pong_arcade_cabinet.jpg',
    imageCredit: 'Rob DiCaterino / CC BY 2.0'
  },
  {
    id: 'gm_2',
    title: '알렉세이 파지트노프, \'테트리스(Tetris)\' 개발',
    year: 1984,
    category: 'games',
    theme: 'games',
    tmi: '소련 과학원에서 탄생해 닌텐도 게임보이 번들로 탑재되면서 전 세계 5억 개 이상 판매되었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'gm_3',
    title: '닌텐도, 패미컴 \'슈퍼 마리오 브라더스\' 발매',
    year: 1985,
    category: 'games',
    theme: 'games',
    tmi: '아타리 쇼크로 무너졌던 북미 비디오 게임 산업을 단숨에 부활시킨 플랫폼 액션의 교과서입니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'gm_4',
    title: '소니 \'플레이스테이션(PlayStation 1)\' 일본 출시',
    year: 1994,
    category: 'games',
    theme: 'games',
    tmi: 'CD-ROM 매체와 3D 그래픽으로 비디오 게임기 역사상 최초로 1억 대 출하 기록을 달성했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/PSX-Console-wController.jpg/500px-PSX-Console-wController.jpg',
    imageCredit: 'Evan-Amos / Public domain'
  },
  {
    id: 'gm_5',
    title: '닌텐도 게임보이 \'포켓몬스터 레드·그린\' 발매',
    year: 1996,
    category: 'games',
    theme: 'games',
    tmi: '통신 케이블 교환 시스템과 151마리의 몬스터 수집으로 세계 매출 1위 미디어 IP가 되었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'gm_6',
    title: '블리자드 \'스타크래프트(StarCraft 1)\' 출시',
    year: 1998,
    category: 'games',
    theme: 'games',
    tmi: '테란·저그·프로토스의 황금 밸런스로 한국 PC방 혁명과 세계 e스포츠 생태계를 열었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'gm_7',
    title: '소니 \'플레이스테이션 2(PS2)\' 발매 (역대 콘솔 판매 1위)',
    year: 2000,
    category: 'games',
    theme: 'games',
    tmi: 'DVD 재생 기능과 압도적인 게임 라인업으로 누적 1억 5,500만 대 이상 판매된 불멸의 콘솔입니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/PlayStation_2.png/500px-PlayStation_2.png',
    imageCredit: 'Evan-Amos / Public domain'
  },
  {
    id: 'gm_8',
    title: '라이엇 게임즈 \'리그 오브 레전드(LoL)\' 정식 출시',
    year: 2009,
    category: 'games',
    theme: 'games',
    tmi: '롤드컵(Worlds)과 페이커의 활약 속에 전 세계 수억 명이 매일 플레이하는 국민 e스포츠가 되었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/League_of_Legends_2019_vector.svg/500px-League_of_Legends_2019_vector.svg.png',
    imageCredit: 'Riot Games / Public domain'
  },
  {
    id: 'gm_9',
    title: '모장 \'마인크래프트(Minecraft)\' 정식 버전 출시',
    year: 2011,
    category: 'games',
    theme: 'games',
    tmi: '무한한 블록 세상에서 자유롭게 건축하고 탐험하는 게임으로 단일 게임 판매량 1위(3억 장)를 기록했습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'gm_10',
    title: '블리자드 \'오버워치(Overwatch)\' 글로벌 출시',
    year: 2016,
    category: 'games',
    theme: 'games',
    tmi: '"새로운 영웅은 언제나 환영이야!"라는 슬로건과 함께 하이퍼 FPS 열풍을 몰고 왔습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'gm_11',
    title: '닌텐도 스위치 & \'젤다의 전설 야생의 숨결\' 발매',
    year: 2017,
    category: 'games',
    theme: 'games',
    tmi: '상호작용 기반의 물리 엔진으로 오픈월드 장르의 새 지평을 열며 올해의 게임상(GOTY)을 휩쓸었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Nintendo_Switch_Console.png/500px-Nintendo_Switch_Console.png',
    imageCredit: 'Evan-Amos / Public domain'
  },
  {
    id: 'gm_12',
    title: '크래프톤 \'배틀그라운드(PUBG)\' 얼리 액세스 돌파',
    year: 2017,
    category: 'games',
    theme: 'games',
    tmi: '스팀 동시 접속자 325만 명이라는 역대 최고 신기록을 세우며 전 세계 배틀로얄 장르를 평정했습니다.',
    imageUrl: null,
    imageCredit: null
  },

  // ==========================================
  // 5. [tech] 실리콘밸리 & 테크 (12개)
  // ==========================================
  {
    id: 'tc_1',
    title: '토머스 에디슨, 백열전구 상용화',
    year: 1879,
    category: 'science',
    theme: 'tech',
    tmi: '탄소 필라멘트를 이용해 40시간 이상 지속되는 전구를 개발하여 인류의 밤을 환하게 밝혔습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Thomas_Edison2.jpg/500px-Thomas_Edison2.jpg',
    imageCredit: 'Louis Bachrach / Public domain'
  },
  {
    id: 'tc_2',
    title: '라이트 형제, 최초의 동력 비행기 성공',
    year: 1903,
    category: 'science',
    theme: 'tech',
    tmi: '노스캐롤라이나 키티호크에서 12초 동안 36.5m를 날아올라 인류 항공 역사를 열었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/First_flight2.jpg/500px-First_flight2.jpg',
    imageCredit: 'John T. Daniels / Public domain'
  },
  {
    id: 'tc_3',
    title: '헨리 포드, 컨베이어 벨트 자동차 대량생산 개시',
    year: 1908,
    category: 'business',
    theme: 'tech',
    tmi: '포드 모델 T의 조립 시간을 12시간에서 93분으로 단축시켜 마이카 시대를 열었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/1910_Ford_Model_T_Touring_Car.jpg/500px-1910_Ford_Model_T_Touring_Car.jpg',
    imageCredit: 'CC BY-SA 2.0'
  },
  {
    id: 'tc_4',
    title: '인류 최초의 전자식 다목적 컴퓨터 ENIAC 공개',
    year: 1946,
    category: 'tech',
    theme: 'tech',
    tmi: '18,000개의 진공관과 30톤의 무게를 자랑하는 컴퓨터로 탄도 궤적 계산을 위해 제작되었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Eniac.jpg/500px-Eniac.jpg',
    imageCredit: 'U.S. Army Photo / Public domain'
  },
  {
    id: 'tc_5',
    title: '아폴로 11호, 인류 최초 달 착륙',
    year: 1969,
    category: 'science',
    theme: 'tech',
    tmi: '"이것은 한 인간에게는 작은 발걸음이지만, 인류에게는 거대한 도약입니다."',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Apollo_11_insignia.png/500px-Apollo_11_insignia.png',
    imageCredit: 'NASA / Public domain'
  },
  {
    id: 'tc_6',
    title: '스티브 잡스 & 워즈니악, 애플(Apple) 창립',
    year: 1976,
    category: 'tech',
    theme: 'tech',
    tmi: '차고에서 수제작 컴퓨터 \'애플 I\' 키트를 판매하며 세계 최고 가치 기업의 역사가 시작되었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/500px-Apple_logo_black.svg.png',
    imageCredit: 'Rob Janoff / Public domain'
  },
  {
    id: 'tc_7',
    title: '팀 버너스리, 월드 와이드 웹(WWW) 첫 서버 가동',
    year: 1991,
    category: 'tech',
    theme: 'tech',
    tmi: 'CERN 연구소에서 하이퍼텍스트 프로토콜(HTTP)과 HTML을 무료 공개하여 현대 인터넷 시대를 열었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'tc_8',
    title: '마이크로소프트, \'윈도우 95(Windows 95)\' 출시',
    year: 1995,
    category: 'tech',
    theme: 'tech',
    tmi: '시작 메뉴와 작업 표시줄, 바탕화면 아이콘을 정립하며 개인용 컴퓨터(PC)를 대중화했습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'tc_9',
    title: '래리 페이지 & 세르게이 브린, 구글(Google) 창립',
    year: 1998,
    category: 'tech',
    theme: 'tech',
    tmi: '페이지랭크(PageRank) 알고리즘으로 웹 검색 시장을 평정하고 지식 검색의 표준이 되었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/500px-Google_2015_logo.svg.png',
    imageCredit: 'Google LLC / Public domain'
  },
  {
    id: 'tc_10',
    title: '스티브 잡스, 1세대 아이폰(iPhone) 발표',
    year: 2007,
    category: 'tech',
    theme: 'tech',
    tmi: '"전화기, 터치 아이팟, 모바일 인터넷 기기. 이것은 하나입니다."라며 스마트폰 혁명을 일으켰습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/500px-IPhone_1st_Gen.svg.png',
    imageCredit: 'Rafael Fernandez / CC BY-SA 4.0'
  },
  {
    id: 'tc_11',
    title: '일론 머스크, 테슬라 \'모델 S\' 전기차 인도 개시',
    year: 2012,
    category: 'tech',
    theme: 'tech',
    tmi: '고성능 프리미엄 순수 전기 세단을 상용화하며 글로벌 완성차 업계의 전동화 전환을 주도했습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'tc_12',
    title: 'OpenAI, \'ChatGPT\' 공개 및 생성형 AI 혁명',
    year: 2022,
    category: 'tech',
    theme: 'tech',
    tmi: '출시 5일 만에 100만 명, 두 달 만에 1억 활성 사용자를 달성하며 인공지능 시대를 열었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/500px-ChatGPT_logo.svg.png',
    imageCredit: 'OpenAI / Public domain'
  },

  // ==========================================
  // 6. [sports] 불멸의 챔피언스 (12개)
  // ==========================================
  {
    id: 'sp_1',
    title: '제1회 아테네 근대 올림픽 개막 (1896년)',
    year: 1896,
    category: 'sports',
    theme: 'sports',
    tmi: '쿠베르탱 남작의 주도로 고대 올림픽의 발상지 아테네에서 14개국이 참가해 열렸습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/1896_Olympics_opening.jpg/500px-1896_Olympics_opening.jpg',
    imageCredit: 'Unknown / Public domain'
  },
  {
    id: 'sp_2',
    title: '제1회 FIFA 우루과이 월드컵 개막 (1930년)',
    year: 1930,
    category: 'sports',
    theme: 'sports',
    tmi: '개최국 우루과이가 아르헨티나를 꺾고 초대 줄리메컵의 주인이 되었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/1930_World_Cup_poster.jpg/500px-1930_World_Cup_poster.jpg',
    imageCredit: 'Guillermo Laborde / Public domain'
  },
  {
    id: 'sp_3',
    title: '손기정, 베를린 올림픽 마라톤 금메달',
    year: 1936,
    category: 'sports',
    theme: 'sports',
    tmi: '일제강점기 일장기를 가슴에 달고 뛰어 세계신기록으로 우승한 뒤 월계수 묘목으로 가슴을 가렸습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Sohn_Kee-chung.jpg/500px-Sohn_Kee-chung.jpg',
    imageCredit: 'Unknown / Public domain'
  },
  {
    id: 'sp_4',
    title: '펠레, 17세 나이로 스웨덴 월드컵 결승 멀티골 우승',
    year: 1958,
    category: 'sports',
    theme: 'sports',
    tmi: '월드컵 최연소 득점 및 최연소 해트트릭을 기록하며 브라질 축구 황제의 등극을 알렸습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Pele_by_John_Mathew_Smith.jpg/500px-Pele_by_John_Mathew_Smith.jpg',
    imageCredit: 'John Mathew Smith / CC BY-SA 2.0'
  },
  {
    id: 'sp_5',
    title: '무하마드 알리 vs 조지 포먼 \'정글의 혈투\' 승리',
    year: 1974,
    category: 'sports',
    theme: 'sports',
    tmi: '자이르 킨샤사에서 로프어도프 전술로 8라운드 KO승을 거두며 헤비급 세계 챔피언에 복귀했습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'sp_6',
    title: '디에고 마라도나, 멕시코 월드컵 \'신의 손\' & 60m 질주골',
    year: 1986,
    category: 'sports',
    theme: 'sports',
    tmi: '잉글랜드와의 8강전에서 세기의 논란골과 5명을 제친 원더골을 모두 터뜨려 아르헨티나를 우승시켰습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Maradona-Mundial_86.jpg/500px-Maradona-Mundial_86.jpg',
    imageCredit: 'El Gráfico / Public domain'
  },
  {
    id: 'sp_7',
    title: '1988 서울 하계 올림픽 개막',
    year: 1988,
    category: 'sports',
    theme: 'sports',
    tmi: '\'손에 손 잡고\' 주제가와 함께 160개국이 참가하며 동서 냉전의 벽을 허문 평화의 축제였습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'sp_8',
    title: '박세리, 맨발 투혼 US 여자오픈 최연소 우승',
    year: 1998,
    category: 'sports',
    theme: 'sports',
    tmi: '워터 해저드에 양말을 벗고 들어가 친 샷으로 기적의 20홀 연장 승리를 거두며 IMF 국민에게 희망을 주었습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'sp_9',
    title: '2002 FIFA 한일 월드컵, 대한민국 4강 신화',
    year: 2002,
    category: 'sports',
    theme: 'sports',
    tmi: '히딩크 감독과 붉은 악마의 전 국민 거리 응원 속에 포르투갈, 이탈리아, 스페인을 꺾고 4강에 올랐습니다.',
    imageUrl: null,
    imageCredit: null
  },
  {
    id: 'sp_10',
    title: '박지성, 한국인 최초 맨체스터 유나이티드 입단',
    year: 2005,
    category: 'sports',
    theme: 'sports',
    tmi: '알렉스 퍼거슨 감독의 지휘 아래 챔피언스리그와 프리미어리그를 제패하며 해외파 전성기를 열었습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Park_Ji-sung_2011.jpg/500px-Park_Ji-sung_2011.jpg',
    imageCredit: 'Steindy / CC BY-SA 3.0'
  },
  {
    id: 'sp_11',
    title: '김연아, 밴쿠버 동계올림픽 피겨 금메달 (228.56점 신기록)',
    year: 2010,
    category: 'sports',
    theme: 'sports',
    tmi: '압도적인 클린 연기로 쇼트와 프리 모두 세계 신기록을 경신하며 여자 싱글 역사상 최고 점수로 우승했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Kim_Yu-Na_at_the_2009_Skate_America_4.jpg/500px-Kim_Yu-Na_at_the_2009_Skate_America_4.jpg',
    imageCredit: 'David W. Carmichael / CC BY 3.0'
  },
  {
    id: 'sp_12',
    title: '손흥민, 아시아인 최초 프리미어리그(EPL) 득점왕 등극',
    year: 2022,
    category: 'sports',
    theme: 'sports',
    tmi: 'PK 없이 순수 필드골 23골로 골든부트를 수상하며 유럽 5대 리그 아시아인 최초 득점왕 역사를 썼습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Son_Heung-min_2022.jpg/500px-Son_Heung-min_2022.jpg',
    imageCredit: 'Ailura / CC BY-SA 3.0 AT'
  },
  {
    id: 'sp_13',
    title: '리오넬 메시, 카타르 월드컵 우승으로 라스트 댄스 완성',
    year: 2022,
    category: 'sports',
    theme: 'sports',
    tmi: '대회 골든볼을 수상하며 국가대표와 클럽에서 얻을 수 있는 모든 메이저 트로피를 석권했습니다.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/500px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
    imageCredit: 'Hossein Zohrevand / CC BY 4.0'
  }
];

async function run() {
  await fs.writeFile('./data/events-with-images.json', JSON.stringify(CURATED_EVENTS, null, 2), 'utf8');
  await fs.writeFile('./data/events-raw.json', JSON.stringify(CURATED_EVENTS, null, 2), 'utf8');
  console.log(`Saved ${CURATED_EVENTS.length} strictly curated events across 6 distinct themes!`);
}

run();
