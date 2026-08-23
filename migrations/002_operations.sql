ALTER TABLE maintenance_templates ADD COLUMN IF NOT EXISTS note TEXT DEFAULT '';
ALTER TABLE maintenance_templates ADD COLUMN IF NOT EXISTS checklist_template JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE maintenance_templates ADD COLUMN IF NOT EXISTS last_generated_at TIMESTAMPTZ;
ALTER TABLE maintenance ADD COLUMN IF NOT EXISTS template_id BIGINT REFERENCES maintenance_templates(id) ON DELETE SET NULL;
DROP INDEX IF EXISTS idx_maintenance_template_open;
CREATE UNIQUE INDEX idx_maintenance_template_open ON maintenance(template_id) WHERE template_id IS NOT NULL AND status='open' AND archived_at IS NULL;

ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS archived_by BIGINT REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_attachment_id BIGINT REFERENCES attachments(id) ON DELETE SET NULL;
ALTER TABLE user_notifications ADD COLUMN IF NOT EXISTS level VARCHAR(30) NOT NULL DEFAULT 'info';
ALTER TABLE faults ADD COLUMN IF NOT EXISTS client_request_id UUID;
ALTER TABLE machine_measurements ADD COLUMN IF NOT EXISTS client_request_id UUID;
ALTER TABLE work_order_events ADD COLUMN IF NOT EXISTS client_request_id UUID;
CREATE UNIQUE INDEX IF NOT EXISTS idx_faults_client_request ON faults(company_id,client_request_id) WHERE client_request_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_measurements_client_request ON machine_measurements(company_id,client_request_id) WHERE client_request_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_work_events_client_request ON work_order_events(company_id,client_request_id) WHERE client_request_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS report_signatures(
  id BIGSERIAL PRIMARY KEY,company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  parent_type VARCHAR(30) NOT NULL,parent_id BIGINT NOT NULL,signer_type VARCHAR(30) NOT NULL,
  signer_name VARCHAR(160) NOT NULL,signature_data TEXT NOT NULL,signed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE(company_id,parent_type,parent_id,signer_type)
);
CREATE INDEX IF NOT EXISTS idx_report_signatures_parent ON report_signatures(company_id,parent_type,parent_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='checklist_photo_attachment_fk') THEN
    ALTER TABLE checklist_items ADD CONSTRAINT checklist_photo_attachment_fk
      FOREIGN KEY(photo_attachment_id) REFERENCES attachments(id) ON DELETE SET NULL;
  END IF;
END $$;
