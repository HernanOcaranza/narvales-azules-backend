import express from 'express';
import disciplinaController from '../controllers/disciplina.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/disciplina.yaml
router.get('/', disciplinaController.getAll.bind(disciplinaController));
router.get('/:id', disciplinaController.getById.bind(disciplinaController));
router.post('/', disciplinaController.create.bind(disciplinaController));
router.put('/:id', disciplinaController.update.bind(disciplinaController));
router.delete('/:id', disciplinaController.delete.bind(disciplinaController));

// Si necesitas proteger las rutas, descomenta la siguiente línea:
// router.use(authMiddleware);

export default router;

