import express from 'express';
import precioMembreciaController from '../controllers/precio_membrecia.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdmin, requireAdminOrRecepcionista } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAdminOrRecepcionista, precioMembreciaController.getAll.bind(precioMembreciaController));
router.get('/vigente/:idTipoMembrecia', requireAdminOrRecepcionista, precioMembreciaController.getPrecioVigente.bind(precioMembreciaController));
router.get('/:id', requireAdminOrRecepcionista, precioMembreciaController.getById.bind(precioMembreciaController));
router.post('/', requireAdmin, precioMembreciaController.create.bind(precioMembreciaController));
router.put('/:id', requireAdmin, precioMembreciaController.update.bind(precioMembreciaController));
router.delete('/:id', requireAdmin, precioMembreciaController.delete.bind(precioMembreciaController));

export default router;

