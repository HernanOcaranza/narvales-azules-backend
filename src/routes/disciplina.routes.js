import express from 'express';
import disciplinaController from '../controllers/disciplina.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdmin, requireAnyRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAnyRole, disciplinaController.getAll.bind(disciplinaController));
router.get('/:id', requireAnyRole, disciplinaController.getById.bind(disciplinaController));
router.post('/', requireAdmin, disciplinaController.create.bind(disciplinaController));
router.put('/:id', requireAdmin, disciplinaController.update.bind(disciplinaController));
router.delete('/:id', requireAdmin, disciplinaController.delete.bind(disciplinaController));

export default router;

