-- SentinelX core schema — PostgreSQL-oriented DDL for production deployments.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE departments (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  parent_id   TEXT REFERENCES departments(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT UNIQUE NOT NULL,
  password_hash    TEXT NOT NULL,
  role             TEXT NOT NULL CHECK (role IN ('ADMIN','EXECUTIVE','MANAGER','EMPLOYEE')),
  department_id    TEXT NOT NULL REFERENCES departments(id),
  recent_rejections INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE expenses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_id     UUID NOT NULL REFERENCES users(id),
  department_id    TEXT NOT NULL REFERENCES departments(id),
  title            TEXT NOT NULL,
  category         TEXT NOT NULL,
  amount           NUMERIC(14,2) NOT NULL,
  currency         TEXT NOT NULL DEFAULT 'USD',
  amount_base      NUMERIC(14,2) NOT NULL,
  merchant         TEXT,
  description      TEXT,
  status           TEXT NOT NULL CHECK (status IN ('DRAFT','PENDING','APPROVED','REJECTED')),
  risk_score       NUMERIC(5,2),
  trust_score      NUMERIC(5,2),
  flags            TEXT[] DEFAULT ARRAY[]::TEXT[],
  workflow         JSONB NOT NULL DEFAULT '{}',
  ocr              JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_dept ON expenses(department_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_submitter ON expenses(submitter_id);

CREATE TABLE audit_logs (
  id           BIGSERIAL PRIMARY KEY,
  actor_id     UUID,
  entity_type  TEXT NOT NULL,
  entity_id    UUID NOT NULL,
  action       TEXT NOT NULL,
  payload      JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
