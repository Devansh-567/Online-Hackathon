/**
 * Approval decision API.
 */
import * as approvalService from '../services/approvalService.js';

export async function decide(req, res, next) {
  try {
    const { action, comment } = req.body || {};
    if (!['APPROVE', 'REJECT'].includes(action)) {
      const e = new Error('action must be APPROVE or REJECT');
      e.statusCode = 400;
      throw e;
    }
    const mapped = action === 'APPROVE' ? 'APPROVE' : 'REJECT';
    const updated = approvalService.applyDecision(req.params.id, req.user, {
      action: mapped,
      comment,
    });
    res.json(updated);
  } catch (e) {
    next(e);
  }
}
