import { buildTargetPath } from './github.js';
import { buildPublishArtifact, normalizeMetadata, renderPreview } from './markdown.js';

function nowIso() {
  return new Date().toISOString();
}

function parseJson(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function putText(bucket, key, text) {
  await bucket.put(key, text, {
    httpMetadata: {
      contentType: 'text/plain; charset=utf-8',
    },
  });
}

async function getText(bucket, key) {
  if (!key) {
    return '';
  }

  const object = await bucket.get(key);
  if (!object) {
    return '';
  }

  return object.text();
}

function draftSourceKey(id) {
  return `drafts/${id}/source.md`;
}

function draftArtifactKey(id) {
  return `drafts/${id}/approved.md`;
}

function rowToSummary(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    updatedAt: row.updated_at,
    scheduledFor: row.scheduled_for,
    publishedAt: row.published_at,
  };
}

function rowToInput(row, body = '') {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    tags: parseJson(row.tags_json, []),
    readTime: row.read_time || '',
    date: row.date || '',
    series: row.series || '',
    seriesOrder: row.series_order ?? '',
    seriesTitle: row.series_title || '',
    relatedSlugs: parseJson(row.related_slugs_json, []),
    callToAction: row.call_to_action || '',
    illustrationPrompt: row.illustration_prompt || '',
    illustrationSvg: row.illustration_svg || '',
    body,
  };
}

async function getDraftRow(env, id) {
  return env.DB.prepare('SELECT * FROM drafts WHERE id = ?').bind(id).first();
}

export async function listDrafts(env) {
  const result = await env.DB.prepare(`
    SELECT id, slug, title, status, updated_at, scheduled_for, published_at
    FROM drafts
    ORDER BY updated_at DESC
  `).all();

  return (result.results || []).map(rowToSummary);
}

export async function getDraft(env, id) {
  const row = await getDraftRow(env, id);
  if (!row) {
    return null;
  }

  const body = await getText(env.DRAFTS_BUCKET, row.source_key);
  const artifact = await getText(env.DRAFTS_BUCKET, row.artifact_key);
  const input = rowToInput(row, body);

  return {
    ...input,
    status: row.status,
    sourceKey: row.source_key,
    artifactKey: row.artifact_key,
    artifact,
    aiReview: parseJson(row.ai_review_json, null),
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    scheduledFor: row.scheduled_for,
    publishedAt: row.published_at,
    previewHtml: renderPreview(input),
  };
}

export async function saveDraft(env, payload, actorEmail) {
  const draftId = String(payload.id || `draft_${crypto.randomUUID()}`);
  const existing = await getDraftRow(env, draftId);
  const existingBody = existing ? await getText(env.DRAFTS_BUCKET, existing.source_key) : '';
  const merged = {
    ...rowToInput(existing || {
      id: draftId,
      slug: '',
      title: '',
      description: '',
      tags_json: '[]',
      read_time: '',
      date: '',
      series: '',
      series_order: '',
      series_title: '',
      related_slugs_json: '[]',
      call_to_action: '',
      illustration_prompt: '',
      illustration_svg: '',
    }, existingBody),
    ...payload,
    id: draftId,
    body: payload.body ?? existingBody,
    slug: payload.slug ?? existing?.slug ?? '',
  };

  const meta = normalizeMetadata(merged);
  const sourceKey = existing?.source_key || draftSourceKey(draftId);
  const sourceBody = String(merged.body || '').trim();
  const timestamp = nowIso();

  await putText(env.DRAFTS_BUCKET, sourceKey, sourceBody);

  await env.DB.prepare(`
    INSERT INTO drafts (
      id, slug, title, description, tags_json, read_time, date, series, series_order, series_title,
      related_slugs_json, call_to_action, illustration_prompt, illustration_svg, ai_review_json,
      status, source_key, artifact_key, scheduled_for, published_at, created_by, updated_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      description = excluded.description,
      tags_json = excluded.tags_json,
      read_time = excluded.read_time,
      date = excluded.date,
      series = excluded.series,
      series_order = excluded.series_order,
      series_title = excluded.series_title,
      related_slugs_json = excluded.related_slugs_json,
      call_to_action = excluded.call_to_action,
      illustration_prompt = excluded.illustration_prompt,
      illustration_svg = excluded.illustration_svg,
      status = excluded.status,
      source_key = excluded.source_key,
      updated_by = excluded.updated_by,
      updated_at = excluded.updated_at
  `).bind(
    draftId,
    meta.slug,
    meta.title,
    meta.description,
    JSON.stringify(meta.tags),
    meta.readTime,
    meta.date,
    meta.series || null,
    meta.seriesOrder ?? null,
    meta.seriesTitle || null,
    JSON.stringify(meta.relatedSlugs),
    meta.callToAction || null,
    meta.illustrationPrompt || null,
    meta.illustrationSvg || null,
    existing?.ai_review_json || null,
    'draft',
    sourceKey,
    existing?.artifact_key || null,
    null,
    existing?.published_at || null,
    existing?.created_by || actorEmail,
    actorEmail,
    existing?.created_at || timestamp,
    timestamp,
  ).run();

  return getDraft(env, draftId);
}

export async function saveReview(env, draftId, review, actorEmail) {
  const reviewId = `review_${crypto.randomUUID()}`;
  const timestamp = nowIso();

  await env.DB.prepare(`
    INSERT INTO review_runs (id, draft_id, actor_email, review_json, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    reviewId,
    draftId,
    actorEmail,
    JSON.stringify(review),
    timestamp,
  ).run();

  await env.DB.prepare(`
    UPDATE drafts
    SET ai_review_json = ?, updated_by = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    JSON.stringify(review),
    actorEmail,
    timestamp,
    draftId,
  ).run();

  return reviewId;
}

export async function approveDraft(env, payload, actorEmail) {
  const existing = await getDraftRow(env, payload.id);
  if (!existing) {
    throw new Error('Draft not found');
  }

  const sourceBody = payload.body ?? await getText(env.DRAFTS_BUCKET, existing.source_key);
  const artifactKey = existing.artifact_key || draftArtifactKey(existing.id);
  const { meta, artifact, previewHtml } = buildPublishArtifact({
    ...rowToInput(existing, sourceBody),
    ...payload,
    body: sourceBody,
  });
  const timestamp = nowIso();

  await putText(env.DRAFTS_BUCKET, existing.source_key, String(sourceBody).trim());
  await putText(env.DRAFTS_BUCKET, artifactKey, artifact);

  await env.DB.prepare(`
    UPDATE drafts
    SET slug = ?, title = ?, description = ?, tags_json = ?, read_time = ?, date = ?, series = ?,
        series_order = ?, series_title = ?, related_slugs_json = ?, call_to_action = ?,
        illustration_prompt = ?, illustration_svg = ?, artifact_key = ?, status = ?, updated_by = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    meta.slug,
    meta.title,
    meta.description,
    JSON.stringify(meta.tags),
    meta.readTime,
    meta.date,
    meta.series || null,
    meta.seriesOrder ?? null,
    meta.seriesTitle || null,
    JSON.stringify(meta.relatedSlugs),
    meta.callToAction || null,
    meta.illustrationPrompt || null,
    meta.illustrationSvg || null,
    artifactKey,
    'ready',
    actorEmail,
    timestamp,
    existing.id,
  ).run();

  const draft = await getDraft(env, existing.id);
  draft.artifact = artifact;
  draft.previewHtml = previewHtml;
  return draft;
}

export async function createPublishJob(env, { draftId, mode, publishAt, actorEmail }) {
  const draft = await getDraftRow(env, draftId);
  if (!draft) {
    throw new Error('Draft not found');
  }

  if (draft.status !== 'ready') {
    throw new Error('Draft phai o trang thai ready truoc khi publish');
  }

  if (!draft.artifact_key) {
    throw new Error('Draft chua duoc approve');
  }

  const timestamp = nowIso();
  const jobId = `publish_${crypto.randomUUID()}`;
  const targetPath = buildTargetPath(env, draft.slug);

  await env.DB.prepare(`
    INSERT INTO publish_jobs (
      id, draft_id, workflow_instance_id, target_slug, target_path,
      mode, publish_at, status, commit_sha, error_message, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    jobId,
    draftId,
    null,
    draft.slug,
    targetPath,
    mode,
    publishAt,
    'queued',
    null,
    null,
    actorEmail,
    timestamp,
    timestamp,
  ).run();

  await env.DB.prepare(`
    UPDATE drafts
    SET status = ?, scheduled_for = ?, updated_by = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    'scheduled',
    publishAt,
    actorEmail,
    timestamp,
    draftId,
  ).run();

  return {
    jobId,
    draftId,
    slug: draft.slug,
    targetPath,
    publishAt,
    mode,
  };
}

export async function attachWorkflowInstance(env, jobId, workflowInstanceId) {
  await env.DB.prepare(`
    UPDATE publish_jobs
    SET workflow_instance_id = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    workflowInstanceId,
    nowIso(),
    jobId,
  ).run();
}

export async function getPublishJob(env, jobId) {
  return env.DB.prepare('SELECT * FROM publish_jobs WHERE id = ?').bind(jobId).first();
}

export async function markPublishSuccess(env, { jobId, commitSha }) {
  const timestamp = nowIso();
  const job = await getPublishJob(env, jobId);
  if (!job) {
    throw new Error('Publish job not found');
  }

  await env.DB.prepare(`
    UPDATE publish_jobs
    SET status = ?, commit_sha = ?, error_message = NULL, updated_at = ?
    WHERE id = ?
  `).bind(
    'published',
    commitSha || null,
    timestamp,
    jobId,
  ).run();

  await env.DB.prepare(`
    UPDATE drafts
    SET status = ?, scheduled_for = NULL, published_at = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    'published',
    timestamp,
    timestamp,
    job.draft_id,
  ).run();
}

export async function markPublishFailure(env, { jobId, errorMessage }) {
  const timestamp = nowIso();
  const job = await getPublishJob(env, jobId);
  if (!job) {
    throw new Error('Publish job not found');
  }

  await env.DB.prepare(`
    UPDATE publish_jobs
    SET status = ?, error_message = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    'failed',
    String(errorMessage || 'Unknown error').slice(0, 4000),
    timestamp,
    jobId,
  ).run();

  await env.DB.prepare(`
    UPDATE drafts
    SET status = ?, scheduled_for = NULL, updated_at = ?
    WHERE id = ?
  `).bind(
    'ready',
    timestamp,
    job.draft_id,
  ).run();
}

export async function recordViewEvent(env, { slug, path, title, visitorHash, userAgent }) {
  const eventId = `view_${crypto.randomUUID()}`;
  await env.DB.prepare(`
    INSERT INTO view_events (id, slug, path, post_title, visitor_hash, user_agent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    eventId,
    slug,
    path,
    title || null,
    visitorHash,
    userAgent || null,
    nowIso(),
  ).run();
}

export async function getDashboard(env) {
  const since = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString();
  const [statusRows, topPostsRows, draftsRows, scheduledRows] = await env.DB.batch([
    env.DB.prepare(`
      SELECT status, COUNT(*) AS count
      FROM drafts
      GROUP BY status
    `),
    env.DB.prepare(`
      SELECT slug, COALESCE(MAX(post_title), slug) AS title, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS readers
      FROM view_events
      WHERE created_at >= ?
      GROUP BY slug
      ORDER BY views DESC, readers DESC
      LIMIT 8
    `).bind(since),
    env.DB.prepare(`
      SELECT id, slug, title, status, updated_at, scheduled_for, published_at
      FROM drafts
      ORDER BY updated_at DESC
      LIMIT 20
    `),
    env.DB.prepare(`
      SELECT target_slug, publish_at, status
      FROM publish_jobs
      WHERE status = 'queued'
      ORDER BY publish_at ASC
      LIMIT 8
    `),
  ]);

  const summary = {
    draft: 0,
    ready: 0,
    scheduled: 0,
    published: 0,
  };

  for (const row of statusRows.results || []) {
    summary[row.status] = Number(row.count || 0);
  }

  return {
    summary,
    topPosts: (topPostsRows.results || []).map((row) => ({
      slug: row.slug,
      title: row.title,
      views: Number(row.views || 0),
      readers: Number(row.readers || 0),
    })),
    drafts: (draftsRows.results || []).map(rowToSummary),
    scheduled: (scheduledRows.results || []).map((row) => ({
      slug: row.target_slug,
      publishAt: row.publish_at,
      status: row.status,
    })),
  };
}
