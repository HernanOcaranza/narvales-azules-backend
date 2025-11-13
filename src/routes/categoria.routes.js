import express from 'express';
import categoriaController from '../controllers/categoria.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/categoria.yaml
router.get('/', categoriaController.getAll.bind(categoriaController));
router.get('/:id', categoriaController.getById.bind(categoriaController));
router.post('/', categoriaController.create.bind(categoriaController));
router.put('/:id', categoriaController.update.bind(categoriaController));
router.delete('/:id', categoriaController.delete.bind(categoriaController));

// Si necesitas proteger las rutas, descomenta la siguiente línea:
// router.use(authMiddleware);

export default router;

