CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tags_json TEXT NOT NULL DEFAULT '[]',
  read_time TEXT,
  date TEXT,
  series TEXT,
  series_order INTEGER,
  series_title TEXT,
  related_slugs_json TEXT NOT NULL DEFAULT '[]',
  call_to_action TEXT,
  illustration_prompt TEXT,
  illustration_svg TEXT,
  ai_review_json TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  source_key TEXT NOT NULL,
  artifact_key TEXT,
  scheduled_for TEXT,
  published_at TEXT,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_drafts_slug ON drafts(slug);
CREATE INDEX IF NOT EXISTS idx_drafts_status ON drafts(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_drafts_scheduled_for ON drafts(scheduled_for);

CREATE TABLE IF NOT EXISTS review_runs (
  id TEXT PRIMARY KEY,
  draft_id TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  review_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_runs_draft ON review_runs(draft_id, created_at DESC);

CREATE TABLE IF NOT EXISTS publish_jobs (
  id TEXT PRIMARY KEY,
  draft_id TEXT NOT NULL,
  workflow_instance_id TEXT,
  target_slug TEXT NOT NULL,
  target_path TEXT NOT NULL,
  mode TEXT NOT NULL,
  publish_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  commit_sha TEXT,
  error_message TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_publish_jobs_status ON publish_jobs(status, publish_at);
CREATE INDEX IF NOT EXISTS idx_publish_jobs_draft ON publish_jobs(draft_id, created_at DESC);

CREATE TABLE IF NOT EXISTS view_events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  path TEXT NOT NULL,
  post_title TEXT,
  visitor_hash TEXT NOT NULL,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_view_events_slug_created ON view_events(slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_view_events_created ON view_events(created_at DESC);
