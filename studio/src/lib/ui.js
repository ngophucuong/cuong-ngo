export function renderStudioApp() {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cuong Ngo Studio</title>
  <style>
    :root {
      --bg: #f2ecdf;
      --panel: rgba(255, 252, 246, 0.84);
      --ink: #1d1a16;
      --muted: #685f55;
      --line: #d6ccbf;
      --accent: #9a3b1f;
      --accent-2: #3d5c4a;
      --shadow: 0 22px 50px rgba(48, 39, 30, 0.08);
      --radius: 22px;
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
      color: var(--ink);
      background:
        radial-gradient(circle at top left, rgba(154, 59, 31, 0.1), transparent 28%),
        radial-gradient(circle at top right, rgba(61, 92, 74, 0.08), transparent 26%),
        linear-gradient(180deg, #f7f2e8 0%, #efe7d9 100%);
      min-height: 100vh;
    }

    .studio-shell {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 100vh;
    }

    .studio-header {
      padding: 1.1rem 1.4rem;
      border-bottom: 1px solid rgba(214, 204, 191, 0.9);
      backdrop-filter: blur(18px);
      background: rgba(247, 242, 232, 0.88);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .studio-header-inner {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
    }

    .studio-brand h1 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 500;
    }

    .studio-brand p,
    .session-pill,
    .status-line {
      margin: 0.25rem 0 0;
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.45;
    }

    .session-pill {
      padding: 0.55rem 0.85rem;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.6);
      white-space: nowrap;
    }

    .status-line[data-tone="error"] { color: var(--accent); }
    .status-line[data-tone="success"] { color: var(--accent-2); }

    .studio-grid {
      display: grid;
      grid-template-columns: 300px minmax(0, 1.35fr) minmax(320px, 0.95fr);
      gap: 1rem;
      padding: 1rem;
      align-items: start;
    }

    .panel {
      background: var(--panel);
      border: 1px solid rgba(214, 204, 191, 0.88);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(14px);
    }

    .panel-inner {
      padding: 1rem 1rem 1.15rem;
    }

    .panel h2,
    .panel h3 {
      margin: 0 0 0.85rem;
      font-size: 1rem;
      font-weight: 500;
      letter-spacing: 0.01em;
    }

    .stack { display: grid; gap: 1rem; }
    .mini-stack { display: grid; gap: 0.6rem; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .stat-card {
      padding: 0.85rem;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.48);
    }

    .stat-card strong {
      display: block;
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 1;
      margin-bottom: 0.35rem;
    }

    .stat-card span {
      color: var(--muted);
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .search-row,
    .schedule-row,
    .toolbar {
      display: grid;
      gap: 0.65rem;
    }

    .toolbar {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    label {
      display: grid;
      gap: 0.38rem;
      font-size: 0.86rem;
      color: var(--muted);
    }

    input,
    textarea,
    button {
      font: inherit;
    }

    input,
    textarea {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 0.78rem 0.85rem;
      background: rgba(255, 255, 255, 0.82);
      color: var(--ink);
    }

    textarea { resize: vertical; min-height: 7rem; }
    #body { min-height: 26rem; }
    #illustration-svg { min-height: 14rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85rem; }

    input:focus,
    textarea:focus {
      outline: 2px solid rgba(154, 59, 31, 0.18);
      border-color: rgba(154, 59, 31, 0.6);
    }

    button {
      border: none;
      border-radius: 999px;
      padding: 0.78rem 1rem;
      cursor: pointer;
      background: #f0e5d3;
      color: var(--ink);
      transition: transform 120ms ease, opacity 120ms ease, background 120ms ease;
    }

    button:hover { transform: translateY(-1px); }
    button.primary { background: var(--accent); color: #fff6ef; }
    button.secondary { background: rgba(61, 92, 74, 0.12); color: var(--accent-2); }
    button.ghost { background: rgba(255, 255, 255, 0.6); border: 1px solid var(--line); }
    button.warn { background: rgba(154, 59, 31, 0.12); color: var(--accent); }

    .draft-list,
    .top-posts,
    .schedule-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0.6rem;
    }

    .draft-list button {
      width: 100%;
      text-align: left;
      border-radius: 16px;
      padding: 0.9rem;
      background: rgba(255, 255, 255, 0.68);
      border: 1px solid transparent;
    }

    .draft-list button[data-active="true"] {
      border-color: rgba(154, 59, 31, 0.4);
      background: rgba(255, 255, 255, 0.92);
    }

    .draft-item-title {
      display: block;
      font-size: 1rem;
      color: var(--ink);
      margin-bottom: 0.28rem;
    }

    .draft-item-meta,
    .top-posts small,
    .schedule-list small,
    .field-hint {
      color: var(--muted);
      font-size: 0.8rem;
      line-height: 1.4;
    }

    .top-posts li,
    .schedule-list li {
      padding: 0.75rem 0.8rem;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.45);
    }

    .top-posts strong,
    .schedule-list strong {
      display: block;
      margin-bottom: 0.18rem;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.8rem;
    }

    .full-span { grid-column: 1 / -1; }

    .section-divider {
      padding-top: 0.2rem;
      border-top: 1px solid rgba(214, 204, 191, 0.72);
    }

    .review-box {
      white-space: pre-wrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.82rem;
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 0.9rem;
      background: rgba(255, 255, 255, 0.62);
      min-height: 12rem;
      overflow: auto;
    }

    .preview-shell {
      border: 1px solid var(--line);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.78);
      padding: 1rem;
      min-height: 16rem;
      overflow: auto;
    }

    .preview-shell .preview-header h1 {
      margin: 0 0 0.6rem;
      font-size: 1.7rem;
      line-height: 1.18;
    }

    .preview-shell .preview-header p {
      margin: 0 0 1rem;
      color: var(--muted);
      font-style: italic;
    }

    .preview-shell .preview-body p,
    .preview-shell .preview-body ul,
    .preview-shell .preview-body blockquote {
      margin: 0 0 1rem;
      line-height: 1.7;
    }

    .preview-shell .preview-body h2 {
      margin: 2rem 0 0.6rem;
      font-size: 1.25rem;
    }

    .preview-shell .preview-body h3 {
      margin: 1.5rem 0 0.5rem;
      font-size: 1.08rem;
    }

    .preview-shell svg,
    .preview-shell img,
    .preview-shell figure {
      display: block;
      width: 100%;
      max-width: 100%;
      height: auto;
      margin: 0 0 1rem;
    }

    .empty-state {
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.5;
    }

    .hidden { display: none; }

    @media (max-width: 1160px) {
      .studio-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 720px) {
      .studio-header-inner,
      .toolbar,
      .form-grid {
        grid-template-columns: 1fr;
        display: grid;
      }

      .studio-header {
        padding: 1rem;
      }

      .studio-grid {
        padding: 0.8rem;
      }
    }
  </style>
</head>
<body>
  <div class="studio-shell">
    <header class="studio-header">
      <div class="studio-header-inner">
        <div class="studio-brand">
          <h1>Cuong Ngo Studio</h1>
          <p>Markdown editor, AI review, schedule publish va top bai duoc doc nhieu nhat.</p>
          <p class="status-line" id="status-line">Dang tai du lieu studio...</p>
        </div>
        <div class="session-pill">Access session: <strong id="session-email">...</strong></div>
      </div>
    </header>

    <div class="studio-grid">
      <aside class="stack">
        <section class="panel">
          <div class="panel-inner stack">
            <div>
              <h2>Tong quan</h2>
              <div class="stats-grid" id="summary-grid"></div>
            </div>
            <div>
              <h3>Top bai 30 ngay</h3>
              <ul class="top-posts" id="top-posts"></ul>
            </div>
            <div>
              <h3>Lich dang</h3>
              <ul class="schedule-list" id="scheduled-list"></ul>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-inner stack">
            <div class="search-row">
              <label for="draft-search">Loc draft</label>
              <input id="draft-search" type="search" placeholder="Tim theo tieu de, slug..." />
            </div>
            <div class="toolbar">
              <button class="ghost" id="new-draft-btn" type="button">Draft moi</button>
              <button class="primary" id="save-btn" type="button">Luu draft</button>
            </div>
            <div>
              <h3>Danh sach draft</h3>
              <ul class="draft-list" id="draft-list"></ul>
            </div>
          </div>
        </section>
      </aside>

      <main class="stack">
        <section class="panel">
          <div class="panel-inner stack">
            <div>
              <h2>Editor</h2>
              <p class="field-hint">V1 luu draft vao R2, metadata vao D1. Mọi thay doi sau publish van se quay lai luong approve.</p>
            </div>

            <input id="draft-id" type="hidden" />

            <div class="form-grid">
              <label class="full-span">Tieu de
                <input id="title" type="text" placeholder="Tieu de bai viet" />
              </label>

              <label>Slug
                <input id="slug" type="text" placeholder="slug-tu-dong-neu-bo-trong" />
              </label>

              <label>Ngay dang
                <input id="date" type="date" />
              </label>

              <label class="full-span">Mo ta ngan
                <textarea id="description" rows="3" placeholder="Standfirst / description"></textarea>
              </label>

              <label>The
                <input id="tags" type="text" placeholder="AI, Van hanh, Nghe" />
              </label>

              <label>Read time
                <input id="read-time" type="text" placeholder="~7 phut doc" />
              </label>

              <label>Series key
                <input id="series" type="text" placeholder="phan-mem-thich-ung" />
              </label>

              <label>Series order
                <input id="series-order" type="number" min="1" step="1" placeholder="1" />
              </label>

              <label class="full-span">Series title
                <input id="series-title" type="text" placeholder="Tieu de tuyen bai" />
              </label>

              <label class="full-span">Related slugs
                <input id="related-slugs" type="text" placeholder="slug-1, slug-2" />
              </label>

              <label class="full-span">Call to action
                <textarea id="call-to-action" rows="3" placeholder="Canh huong ket noi cuoi bai"></textarea>
              </label>

              <label class="full-span">Prompt minh hoa
                <textarea id="illustration-prompt" rows="3" placeholder="Mo ta y tuong hinh minh hoa de AI doi sang SVG"></textarea>
              </label>

              <label class="full-span">SVG minh hoa
                <textarea id="illustration-svg" placeholder="<svg ...>"></textarea>
              </label>

              <label class="full-span">Noi dung Markdown
                <textarea id="body" placeholder="Dan bai viet Markdown vao day"></textarea>
              </label>
            </div>
          </div>
        </section>
      </main>

      <aside class="stack">
        <section class="panel">
          <div class="panel-inner stack">
            <div>
              <h2>Review va publish</h2>
              <p class="field-hint">AI chi goi y. Publish can qua buoc phe duyet.</p>
            </div>

            <div class="toolbar">
              <button class="secondary" id="review-btn" type="button">AI review</button>
              <button class="ghost" id="illustration-btn" type="button">AI -> SVG</button>
              <button class="primary" id="approve-btn" type="button">Approve ready</button>
              <button class="warn" id="publish-now-btn" type="button">Publish now</button>
            </div>

            <div class="schedule-row section-divider">
              <label for="publish-at">Schedule publish</label>
              <input id="publish-at" type="datetime-local" />
              <button class="ghost" id="schedule-btn" type="button">Dat lich dang</button>
            </div>

            <div class="mini-stack">
              <h3>AI notes</h3>
              <div class="review-box" id="review-output">Chua co review AI.</div>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-inner stack">
            <div>
              <h2>Preview</h2>
              <p class="field-hint">Preview v1 du dung de canh bo cuc, title, standfirst va SVG minh hoa.</p>
            </div>
            <div class="preview-shell" id="preview-shell">
              <p class="empty-state">Chon hoac tao draft de xem preview.</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>

  <script>
    const state = {
      dashboard: null,
      drafts: [],
      currentId: '',
      currentDraft: null
    };

    const els = {
      status: document.getElementById('status-line'),
      sessionEmail: document.getElementById('session-email'),
      summary: document.getElementById('summary-grid'),
      topPosts: document.getElementById('top-posts'),
      scheduled: document.getElementById('scheduled-list'),
      draftList: document.getElementById('draft-list'),
      search: document.getElementById('draft-search'),
      preview: document.getElementById('preview-shell'),
      review: document.getElementById('review-output'),
      publishAt: document.getElementById('publish-at'),
      form: {
        id: document.getElementById('draft-id'),
        title: document.getElementById('title'),
        slug: document.getElementById('slug'),
        date: document.getElementById('date'),
        description: document.getElementById('description'),
        tags: document.getElementById('tags'),
        readTime: document.getElementById('read-time'),
        series: document.getElementById('series'),
        seriesOrder: document.getElementById('series-order'),
        seriesTitle: document.getElementById('series-title'),
        relatedSlugs: document.getElementById('related-slugs'),
        callToAction: document.getElementById('call-to-action'),
        illustrationPrompt: document.getElementById('illustration-prompt'),
        illustrationSvg: document.getElementById('illustration-svg'),
        body: document.getElementById('body')
      }
    };

    function escapeHtml(value) {
      return String(value || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
    }

    function setStatus(message, tone) {
      els.status.textContent = message;
      els.status.dataset.tone = tone || '';
    }

    async function api(path, options) {
      const response = await fetch(path, {
        headers: {
          'content-type': 'application/json'
        },
        ...options
      });

      const payload = await response.json().catch(function () { return null; });
      if (!response.ok) {
        throw new Error(payload && payload.error ? payload.error : 'Request failed');
      }

      return payload;
    }

    function readForm() {
      return {
        id: els.form.id.value.trim(),
        title: els.form.title.value,
        slug: els.form.slug.value,
        date: els.form.date.value,
        description: els.form.description.value,
        tags: els.form.tags.value,
        readTime: els.form.readTime.value,
        series: els.form.series.value,
        seriesOrder: els.form.seriesOrder.value,
        seriesTitle: els.form.seriesTitle.value,
        relatedSlugs: els.form.relatedSlugs.value,
        callToAction: els.form.callToAction.value,
        illustrationPrompt: els.form.illustrationPrompt.value,
        illustrationSvg: els.form.illustrationSvg.value,
        body: els.form.body.value
      };
    }

    function joinList(value) {
      return Array.isArray(value) ? value.join(', ') : '';
    }

    function fillForm(draft) {
      const data = draft || {};
      els.form.id.value = data.id || '';
      els.form.title.value = data.title || '';
      els.form.slug.value = data.slug || '';
      els.form.date.value = data.date || '';
      els.form.description.value = data.description || '';
      els.form.tags.value = joinList(data.tags);
      els.form.readTime.value = data.readTime || '';
      els.form.series.value = data.series || '';
      els.form.seriesOrder.value = data.seriesOrder || '';
      els.form.seriesTitle.value = data.seriesTitle || '';
      els.form.relatedSlugs.value = joinList(data.relatedSlugs);
      els.form.callToAction.value = data.callToAction || '';
      els.form.illustrationPrompt.value = data.illustrationPrompt || '';
      els.form.illustrationSvg.value = data.illustrationSvg || '';
      els.form.body.value = data.body || '';
      els.publishAt.value = '';
    }

    function clearForm() {
      fillForm({});
      state.currentId = '';
      state.currentDraft = null;
      renderDraftList();
      renderPreview('');
      renderReview(null);
      setStatus('Dang tao mot draft moi. Bam "Luu draft" de khoi tao ID.', '');
    }

    function renderReview(review) {
      if (!review) {
        els.review.textContent = 'Chua co review AI.';
        return;
      }

      els.review.textContent = JSON.stringify(review, null, 2);
    }

    function renderPreview(previewHtml) {
      if (!previewHtml) {
        els.preview.innerHTML = '<p class="empty-state">Chon hoac tao draft de xem preview.</p>';
        return;
      }

      els.preview.innerHTML = previewHtml;
    }

    function renderSummary() {
      const summary = state.dashboard && state.dashboard.summary ? state.dashboard.summary : {
        draft: 0,
        ready: 0,
        scheduled: 0,
        published: 0
      };

      els.summary.innerHTML = [
        ['Draft', summary.draft],
        ['Ready', summary.ready],
        ['Scheduled', summary.scheduled],
        ['Published', summary.published]
      ].map(function (item) {
        return '<div class="stat-card"><strong>' + item[1] + '</strong><span>' + item[0] + '</span></div>';
      }).join('');

      const topPosts = state.dashboard && state.dashboard.topPosts ? state.dashboard.topPosts : [];
      els.topPosts.innerHTML = topPosts.length
        ? topPosts.map(function (post) {
            return '<li><strong>' + escapeHtml(post.title || post.slug) + '</strong><small>' +
              escapeHtml(post.slug) + ' · ' + post.views + ' views · ' + post.readers + ' readers</small></li>';
          }).join('')
        : '<li><small>Chua co du lieu doc bai. Beacon se do tu blog public.</small></li>';

      const scheduled = state.dashboard && state.dashboard.scheduled ? state.dashboard.scheduled : [];
      els.scheduled.innerHTML = scheduled.length
        ? scheduled.map(function (job) {
            return '<li><strong>' + escapeHtml(job.slug) + '</strong><small>' +
              escapeHtml(formatDateTime(job.publishAt)) + '</small></li>';
          }).join('')
        : '<li><small>Chua co bai nao dang xep lich.</small></li>';
    }

    function renderDraftList() {
      const query = els.search.value.trim().toLowerCase();
      const drafts = state.drafts.filter(function (draft) {
        if (!query) return true;
        return String(draft.title || '').toLowerCase().includes(query) ||
          String(draft.slug || '').toLowerCase().includes(query);
      });

      els.draftList.innerHTML = drafts.length
        ? drafts.map(function (draft) {
            const active = draft.id === state.currentId ? 'true' : 'false';
            const title = escapeHtml(draft.title || draft.slug || 'Ban nhap chua dat ten');
            const meta = escapeHtml((draft.status || 'draft') + ' · ' + formatDateTime(draft.updatedAt));
            return '<li><button type="button" data-draft-id="' + escapeHtml(draft.id) + '" data-active="' + active + '">' +
              '<span class="draft-item-title">' + title + '</span>' +
              '<span class="draft-item-meta">' + meta + '</span></button></li>';
          }).join('')
        : '<li><small>Chua co draft nao.</small></li>';
    }

    function applyReview(review) {
      if (!review) {
        return;
      }

      if (!els.form.title.value.trim() && review.title) els.form.title.value = review.title;
      if (!els.form.description.value.trim() && review.description) els.form.description.value = review.description;
      if (!els.form.tags.value.trim() && Array.isArray(review.tags)) els.form.tags.value = review.tags.join(', ');
      if (!els.form.readTime.value.trim() && review.readTime) els.form.readTime.value = review.readTime;
      if (!els.form.series.value.trim() && review.series) els.form.series.value = review.series;
      if (!els.form.seriesOrder.value.trim() && review.seriesOrder) els.form.seriesOrder.value = String(review.seriesOrder);
      if (!els.form.seriesTitle.value.trim() && review.seriesTitle) els.form.seriesTitle.value = review.seriesTitle;
      if (!els.form.relatedSlugs.value.trim() && Array.isArray(review.relatedSlugs)) els.form.relatedSlugs.value = review.relatedSlugs.join(', ');
      if (!els.form.callToAction.value.trim() && review.callToAction) els.form.callToAction.value = review.callToAction;
      if (!els.form.illustrationPrompt.value.trim() && review.visualPrompt) els.form.illustrationPrompt.value = review.visualPrompt;
    }

    function formatDateTime(value) {
      if (!value) {
        return 'chua ro';
      }

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return String(value);
      }

      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    async function loadSession() {
      const payload = await api('/api/session');
      els.sessionEmail.textContent = payload.session.email;
    }

    async function loadDashboard() {
      const payload = await api('/api/dashboard');
      state.dashboard = payload.dashboard;
      state.drafts = payload.dashboard.drafts || [];
      renderSummary();
      renderDraftList();
    }

    async function loadDraft(id) {
      const payload = await api('/api/drafts/' + encodeURIComponent(id));
      state.currentId = payload.draft.id;
      state.currentDraft = payload.draft;
      fillForm(payload.draft);
      renderReview(payload.draft.aiReview);
      renderPreview(payload.draft.previewHtml);
      renderDraftList();
      setStatus('Da mo draft "' + (payload.draft.title || payload.draft.slug) + '".', 'success');
      return payload.draft;
    }

    async function saveCurrent() {
      setStatus('Dang luu draft...', '');
      const payload = await api('/api/drafts', {
        method: 'POST',
        body: JSON.stringify(readForm())
      });
      state.currentId = payload.draft.id;
      state.currentDraft = payload.draft;
      fillForm(payload.draft);
      renderPreview(payload.draft.previewHtml);
      renderReview(payload.draft.aiReview);
      await loadDashboard();
      setStatus('Da luu draft.', 'success');
      return payload.draft;
    }

    async function ensureCurrentDraft() {
      if (!els.form.body.value.trim()) {
        throw new Error('Can co noi dung Markdown truoc.');
      }
      return saveCurrent();
    }

    async function handleReview() {
      const draft = await ensureCurrentDraft();
      setStatus('Dang chay AI review...', '');
      const payload = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/review', {
        method: 'POST',
        body: JSON.stringify(readForm())
      });
      renderReview(payload.review);
      applyReview(payload.review);
      setStatus('AI da tra ve goi y. Ban xem lai truoc khi approve.', 'success');
    }

    async function handleIllustration() {
      const draft = await ensureCurrentDraft();
      setStatus('Dang tao SVG minh hoa...', '');
      const payload = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/illustration', {
        method: 'POST',
        body: JSON.stringify(readForm())
      });
      els.form.illustrationSvg.value = payload.illustrationSvg || '';
      renderPreview(payload.previewHtml);
      setStatus('Da tao SVG minh hoa. Ban co the chinh tay neu can.', 'success');
    }

    async function handleApprove() {
      const draft = await ensureCurrentDraft();
      setStatus('Dang dong artifact publish-ready...', '');
      const payload = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/approve', {
        method: 'POST',
        body: JSON.stringify(readForm())
      });
      state.currentDraft = payload.draft;
      fillForm(payload.draft);
      renderPreview(payload.draft.previewHtml);
      renderReview(payload.draft.aiReview);
      await loadDashboard();
      setStatus('Draft da o trang thai ready.', 'success');
    }

    async function handlePublish(mode) {
      const draftId = els.form.id.value.trim();
      if (!draftId) {
        throw new Error('Can luu va approve draft truoc khi publish.');
      }

      const body = { mode: mode };
      if (mode === 'schedule') {
        if (!els.publishAt.value) {
          throw new Error('Chon thoi diem schedule.');
        }
        body.publishAt = new Date(els.publishAt.value).toISOString();
      }

      setStatus(mode === 'now' ? 'Dang tao publish job...' : 'Dang dat lich publish...', '');
      const payload = await api('/api/drafts/' + encodeURIComponent(draftId) + '/publish', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      await loadDashboard();
      await loadDraft(draftId);
      setStatus(payload.message, 'success');
    }

    document.getElementById('new-draft-btn').addEventListener('click', function () {
      clearForm();
    });

    document.getElementById('save-btn').addEventListener('click', function () {
      saveCurrent().catch(function (error) {
        setStatus(error.message, 'error');
      });
    });

    document.getElementById('review-btn').addEventListener('click', function () {
      handleReview().catch(function (error) {
        setStatus(error.message, 'error');
      });
    });

    document.getElementById('illustration-btn').addEventListener('click', function () {
      handleIllustration().catch(function (error) {
        setStatus(error.message, 'error');
      });
    });

    document.getElementById('approve-btn').addEventListener('click', function () {
      handleApprove().catch(function (error) {
        setStatus(error.message, 'error');
      });
    });

    document.getElementById('publish-now-btn').addEventListener('click', function () {
      handlePublish('now').catch(function (error) {
        setStatus(error.message, 'error');
      });
    });

    document.getElementById('schedule-btn').addEventListener('click', function () {
      handlePublish('schedule').catch(function (error) {
        setStatus(error.message, 'error');
      });
    });

    els.search.addEventListener('input', renderDraftList);
    els.draftList.addEventListener('click', function (event) {
      const button = event.target.closest('[data-draft-id]');
      if (!button) {
        return;
      }

      loadDraft(button.dataset.draftId).catch(function (error) {
        setStatus(error.message, 'error');
      });
    });

    (async function init() {
      try {
        await loadSession();
        await loadDashboard();
        if (state.drafts.length) {
          await loadDraft(state.drafts[0].id);
        } else {
          clearForm();
          renderSummary();
        }
      } catch (error) {
        setStatus(error.message || 'Khong tai duoc studio.', 'error');
      }
    }());
  </script>
</body>
</html>`;
}
