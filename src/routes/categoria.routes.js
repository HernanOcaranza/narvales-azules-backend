import express from 'express';
import categoriaController from '../controllers/categoria.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdmin, requireAnyRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAnyRole, categoriaController.getAll.bind(categoriaController));
router.get('/:id', requireAnyRole, categoriaController.getById.bind(categoriaController));
router.post('/', requireAdmin, categoriaController.create.bind(categoriaController));
router.put('/:id', requireAdmin, categoriaController.update.bind(categoriaController));
router.delete('/:id', requireAdmin, categoriaController.delete.bind(categoriaController));

export default router;

