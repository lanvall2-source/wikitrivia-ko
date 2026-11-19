import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_AGENT = 'WikiTriviaKorea/1.0 (https://github.com/wikitrivia-ko; contact@wikitrivia.kr) Node.js/20';
const DELAY_MS = 200;

function isAllowedLicense(licenseName) {
  if (!licenseName) return false;
  const l = licenseName.trim().toLowerCase();

  if (
    l.includes('fair use') ||
    l.includes('noncommercial') ||
    l.includes('nc') ||
    l.includes('noderivs') ||
    l.includes('nd') ||
    l.includes('all rights reserved')
  ) {
    return false;
  }

  return (
    l.includes('public domain') ||
    l.startsWith('pd') ||
    l === 'cc0' ||
    l.startsWith('cc0 ') ||
    l.includes('cc by-sa') ||
    l.includes('cc-by-sa') ||
    l.includes('cc by') ||
    l.includes('cc-by')
  );
}

function cleanHtml(rawText) {
  if (!rawText) return '';
  return rawText.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function extractFileNameFromUrl(imgUrl) {
  const cleanUrl = imgUrl.split('?')[0];
  const parts = cleanUrl.split('/');
  const isThumb = cleanUrl.includes('/thumb/');
  const rawFileName = isThumb ? parts[parts.length - 2] : parts[parts.length - 1];
  return decodeURIComponent(rawFileName);
}

async function fetchSummaryImage(wikiTitle, lang = 'ko') {
  if (!wikiTitle) return null;
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail?.source || data.originalimage?.source || null;
  } catch {
    return null;
  }
}

async function fetchImageMetaAnd500px(fileName, preferLang = 'ko') {
  const apis = [
    'https://commons.wikimedia.org/w/api.php',
    `https://${preferLang}.wikipedia.org/w/api.php`,
    'https://en.wikipedia.org/w/api.php',
  ];

  for (const apiBase of apis) {
    const queryUrl = `${apiBase}?action=query&titles=File:${encodeURIComponent(
      fileName
    )}&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=500&format=json`;

    try {
      const res = await fetch(queryUrl, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      });
      if (!res.ok) continue;

      const data = await res.json();
      const pages = data.query?.pages || {};
      const page = Object.values(pages)[0];

      if (!page || page.missing || !page.imageinfo?.[0]) continue;

      const info = page.imageinfo[0];
      const meta = info.extmetadata || {};

      const licenseShort = meta.LicenseShortName?.value || meta.License?.value || '';
      const artistRaw = meta.Artist?.value || meta.Credit?.value || '';
      const artist = cleanHtml(artistRaw) || 'Wikimedia Commons';
      const thumbUrl = info.thumburl || info.url;

      return {
        thumb500Url: thumbUrl,
        license: licenseShort,
        artist,
        isAllowed: isAllowedLicense(licenseShort),
      };
    } catch {
      continue;
    }
  }

  return null;
}

async function run() {
  const inputPath = path.resolve(__dirname, '../data/events-raw.json');
  const outputPath = path.resolve(__dirname, '../data/events-with-images.json');

  console.log(`\n🚀 [WikiTrivia] 위키미디어 이미지 & 라이선스 자동 수집 시작`);
  console.log(`📂 입력 파일: ${inputPath}`);

  let rawData;
  try {
    const content = await fs.readFile(inputPath, 'utf8');
    rawData = JSON.parse(content);
  } catch (err) {
    console.error(`❌ 입력 파일(${inputPath})을 읽을 수 없습니다:`, err.message);
    process.exit(1);
  }

  const results = [];
  let successCount = 0;
  let fallbackCount = 0;

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];
    const indexStr = `[${i + 1}/${rawData.length}]`;
    process.stdout.write(`${indexStr} ${item.title} 처리 중... `);

    let imgSourceUrl = null;
    let usedLang = 'ko';

    if (item.wikiTitleKo) {
      imgSourceUrl = await fetchSummaryImage(item.wikiTitleKo, 'ko');
      await sleep(DELAY_MS);
    }

    if (!imgSourceUrl && item.wikiTitleEn) {
      usedLang = 'en';
      imgSourceUrl = await fetchSummaryImage(item.wikiTitleEn, 'en');
      await sleep(DELAY_MS);
    }

    let finalImageUrl = null;
    let finalImageCredit = null;

    if (imgSourceUrl) {
      const fileName = extractFileNameFromUrl(imgSourceUrl);
      const meta = await fetchImageMetaAnd500px(fileName, usedLang);
      await sleep(DELAY_MS);

      if (meta && meta.isAllowed) {
        finalImageUrl = meta.thumb500Url;
        finalImageCredit = `${meta.artist} / ${meta.license}`;
        successCount++;
        console.log(`✅ 성공 (${meta.license})`);
      } else {
        fallbackCount++;
        const reason = meta ? `허용되지 않은 라이선스: ${meta.license}` : '메타데이터 조회 실패';
        console.log(`⚠️ Fallback 아이콘 전환 (${reason})`);
      }
    } else {
      fallbackCount++;
      console.log(`⚠️ 이미지 없음 (Fallback 아이콘 전환)`);
    }

    results.push({
      id: item.id || `evt_${i + 1}`,
      title: item.title,
      year: item.year,
      category: item.category,
      tmi: item.tmi,
      imageUrl: finalImageUrl,
      imageCredit: finalImageCredit,
    });
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf8');

  console.log(`\n===========================================`);
  console.log(`🎉 수집 완료!`);
  console.log(`- 전체 처리 건수: ${rawData.length}개`);
  console.log(`- 이미지 확보 성공: ${successCount}개`);
  console.log(`- 안전 Fallback(아이콘) 처리: ${fallbackCount}개`);
  console.log(`- 저장 위치: ${outputPath}`);
  console.log(`===========================================\n`);
}

run();
