export function renderStudioApp() {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cuong Ngo Studio</title>
  <style>
    :root {
      --bg: #f5f7f8;
      --panel: #ffffff;
      --panel-soft: #f9fbfb;
      --ink: #16181d;
      --muted: #66717d;
      --line: #dde3e8;
      --line-strong: #c9d2da;
      --accent: #0f766e;
      --accent-soft: #e8f3f1;
      --danger: #b42318;
      --warning: #a15c07;
      --shadow: 0 16px 38px rgba(29, 39, 52, 0.08);
      --radius: 8px;
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      background: var(--bg);
      color: var(--ink);
      font-family: Aptos, "SF Pro Text", "Segoe UI", sans-serif;
      font-size: 15px;
      line-height: 1.45;
    }

    button, input, textarea { font: inherit; }

    button {
      min-height: 38px;
      border: 1px solid transparent;
      border-radius: var(--radius);
      padding: 0.55rem 0.8rem;
      cursor: pointer;
      background: #eef2f5;
      color: var(--ink);
    }

    button:hover { border-color: var(--line-strong); }
    button.primary { background: var(--accent); color: #fff; }
    button.secondary { background: var(--accent-soft); color: #075f58; }
    button.ghost { background: #fff; border-color: var(--line); }
    button.warn { background: #fff7ed; color: var(--warning); border-color: #fed7aa; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }

    input, textarea {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: #fff;
      color: var(--ink);
      padding: 0.68rem 0.75rem;
    }

    input:focus, textarea:focus {
      outline: 3px solid rgba(15, 118, 110, 0.12);
      border-color: var(--accent);
    }

    textarea { resize: vertical; min-height: 7rem; }

    label {
      display: grid;
      gap: 0.35rem;
      color: var(--muted);
      font-size: 0.84rem;
    }

    .studio-shell {
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    .studio-header {
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 1px solid var(--line);
      background: rgba(245, 247, 248, 0.94);
      backdrop-filter: blur(14px);
    }

    .studio-header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1rem;
    }

    .studio-brand h1 {
      margin: 0;
      font-size: 1rem;
      font-weight: 650;
      letter-spacing: 0;
    }

    .status-line {
      margin: 0.15rem 0 0;
      color: var(--muted);
      font-size: 0.84rem;
    }

    .status-line[data-tone="error"] { color: var(--danger); }
    .status-line[data-tone="success"] { color: var(--accent); }

    .session-pill {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: #fff;
      color: var(--muted);
      padding: 0.5rem 0.65rem;
      white-space: nowrap;
      font-size: 0.84rem;
    }

    .workbench {
      display: grid;
      grid-template-columns: 292px minmax(520px, 1fr) 360px;
      gap: 1rem;
      padding: 1rem;
      align-items: start;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }

    .panel-inner { padding: 1rem; }
    .stack { display: grid; gap: 1rem; }
    .mini-stack { display: grid; gap: 0.65rem; }

    .panel h2, .panel h3 {
      margin: 0 0 0.75rem;
      font-size: 0.92rem;
      font-weight: 650;
      letter-spacing: 0;
    }

    .toolbar {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.55rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      border: 1px solid var(--line);
      border-radius: var(--radius);
      overflow: hidden;
      background: #fff;
    }

    .stat-card {
      padding: 0.7rem;
      border-right: 1px solid var(--line);
    }

    .stat-card:last-child { border-right: 0; }

    .stat-card strong {
      display: block;
      font-size: 1.15rem;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .stat-card span,
    .field-hint,
    .draft-item-meta,
    .top-posts small,
    .schedule-list small {
      color: var(--muted);
      font-size: 0.78rem;
      line-height: 1.4;
    }

    .draft-list, .top-posts, .schedule-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0.45rem;
    }

    .draft-list button {
      width: 100%;
      text-align: left;
      border: 1px solid transparent;
      background: var(--panel-soft);
      padding: 0.75rem;
    }

    .draft-list button[data-active="true"] {
      border-color: var(--accent);
      background: var(--accent-soft);
    }

    .draft-item-title, .top-posts strong, .schedule-list strong {
      display: block;
      color: var(--ink);
      font-size: 0.9rem;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    .top-posts li, .schedule-list li {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--panel-soft);
      padding: 0.7rem;
    }

    .editor-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.9rem;
    }

    .editor-head h2 {
      margin-bottom: 0.2rem;
      font-size: 1.08rem;
    }

    .stepper {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .step-tab {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.5rem;
      align-items: center;
      text-align: left;
      border: 1px solid var(--line);
      background: #fff;
      min-height: 52px;
      padding: 0.55rem;
    }

    .step-tab[aria-selected="true"] {
      border-color: var(--accent);
      background: var(--accent-soft);
    }

    .step-index {
      display: grid;
      place-items: center;
      width: 1.55rem;
      height: 1.55rem;
      border-radius: 999px;
      background: #e7edf1;
      font-size: 0.78rem;
      font-weight: 700;
    }

    .step-tab[aria-selected="true"] .step-index {
      background: var(--accent);
      color: #fff;
    }

    .step-label {
      min-width: 0;
      font-size: 0.82rem;
      font-weight: 650;
      line-height: 1.2;
    }

    .step-panel {
      display: grid;
      gap: 1rem;
      min-height: 520px;
      animation: panel-in 150ms ease-out;
    }

    .step-panel[hidden] { display: none; }

    @keyframes panel-in {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .field-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.8rem;
    }

    .full-span { grid-column: 1 / -1; }

    #body {
      min-height: 430px;
      font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace;
      font-size: 0.9rem;
      line-height: 1.58;
    }

    #illustration-svg {
      min-height: 260px;
      font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace;
      font-size: 0.84rem;
      line-height: 1.5;
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      border-top: 1px solid var(--line);
      padding-top: 0.9rem;
      align-self: end;
    }

    .step-actions .right {
      display: flex;
      justify-content: flex-end;
      gap: 0.55rem;
      flex-wrap: wrap;
    }

    .publish-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.8rem;
    }

    .publish-block {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--panel-soft);
      padding: 0.85rem;
      display: grid;
      gap: 0.65rem;
    }

    .publish-block h3 { margin: 0; }

    .review-box, .preview-shell {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: #fff;
    }

    .review-box {
      min-height: 180px;
      max-height: 320px;
      overflow: auto;
      padding: 0.8rem;
      white-space: pre-wrap;
      font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace;
      font-size: 0.78rem;
      line-height: 1.45;
    }

    .preview-panel {
      position: sticky;
      top: 86px;
    }

    .preview-shell {
      padding: 1rem;
      min-height: 420px;
      max-height: calc(100vh - 210px);
      overflow: auto;
    }

    .preview-shell .preview-header h1 {
      margin: 0 0 0.55rem;
      font-size: 1.45rem;
      line-height: 1.22;
      letter-spacing: 0;
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
      line-height: 1.68;
    }

    .preview-shell .preview-body h2 {
      margin: 1.6rem 0 0.55rem;
      font-size: 1.12rem;
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

    .empty-state { color: var(--muted); margin: 0; }

    .utility-row {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      align-items: center;
      flex-wrap: wrap;
    }

    .hidden { display: none; }

    @media (max-width: 1240px) {
      .workbench { grid-template-columns: 280px minmax(0, 1fr); }
      .preview-panel { position: static; grid-column: 1 / -1; }
      .preview-shell { max-height: none; }
    }

    @media (max-width: 860px) {
      .studio-header-inner, .workbench, .editor-head, .field-grid, .publish-grid {
        display: grid;
        grid-template-columns: 1fr;
      }

      .workbench { padding: 0.75rem; }
      .stepper { grid-template-columns: 1fr 1fr; }
      .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .stat-card:nth-child(2) { border-right: 0; }
    }

    @media (max-width: 560px) {
      .stepper, .toolbar, .step-actions, .step-actions .right, .utility-row {
        display: grid;
        grid-template-columns: 1fr;
      }

      .session-pill { white-space: normal; }
    }
  </style>
</head>
<body>
  <div class="studio-shell">
    <header class="studio-header">
      <div class="studio-header-inner">
        <div class="studio-brand">
          <h1>Cuong Ngo Studio</h1>
          <p class="status-line" id="status-line">Dang tai du lieu studio...</p>
        </div>
        <div class="session-pill">Access session: <strong id="session-email">...</strong></div>
      </div>
    </header>

    <div class="workbench">
      <aside class="stack">
        <section class="panel">
          <div class="panel-inner stack">
            <div>
              <h2>Tong quan</h2>
              <div class="stats-grid" id="summary-grid"></div>
            </div>
            <div class="toolbar">
              <button class="ghost" id="new-draft-btn" type="button">Draft moi</button>
              <button class="primary" id="save-btn" type="button">Luu</button>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-inner stack">
            <label for="draft-search">Draft
              <input id="draft-search" type="search" placeholder="Tim title hoac slug" />
            </label>
            <ul class="draft-list" id="draft-list"></ul>
          </div>
        </section>

        <section class="panel">
          <div class="panel-inner mini-stack">
            <h2>Top bai 30 ngay</h2>
            <ul class="top-posts" id="top-posts"></ul>
          </div>
        </section>

        <section class="panel">
          <div class="panel-inner mini-stack">
            <h2>Lich dang</h2>
            <ul class="schedule-list" id="scheduled-list"></ul>
          </div>
        </section>
      </aside>

      <main class="panel">
        <div class="panel-inner">
          <div class="editor-head">
            <div>
              <h2 id="step-title">Noi dung</h2>
              <p class="field-hint" id="step-subtitle">Dan bai vao day, sau do de AI chuan bi phan con lai.</p>
            </div>
            <div class="utility-row">
              <button class="primary" id="prepare-btn" type="button">AI chuan bi bai</button>
            </div>
          </div>

          <input id="draft-id" type="hidden" />

          <nav class="stepper" aria-label="Publish workflow">
            <button class="step-tab" type="button" data-step-target="write" aria-selected="true">
              <span class="step-index">1</span>
              <span class="step-label">Noi dung</span>
            </button>
            <button class="step-tab" type="button" data-step-target="meta" aria-selected="false">
              <span class="step-index">2</span>
              <span class="step-label">Bien tap</span>
            </button>
            <button class="step-tab" type="button" data-step-target="illustration" aria-selected="false">
              <span class="step-index">3</span>
              <span class="step-label">Minh hoa</span>
            </button>
            <button class="step-tab" type="button" data-step-target="publish" aria-selected="false">
              <span class="step-index">4</span>
              <span class="step-label">Duyet dang</span>
            </button>
          </nav>

          <section class="step-panel" data-step-panel="write">
            <div class="field-grid">
              <label class="full-span">Tieu de
                <input id="title" type="text" placeholder="Tieu de bai viet" />
              </label>
              <label class="full-span">Noi dung Markdown
                <textarea id="body" placeholder="Dan bai viet Markdown vao day"></textarea>
              </label>
            </div>
            <div class="step-actions">
              <span class="field-hint">Chi can dan noi dung. AI se chuan bi metadata, lien ket va minh hoa.</span>
              <div class="right">
                <button class="ghost" id="save-write-btn" type="button">Luu</button>
                <button class="primary" id="prepare-write-btn" type="button">AI chuan bi bai</button>
                <button class="ghost" data-next-step="meta" type="button">Chinh tay</button>
              </div>
            </div>
          </section>

          <section class="step-panel" data-step-panel="meta" hidden>
            <div class="field-grid">
              <label class="full-span">Mo ta ngan
                <textarea id="description" rows="3" placeholder="Standfirst / description"></textarea>
              </label>
              <label>Slug
                <input id="slug" type="text" placeholder="tu-dong-neu-bo-trong" />
              </label>
              <label>Ngay dang
                <input id="date" type="date" />
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
            </div>
            <div class="step-actions">
              <button class="ghost" data-prev-step="write" type="button">Quay lai</button>
              <div class="right">
                <button class="ghost" id="save-meta-btn" type="button">Luu</button>
                <button class="primary" data-next-step="illustration" type="button">Tiep: Minh hoa</button>
              </div>
            </div>
          </section>

          <section class="step-panel" data-step-panel="illustration" hidden>
            <div class="field-grid">
              <label class="full-span">Prompt minh hoa
                <textarea id="illustration-prompt" rows="4" placeholder="Mo ta y tuong hinh minh hoa de AI doi sang SVG"></textarea>
              </label>
              <label class="full-span">SVG minh hoa
                <textarea id="illustration-svg" placeholder="<svg ...>"></textarea>
              </label>
            </div>
            <div class="step-actions">
              <button class="ghost" data-prev-step="meta" type="button">Quay lai</button>
              <div class="right">
                <button class="secondary" id="illustration-inline-btn" type="button">Tao SVG</button>
                <button class="ghost" id="save-illustration-btn" type="button">Luu</button>
                <button class="primary" data-next-step="publish" type="button">Tiep: Duyet dang</button>
              </div>
            </div>
          </section>

          <section class="step-panel" data-step-panel="publish" hidden>
            <div class="publish-grid">
              <div class="publish-block">
                <h3>Duyet noi dung</h3>
                <p class="field-hint">Approve tao artifact markdown cuoi cung trong R2. Chi artifact da approve moi duoc publish.</p>
                <button class="secondary" id="review-inline-btn" type="button">Chay AI review</button>
                <button class="primary" id="approve-btn" type="button">Approve ready</button>
              </div>
              <div class="publish-block">
                <h3>Dang bai</h3>
                <p class="field-hint">Publish now tao workflow job va commit vao GitHub bang token cua Worker.</p>
                <button class="warn" id="publish-now-btn" type="button">Publish now</button>
                <label>Schedule publish
                  <input id="publish-at" type="datetime-local" />
                </label>
                <button class="ghost" id="schedule-btn" type="button">Dat lich dang</button>
              </div>
            </div>
            <div class="step-actions">
              <button class="ghost" data-prev-step="illustration" type="button">Quay lai</button>
              <span class="field-hint">Trang thai ready/scheduled/published se hien trong danh sach draft.</span>
            </div>
          </section>
        </div>
      </main>

      <aside class="panel preview-panel">
        <div class="panel-inner stack">
          <div>
            <h2>Preview</h2>
            <p class="field-hint">Preview cap nhat sau khi AI chuan bi, luu, tao SVG hoac approve.</p>
          </div>
          <div class="preview-shell" id="preview-shell">
            <p class="empty-state">Chon hoac tao draft de xem preview.</p>
          </div>
          <div class="mini-stack">
            <h2>AI notes</h2>
            <div class="review-box" id="review-output">Chua co review AI.</div>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <script>
    const stepMeta = {
      write: ['Noi dung', 'Viet title va markdown truoc, cac truong khac di sau.'],
      meta: ['Bien tap', 'Mo ta, slug, tag, tuyen bai va lien ket lien quan.'],
      illustration: ['Minh hoa', 'Tao hoac chinh SVG truoc khi dua vao artifact publish.'],
      publish: ['Duyet dang', 'Review, approve, publish ngay hoac dat lich.']
    };

    const state = {
      dashboard: null,
      drafts: [],
      currentId: '',
      currentDraft: null,
      activeStep: 'write'
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
      stepTitle: document.getElementById('step-title'),
      stepSubtitle: document.getElementById('step-subtitle'),
      stepButtons: Array.from(document.querySelectorAll('[data-step-target]')),
      stepPanels: Array.from(document.querySelectorAll('[data-step-panel]')),
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

    function setStep(step) {
      if (!stepMeta[step]) return;
      state.activeStep = step;
      els.stepTitle.textContent = stepMeta[step][0];
      els.stepSubtitle.textContent = stepMeta[step][1];
      for (const button of els.stepButtons) {
        button.setAttribute('aria-selected', button.dataset.stepTarget === step ? 'true' : 'false');
      }
      for (const panel of els.stepPanels) {
        panel.hidden = panel.dataset.stepPanel !== step;
      }
    }

    async function api(path, options) {
      const response = await fetch(path, {
        headers: { 'content-type': 'application/json' },
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

    function joinList(value) { return Array.isArray(value) ? value.join(', ') : ''; }

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
      setStep('write');
      renderDraftList();
      renderPreview('');
      renderReview(null);
      setStatus('Dang tao draft moi. Viet noi dung roi bam Tiep.', '');
    }

    function renderReview(review) {
      els.review.textContent = review ? JSON.stringify(review, null, 2) : 'Chua co review AI.';
    }

    function renderPreview(previewHtml) {
      els.preview.innerHTML = previewHtml || '<p class="empty-state">Chon hoac tao draft de xem preview.</p>';
    }

    function renderSummary() {
      const summary = state.dashboard && state.dashboard.summary ? state.dashboard.summary : {
        draft: 0, ready: 0, scheduled: 0, published: 0
      };
      els.summary.innerHTML = [
        ['Draft', summary.draft], ['Ready', summary.ready], ['Scheduled', summary.scheduled], ['Published', summary.published]
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
            return '<li><strong>' + escapeHtml(job.slug) + '</strong><small>' + escapeHtml(formatDateTime(job.publishAt)) + '</small></li>';
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
      if (!review) return;
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
      if (!value) return 'chua ro';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
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
      setStep('write');
      setStatus('Da mo draft "' + (payload.draft.title || payload.draft.slug) + '".', 'success');
      return payload.draft;
    }

    async function saveCurrent() {
      setStatus('Dang luu draft...', '');
      const payload = await api('/api/drafts', { method: 'POST', body: JSON.stringify(readForm()) });
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
      if (!els.form.body.value.trim()) throw new Error('Can co noi dung Markdown truoc.');
      return saveCurrent();
    }

    async function saveAndStep(step) {
      await ensureCurrentDraft();
      setStep(step);
    }

    async function handlePrepare() {
      const draft = await ensureCurrentDraft();
      setStatus('AI dang chuan bi metadata, lien ket va minh hoa...', '');
      const payload = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/prepare', {
        method: 'POST', body: JSON.stringify(readForm())
      });
      state.currentDraft = payload.draft;
      fillForm(payload.draft);
      renderReview(payload.review);
      renderPreview(payload.draft.previewHtml || payload.previewHtml);
      await loadDashboard();
      setStep('publish');
      setStatus('AI da chuan bi bai. Neu can sua, vao Bien tap hoac Minh hoa; neu on, approve ready.', 'success');
      return payload.draft;
    }

    async function handleReview() {
      const draft = await ensureCurrentDraft();
      setStatus('Dang chay AI review...', '');
      const payload = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/review', {
        method: 'POST', body: JSON.stringify(readForm())
      });
      renderReview(payload.review);
      applyReview(payload.review);
      setStep('meta');
      setStatus('AI da tra ve goi y. Ban xem lai metadata truoc khi approve.', 'success');
    }

    async function handleIllustration() {
      const draft = await ensureCurrentDraft();
      setStatus('Dang tao SVG minh hoa...', '');
      const payload = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/illustration', {
        method: 'POST', body: JSON.stringify(readForm())
      });
      els.form.illustrationSvg.value = payload.illustrationSvg || '';
      renderPreview(payload.previewHtml);
      setStep('illustration');
      setStatus('Da tao SVG minh hoa. Ban co the chinh tay neu can.', 'success');
    }

    async function handleApprove() {
      const draft = await ensureCurrentDraft();
      setStatus('Dang dong artifact publish-ready...', '');
      const payload = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/approve', {
        method: 'POST', body: JSON.stringify(readForm())
      });
      state.currentDraft = payload.draft;
      fillForm(payload.draft);
      renderPreview(payload.draft.previewHtml);
      renderReview(payload.draft.aiReview);
      await loadDashboard();
      setStep('publish');
      setStatus('Draft da o trang thai ready.', 'success');
    }

    async function handlePublish(mode) {
      const draftId = els.form.id.value.trim();
      if (!draftId) throw new Error('Can luu va approve draft truoc khi publish.');
      const body = { mode: mode };
      if (mode === 'schedule') {
        if (!els.publishAt.value) throw new Error('Chon thoi diem schedule.');
        body.publishAt = new Date(els.publishAt.value).toISOString();
      }
      setStatus(mode === 'now' ? 'Dang tao publish job...' : 'Dang dat lich publish...', '');
      const payload = await api('/api/drafts/' + encodeURIComponent(draftId) + '/publish', {
        method: 'POST', body: JSON.stringify(body)
      });
      await loadDashboard();
      await loadDraft(draftId);
      setStep('publish');
      setStatus(payload.message, 'success');
    }

    function wireClick(id, handler) {
      const node = document.getElementById(id);
      if (!node) return;
      node.addEventListener('click', function () {
        handler().catch(function (error) { setStatus(error.message, 'error'); });
      });
    }

    document.getElementById('new-draft-btn').addEventListener('click', function () { clearForm(); });
    wireClick('save-btn', saveCurrent);
    wireClick('save-write-btn', saveCurrent);
    wireClick('save-meta-btn', saveCurrent);
    wireClick('save-illustration-btn', saveCurrent);
    wireClick('prepare-btn', handlePrepare);
    wireClick('prepare-write-btn', handlePrepare);
    wireClick('review-inline-btn', handleReview);
    wireClick('illustration-inline-btn', handleIllustration);
    wireClick('approve-btn', handleApprove);
    wireClick('publish-now-btn', function () { return handlePublish('now'); });
    wireClick('schedule-btn', function () { return handlePublish('schedule'); });

    for (const button of els.stepButtons) {
      button.addEventListener('click', function () { setStep(button.dataset.stepTarget); });
    }

    for (const button of document.querySelectorAll('[data-next-step]')) {
      button.addEventListener('click', function () {
        saveAndStep(button.dataset.nextStep).catch(function (error) { setStatus(error.message, 'error'); });
      });
    }

    for (const button of document.querySelectorAll('[data-prev-step]')) {
      button.addEventListener('click', function () { setStep(button.dataset.prevStep); });
    }

    els.search.addEventListener('input', renderDraftList);
    els.draftList.addEventListener('click', function (event) {
      const button = event.target.closest('[data-draft-id]');
      if (!button) return;
      loadDraft(button.dataset.draftId).catch(function (error) { setStatus(error.message, 'error'); });
    });

    (async function init() {
      try {
        setStep('write');
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
