# SentinelX — Intelligent Expense Governance Platform

SentinelX is an **enterprise-style** reference implementation for **policy-aware expense operations**: submissions enriched with **simulated OCR**, **risk and trust scoring**, **fraud-style heuristics**, **dynamic approval workflows**, **notifications**, and **structured logging**. It is designed to read like a real startup codebase — clear boundaries, commented modules, and a path to production databases and model hosting.

---

## Problem Statement

Organizations lose millions annually to **non-compliant spend**, **slow approvals**, and **opaque decision trails**. Finance teams need:

- **Governed submission** with evidence (receipts) and standardized metadata  
- **Risk-aware routing** — not every dollar should follow the same path  
- **Role-based visibility** — employees, managers, and admins see appropriate scope  
- **Defensible audits** — why an expense was flagged, escalated, or auto-approved  

SentinelX demonstrates how product, API, workflow, and AI layers cooperate to solve that problem **without** collapsing everything into a monolith.

---

## Architecture

| Layer | Responsibility |
|-------|----------------|
| **React SPA** | Auth context, dashboards, expense tables, approval queue |
| **Express API** | JWT auth, RBAC middleware, CRUD, approval transitions |
| **Workflow engine** | Rules + escalation tiers + multi-step approvals |
| **AI engine (Python)** | Anomaly detection, risk/trust cards, prediction envelope |
| **Database (SQL)** | Postgres-oriented schema for durable deployment |
| **Integrations** | OCR simulation, FX normalization |
| **Notifications** | Email outbox interface + WebSocket broadcast helper |

See [docs/architecture.md](docs/architecture.md) for diagrams and data flow.

---

## Tech Stack

- **Frontend**: React 18, React Router, Vite, Axios  
- **Backend**: Node.js 18+, Express, Helmet, CORS, `express-rate-limit`, `ws`  
- **Auth**: JWT (HS256), bcrypt password hashing  
- **AI**: Python 3.11+ (stdlib + modular services)  
- **Database**: PostgreSQL DDL provided (dev uses in-memory repositories)  

---

## Repository Layout

```
sentinelx/
├── frontend/          # Vite React client (pages, components, hooks, services)
├── backend/           # Express API (controllers, routes, services, models)
├── ai-engine/         # Python scoring + inference service wrapper
├── database/          # schema.sql, migrations/, seed.sql
├── auth/              # JWT + RBAC + password helpers (shared by API)
├── workflow-engine/   # Rules engine, escalation, approval state machine
├── integrations/      # OCR + currency adapters
├── notifications/     # Email + WebSocket helpers
├── logs/              # Structured logger utility
├── tests/             # Node + Python smoke tests
├── docs/              # Architecture + API reference
└── scripts/           # setup.sh / build.sh
```

---

## Core Features

- **Role-based login**: `ADMIN`, `MANAGER`, `EMPLOYEE` with permission map  
- **Expense CRUD** with pagination and scoped list queries  
- **OCR simulation** — deterministic enrichment from receipt metadata  
- **Fraud / policy flags** — rule-based signals (merchant, category/amount mismatch, OCR confidence)  
- **Risk score** — interpretable composite with anomaly and amount pressure  
- **Trust score** — modulates friction for trusted submitters  
- **Dynamic approvals** — manager → finance → executive based on escalation tier  
- **Notifications** — email queue (dev logger) + WebSocket stub  
- **Logging** — JSON structured logger for cross-service consistency  

### Advanced / Enterprise Touches

- **FX normalization** to a base currency for like-for-like reporting  
- **Workflow snapshots** persisted alongside expenses (demo store)  
- **Rate limiting + security headers** on the API  
- **Postgres schema + migrations** for real deployments  

---

## AI Layer (What It Does Today)

The Python modules are **transparent heuristics** with clean extension points for trained models:

- `anomaly_detection.py` — peer z-score + policy triggers  
- `risk_scoring.py` — factorized risk card (auditors love explainability)  
- `trust_score.py` — tenure, role, and quality adjustments  
- `prediction_model.py` — deterministic “recommended action” envelope  
- `services/inference_service.py` — loads `models/manifest.json`, ready for ONNX/PyTorch artifacts  

Node duplicates key formulas for interactive API latency; **batch jobs** can call Python for parity checks.

---

## Setup Guide

### Prerequisites

- Node.js **18+** and npm  
- (Optional) Python **3.11+** for AI scripts  
- (Optional) PostgreSQL **15+** for relational mode  

### Quick Start

```bash
chmod +x scripts/setup.sh scripts/build.sh
./scripts/setup.sh
```

**Terminal A — API**

```bash
cd backend
npm run dev
# listens on http://localhost:4000
```

**Terminal B — UI**

```bash
cd frontend
npm run dev
# listens on http://localhost:5173 (proxies /api → :4000)
```

### Environment

Create `backend/.env` as needed:

```
PORT=4000
JWT_SECRET=replace-me-in-prod
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

## Demo Guide

1. Open `http://localhost:5173` → sign in as **`employee@sentinelx.demo` / `Employee!123`**.  
2. Visit **Expenses** → submit a new line item (OCR simulation runs automatically).  
3. Sign in as **`manager@sentinelx.demo` / `Manager!123`**.  
4. Open **Approvals** → approve or reject pending items; watch workflow steps advance.  
5. Sign in as **`admin@sentinelx.demo` / `Admin!123`** for global visibility.  

Seed data includes a pending “Client dinner” to accelerate the approver demo.

---

## Testing

```bash
cd backend && npm test
python tests/ai.test.py
```

---

## API Reference

See [docs/api_docs.md](docs/api_docs.md).

---

## Future Scope

- **Real OCR** (Textract / Document AI) + virus scanning + object storage  
- **Model hosting** (GPU worker, ONNX Runtime, or managed endpoints)  
- **Policy DSL** for finance-authored rules without redeploys  
- **SAP / NetSuite / Workday** connectors and ERP sync jobs  
- **SOC2-ready** audit exports, immutable log shipping, and tenant isolation  

---

## License

Reference implementation — adopt internally with your preferred license.

