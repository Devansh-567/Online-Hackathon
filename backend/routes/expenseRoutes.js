/**
 * Expense CRUD routes.
 */
import { Router } from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/rbacMiddleware.js';

const r = Router();

r.use(requireAuth);

r.get('/', expenseController.list);
r.get('/:id', expenseController.getOne);
r.post('/', requirePermission('expense:create'), expenseController.create);
r.patch('/:id', expenseController.update);
r.delete('/:id', expenseController.remove);

export default r;
