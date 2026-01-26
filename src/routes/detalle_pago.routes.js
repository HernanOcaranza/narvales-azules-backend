import express from 'express';
import detallePagoController from '../controllers/detalle_pago.controller.js';

const router = express.Router();

// Rutas - Documentación en src/docs/detalle_pago.yaml
router.get('/', detallePagoController.getAll.bind(detallePagoController));
router.get('/pago/:idPago', detallePagoController.getByPagoId.bind(detallePagoController));
router.get('/:id', detallePagoController.getById.bind(detallePagoController));
router.post('/', detallePagoController.create.bind(detallePagoController));
router.put('/:id', detallePagoController.update.bind(detallePagoController));
router.delete('/:id', detallePagoController.delete.bind(detallePagoController));

export default router;

