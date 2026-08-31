CREATE TABLE IF NOT EXISTS mobile_refresh_tokens(
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES auth_sessions(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  rotated_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobile_refresh_session
  ON mobile_refresh_tokens(session_id,created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mobile_refresh_user
  ON mobile_refresh_tokens(user_id,expires_at DESC);

CREATE TABLE IF NOT EXISTS mobile_push_tokens(
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
  expo_push_token TEXT UNIQUE NOT NULL,
  platform VARCHAR(20) NOT NULL,
  device_name VARCHAR(160),
  app_version VARCHAR(40),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobile_push_user
  ON mobile_push_tokens(user_id,active,last_seen_at DESC);

ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS client_request_id UUID;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS client_request_id UUID;

CREATE UNIQUE INDEX IF NOT EXISTS idx_maintenance_client_request
  ON maintenance(company_id,client_request_id)
  WHERE client_request_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_work_orders_client_request
  ON work_orders(company_id,client_request_id)
  WHERE client_request_id IS NOT NULL;

ALTER TABLE faults ADD COLUMN IF NOT EXISTS assigned_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE faults ADD COLUMN IF NOT EXISTS closed_by BIGINT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE faults ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS client_request_id UUID;

CREATE INDEX IF NOT EXISTS idx_faults_assignment
  ON faults(company_id,assigned_user_id,status,created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_attachments_client_request
  ON attachments(company_id,client_request_id)
  WHERE client_request_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS fault_events(
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  fault_id BIGINT NOT NULL REFERENCES faults(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  from_status VARCHAR(30),
  to_status VARCHAR(30),
  body TEXT DEFAULT '',
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fault_events_fault
  ON fault_events(company_id,fault_id,created_at,id);
