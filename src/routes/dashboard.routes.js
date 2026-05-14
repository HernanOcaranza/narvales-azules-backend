import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAdmin, dashboardController.getStats.bind(dashboardController));

export default router;