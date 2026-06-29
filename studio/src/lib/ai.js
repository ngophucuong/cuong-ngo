import { estimateReadTime, normalizeMetadata, stripMarkdown } from './markdown.js';

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

function normalizeComparable(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[“”"'`.,!?…:;()\[\]{}_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMeaningfulLine(markdown = '') {
  return stripMarkdown(markdown)
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .find((line) => line.length >= 20) || '';
}

function isWeakDescription(description, meta) {
  const normalized = normalizeComparable(description);
  if (!normalized || normalized.length < 35) {
    return true;
  }

  const title = normalizeComparable(meta.title);
  const firstLine = normalizeComparable(firstMeaningfulLine(meta.body));
  return normalized === title || normalized === firstLine || (title && normalized.includes(title));
}

function buildCuriosityDescription(meta) {
  const text = stripMarkdown(meta.body).replace(/\s+/g, ' ').trim();
  if (/\bAI\b/i.test(text)) {
    return 'Một tình huống nhỏ đặt lại câu hỏi lớn: khi nào AI thật sự giúp người, và khi nào nó chỉ làm mọi thứ thêm ồn ào?';
  }

  return 'Một lát cắt nhỏ mở ra câu hỏi lớn hơn: đâu là vấn đề thật phía sau những điều tưởng như đã rõ?';
}

function buildFallbackReview(draft, publishedSlugs = []) {
  const meta = normalizeMetadata(draft);
  const relatedSlugs = publishedSlugs.filter((slug) => slug !== meta.slug).slice(0, 2);

  return {
    title: meta.title,
    description: isWeakDescription(meta.description, meta) ? buildCuriosityDescription(meta) : meta.description,
    tags: meta.tags,
    readTime: meta.readTime || estimateReadTime(meta.body),
    series: meta.series || '',
    seriesOrder: meta.seriesOrder || null,
    seriesTitle: meta.seriesTitle || '',
    relatedSlugs,
    callToAction: meta.callToAction || '',
    visualPrompt: meta.illustrationPrompt || `Một minh hoạ SVG tối giản cho bài "${meta.title}"`,
    editorialNotes: [
      'Fallback review được dùng vì AI không trả về JSON hợp lệ.',
      'Bạn nên xem lại tiêu đề, mô tả, thẻ và relatedSlugs trước khi approve.',
    ],
    safetyFlags: [],
  };
}

function sanitizeReview(review, fallback, meta) {
  const title = String(review?.title || fallback.title).trim();
  let description = String(review?.description || fallback.description).trim();
  if (isWeakDescription(description, { ...meta, title })) {
    description = fallback.description;
  }

  return {
    title,
    description,
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
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(title || 'Minh hoạ bài viết')}">`,
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

function joinSuggestedList(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean).join(', ')
    : '';
}

function useSuggestion(current, suggested) {
  const currentText = String(current || '').trim();
  return currentText || String(suggested || '').trim();
}

function useDescriptionSuggestion(payload, review) {
  const currentText = String(payload.description || '').trim();
  const suggested = String(review.description || '').trim();
  const meta = { title: payload.title || review.title || '', body: payload.body || '' };
  if (!currentText || isWeakDescription(currentText, meta)) {
    return suggested || currentText;
  }
  return currentText;
}

// Hợp nhất bản nháp người dùng với gợi ý AI: chỉ điền vào ô trống,
// trừ description yếu/trùng lặp thì thay hẳn bằng bản AI.
export function mergePreparedInput(payload, review) {
  return {
    ...payload,
    title: useSuggestion(payload.title, review.title),
    description: useDescriptionSuggestion(payload, review),
    tags: useSuggestion(payload.tags, joinSuggestedList(review.tags)),
    readTime: useSuggestion(payload.readTime, review.readTime),
    series: useSuggestion(payload.series, review.series),
    seriesOrder: useSuggestion(payload.seriesOrder, review.seriesOrder),
    seriesTitle: useSuggestion(payload.seriesTitle, review.seriesTitle),
    relatedSlugs: useSuggestion(payload.relatedSlugs, joinSuggestedList(review.relatedSlugs)),
    callToAction: useSuggestion(payload.callToAction, review.callToAction),
    illustrationPrompt: useSuggestion(payload.illustrationPrompt, review.visualPrompt),
  };
}

export async function runEditorialReview(env, draft, publishedSlugs = []) {
  const fallback = buildFallbackReview(draft, publishedSlugs);
  if (!env.AI) {
    return fallback;
  }

  const prompt = [
    'Bạn là biên tập viên cho một blog công nghệ viết bằng tiếng Việt.',
    'Trả về DUY NHẤT một JSON hợp lệ, không markdown, không giải thích.',
    'JSON phải có các khoá:',
    'title, description, tags, readTime, series, seriesOrder, seriesTitle, relatedSlugs, callToAction, visualPrompt, editorialNotes, safetyFlags',
    'Ràng buộc:',
    '- description <= 180 ký tự, là standfirst nằm dưới title',
    '- description phải gợi tò mò bằng mâu thuẫn/câu hỏi chính; không tiết lộ hết kết luận',
    '- description KHÔNG được trùng title, không lặp câu mở đầu, không copy nguyên văn một câu trong bài',
    '- nếu description hiện tại yếu/trùng lặp, hãy thay hoàn toàn bằng mô tả mới',
    '- tags tối đa 5 mục',
    '- relatedSlugs tối đa 2 mục, chỉ chọn từ danh sách cho sẵn',
    '- giữ giọng văn trầm, thật, không khoe khoang',
    '- tránh mở description bằng dấu ngoặc kép nếu chỉ đang lặp một câu nói trong bài',
    '',
    `Danh sách slug đã có thể tham chiếu: ${publishedSlugs.join(', ') || '(chưa có)'}`,
    '',
    'Dữ liệu bài viết:',
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
        { role: 'system', content: 'Bạn chỉ được trả về JSON hợp lệ.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      max_tokens: 1200,
    });

    const text = typeof result === 'string'
      ? result
      : String(result?.response || result?.result?.response || '');
    const parsed = extractJson(text);

    return sanitizeReview(parsed, fallback, normalizeMetadata(draft));
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
    'Tạo một SVG minh hoạ ngang 1200x675 cho bài viết blog.',
    'Chỉ trả về duy nhất mã SVG hợp lệ bắt đầu bằng <svg và kết thúc bằng </svg>.',
    'Không chèn script, không CSS bên ngoài, không markdown fence.',
    'Phong cách tối giản, ấm áp, nghiêm, hợp với bài viết công nghệ và vận hành.',
    `Tiêu đề: ${meta.title}`,
    `Mô tả: ${meta.description}`,
    `Gợi ý minh hoạ: ${meta.illustrationPrompt || 'rút một hình tượng trực tiếp từ tinh thần bài viết'}`,
    `Nội dung rút gọn: ${meta.body.slice(0, 1800)}`,
  ].join('\n');

  try {
    const result = await env.AI.run(env.AI_REVIEW_MODEL, {
      messages: [
        { role: 'system', content: 'Bạn là nhà thiết kế SVG. Chỉ trả về mã SVG hợp lệ.' },
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
