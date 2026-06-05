import express from 'express';
import tipoMembreciaController from '../controllers/tipo_membrecia.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdmin, requireAdminOrRecepcionista } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAdminOrRecepcionista, tipoMembreciaController.getAll.bind(tipoMembreciaController));
router.get('/:id', requireAdminOrRecepcionista, tipoMembreciaController.getById.bind(tipoMembreciaController));
router.post('/', requireAdmin, tipoMembreciaController.create.bind(tipoMembreciaController));
router.put('/:id', requireAdmin, tipoMembreciaController.update.bind(tipoMembreciaController));
router.delete('/:id', requireAdmin, tipoMembreciaController.delete.bind(tipoMembreciaController));

export default router;

