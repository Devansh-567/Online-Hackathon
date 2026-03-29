/**
 * Email notification adapter — logs in dev; plug SendGrid/SES in production.
 */
import { createLogger } from '../logs/logger.js';

const log = createLogger('email');

const queue = [];

export function enqueueEmail({ to, subject, html, text, templateId, meta = {} }) {
  const message = {
    id: `em_${Date.now()}`,
    to,
    subject,
    html,
    text,
    templateId,
    meta,
    createdAt: new Date().toISOString(),
    status: 'queued',
  };
  queue.push(message);
  log.info('email_enqueued', { to, subject, templateId });
  return message;
}

export async function flushDevOutbox() {
  while (queue.length) {
    const m = queue.shift();
    log.info('email_sent_dev', { id: m.id, to: m.to, subject: m.subject });
    m.status = 'sent';
  }
}

export function getQueueSnapshot() {
  return [...queue];
}
