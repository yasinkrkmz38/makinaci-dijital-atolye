ALTER TABLE machines ADD COLUMN IF NOT EXISTS machine_code VARCHAR(80);
ALTER TABLE machines ADD COLUMN IF NOT EXISTS department VARCHAR(140) DEFAULT '';
ALTER TABLE machines ADD COLUMN IF NOT EXISTS hourly_downtime_cost NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK(hourly_downtime_cost>=0);
CREATE UNIQUE INDEX IF NOT EXISTS idx_machines_company_code ON machines(company_id,machine_code) WHERE machine_code IS NOT NULL AND archived_at IS NULL;

CREATE TABLE IF NOT EXISTS machine_meter_readings(
  id BIGSERIAL PRIMARY KEY,company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  machine_id BIGINT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,meter_type VARCHAR(30) NOT NULL,
  reading NUMERIC(16,2) NOT NULL CHECK(reading>=0),unit VARCHAR(30) NOT NULL DEFAULT 'saat',note VARCHAR(240) DEFAULT '',
  recorded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_machine_meter_history ON machine_meter_readings(company_id,machine_id,meter_type,recorded_at DESC);

ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS work_order_no VARCHAR(40);
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS fault_id BIGINT REFERENCES faults(id) ON DELETE SET NULL;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS action_taken TEXT DEFAULT '';
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS result TEXT DEFAULT '';
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS closing_note TEXT DEFAULT '';
CREATE UNIQUE INDEX IF NOT EXISTS idx_work_order_company_no ON work_orders(company_id,work_order_no) WHERE work_order_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_work_orders_assignment_status ON work_orders(company_id,assigned_user_id,status,created_at DESC);
CREATE OR REPLACE FUNCTION set_work_order_no() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.work_order_no IS NULL THEN
    UPDATE work_orders SET work_order_no='WO-'||EXTRACT(YEAR FROM NEW.created_at)::int||'-'||LPAD(NEW.id::text,6,'0') WHERE id=NEW.id;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_work_order_no ON work_orders;
CREATE TRIGGER trg_work_order_no AFTER INSERT ON work_orders FOR EACH ROW EXECUTE FUNCTION set_work_order_no();
UPDATE work_orders SET work_order_no='WO-'||EXTRACT(YEAR FROM created_at)::int||'-'||LPAD(id::text,6,'0') WHERE work_order_no IS NULL;

ALTER TABLE faults ADD COLUMN IF NOT EXISTS title VARCHAR(220) DEFAULT '';
ALTER TABLE faults ADD COLUMN IF NOT EXISTS category VARCHAR(60) DEFAULT 'Diğer';
ALTER TABLE faults ADD COLUMN IF NOT EXISTS details TEXT DEFAULT '';
ALTER TABLE faults ADD COLUMN IF NOT EXISTS machine_stopped BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE faults ADD COLUMN IF NOT EXISTS downtime_started_at TIMESTAMPTZ;
ALTER TABLE faults ADD COLUMN IF NOT EXISTS fault_code VARCHAR(80) DEFAULT '';
ALTER TABLE faults ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE faults ADD COLUMN IF NOT EXISTS resolution TEXT DEFAULT '';
ALTER TABLE faults ADD COLUMN IF NOT EXISTS reported_by BIGINT REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE parts ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(140) DEFAULT '';
ALTER TABLE parts ADD COLUMN IF NOT EXISTS brand VARCHAR(140) DEFAULT '';
ALTER TABLE parts ADD COLUMN IF NOT EXISTS model VARCHAR(140) DEFAULT '';
ALTER TABLE parts ADD COLUMN IF NOT EXISTS warehouse VARCHAR(140) DEFAULT '';
ALTER TABLE parts ADD COLUMN IF NOT EXISTS max_quantity NUMERIC(12,2) CHECK(max_quantity IS NULL OR max_quantity>=0);
ALTER TABLE parts ADD COLUMN IF NOT EXISTS barcode VARCHAR(120) DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_parts_company_code ON parts(company_id,part_code);

CREATE TABLE IF NOT EXISTS machine_parts(
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  machine_id BIGINT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  part_id BIGINT NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  note VARCHAR(240) DEFAULT '',created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),PRIMARY KEY(machine_id,part_id)
);
CREATE INDEX IF NOT EXISTS idx_machine_parts_company_part ON machine_parts(company_id,part_id,machine_id);

CREATE TABLE IF NOT EXISTS shift_handovers(
  id BIGSERIAL PRIMARY KEY,company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  shift VARCHAR(40) NOT NULL,handover_date DATE NOT NULL DEFAULT CURRENT_DATE,
  handed_over_by BIGINT REFERENCES users(id) ON DELETE SET NULL,received_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  note TEXT DEFAULT '',open_items JSONB NOT NULL DEFAULT '[]'::jsonb,critical_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),archived_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_shift_handovers_company_date ON shift_handovers(company_id,handover_date DESC,created_at DESC);

ALTER TABLE attachments ADD COLUMN IF NOT EXISTS fault_id BIGINT REFERENCES faults(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_attachments_fault ON attachments(company_id,fault_id,created_at DESC);
