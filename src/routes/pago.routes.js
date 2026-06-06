import express from 'express';
import pagoController from '../controllers/pago.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdminOrRecepcionista } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAdminOrRecepcionista, pagoController.getAll.bind(pagoController));
router.get('/:id', requireAdminOrRecepcionista, pagoController.getById.bind(pagoController));
router.post('/egreso', requireAdminOrRecepcionista, pagoController.createEgreso.bind(pagoController));
router.post('/', requireAdminOrRecepcionista, pagoController.create.bind(pagoController));
router.put('/:id', requireAdminOrRecepcionista, pagoController.update.bind(pagoController));
router.delete('/:id', requireAdminOrRecepcionista, pagoController.delete.bind(pagoController));

export default router;

