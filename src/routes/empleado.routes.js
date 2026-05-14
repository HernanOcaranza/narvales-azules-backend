import express from 'express';
import empleadoController from '../controllers/empleado.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAdmin, empleadoController.getAll.bind(empleadoController));
router.get('/:id', requireAdmin, empleadoController.getById.bind(empleadoController));
router.post('/', requireAdmin, empleadoController.create.bind(empleadoController));
router.put('/:id', requireAdmin, empleadoController.update.bind(empleadoController));
router.delete('/:id', requireAdmin, empleadoController.delete.bind(empleadoController));

export default router;

