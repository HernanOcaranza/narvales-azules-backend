import express from 'express';
import detallePagoController from '../controllers/detalle_pago.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdminOrRecepcionista } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAdminOrRecepcionista, detallePagoController.getAll.bind(detallePagoController));
router.get('/pago/:idPago', requireAdminOrRecepcionista, detallePagoController.getByPagoId.bind(detallePagoController));
router.get('/:id', requireAdminOrRecepcionista, detallePagoController.getById.bind(detallePagoController));
router.post('/', requireAdminOrRecepcionista, detallePagoController.create.bind(detallePagoController));
router.put('/:id', requireAdminOrRecepcionista, detallePagoController.update.bind(detallePagoController));
router.delete('/:id', requireAdminOrRecepcionista, detallePagoController.delete.bind(detallePagoController));

export default router;

