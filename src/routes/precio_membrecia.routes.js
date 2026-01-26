import express from 'express';
import precioMembreciaController from '../controllers/precio_membrecia.controller.js';

const router = express.Router();

// Rutas - Documentación en src/docs/precio_membrecia.yaml
router.get('/', precioMembreciaController.getAll.bind(precioMembreciaController));
router.get('/vigente/:idTipoMembrecia', precioMembreciaController.getPrecioVigente.bind(precioMembreciaController));
router.get('/:id', precioMembreciaController.getById.bind(precioMembreciaController));
router.post('/', precioMembreciaController.create.bind(precioMembreciaController));
router.put('/:id', precioMembreciaController.update.bind(precioMembreciaController));
router.delete('/:id', precioMembreciaController.delete.bind(precioMembreciaController));

export default router;

