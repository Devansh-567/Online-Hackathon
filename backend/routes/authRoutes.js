/**
 * Auth routes.
 */
import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const r = Router();

r.post('/login', authController.login);
r.get('/me', requireAuth, authController.me);

export default r;
