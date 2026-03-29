/**
 * Aggregates route modules.
 */
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import userRoutes from './userRoutes.js';
import * as approvalController from '../controllers/approvalController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const api = Router();

api.use('/auth', authRoutes);
api.use('/expenses', expenseRoutes);
api.use('/users', userRoutes);
api.post('/expenses/:id/approve', requireAuth, approvalController.decide);

export default api;
