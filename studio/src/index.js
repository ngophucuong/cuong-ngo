import { error, html, json, readJson, withCors } from './lib/http.js';
import { renderPreview } from './lib/markdown.js';
import { renderStudioApp } from './lib/ui.js';
import { generateIllustrationSvg, runEditorialReview } from './lib/ai.js';
import { attachWorkflowInstance, approveDraft, createPublishJob, getDashboard, getDraft, getDraftIllustrationImageObject, listDrafts, recordViewEvent, saveDraft, saveDraftIllustrationImage, saveReview } from './lib/storage.js';
import { listPublishedPosts, listPublishedSlugs, recallPublishedPostFromGitHub } from './lib/github.js';
import { PublishWorkflow } from './workflows/publish-workflow.js';

function getSignalsHost(env) {
  try {
    return new URL(env.PUBLIC_TRACKING_BASE).hostname;
  } catch {
    return 'signals.cuong.ngo';
  }
}

function getPublicOrigin(env) {
  try {
    return new URL(env.PUBLIC_SITE_BASE).origin;
  } catch {
    return '*';
  }
}

function getSession(request) {
  const email = request.headers.get('cf-access-authenticated-user-email');
  if (email) {
    return { email, provider: 'cloudflare-access' };
  }

  const hostname = new URL(request.url).hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return { email: 'local-dev@cuong.ngo', provider: 'local-dev' };
  }

  return null;
}

function requireSession(request) {
  const session = getSession(request);
  if (!session) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return session;
}

function parseDraftRoute(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'api' || parts[1] !== 'drafts') {
    return null;
  }

  return {
    id: parts[2] || null,
    action: parts[3] || null,
  };
}


function parsePublishedRoute(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'api' || parts[1] !== 'published') {
    return null;
  }

  return {
    slug: parts[2] ? decodeURIComponent(parts[2]) : null,
    action: parts[3] || null,
  };
}

async function hashVisitor(request) {
  const raw = `${request.headers.get('cf-connecting-ip') || '0.0.0.0'}|${request.headers.get('user-agent') || 'unknown'}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(digest)).slice(0, 12).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function readTrackPayload(request) {
  try {
    return await request.json();
  } catch {
    const text = await request.text();
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
}

async function handleTrack(request, env) {
  if (request.method === 'OPTIONS') {
    return withCors(new Response(null, { status: 204 }), getPublicOrigin(env));
  }

  if (request.method !== 'POST') {
    return withCors(error('Method not allowed', 405), getPublicOrigin(env));
  }

  const payload = await readTrackPayload(request);
  const slug = String(payload?.slug || '').trim();
  const path = String(payload?.path || '').trim();
  const title = String(payload?.title || '').trim();

  if (!slug || !path) {
    return withCors(error('Missing slug or path', 400), getPublicOrigin(env));
  }

  await recordViewEvent(env, {
    slug,
    path,
    title,
    visitorHash: await hashVisitor(request),
    userAgent: request.headers.get('user-agent') || '',
  });

  return withCors(new Response(null, { status: 204 }), getPublicOrigin(env));
}

async function handleSession(request) {
  const session = requireSession(request);
  return json({ ok: true, session });
}

async function handleDashboard(request, env) {
  requireSession(request);
  return json({ ok: true, dashboard: await getDashboard(env) });
}

async function handlePublishedPosts(request, env) {
  requireSession(request);
  if (request.method !== 'GET') {
    return error('Method not allowed', 405);
  }

  const posts = await listPublishedPosts(env);
  return json({ ok: true, posts });
}

async function handleRecallPublishedPost(request, env, slug) {
  const session = requireSession(request);
  if (request.method !== 'POST') {
    return error('Method not allowed', 405);
  }

  const result = await recallPublishedPostFromGitHub(env, {
    slug,
    actorEmail: session.email,
  });

  return json({
    ok: true,
    message: `Đã thu hồi bài ${slug}. Cloudflare Pages sẽ cập nhật sau khi GitHub build xong.`,
    result,
  });
}

async function handleDrafts(request, env) {
  const session = requireSession(request);

  if (request.method === 'GET') {
    return json({ ok: true, drafts: await listDrafts(env) });
  }

  if (request.method === 'POST') {
    const payload = await readJson(request);
    if (!payload) {
      return error('Invalid JSON body', 400);
    }

    const draft = await saveDraft(env, payload, session.email);
    return json({ ok: true, draft });
  }

  return error('Method not allowed', 405);
}

async function handleDraftDetail(request, env, draftId) {
  requireSession(request);
  const draft = await getDraft(env, draftId);
  if (!draft) {
    return error('Draft not found', 404);
  }
  return json({ ok: true, draft });
}

async function handleReview(request, env, draftId) {
  const session = requireSession(request);
  const payload = await readJson(request);
  if (!payload) {
    return error('Invalid JSON body', 400);
  }

  let publishedSlugs = [];
  try {
    publishedSlugs = await listPublishedSlugs(env);
  } catch {
    publishedSlugs = [];
  }

  const review = await runEditorialReview(env, payload, publishedSlugs);
  await saveReview(env, draftId, review, session.email);
  return json({ ok: true, review });
}

async function handleIllustration(request, env) {
  requireSession(request);
  const payload = await readJson(request);
  if (!payload) {
    return error('Invalid JSON body', 400);
  }

  const illustrationSvg = await generateIllustrationSvg(env, payload);
  return json({
    ok: true,
    illustrationSvg,
    previewHtml: renderPreview({
      ...payload,
      illustrationSvg,
    }),
  });
}

async function handleUploadIllustrationImage(request, env, draftId) {
  const session = requireSession(request);
  if (request.method !== 'POST') {
    return error('Method not allowed', 405);
  }

  const form = await request.formData();
  const file = form.get('image');
  const alt = String(form.get('alt') || '').trim();
  const draft = await saveDraftIllustrationImage(env, {
    draftId,
    file,
    alt,
  }, session.email);

  return json({
    ok: true,
    draft,
    message: 'Đã tải ảnh minh hoạ lên draft. Hãy approve lại trước khi publish.',
  });
}

async function handleDraftIllustrationImage(request, env, draftId) {
  requireSession(request);
  if (request.method !== 'GET') {
    return error('Method not allowed', 405);
  }

  const result = await getDraftIllustrationImageObject(env, draftId);
  if (!result) {
    return error('Image not found', 404);
  }

  const headers = new Headers();
  headers.set('content-type', result.image.contentType || 'application/octet-stream');
  headers.set('cache-control', 'private, max-age=60');
  if (result.image.fileName) {
    headers.set('content-disposition', `inline; filename="${encodeURIComponent(result.image.fileName)}"`);
  }

  return new Response(result.object.body, { headers });
}


function joinSuggestedList(value) {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean).join(', ') : '';
}

function useSuggestion(current, suggested) {
  const currentText = String(current || '').trim();
  if (currentText) {
    return currentText;
  }
  return String(suggested || '').trim();
}

function mergePreparedInput(payload, review) {
  return {
    ...payload,
    title: useSuggestion(payload.title, review.title),
    description: useSuggestion(payload.description, review.description),
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

async function handlePrepare(request, env, draftId) {
  const session = requireSession(request);
  const payload = await readJson(request);
  if (!payload) {
    return error('Invalid JSON body', 400);
  }

  let publishedSlugs = [];
  try {
    publishedSlugs = await listPublishedSlugs(env);
  } catch {
    publishedSlugs = [];
  }

  const review = await runEditorialReview(env, payload, publishedSlugs);
  await saveReview(env, draftId, review, session.email);

  const preparedInput = mergePreparedInput(payload, review);
  const illustrationSvg = String(preparedInput.illustrationSvg || '').trim()
    || await generateIllustrationSvg(env, preparedInput);
  const draft = await saveDraft(env, {
    ...preparedInput,
    id: draftId,
    illustrationSvg,
  }, session.email);

  return json({
    ok: true,
    review,
    illustrationSvg,
    draft,
    previewHtml: draft.previewHtml || renderPreview({
      ...preparedInput,
      illustrationSvg,
    }),
  });
}

async function handleApprove(request, env, draftId) {
  const session = requireSession(request);
  const payload = await readJson(request);
  if (!payload) {
    return error('Invalid JSON body', 400);
  }

  const draft = await approveDraft(env, { ...payload, id: draftId }, session.email);
  return json({ ok: true, draft });
}

async function handlePublish(request, env, draftId) {
  const session = requireSession(request);
  const payload = await readJson(request);
  const mode = payload?.mode === 'schedule' ? 'schedule' : 'now';
  const publishAt = mode === 'schedule'
    ? String(payload?.publishAt || '').trim()
    : new Date().toISOString();

  if (!publishAt) {
    return error('Missing publishAt for schedule mode', 400);
  }

  const job = await createPublishJob(env, {
    draftId,
    mode,
    publishAt,
    actorEmail: session.email,
  });

  const workflowInstanceId = `publish-${draftId}-${Date.now()}`;
  const instance = await env.PUBLISH_WORKFLOW.create({
    id: workflowInstanceId,
    params: {
      jobId: job.jobId,
      draftId,
      publishAt,
      actorEmail: session.email,
    },
  });

  await attachWorkflowInstance(env, job.jobId, instance.id || workflowInstanceId);

  return json({
    ok: true,
    message: mode === 'schedule'
      ? `Đã đặt lịch publish vào ${publishAt}.`
      : 'Publish job đã được tạo và Workflow đang chạy.',
    job: {
      id: job.jobId,
      workflowInstanceId: instance.id || workflowInstanceId,
      publishAt,
    },
  });
}

export { PublishWorkflow };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const isSignalsHost = url.hostname === getSignalsHost(env);

    try {
      if (pathname === '/api/track') {
        return await handleTrack(request, env);
      }

      if (isSignalsHost) {
        return error('Not found', 404);
      }

      if (pathname === '/' && request.method === 'GET') {
        requireSession(request);
        return html(renderStudioApp());
      }

      if (pathname === '/api/session') {
        return await handleSession(request);
      }

      if (pathname === '/api/dashboard') {
        return await handleDashboard(request, env);
      }

      if (pathname === '/api/drafts') {
        return await handleDrafts(request, env);
      }

      if (pathname === '/api/published') {
        return await handlePublishedPosts(request, env);
      }

      const publishedRoute = parsePublishedRoute(pathname);
      if (publishedRoute?.slug && publishedRoute.action === 'recall') {
        return await handleRecallPublishedPost(request, env, publishedRoute.slug);
      }

      const draftRoute = parseDraftRoute(pathname);
      if (draftRoute?.id && !draftRoute.action && request.method === 'GET') {
        return await handleDraftDetail(request, env, draftRoute.id);
      }

      if (draftRoute?.id && draftRoute.action === 'prepare' && request.method === 'POST') {
        return await handlePrepare(request, env, draftRoute.id);
      }

      if (draftRoute?.id && draftRoute.action === 'review' && request.method === 'POST') {
        return await handleReview(request, env, draftRoute.id);
      }

      if (draftRoute?.id && draftRoute.action === 'illustration' && request.method === 'POST') {
        return await handleIllustration(request, env);
      }

      if (draftRoute?.id && draftRoute.action === 'illustration-image' && request.method === 'POST') {
        return await handleUploadIllustrationImage(request, env, draftRoute.id);
      }

      if (draftRoute?.id && draftRoute.action === 'illustration-image' && request.method === 'GET') {
        return await handleDraftIllustrationImage(request, env, draftRoute.id);
      }

      if (draftRoute?.id && draftRoute.action === 'approve' && request.method === 'POST') {
        return await handleApprove(request, env, draftRoute.id);
      }

      if (draftRoute?.id && draftRoute.action === 'publish' && request.method === 'POST') {
        return await handlePublish(request, env, draftRoute.id);
      }

      return error('Not found', 404);
    } catch (thrown) {
      if (thrown instanceof Response) {
        return thrown;
      }

      return error(thrown instanceof Error ? thrown.message : 'Unexpected error', 500);
    }
  },
};
