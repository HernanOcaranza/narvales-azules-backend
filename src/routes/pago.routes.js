import express from 'express';
import pagoController from '../controllers/pago.controller.js';

const router = express.Router();

// Rutas - Documentación en src/docs/pago.yaml
router.get('/', pagoController.getAll.bind(pagoController));
router.get('/:id', pagoController.getById.bind(pagoController));
router.post('/', pagoController.create.bind(pagoController));
router.put('/:id', pagoController.update.bind(pagoController));
router.delete('/:id', pagoController.delete.bind(pagoController));

export default router;

