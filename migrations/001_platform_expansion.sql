ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret_cipher TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_recovery_codes JSONB NOT NULL DEFAULT '[]'::jsonb;
UPDATE users SET email_verified_at=COALESCE(email_verified_at,created_at,NOW());

CREATE TABLE IF NOT EXISTS auth_sessions(
  id UUID PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_agent TEXT DEFAULT '',ip VARCHAR(80) DEFAULT '',device_name VARCHAR(160) DEFAULT '',
  mfa_verified BOOLEAN NOT NULL DEFAULT FALSE,last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,revoked_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id,created_at DESC);

CREATE TABLE IF NOT EXISTS email_verification_tokens(
  id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) UNIQUE NOT NULL,expires_at TIMESTAMPTZ NOT NULL,used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_verification_token ON email_verification_tokens(token_hash,expires_at);

CREATE TABLE IF NOT EXISTS company_invitations(
  id BIGSERIAL PRIMARY KEY,company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(200) NOT NULL,role VARCHAR(30) NOT NULL DEFAULT 'viewer',token_hash VARCHAR(64) UNIQUE NOT NULL,
  invited_by BIGINT REFERENCES users(id) ON DELETE SET NULL,status VARCHAR(30) NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,accepted_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,cancelled_at TIMESTAMPTZ,last_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_company_invite_pending ON company_invitations(company_id,email) WHERE status='pending';

ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS recurrence_type VARCHAR(30) NOT NULL DEFAULT 'none';
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS interval_months INTEGER;
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS interval_hours NUMERIC(12,1);
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS next_due_hours NUMERIC(12,1);
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS recurrence_source_id BIGINT REFERENCES maintenance(id) ON DELETE SET NULL;
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS maintenance_templates(
  id BIGSERIAL PRIMARY KEY,company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  machine_id BIGINT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,title VARCHAR(220) NOT NULL,
  maintenance_type VARCHAR(50) NOT NULL DEFAULT 'Periyodik',recurrence_type VARCHAR(30) NOT NULL,
  interval_months INTEGER,interval_hours NUMERIC(12,1),next_due_date DATE,next_due_hours NUMERIC(12,1),
  priority VARCHAR(30) DEFAULT 'Normal',assigned_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_maintenance_templates_due ON maintenance_templates(company_id,is_active,next_due_date,next_due_hours);

CREATE TABLE IF NOT EXISTS checklist_items(
  id BIGSERIAL PRIMARY KEY,company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  parent_type VARCHAR(30) NOT NULL,parent_id BIGINT NOT NULL,label VARCHAR(240) NOT NULL,position INTEGER NOT NULL DEFAULT 0,
  result_status VARCHAR(30) NOT NULL DEFAULT 'pending',measurement_value VARCHAR(120) DEFAULT '',measurement_unit VARCHAR(40) DEFAULT '',
  note TEXT DEFAULT '',photo_attachment_id BIGINT,completed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_checklist_parent ON checklist_items(company_id,parent_type,parent_id,position);

CREATE TABLE IF NOT EXISTS part_usages(
  id BIGSERIAL PRIMARY KEY,company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  part_id BIGINT NOT NULL REFERENCES parts(id) ON DELETE RESTRICT,machine_id BIGINT REFERENCES machines(id) ON DELETE SET NULL,
  maintenance_id BIGINT REFERENCES maintenance(id) ON DELETE SET NULL,work_order_id BIGINT REFERENCES work_orders(id) ON DELETE SET NULL,
  movement_id BIGINT REFERENCES part_movements(id) ON DELETE SET NULL,quantity NUMERIC(12,2) NOT NULL CHECK(quantity>0),
  note VARCHAR(240) DEFAULT '',used_by BIGINT REFERENCES users(id) ON DELETE SET NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_part_usages_context ON part_usages(company_id,machine_id,maintenance_id,work_order_id,created_at DESC);

ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS approved_by BIGINT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS actual_duration_min INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS work_order_events(
  id BIGSERIAL PRIMARY KEY,company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  work_order_id BIGINT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,from_status VARCHAR(30),to_status VARCHAR(30),body TEXT DEFAULT '',details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_work_events_order ON work_order_events(company_id,work_order_id,created_at);

CREATE TABLE IF NOT EXISTS work_time_entries(
  id BIGSERIAL PRIMARY KEY,company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  work_order_id BIGINT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),stopped_at TIMESTAMPTZ,duration_min INTEGER,note VARCHAR(240) DEFAULT ''
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_work_timer_open ON work_time_entries(work_order_id,user_id) WHERE stopped_at IS NULL;

ALTER TABLE attachments ALTER COLUMN machine_id DROP NOT NULL;
ALTER TABLE attachments ALTER COLUMN file_data DROP NOT NULL;
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS maintenance_id BIGINT REFERENCES maintenance(id) ON DELETE CASCADE;
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS work_order_id BIGINT REFERENCES work_orders(id) ON DELETE CASCADE;
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS storage_key TEXT;
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS storage_bucket VARCHAR(200);
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS storage_etag VARCHAR(200);
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS checksum_sha256 VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_attachments_work ON attachments(company_id,work_order_id,created_at DESC);

CREATE TABLE IF NOT EXISTS user_notifications(
  id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,type VARCHAR(50) NOT NULL,title VARCHAR(220) NOT NULL,
  body TEXT DEFAULT '',target_url VARCHAR(300) DEFAULT '/app',dedupe_key VARCHAR(240),read_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,dismissed_at TIMESTAMPTZ,email_sent_at TIMESTAMPTZ,push_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE(user_id,dedupe_key)
);
CREATE INDEX IF NOT EXISTS idx_notifications_inbox ON user_notifications(user_id,dismissed_at,snoozed_until,created_at DESC);

CREATE TABLE IF NOT EXISTS push_subscriptions(
  id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,p256dh TEXT NOT NULL,auth TEXT NOT NULL,user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),last_success_at TIMESTAMPTZ,failed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS diagnosis_trees(
  id BIGSERIAL PRIMARY KEY,system_key VARCHAR(80) NOT NULL,node_key VARCHAR(100) NOT NULL,parent_key VARCHAR(100),
  question TEXT NOT NULL,yes_next VARCHAR(100),no_next VARCHAR(100),result_text TEXT,checks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE(system_key,node_key)
);
