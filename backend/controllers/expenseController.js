/**
 * Expense CRUD HTTP handlers.
 */
import * as expenseService from '../services/expenseService.js';
import { assertNonEmptyString, parseMoney, allowedCategories } from '../utils/validators.js';
import { parsePagination, buildPageResponse } from '../utils/pagination.js';
import { ROLES } from '../../auth/role_manager.js';

export async function list(req, res, next) {
  try {
    const { limit, page, offset } = parsePagination(req.query);
    const all = expenseService.listForUser(req.user);
    const slice = all.slice(offset, offset + limit);
    res.json(buildPageResponse(slice, { total: all.length, page, limit }));
  } catch (e) {
    next(e);
  }
}

export async function getOne(req, res, next) {
  try {
    const row = expenseService.getExpense(req.params.id);
    if (!row) {
      const e = new Error('Not found');
      e.statusCode = 404;
      throw e;
    }
    if (req.user.role === ROLES.EMPLOYEE && row.submitterId !== req.user.id) {
      const e = new Error('Not found');
      e.statusCode = 404;
      throw e;
    }
    res.json(row);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const b = req.body || {};
    assertNonEmptyString(b.title, 'title');
    assertNonEmptyString(b.category, 'category');
    if (!allowedCategories().includes(b.category)) {
      const e = new Error('invalid category');
      e.statusCode = 400;
      throw e;
    }
    b.amount = parseMoney(b.amount);
    const created = await expenseService.createExpenseFromPayload(b, req.user);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const updated = expenseService.updateExpense(req.params.id, req.body || {}, req.user);
    if (!updated) {
      const e = new Error('Not found');
      e.statusCode = 404;
      throw e;
    }
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const ok = expenseService.removeExpense(req.params.id, req.user);
    if (!ok) {
      const e = new Error('Not found');
      e.statusCode = 404;
      throw e;
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
