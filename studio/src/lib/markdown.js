import { extractTitleFromMarkdown, sanitizeSlug } from './slug.js';

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderInline(text = '') {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function stripFrontmatter(markdown = '') {
  return markdown.replace(/^---\n[\s\S]*?\n---\n*/, '').trim();
}

function stripLeadingHeading(markdown = '', title = '') {
  const normalizedTitle = title.trim().toLowerCase();
  if (!normalizedTitle) {
    return markdown.trim();
  }

  return markdown.replace(/^#\s+(.+?)\s*\n+/, (match, heading) => {
    return heading.trim().toLowerCase() === normalizedTitle ? '' : match;
  }).trim();
}

export function stripMarkdown(markdown = '') {
  return stripFrontmatter(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#+\s+/gm, '')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

export function estimateReadTime(markdown = '') {
  const words = stripMarkdown(markdown).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `~${minutes} phút đọc`;
}

export function deriveDescription(markdown = '') {
  const text = stripMarkdown(markdown)
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 40) || stripMarkdown(markdown);

  if (!text) {
    return '';
  }

  const compact = text.replace(/\s+/g, ' ').trim();
  if (compact.length <= 180) {
    return compact;
  }

  return `${compact.slice(0, 177).trimEnd()}...`;
}

export function parseListInput(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toYamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function toDateString(value) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function renderImageFigure(src, alt) {
  if (!src) {
    return '';
  }

  return [
    '<figure class="article-illustration">',
    `  <img src="${escapeHtml(src)}" alt="${escapeHtml(alt || '')}" loading="lazy" decoding="async" />`,
    '</figure>',
  ].join('\n');
}

export function normalizeMetadata(input = {}) {
  const rawBody = stripFrontmatter(String(input.body || ''));
  const title = String(input.title || '').trim() || extractTitleFromMarkdown(rawBody) || 'Bản nháp chưa đặt tên';
  const body = stripLeadingHeading(rawBody, title);
  const description = String(input.description || '').trim() || deriveDescription(body);
  const tags = parseListInput(input.tags);
  const relatedSlugs = parseListInput(input.relatedSlugs).map((item) => sanitizeSlug(item)).filter(Boolean);
  const seriesOrderValue = Number.parseInt(String(input.seriesOrder || '').trim(), 10);
  const illustrationSvg = String(input.illustrationSvg || '').trim();

  return {
    title,
    slug: sanitizeSlug(input.slug || title),
    description,
    tags,
    readTime: String(input.readTime || '').trim() || estimateReadTime(body),
    date: toDateString(input.date),
    series: String(input.series || '').trim() || undefined,
    seriesOrder: Number.isFinite(seriesOrderValue) ? seriesOrderValue : undefined,
    seriesTitle: String(input.seriesTitle || '').trim() || undefined,
    relatedSlugs,
    callToAction: String(input.callToAction || '').trim() || undefined,
    illustrationPrompt: String(input.illustrationPrompt || '').trim() || undefined,
    illustrationSvg: illustrationSvg || undefined,
    illustrationImagePath: String(input.illustrationImagePath || '').trim() || undefined,
    illustrationImageUrl: String(input.illustrationImageUrl || '').trim() || undefined,
    illustrationImageAlt: String(input.illustrationImageAlt || '').trim() || title,
    body,
  };
}

export function buildFrontmatter(meta) {
  const lines = [
    '---',
    `title: ${toYamlString(meta.title)}`,
    `date: ${meta.date}`,
    `description: ${toYamlString(meta.description)}`,
  ];

  if (meta.tags?.length) {
    lines.push('tags:');
    for (const tag of meta.tags) {
      lines.push(`  - ${toYamlString(tag)}`);
    }
  }

  if (meta.readTime) {
    lines.push(`readTime: ${toYamlString(meta.readTime)}`);
  }

  if (meta.series) {
    lines.push(`series: ${toYamlString(meta.series)}`);
  }

  if (typeof meta.seriesOrder === 'number') {
    lines.push(`seriesOrder: ${meta.seriesOrder}`);
  }

  if (meta.seriesTitle) {
    lines.push(`seriesTitle: ${toYamlString(meta.seriesTitle)}`);
  }

  if (meta.relatedSlugs?.length) {
    lines.push('relatedSlugs:');
    for (const slug of meta.relatedSlugs) {
      lines.push(`  - ${toYamlString(slug)}`);
    }
  }

  if (meta.callToAction) {
    lines.push(`callToAction: ${toYamlString(meta.callToAction)}`);
  }

  lines.push('---', '');
  return lines.join('\n');
}

function renderBlocks(markdown = '') {
  const blocks = [];
  const lines = markdown.split('\n');
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }
    blocks.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) {
      return;
    }
    blocks.push(`<ul>${list.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ul>`);
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed === '---') {
      flushParagraph();
      flushList();
      blocks.push('<hr />');
      continue;
    }

    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const tag = heading[1].length === 2 ? 'h2' : 'h3';
      blocks.push(`<${tag}>${renderInline(heading[2])}</${tag}>`);
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      flushList();
      blocks.push(`<blockquote><p>${renderInline(trimmed.replace(/^>\s?/, ''))}</p></blockquote>`);
      continue;
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      list.push(listItem[1]);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks.join('\n');
}

export function renderPreview(input = {}) {
  const meta = normalizeMetadata(input);
  const imageUrl = meta.illustrationImageUrl || meta.illustrationImagePath;
  const illustration = imageUrl
    ? renderImageFigure(imageUrl, meta.illustrationImageAlt)
    : meta.illustrationSvg
    ? `<figure class="article-illustration">${meta.illustrationSvg}</figure>`
    : '';

  return [
    '<article class="preview-article">',
    `<header class="preview-header"><h1>${escapeHtml(meta.title)}</h1><p>${escapeHtml(meta.description)}</p></header>`,
    illustration,
    `<section class="preview-body">${renderBlocks(meta.body)}</section>`,
    '</article>',
  ].join('');
}

export function buildPublishArtifact(input = {}) {
  const meta = normalizeMetadata(input);
  const frontmatter = buildFrontmatter(meta);
  const imagePath = meta.illustrationImagePath || '';
  const illustrationBlock = imagePath
    ? `${renderImageFigure(imagePath, meta.illustrationImageAlt)}\n\n`
    : meta.illustrationSvg
    ? `<figure class="article-illustration">\n${meta.illustrationSvg.trim()}\n</figure>\n\n`
    : '';
  const artifact = `${frontmatter}${illustrationBlock}${meta.body.trim()}\n`;

  return {
    meta,
    artifact,
    previewHtml: renderPreview(meta),
  };
}
