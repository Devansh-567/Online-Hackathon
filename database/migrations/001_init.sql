-- Migration 001: baseline departments and indexes for reporting views.

INSERT INTO departments (id, name, parent_id)
VALUES
  ('dept-hq', 'Headquarters', NULL),
  ('dept-eng', 'Engineering', 'dept-hq'),
  ('dept-fin', 'Finance', 'dept-hq')
ON CONFLICT (id) DO NOTHING;

-- Example partial index for approver queues
CREATE INDEX IF NOT EXISTS idx_expenses_pending_manager
  ON expenses (department_id, created_at DESC)
  WHERE status = 'PENDING';
