const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

  :root {
    --bg: #f4f6f8;
    --panel: #ffffff;
    --panel-soft: #f8fafb;
    --ink: #14181f;
    --muted: #69747f;
    --line: #e2e8ee;
    --line-strong: #cdd6df;
    --accent: #0f766e;
    --accent-ink: #0b5a53;
    --accent-soft: #e7f3f1;
    --amber: #9a6209;
    --amber-soft: #fdf3e3;
    --green: #15803d;
    --green-soft: #e9f6ee;
    --danger: #b42318;
    --shadow-sm: 0 1px 2px rgba(20, 32, 45, 0.05);
    --shadow: 0 12px 30px rgba(22, 33, 48, 0.07);
    --radius: 10px;
    --radius-sm: 7px;
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }

  body {
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
    font-family: "Be Vietnam Pro", Aptos, "SF Pro Text", "Segoe UI", sans-serif;
    font-size: 15px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  button, input, textarea, select { font: inherit; }

  button {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-sm);
    padding: 0.5rem 0.85rem;
    cursor: pointer;
    background: #fff;
    color: var(--ink);
    font-weight: 550;
    transition: background 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
  }

  button:hover { border-color: var(--accent); }
  button:active { transform: translateY(0.5px); }
  button.primary { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: var(--shadow-sm); }
  button.primary:hover { background: var(--accent-ink); border-color: var(--accent-ink); }
  button.secondary { background: var(--accent-soft); border-color: transparent; color: var(--accent-ink); }
  button.secondary:hover { border-color: var(--accent); }
  button.ghost { background: var(--panel-soft); }
  button.danger { background: #fff; border-color: #f1c4bd; color: var(--danger); }
  button.danger:hover { border-color: var(--danger); }
  button:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  input, textarea, select {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    background: #fff;
    color: var(--ink);
    padding: 0.6rem 0.7rem;
  }

  input:focus, textarea:focus, select:focus {
    outline: 3px solid rgba(15, 118, 110, 0.13);
    border-color: var(--accent);
  }

  textarea { resize: vertical; min-height: 6.5rem; }

  label {
    display: grid;
    gap: 0.32rem;
    color: var(--muted);
    font-size: 0.82rem;
    font-weight: 500;
  }

  .hint { color: var(--muted); font-size: 0.8rem; line-height: 1.45; margin: 0; }
  .hidden { display: none !important; }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    border-radius: 999px;
    padding: 0.12rem 0.55rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }
  .status-draft { background: #eef1f4; color: #586774; }
  .status-ready { background: var(--accent-soft); color: var(--accent-ink); }
  .status-scheduled { background: var(--amber-soft); color: var(--amber); }
  .status-published { background: var(--green-soft); color: var(--green); }
  .badge-warn { background: var(--amber-soft); color: var(--amber); }

  .chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .chip {
    border: 1px solid var(--line);
    background: var(--panel-soft);
    border-radius: 999px;
    padding: 0.15rem 0.6rem;
    font-size: 0.74rem;
    color: var(--muted);
  }

  .studio-shell { min-height: 100vh; display: grid; grid-template-rows: auto 1fr; }

  .studio-header {
    position: sticky; top: 0; z-index: 20;
    border-bottom: 1px solid var(--line);
    background: rgba(244, 246, 248, 0.92);
    backdrop-filter: blur(14px);
  }
  .studio-header-inner {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; padding: 0.7rem 1.1rem;
  }
  .studio-brand { display: flex; align-items: center; gap: 0.7rem; }
  .brand-mark {
    width: 30px; height: 30px; border-radius: 8px;
    display: grid; place-items: center;
    background: var(--accent); color: #fff; font-weight: 700; font-size: 0.95rem;
  }
  .studio-brand h1 { margin: 0; font-size: 0.98rem; font-weight: 650; }
  .studio-brand .status-line { margin: 0.05rem 0 0; color: var(--muted); font-size: 0.8rem; }
  .status-line[data-tone="error"] { color: var(--danger); }
  .status-line[data-tone="success"] { color: var(--accent); }
  .session-pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    border: 1px solid var(--line); border-radius: 999px; background: #fff;
    color: var(--muted); padding: 0.35rem 0.7rem; font-size: 0.8rem; white-space: nowrap;
  }
  .session-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); }

  .workbench {
    display: grid;
    grid-template-columns: 290px minmax(480px, 1fr) 340px;
    gap: 1rem; padding: 1rem; align-items: start;
  }

  .panel {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  .panel-inner { padding: 0.95rem; }
  .stack { display: grid; gap: 0.95rem; }
  .mini-stack { display: grid; gap: 0.6rem; }
  .section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; }
  .panel h2 { margin: 0; font-size: 0.82rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
  .panel h3 { margin: 0 0 0.2rem; font-size: 0.95rem; font-weight: 650; }

  .toolbar { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem; }
  .stat-card {
    border: 1px solid var(--line); border-radius: var(--radius-sm);
    background: var(--panel-soft); padding: 0.55rem 0.5rem; text-align: center;
  }
  .stat-card strong { display: block; font-size: 1.25rem; line-height: 1.1; }
  .stat-card span { color: var(--muted); font-size: 0.68rem; }

  .list-reset { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4rem; }

  .draft-list button {
    width: 100%; text-align: left; display: grid; gap: 0.3rem;
    border: 1px solid var(--line); background: var(--panel-soft); padding: 0.6rem 0.65rem;
  }
  .draft-list button[data-active="true"] { border-color: var(--accent); background: var(--accent-soft); }
  .draft-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .draft-title { font-size: 0.88rem; font-weight: 600; color: var(--ink); overflow-wrap: anywhere; }
  .draft-meta { color: var(--muted); font-size: 0.72rem; }
  .empty-row { color: var(--muted); font-size: 0.78rem; padding: 0.3rem 0.1rem; }

  .published-card {
    border: 1px solid var(--line); border-radius: var(--radius-sm);
    background: var(--panel-soft); padding: 0.65rem; display: grid; gap: 0.55rem;
  }
  .published-card .draft-title { margin-bottom: 0.1rem; }
  .published-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.3rem; }
  .published-stat { border: 1px solid var(--line); border-radius: 6px; background: #fff; padding: 0.35rem 0.45rem; }
  .published-stat strong { display: block; font-size: 0.85rem; }
  .published-stat span { color: var(--muted); font-size: 0.64rem; }
  .published-actions { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
  .published-actions a, .published-actions button { min-height: 30px; font-size: 0.74rem; padding: 0.3rem 0.55rem; }
  .published-actions a { text-decoration: none; border: 1px solid var(--line); border-radius: var(--radius-sm); background: #fff; color: var(--accent-ink); }

  .top-list li, .schedule-list li {
    display: grid; gap: 0.15rem;
    border: 1px solid var(--line); border-radius: var(--radius-sm);
    background: var(--panel-soft); padding: 0.5rem 0.6rem;
  }
  .top-list strong, .schedule-list strong { font-size: 0.84rem; overflow-wrap: anywhere; }
  .top-list small, .schedule-list small { color: var(--muted); font-size: 0.72rem; }
  .schedule-list li.job-failed { background: var(--amber-soft); border-color: var(--amber); }
  .schedule-list li.job-failed strong { color: var(--amber); }
  .schedule-list .job-error { color: var(--amber); font-size: 0.7rem; overflow-wrap: anywhere; }

  .editor-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.9rem; }
  .editor-head h2 { text-transform: none; letter-spacing: 0; color: var(--ink); font-size: 1.1rem; font-weight: 650; margin-bottom: 0.15rem; }

  .stepper { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1.1rem; }
  .step-tab {
    display: grid; grid-template-columns: auto 1fr; gap: 0.5rem; align-items: center;
    text-align: left; border: 1px solid var(--line); background: #fff; min-height: 50px; padding: 0.5rem 0.6rem;
  }
  .step-tab[aria-selected="true"] { border-color: var(--accent); background: var(--accent-soft); }
  .step-index {
    display: grid; place-items: center; width: 1.5rem; height: 1.5rem; border-radius: 999px;
    background: #e6ecf0; font-size: 0.76rem; font-weight: 700; color: var(--muted);
  }
  .step-tab[aria-selected="true"] .step-index { background: var(--accent); color: #fff; }
  .step-tab[data-done="true"] .step-index { background: var(--green); color: #fff; }
  .step-label { font-size: 0.82rem; font-weight: 600; line-height: 1.2; }
  .step-sub { display: block; color: var(--muted); font-size: 0.7rem; font-weight: 400; }

  .step-panel { display: grid; gap: 1rem; animation: panel-in 140ms ease-out; }
  .step-panel[hidden] { display: none; }
  @keyframes panel-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  fieldset.group {
    border: 1px solid var(--line); border-radius: var(--radius-sm);
    margin: 0; padding: 0.9rem; display: grid; gap: 0.75rem;
  }
  fieldset.group > legend { padding: 0 0.4rem; font-size: 0.78rem; font-weight: 650; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }

  .field-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  .full-span { grid-column: 1 / -1; }

  #body { min-height: 420px; font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace; font-size: 0.9rem; line-height: 1.6; }
  #illustration-svg { min-height: 200px; font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace; font-size: 0.82rem; }

  .image-card { display: grid; gap: 0.65rem; }
  .image-card input[type="file"] { border-style: dashed; background: var(--panel-soft); cursor: pointer; }
  .image-preview { display: grid; gap: 0.4rem; }
  .image-preview img { display: block; width: 100%; max-height: 200px; object-fit: contain; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--panel-soft); }
  .image-preview small { color: var(--muted); font-size: 0.74rem; }

  .step-actions {
    display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
    border-top: 1px solid var(--line); padding-top: 0.9rem; flex-wrap: wrap;
  }
  .step-actions .right { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end; }

  .publish-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.8rem; }
  .publish-block { border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--panel-soft); padding: 0.85rem; display: grid; gap: 0.65rem; align-content: start; }
  .publish-status { display: flex; align-items: center; gap: 0.5rem; padding: 0.55rem 0.7rem; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--panel-soft); }

  .preview-panel { position: sticky; top: 78px; }
  .preview-shell { border: 1px solid var(--line); border-radius: var(--radius-sm); background: #fff; padding: 1rem; min-height: 360px; max-height: calc(100vh - 230px); overflow: auto; }
  .preview-shell .preview-header h1 { margin: 0 0 0.5rem; font-size: 1.4rem; line-height: 1.25; }
  .preview-shell .preview-header p { margin: 0 0 1rem; color: var(--muted); font-style: italic; }
  .preview-shell .preview-body p, .preview-shell .preview-body ul, .preview-shell .preview-body blockquote { margin: 0 0 1rem; line-height: 1.7; }
  .preview-shell .preview-body h2 { margin: 1.5rem 0 0.5rem; font-size: 1.12rem; }
  .preview-shell svg, .preview-shell img, .preview-shell figure { display: block; width: 100%; max-width: 100%; height: auto; margin: 0 0 1rem; }
  .empty-state { color: var(--muted); margin: 0; }

  .ai-box { display: grid; gap: 0.7rem; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--panel-soft); padding: 0.75rem; max-height: 320px; overflow: auto; }
  .ai-flags { display: grid; gap: 0.3rem; }
  .ai-notes { margin: 0; padding-left: 1.05rem; display: grid; gap: 0.3rem; font-size: 0.82rem; line-height: 1.45; }
  .ai-section { display: grid; gap: 0.3rem; }
  .ai-label { font-size: 0.72rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }

  @media (max-width: 1240px) {
    .workbench { grid-template-columns: 280px minmax(0, 1fr); }
    .preview-panel { position: static; grid-column: 1 / -1; }
    .preview-shell { max-height: none; }
  }
  @media (max-width: 860px) {
    .workbench { grid-template-columns: 1fr; padding: 0.75rem; }
    .field-grid, .publish-grid, .stepper { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

const BODY = `
  <div class="studio-shell">
    <header class="studio-header">
      <div class="studio-header-inner">
        <div class="studio-brand">
          <div class="brand-mark">CN</div>
          <div>
            <h1>Cường Ngô Studio</h1>
            <p class="status-line" id="status-line">Đang tải studio…</p>
          </div>
        </div>
        <div class="session-pill"><span class="session-dot"></span><span id="session-email">…</span></div>
      </div>
    </header>

    <div class="workbench">
      <aside class="stack">
        <section class="panel">
          <div class="panel-inner stack">
            <div class="stats-grid" id="summary-grid"></div>
            <div class="toolbar">
              <button class="ghost" data-action="new" type="button">+ Bài mới</button>
              <button class="secondary" data-action="save" type="button">Lưu nháp</button>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-inner stack">
            <label for="draft-search">Thư viện nháp
              <input id="draft-search" type="search" placeholder="Tìm tiêu đề hoặc slug" />
            </label>
            <ul class="list-reset draft-list" id="draft-list"></ul>
          </div>
        </section>

        <section class="panel">
          <div class="panel-inner stack">
            <div class="section-head"><h2>Bài đã đăng</h2></div>
            <ul class="list-reset" id="published-list"></ul>
          </div>
        </section>

        <section class="panel">
          <div class="panel-inner mini-stack">
            <div class="section-head"><h2>Top 30 ngày</h2></div>
            <ul class="list-reset top-list" id="top-posts"></ul>
          </div>
        </section>

        <section class="panel">
          <div class="panel-inner mini-stack">
            <div class="section-head"><h2>Lịch đăng</h2></div>
            <ul class="list-reset schedule-list" id="scheduled-list"></ul>
          </div>
        </section>
      </aside>

      <main class="panel">
        <div class="panel-inner">
          <div class="editor-head">
            <div>
              <h2 id="step-title">Soạn thảo</h2>
              <p class="hint" id="step-subtitle">Dán tiêu đề và nội dung, rồi để AI lo phần còn lại.</p>
            </div>
          </div>

          <input id="draft-id" type="hidden" />

          <nav class="stepper" aria-label="Quy trình đăng bài">
            <button class="step-tab" type="button" data-step="write" aria-selected="true">
              <span class="step-index">1</span>
              <span class="step-label">Soạn thảo<span class="step-sub">Tiêu đề & nội dung</span></span>
            </button>
            <button class="step-tab" type="button" data-step="edit" aria-selected="false">
              <span class="step-index">2</span>
              <span class="step-label">Biên tập<span class="step-sub">Metadata & minh hoạ</span></span>
            </button>
            <button class="step-tab" type="button" data-step="publish" aria-selected="false">
              <span class="step-index">3</span>
              <span class="step-label">Duyệt & đăng<span class="step-sub">Approve rồi publish</span></span>
            </button>
          </nav>

          <section class="step-panel" data-step-panel="write">
            <div class="field-grid">
              <label class="full-span">Tiêu đề
                <input id="title" type="text" placeholder="Tiêu đề bài viết" />
              </label>
              <label class="full-span">Nội dung Markdown
                <textarea id="body" placeholder="Dán bài viết Markdown vào đây…"></textarea>
              </label>
            </div>
            <div class="step-actions">
              <button class="ghost" data-action="save" data-step="edit" type="button">Tự biên tập →</button>
              <div class="right">
                <button class="ghost" data-action="save" type="button">Lưu nháp</button>
                <button class="primary" data-action="prepare" data-step="edit" type="button">✨ AI chuẩn bị bài</button>
              </div>
            </div>
          </section>

          <section class="step-panel" data-step-panel="edit" hidden>
            <fieldset class="group">
              <legend>Thông tin bài</legend>
              <div class="field-grid">
                <label class="full-span">Mô tả ngắn (standfirst)
                  <textarea id="description" rows="3" placeholder="Câu dẫn gợi tò mò dưới tiêu đề"></textarea>
                </label>
                <label>Slug
                  <input id="slug" type="text" placeholder="tự sinh nếu để trống" />
                </label>
                <label>Ngày đăng
                  <input id="date" type="date" />
                </label>
                <label>Thẻ
                  <input id="tags" type="text" placeholder="AI, Vận hành, Nghề" />
                </label>
                <label>Read time
                  <input id="read-time" type="text" placeholder="~7 phút đọc" />
                </label>
                <label>Series key
                  <input id="series" type="text" placeholder="phan-mem-thich-ung" />
                </label>
                <label>Series order
                  <input id="series-order" type="number" min="1" step="1" placeholder="1" />
                </label>
                <label class="full-span">Series title
                  <input id="series-title" type="text" placeholder="Tiêu đề tuyến bài" />
                </label>
                <label class="full-span">Related slugs
                  <input id="related-slugs" type="text" placeholder="slug-1, slug-2" />
                </label>
                <label class="full-span">Call to action
                  <textarea id="call-to-action" rows="2" placeholder="Lời kết nối cuối bài"></textarea>
                </label>
              </div>
            </fieldset>

            <fieldset class="group">
              <legend>Minh hoạ</legend>
              <p class="hint">Có ảnh upload thì bài sẽ ưu tiên ảnh; nếu không, dùng SVG do AI tạo.</p>
              <div class="image-card">
                <label>Ảnh PNG/JPG/WebP
                  <input id="illustration-image-file" type="file" accept="image/png,image/jpeg,image/webp" />
                </label>
                <label>Alt ảnh
                  <input id="illustration-image-alt" type="text" placeholder="Mô tả ngắn cho người đọc và SEO" />
                </label>
                <div class="image-preview" id="illustration-image-preview"><small>Chưa có ảnh upload.</small></div>
                <div class="right" style="justify-content:flex-start">
                  <button class="secondary" data-action="upload-image" type="button">Tải ảnh lên</button>
                </div>
              </div>
              <label class="full-span">Prompt minh hoạ
                <textarea id="illustration-prompt" rows="2" placeholder="Mô tả ý tưởng để AI dựng SVG"></textarea>
              </label>
              <label class="full-span">SVG minh hoạ
                <textarea id="illustration-svg" placeholder="<svg …>"></textarea>
              </label>
              <div class="right" style="justify-content:flex-start">
                <button class="secondary" data-action="gen-svg" type="button">Tạo SVG bằng AI</button>
              </div>
            </fieldset>

            <div class="step-actions">
              <button class="ghost" data-step="write" type="button">← Soạn thảo</button>
              <div class="right">
                <button class="ghost" data-action="review" type="button">Chạy AI review</button>
                <button class="ghost" data-action="save" type="button">Lưu nháp</button>
                <button class="primary" data-action="approve" data-step="publish" type="button">Duyệt & sang đăng →</button>
              </div>
            </div>
          </section>

          <section class="step-panel" data-step-panel="publish" hidden>
            <div class="publish-status">
              <span id="publish-status-badge" class="badge status-draft">Nháp</span>
              <span class="hint" id="publish-status-text">Cần duyệt (approve) trước khi đăng.</span>
            </div>
            <div class="publish-grid">
              <div class="publish-block">
                <h3>Đăng ngay</h3>
                <p class="hint">Tạo workflow job và commit thẳng vào GitHub bằng token của Worker.</p>
                <button class="primary" data-action="publish-now" type="button">Đăng ngay</button>
              </div>
              <div class="publish-block">
                <h3>Đặt lịch</h3>
                <p class="hint">Workflow sẽ chờ tới thời điểm rồi tự đăng.</p>
                <label>Thời điểm đăng
                  <input id="publish-at" type="datetime-local" />
                </label>
                <button class="ghost" data-action="schedule" type="button">Đặt lịch đăng</button>
              </div>
            </div>
            <div class="step-actions">
              <button class="ghost" data-step="edit" type="button">← Biên tập</button>
              <span class="hint">Chưa approve thì nút đăng sẽ báo lỗi.</span>
            </div>
          </section>
        </div>
      </main>

      <aside class="panel preview-panel">
        <div class="panel-inner stack">
          <div class="section-head"><h2>Xem trước</h2></div>
          <div class="preview-shell" id="preview-shell">
            <p class="empty-state">Chọn hoặc tạo bài để xem trước.</p>
          </div>
          <div class="mini-stack">
            <div class="section-head"><h2>Ghi chú AI</h2></div>
            <div class="ai-box" id="review-output"><p class="hint">Chưa có ghi chú AI.</p></div>
          </div>
        </div>
      </aside>
    </div>
  </div>
`;

const SCRIPT = `
  const STEP_META = {
    write: ['Soạn thảo', 'Dán tiêu đề và nội dung, rồi để AI lo phần còn lại.'],
    edit: ['Biên tập & minh hoạ', 'Xem lại metadata AI gợi ý và chọn ảnh/SVG minh hoạ.'],
    publish: ['Duyệt & đăng', 'Đóng artifact rồi đăng ngay hoặc đặt lịch.']
  };
  const STEP_ORDER = ['write', 'edit', 'publish'];
  const STATUS_LABEL = { draft: 'Nháp', ready: 'Sẵn sàng', scheduled: 'Đã lên lịch', published: 'Đã đăng' };

  const state = { dashboard: null, drafts: [], publishedPosts: [], currentId: '', currentDraft: null, activeStep: 'write' };

  const els = {
    status: document.getElementById('status-line'),
    sessionEmail: document.getElementById('session-email'),
    summary: document.getElementById('summary-grid'),
    topPosts: document.getElementById('top-posts'),
    scheduled: document.getElementById('scheduled-list'),
    draftList: document.getElementById('draft-list'),
    publishedList: document.getElementById('published-list'),
    search: document.getElementById('draft-search'),
    preview: document.getElementById('preview-shell'),
    review: document.getElementById('review-output'),
    publishAt: document.getElementById('publish-at'),
    imagePreview: document.getElementById('illustration-image-preview'),
    stepTitle: document.getElementById('step-title'),
    stepSubtitle: document.getElementById('step-subtitle'),
    stepTabs: Array.from(document.querySelectorAll('.step-tab')),
    stepPanels: Array.from(document.querySelectorAll('[data-step-panel]')),
    publishBadge: document.getElementById('publish-status-badge'),
    publishText: document.getElementById('publish-status-text'),
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
      illustrationImageFile: document.getElementById('illustration-image-file'),
      illustrationImageAlt: document.getElementById('illustration-image-alt'),
      illustrationSvg: document.getElementById('illustration-svg'),
      body: document.getElementById('body')
    }
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  }
  function setStatus(message, tone) { els.status.textContent = message; els.status.dataset.tone = tone || ''; }
  function joinList(value) { return Array.isArray(value) ? value.join(', ') : ''; }
  function statusBadge(status) {
    const s = status || 'draft';
    return '<span class="badge status-' + s + '">' + escapeHtml(STATUS_LABEL[s] || s) + '</span>';
  }
  function formatBytes(value) {
    const size = Number(value || 0);
    if (!size) return 'không rõ dung lượng';
    if (size < 1024 * 1024) return Math.round(size / 1024) + 'KB';
    return (size / (1024 * 1024)).toFixed(1) + 'MB';
  }
  function formatDateTime(value) {
    if (!value) return 'chưa rõ';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  function setStep(step) {
    if (!STEP_META[step]) return;
    state.activeStep = step;
    els.stepTitle.textContent = STEP_META[step][0];
    els.stepSubtitle.textContent = STEP_META[step][1];
    const activeIndex = STEP_ORDER.indexOf(step);
    els.stepTabs.forEach(function (tab) {
      const tabStep = tab.dataset.step;
      const tabIndex = STEP_ORDER.indexOf(tabStep);
      tab.setAttribute('aria-selected', tabStep === step ? 'true' : 'false');
      tab.dataset.done = tabIndex < activeIndex ? 'true' : 'false';
    });
    els.stepPanels.forEach(function (panel) { panel.hidden = panel.dataset.stepPanel !== step; });
  }

  async function api(path, options) {
    const response = await fetch(path, { headers: { 'content-type': 'application/json' }, ...options });
    const payload = await response.json().catch(function () { return null; });
    if (!response.ok) throw new Error(payload && payload.error ? payload.error : 'Request thất bại');
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
      illustrationImageAlt: els.form.illustrationImageAlt.value,
      illustrationImageUrl: state.currentDraft && state.currentDraft.illustrationImage ? state.currentDraft.illustrationImage.draftUrl : '',
      illustrationSvg: els.form.illustrationSvg.value,
      body: els.form.body.value
    };
  }

  function renderImageCard(image) {
    if (!image || !image.draftUrl) { els.imagePreview.innerHTML = '<small>Chưa có ảnh upload.</small>'; return; }
    const alt = image.alt || els.form.title.value || 'Ảnh minh hoạ';
    const meta = [image.fileName || 'cover', image.contentType || '', formatBytes(image.size)].filter(Boolean).join(' · ');
    els.imagePreview.innerHTML = '<img src="' + escapeHtml(image.draftUrl) + '" alt="' + escapeHtml(alt) + '" /><small>' + escapeHtml(meta) + '</small>';
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
    els.form.illustrationImageAlt.value = data.illustrationImageAlt || (data.illustrationImage && data.illustrationImage.alt) || '';
    els.form.illustrationSvg.value = data.illustrationSvg || '';
    els.form.body.value = data.body || '';
    els.publishAt.value = '';
    renderImageCard(data.illustrationImage);
    renderPublishStatus(data.status);
  }

  function renderPublishStatus(status) {
    const s = status || 'draft';
    els.publishBadge.className = 'badge status-' + s;
    els.publishBadge.textContent = STATUS_LABEL[s] || s;
    const texts = {
      draft: 'Cần duyệt (approve) trước khi đăng.',
      ready: 'Đã approve. Có thể đăng ngay hoặc đặt lịch.',
      scheduled: 'Đang xếp lịch đăng tự động.',
      published: 'Bài đã đăng. Đăng lại sẽ cập nhật file trên GitHub.'
    };
    els.publishText.textContent = texts[s] || '';
  }

  function clearForm() {
    fillForm({});
    state.currentId = '';
    state.currentDraft = null;
    setStep('write');
    renderDraftList();
    renderPreview('');
    renderReview(null);
    setStatus('Đang tạo bài mới. Viết nội dung rồi bấm AI chuẩn bị.', '');
  }

  function renderReview(review) {
    if (!review) { els.review.innerHTML = '<p class="hint">Chưa có ghi chú AI. Chạy "AI chuẩn bị" hoặc "AI review".</p>'; return; }
    const parts = [];
    const flags = Array.isArray(review.safetyFlags) ? review.safetyFlags : [];
    if (flags.length) parts.push('<div class="ai-flags">' + flags.map(function (f) { return '<span class="badge badge-warn">⚠ ' + escapeHtml(f) + '</span>'; }).join('') + '</div>');
    if (review.description) parts.push('<div class="ai-section"><span class="ai-label">Mô tả gợi ý</span><p class="hint" style="color:var(--ink)">' + escapeHtml(review.description) + '</p></div>');
    const notes = Array.isArray(review.editorialNotes) ? review.editorialNotes : [];
    if (notes.length) parts.push('<ul class="ai-notes">' + notes.map(function (n) { return '<li>' + escapeHtml(n) + '</li>'; }).join('') + '</ul>');
    const tags = Array.isArray(review.tags) ? review.tags : [];
    if (tags.length) parts.push('<div class="ai-section"><span class="ai-label">Thẻ gợi ý</span><div class="chips">' + tags.map(function (t) { return '<span class="chip">' + escapeHtml(t) + '</span>'; }).join('') + '</div></div>');
    const rel = Array.isArray(review.relatedSlugs) ? review.relatedSlugs : [];
    if (rel.length) parts.push('<div class="ai-section"><span class="ai-label">Bài liên quan</span><div class="chips">' + rel.map(function (t) { return '<span class="chip">' + escapeHtml(t) + '</span>'; }).join('') + '</div></div>');
    if (!parts.length) parts.push('<p class="hint">AI không có ghi chú thêm.</p>');
    els.review.innerHTML = parts.join('');
  }

  function renderPreview(previewHtml) {
    els.preview.innerHTML = previewHtml || '<p class="empty-state">Chọn hoặc tạo bài để xem trước.</p>';
  }

  function renderSummary() {
    const summary = (state.dashboard && state.dashboard.summary) || { draft: 0, ready: 0, scheduled: 0, published: 0 };
    els.summary.innerHTML = [['Nháp', summary.draft], ['Sẵn sàng', summary.ready], ['Lên lịch', summary.scheduled], ['Đã đăng', summary.published]]
      .map(function (item) { return '<div class="stat-card"><strong>' + (item[1] || 0) + '</strong><span>' + item[0] + '</span></div>'; }).join('');

    const topPosts = (state.dashboard && state.dashboard.topPosts) || [];
    els.topPosts.innerHTML = topPosts.length
      ? topPosts.map(function (post) {
          return '<li><strong>' + escapeHtml(post.title || post.slug) + '</strong><small>' + post.views + ' views · ' + post.readers + ' readers</small></li>';
        }).join('')
      : '<li class="empty-row">Chưa có dữ liệu đọc bài.</li>';

    const scheduled = (state.dashboard && state.dashboard.scheduled) || [];
    els.scheduled.innerHTML = scheduled.length
      ? scheduled.map(function (job) {
          var failed = job.status === 'failed';
          var icon = failed ? '⚠ ' : '';
          var errorHtml = (failed && job.errorReason) ? '<span class="job-error">' + escapeHtml(job.errorReason.slice(0, 80)) + '</span>' : '';
          return '<li class="' + (failed ? 'job-failed' : '') + '"><strong>' + icon + escapeHtml(job.slug) + '</strong><small>' + escapeHtml(formatDateTime(job.publishAt)) + '</small>' + errorHtml + '</li>';
        }).join('')
      : '<li class="empty-row">Chưa có bài xếp lịch.</li>';
  }

  function renderDraftList() {
    const query = els.search.value.trim().toLowerCase();
    const drafts = state.drafts.filter(function (draft) {
      if (!query) return true;
      return String(draft.title || '').toLowerCase().includes(query) || String(draft.slug || '').toLowerCase().includes(query);
    });
    els.draftList.innerHTML = drafts.length
      ? drafts.map(function (draft) {
          const active = draft.id === state.currentId ? 'true' : 'false';
          const title = escapeHtml(draft.title || draft.slug || 'Bản nháp chưa đặt tên');
          return '<li><button type="button" data-draft-id="' + escapeHtml(draft.id) + '" data-active="' + active + '">' +
            '<span class="draft-row"><span class="draft-title">' + title + '</span>' + statusBadge(draft.status) + '</span>' +
            '<span class="draft-meta">' + escapeHtml(formatDateTime(draft.updatedAt)) + '</span></button></li>';
        }).join('')
      : '<li class="empty-row">Chưa có bài nháp nào.</li>';
  }

  function renderPublishedList() {
    els.publishedList.innerHTML = state.publishedPosts.length
      ? state.publishedPosts.map(function (post) {
          const stats = post.stats || {};
          const title = escapeHtml(post.title || post.slug);
          const slug = escapeHtml(post.slug);
          const meta = escapeHtml((post.date || 'chưa rõ ngày') + ' · ' + post.slug);
          const url = post.publicUrl || ('/bai/' + encodeURIComponent(post.slug) + '/');
          return '<li class="published-card"><div><span class="draft-title">' + title + '</span><div class="draft-meta">' + meta + '</div></div>' +
            '<div class="published-stats">' +
              '<div class="published-stat"><strong>' + Number(stats.views30d || 0) + '</strong><span>lượt 30 ngày</span></div>' +
              '<div class="published-stat"><strong>' + Number(stats.totalViews || 0) + '</strong><span>lượt tổng</span></div>' +
              '<div class="published-stat"><strong>' + Number(stats.readers30d || 0) + '</strong><span>độc giả 30 ngày</span></div>' +
              '<div class="published-stat"><strong>' + Number(stats.totalReaders || 0) + '</strong><span>độc giả tổng</span></div>' +
            '</div>' +
            '<div class="published-actions"><a href="' + escapeHtml(url) + '" target="_blank" rel="noreferrer">Xem bài</a>' +
            '<button class="danger" type="button" data-recall-slug="' + slug + '">Thu hồi</button></div></li>';
        }).join('')
      : '<li class="empty-row">Chưa có bài đã đăng.</li>';
  }

  async function loadSession() { const p = await api('/api/session'); els.sessionEmail.textContent = p.session.email; }

  async function loadDashboard() {
    const p = await api('/api/dashboard');
    state.dashboard = p.dashboard;
    state.drafts = p.dashboard.drafts || [];
    renderSummary();
    renderDraftList();
  }

  async function loadPublishedPosts() {
    els.publishedList.innerHTML = '<li class="empty-row">Đang tải…</li>';
    try {
      const p = await api('/api/published');
      state.publishedPosts = p.posts || [];
      renderPublishedList();
    } catch (error) {
      state.publishedPosts = [];
      els.publishedList.innerHTML = '<li class="empty-row">Không tải được: ' + escapeHtml(error.message || 'lỗi') + '</li>';
    }
  }

  async function loadDraft(id) {
    const p = await api('/api/drafts/' + encodeURIComponent(id));
    state.currentId = p.draft.id;
    state.currentDraft = p.draft;
    fillForm(p.draft);
    renderReview(p.draft.aiReview);
    renderPreview(p.draft.previewHtml);
    renderDraftList();
    setStep('write');
    setStatus('Đã mở "' + (p.draft.title || p.draft.slug) + '".', 'success');
    return p.draft;
  }

  async function saveCurrent() {
    setStatus('Đang lưu nháp…', '');
    const p = await api('/api/drafts', { method: 'POST', body: JSON.stringify(readForm()) });
    state.currentId = p.draft.id;
    state.currentDraft = p.draft;
    fillForm(p.draft);
    renderPreview(p.draft.previewHtml);
    renderReview(p.draft.aiReview);
    await loadDashboard();
    setStatus('Đã lưu nháp.', 'success');
    return p.draft;
  }

  async function ensureCurrentDraft() {
    if (!els.form.body.value.trim()) throw new Error('Cần có nội dung Markdown trước.');
    return saveCurrent();
  }

  async function handlePrepare() {
    const draft = await ensureCurrentDraft();
    setStatus('AI đang chuẩn bị metadata, liên kết và minh hoạ…', '');
    const p = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/prepare', { method: 'POST', body: JSON.stringify(readForm()) });
    state.currentDraft = p.draft;
    fillForm(p.draft);
    renderReview(p.review);
    renderPreview((p.draft && p.draft.previewHtml) || p.previewHtml);
    await loadDashboard();
    setStatus('AI đã chuẩn bị xong. Xem lại rồi duyệt.', 'success');
  }

  async function handleReview() {
    const draft = await ensureCurrentDraft();
    setStatus('Đang chạy AI review…', '');
    const p = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/review', { method: 'POST', body: JSON.stringify(readForm()) });
    renderReview(p.review);
    setStatus('AI đã trả về gợi ý ở khung Ghi chú AI.', 'success');
  }

  async function handleUploadImage() {
    const file = els.form.illustrationImageFile.files && els.form.illustrationImageFile.files[0];
    if (!file) throw new Error('Chọn ảnh PNG, JPG hoặc WebP trước.');
    if (!els.form.illustrationImageAlt.value.trim()) els.form.illustrationImageAlt.value = els.form.title.value.trim() || file.name;
    const draft = await ensureCurrentDraft();
    const form = new FormData();
    form.append('image', file);
    form.append('alt', els.form.illustrationImageAlt.value.trim());
    setStatus('Đang tải ảnh minh hoạ…', '');
    const response = await fetch('/api/drafts/' + encodeURIComponent(draft.id) + '/illustration-image', { method: 'POST', body: form });
    const p = await response.json().catch(function () { return null; });
    if (!response.ok) throw new Error(p && p.error ? p.error : 'Không upload được ảnh.');
    state.currentDraft = p.draft;
    fillForm(p.draft);
    els.form.illustrationImageFile.value = '';
    renderPreview(p.draft.previewHtml);
    await loadDashboard();
    setStatus(p.message || 'Đã tải ảnh minh hoạ.', 'success');
  }

  async function handleGenerateSvg() {
    const draft = await ensureCurrentDraft();
    setStatus('Đang tạo SVG minh hoạ…', '');
    const p = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/illustration', { method: 'POST', body: JSON.stringify(readForm()) });
    els.form.illustrationSvg.value = p.illustrationSvg || '';
    if (p.draft) state.currentDraft = p.draft;
    renderPreview(p.previewHtml || (p.draft && p.draft.previewHtml));
    setStatus('Đã tạo SVG minh hoạ. Chỉnh tay nếu cần.', 'success');
  }

  async function handleApprove() {
    const draft = await ensureCurrentDraft();
    setStatus('Đang đóng artifact publish-ready…', '');
    const p = await api('/api/drafts/' + encodeURIComponent(draft.id) + '/approve', { method: 'POST', body: JSON.stringify(readForm()) });
    state.currentDraft = p.draft;
    fillForm(p.draft);
    renderPreview(p.draft.previewHtml);
    renderReview(p.draft.aiReview);
    await loadDashboard();
    setStatus('Bài đã sẵn sàng (ready). Có thể đăng.', 'success');
  }

  async function handlePublish(mode) {
    const draftId = els.form.id.value.trim();
    if (!draftId) throw new Error('Cần lưu và duyệt bài trước khi đăng.');
    const body = { mode: mode };
    if (mode === 'schedule') {
      if (!els.publishAt.value) throw new Error('Chọn thời điểm đặt lịch.');
      body.publishAt = new Date(els.publishAt.value).toISOString();
    }
    setStatus(mode === 'now' ? 'Đang tạo publish job…' : 'Đang đặt lịch…', '');
    const p = await api('/api/drafts/' + encodeURIComponent(draftId) + '/publish', { method: 'POST', body: JSON.stringify(body) });
    await loadDashboard();
    await loadDraft(draftId);
    setStep('publish');
    setStatus(p.message, 'success');
  }

  async function handleRecallPublished(slug) {
    if (!slug) return;
    if (!window.confirm('Thu hồi bài "' + slug + '"? Việc này commit xoá file markdown trên GitHub.')) return;
    setStatus('Đang thu hồi bài ' + slug + '…', '');
    const p = await api('/api/published/' + encodeURIComponent(slug) + '/recall', { method: 'POST' });
    await loadPublishedPosts();
    await loadDashboard();
    setStatus(p.message || 'Đã thu hồi bài.', 'success');
  }

  const ACTIONS = {
    'new': function () { clearForm(); return Promise.resolve(); },
    'save': saveCurrent,
    'prepare': handlePrepare,
    'review': handleReview,
    'upload-image': handleUploadImage,
    'gen-svg': handleGenerateSvg,
    'approve': handleApprove,
    'publish-now': function () { return handlePublish('now'); },
    'schedule': function () { return handlePublish('schedule'); }
  };

  document.addEventListener('click', function (event) {
    const actionBtn = event.target.closest('[data-action]');
    if (actionBtn) {
      const action = ACTIONS[actionBtn.dataset.action];
      if (!action) return;
      const nextStep = actionBtn.dataset.step;
      Promise.resolve(action(actionBtn))
        .then(function () { if (nextStep) setStep(nextStep); })
        .catch(function (error) { setStatus(error.message, 'error'); });
      return;
    }
    const stepBtn = event.target.closest('[data-step]');
    if (stepBtn) { setStep(stepBtn.dataset.step); return; }
    const draftBtn = event.target.closest('[data-draft-id]');
    if (draftBtn) { loadDraft(draftBtn.dataset.draftId).catch(function (error) { setStatus(error.message, 'error'); }); return; }
    const recallBtn = event.target.closest('[data-recall-slug]');
    if (recallBtn) { handleRecallPublished(recallBtn.dataset.recallSlug).catch(function (error) { setStatus(error.message, 'error'); }); return; }
  });

  els.form.illustrationImageFile.addEventListener('change', function () {
    const file = els.form.illustrationImageFile.files && els.form.illustrationImageFile.files[0];
    if (file && !els.form.illustrationImageAlt.value.trim()) els.form.illustrationImageAlt.value = els.form.title.value.trim() || file.name;
  });
  els.search.addEventListener('input', renderDraftList);

  (async function init() {
    try {
      setStep('write');
      await loadSession();
      await loadDashboard();
      await loadPublishedPosts();
      if (state.drafts.length) { await loadDraft(state.drafts[0].id); }
      else { clearForm(); renderSummary(); }
    } catch (error) { setStatus(error.message || 'Không tải được studio.', 'error'); }
  }());
`;

export function renderStudioApp() {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cường Ngô Studio</title>
  <style>${STYLES}</style>
</head>
<body>${BODY}
  <script>${SCRIPT}</script>
</body>
</html>`;
}
