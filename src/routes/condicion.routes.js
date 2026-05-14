import express from 'express';
import condicionController from '../controllers/condicion.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdmin, requireAnyRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAnyRole, condicionController.getAll.bind(condicionController));
router.get('/:id', requireAnyRole, condicionController.getById.bind(condicionController));
router.post('/', requireAdmin, condicionController.create.bind(condicionController));
router.put('/:id', requireAdmin, condicionController.update.bind(condicionController));
router.delete('/:id', requireAdmin, condicionController.delete.bind(condicionController));

export default router;

