import express from 'express';
import membresiaController from '../controllers/membrecia.controller.js';

const router = express.Router();

// Rutas - Documentación en src/docs/membrecia.yaml
router.get('/', membresiaController.getAll.bind(membresiaController));
router.get('/alumno/:idAlumno', membresiaController.getByAlumnoId.bind(membresiaController));
router.get('/:id', membresiaController.getById.bind(membresiaController));
router.post('/', membresiaController.create.bind(membresiaController));
router.put('/:id', membresiaController.update.bind(membresiaController));
router.delete('/:id', membresiaController.delete.bind(membresiaController));

export default router;

