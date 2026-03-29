/** Maps expense status to Badge tone. */

import React from 'react';
import { Badge } from '../UI/Badge.jsx';

export function ExpenseStatusBadge({ status }) {
  const tone = status === 'APPROVED' ? 'ok' : status === 'REJECTED' ? 'danger' : status === 'PENDING' ? 'warn' : 'muted';
  return <Badge tone={tone}>{status}</Badge>;
}
