import express from 'express';
import tutorController from '../controllers/tutor.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/tutor.yaml
router.get('/search', tutorController.searchByNombre.bind(tutorController));
router.get('/', tutorController.getAll.bind(tutorController));
router.get('/:id', tutorController.getById.bind(tutorController));
router.post('/', tutorController.create.bind(tutorController));
router.put('/:id', tutorController.update.bind(tutorController));
router.delete('/:id', tutorController.delete.bind(tutorController));

// Si necesitas proteger las rutas, descomenta la siguiente línea:
// router.use(authMiddleware);

export default router;

