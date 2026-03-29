# SentinelX HTTP API (v1)

Base URL (local): `http://localhost:4000/api/v1`

## Authentication

### `POST /auth/login`

```json
{ "email": "employee@sentinelx.demo", "password": "Employee!123" }
```

**Response**

```json
{ "token": "<jwt>", "user": { "id": "...", "email": "...", "role": "EMPLOYEE", "departmentId": "dept-eng" } }
```

### `GET /auth/me`

**Headers**: `Authorization: Bearer <jwt>`

## Expenses

### `GET /expenses`

Query: `page`, `limit` — paginated list scoped by role (employee: own, manager: department, admin: all).

### `GET /expenses/:id`

### `POST /expenses`

```json
{
  "title": "Client dinner",
  "category": "MEALS",
  "amount": 120.5,
  "currency": "USD",
  "merchant": "Cafe Noir",
  "receiptMeta": { "name": "receipt.png", "type": "image/png" }
}
```

`receiptMeta` triggers OCR simulation on the server.

### `PATCH /expenses/:id`

Updates allowed per role/status rules (employees: drafts primarily).

### `DELETE /expenses/:id`

## Approvals

### `POST /expenses/:id/approve`

```json
{ "action": "APPROVE", "comment": "Looks compliant." }
```

`action` is `APPROVE` or `REJECT`.

## Users

### `GET /users`

Admin/Manager listing (demo).

## Health

### `GET /health`

Liveness probe (root server, not under `/api/v1`).
