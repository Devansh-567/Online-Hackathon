/**
 * User routes.
 */
import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const r = Router();

r.use(requireAuth);
r.get('/', userController.list);

export default r;
