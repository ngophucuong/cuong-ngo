import { estimateReadTime, normalizeMetadata } from './markdown.js';

function safeJsonParse(input) {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function extractJson(text = '') {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced) {
    return safeJsonParse(fenced[1].trim());
  }

  const direct = text.match(/\{[\s\S]*\}/);
  if (direct) {
    return safeJsonParse(direct[0]);
  }

  return null;
}

function clampList(value, limit = 2) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, limit);
}

function buildFallbackReview(draft, publishedSlugs = []) {
  const meta = normalizeMetadata(draft);
  const relatedSlugs = publishedSlugs.filter((slug) => slug !== meta.slug).slice(0, 2);

  return {
    title: meta.title,
    description: meta.description,
    tags: meta.tags,
    readTime: meta.readTime || estimateReadTime(meta.body),
    series: meta.series || '',
    seriesOrder: meta.seriesOrder || null,
    seriesTitle: meta.seriesTitle || '',
    relatedSlugs,
    callToAction: meta.callToAction || '',
    visualPrompt: meta.illustrationPrompt || `Mot minh hoa SVG toi gian cho bai "${meta.title}"`,
    editorialNotes: [
      'Fallback review duoc dung vi AI khong tra ve JSON hop le.',
      'Ban nen xem lai tieu de, mo ta, the va relatedSlugs truoc khi approve.',
    ],
    safetyFlags: [],
  };
}

function sanitizeReview(review, fallback) {
  return {
    title: String(review?.title || fallback.title).trim(),
    description: String(review?.description || fallback.description).trim(),
    tags: clampList(review?.tags || fallback.tags || [], 5),
    readTime: String(review?.readTime || fallback.readTime).trim(),
    series: String(review?.series || fallback.series || '').trim(),
    seriesOrder: Number.isFinite(Number(review?.seriesOrder)) ? Number(review.seriesOrder) : fallback.seriesOrder,
    seriesTitle: String(review?.seriesTitle || fallback.seriesTitle || '').trim(),
    relatedSlugs: clampList(review?.relatedSlugs || fallback.relatedSlugs || [], 2),
    callToAction: String(review?.callToAction || fallback.callToAction || '').trim(),
    visualPrompt: String(review?.visualPrompt || fallback.visualPrompt || '').trim(),
    editorialNotes: Array.isArray(review?.editorialNotes)
      ? review.editorialNotes.map((item) => String(item).trim()).filter(Boolean).slice(0, 6)
      : fallback.editorialNotes,
    safetyFlags: Array.isArray(review?.safetyFlags)
      ? review.safetyFlags.map((item) => String(item).trim()).filter(Boolean).slice(0, 6)
      : [],
  };
}

function sanitizeSvg(svg = '') {
  return svg
    .replace(/```svg\s*/gi, '')
    .replace(/```\s*$/g, '')
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .trim();
}

function hashString(value = '') {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function fallbackSvg(seedText = '', title = '') {
  const hash = hashString(seedText || title || 'cuong-ngo');
  const colors = [
    ['#f3eadb', '#9a3b1f', '#1a1714'],
    ['#ede7da', '#3d5c4a', '#5a524a'],
    ['#efe4d2', '#8d5b2c', '#2d2823'],
  ][hash % 3];

  const accentX = 180 + (hash % 420);
  const accentY = 140 + (hash % 180);
  const lineX = 720 + (hash % 240);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${title || 'Minh hoa bai viet'}">`,
    `<rect width="1200" height="675" fill="${colors[0]}"/>`,
    `<circle cx="${accentX}" cy="${accentY}" r="132" fill="${colors[1]}" opacity="0.12"/>`,
    `<circle cx="1020" cy="540" r="188" fill="${colors[1]}" opacity="0.08"/>`,
    `<path d="M120 520C260 420 380 400 520 452C650 500 820 508 1080 360" stroke="${colors[1]}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.78"/>`,
    `<path d="M130 ${accentY + 120}H${lineX}" stroke="${colors[2]}" stroke-width="2" opacity="0.18"/>`,
    `<rect x="96" y="88" width="360" height="120" rx="18" fill="white" fill-opacity="0.42"/>`,
    `<text x="126" y="144" fill="${colors[2]}" font-family="Georgia, serif" font-size="34">${escapeXml(title || 'Ngô Phú Cường')}</text>`,
    `<text x="126" y="186" fill="${colors[2]}" opacity="0.76" font-family="Georgia, serif" font-size="20">Studio v1 · minh hoa SVG</text>`,
    `</svg>`,
  ].join('');
}

function escapeXml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export async function runEditorialReview(env, draft, publishedSlugs = []) {
  const fallback = buildFallbackReview(draft, publishedSlugs);
  if (!env.AI) {
    return fallback;
  }

  const prompt = [
    'Ban la bien tap vien cho mot blog cong nghe viet bang tieng Viet.',
    'Tra ve DUY NHAT mot JSON hop le, khong markdown, khong giai thich.',
    'JSON phai co cac khoa:',
    'title, description, tags, readTime, series, seriesOrder, seriesTitle, relatedSlugs, callToAction, visualPrompt, editorialNotes, safetyFlags',
    'Rang buoc:',
    '- description <= 180 ky tu',
    '- tags toi da 5 muc',
    '- relatedSlugs toi da 2 muc, chi chon tu danh sach cho san',
    '- giu giong van tram, that, khong khoe khoang',
    '',
    `Danh sach slug da co the tham chieu: ${publishedSlugs.join(', ') || '(chua co)'}`,
    '',
    'Du lieu bai viet:',
    JSON.stringify({
      title: draft.title || '',
      description: draft.description || '',
      body: draft.body || '',
      tags: draft.tags || [],
      series: draft.series || '',
      seriesOrder: draft.seriesOrder || null,
      seriesTitle: draft.seriesTitle || '',
      relatedSlugs: draft.relatedSlugs || [],
      callToAction: draft.callToAction || '',
      illustrationPrompt: draft.illustrationPrompt || '',
    }),
  ].join('\n');

  try {
    const result = await env.AI.run(env.AI_REVIEW_MODEL, {
      messages: [
        { role: 'system', content: 'Ban chi duoc tra ve JSON hop le.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      max_tokens: 1200,
    });

    const text = typeof result === 'string'
      ? result
      : String(result?.response || result?.result?.response || '');
    const parsed = extractJson(text);

    return sanitizeReview(parsed, fallback);
  } catch {
    return fallback;
  }
}

export async function generateIllustrationSvg(env, draft) {
  const meta = normalizeMetadata(draft);
  const fallback = fallbackSvg(meta.illustrationPrompt || meta.description || meta.body, meta.title);

  if (!env.AI) {
    return fallback;
  }

  const prompt = [
    'Tao mot SVG minh hoa ngang 1200x675 cho bai viet blog.',
    'Chi tra ve duy nhat ma SVG hop le bat dau bang <svg va ket thuc bang </svg>.',
    'Khong chen script, khong CSS ben ngoai, khong markdown fence.',
    'Phong cach toi gian, am ap, nghiem, hop voi bai viet cong nghe va van hanh.',
    `Tieu de: ${meta.title}`,
    `Mo ta: ${meta.description}`,
    `Goi y minh hoa: ${meta.illustrationPrompt || 'rut mot hinh tuong truc tiep tu tinh than bai viet'}`,
    `Noi dung rut gon: ${meta.body.slice(0, 1800)}`,
  ].join('\n');

  try {
    const result = await env.AI.run(env.AI_REVIEW_MODEL, {
      messages: [
        { role: 'system', content: 'Ban la nha thiet ke SVG. Chi tra ve ma SVG hop le.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 1800,
    });

    const text = typeof result === 'string'
      ? result
      : String(result?.response || result?.result?.response || '');
    const svg = sanitizeSvg(text);

    if (svg.startsWith('<svg') && svg.includes('</svg>')) {
      return svg;
    }

    return fallback;
  } catch {
    return fallback;
  }
}
