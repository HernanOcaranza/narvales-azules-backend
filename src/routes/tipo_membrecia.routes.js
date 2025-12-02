import express from 'express';
import tipoMembreciaController from '../controllers/tipo_membrecia.controller.js';

const router = express.Router();

// Rutas - Documentación en src/docs/tipo_membrecia.yaml
router.get('/', tipoMembreciaController.getAll.bind(tipoMembreciaController));
router.get('/:id', tipoMembreciaController.getById.bind(tipoMembreciaController));
router.post('/', tipoMembreciaController.create.bind(tipoMembreciaController));
router.put('/:id', tipoMembreciaController.update.bind(tipoMembreciaController));
router.delete('/:id', tipoMembreciaController.delete.bind(tipoMembreciaController));

export default router;

