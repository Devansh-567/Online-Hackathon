-- Demo seed data — passwords must be replaced with real hashes via application layer.

INSERT INTO departments (id, name, parent_id)
VALUES
  ('dept-hq', 'Headquarters', NULL),
  ('dept-eng', 'Engineering', 'dept-hq')
ON CONFLICT (id) DO NOTHING;

-- NOTE: password_hash placeholders; use backend seed or migration tool to hash secrets.
INSERT INTO users (email, password_hash, role, department_id)
VALUES
  ('admin@sentinelx.demo', '$PLACEHOLDER$', 'ADMIN', 'dept-hq'),
  ('manager@sentinelx.demo', '$PLACEHOLDER$', 'MANAGER', 'dept-eng'),
  ('employee@sentinelx.demo', '$PLACEHOLDER$', 'EMPLOYEE', 'dept-eng')
ON CONFLICT (email) DO NOTHING;
