import express from 'express';
import alumnoController from '../controllers/alumno.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/alumno.yaml
router.get('/search', alumnoController.searchByNombre.bind(alumnoController));
router.get('/', alumnoController.getAll.bind(alumnoController));
router.get('/tutor/:idTutor', alumnoController.getByTutor.bind(alumnoController));
router.get('/:id/completo', alumnoController.getCompletoById.bind(alumnoController));
router.get('/:id', alumnoController.getById.bind(alumnoController));
router.post('/', alumnoController.create.bind(alumnoController));
router.put('/:id', alumnoController.update.bind(alumnoController));
router.delete('/:id', alumnoController.delete.bind(alumnoController));

// Si necesitas proteger las rutas, descomenta la siguiente línea:
// router.use(authMiddleware);

export default router;

