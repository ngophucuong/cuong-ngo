const DIACRITICS = /[\u0300-\u036f]/g;

export function stripDiacritics(value = '') {
  return value.normalize('NFD').replace(DIACRITICS, '');
}

export function slugify(value = '') {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 96);
}

export function sanitizeSlug(value = '') {
  return slugify(value.replace(/[/.\\]+/g, ' '));
}

export function extractTitleFromMarkdown(markdown = '') {
  const heading = markdown.match(/^\s*#\s+(.+?)\s*$/m);
  if (heading) {
    return heading[1].trim();
  }

  const line = markdown
    .split('\n')
    .map((item) => item.trim())
    .find(Boolean);

  return line || '';
}

export function ensureUniqueSlug(baseSlug, used = []) {
  const normalized = sanitizeSlug(baseSlug) || `bai-${Date.now()}`;
  const taken = new Set(used.filter(Boolean));
  if (!taken.has(normalized)) {
    return normalized;
  }

  let counter = 2;
  while (taken.has(`${normalized}-${counter}`)) {
    counter += 1;
  }

  return `${normalized}-${counter}`;
}
