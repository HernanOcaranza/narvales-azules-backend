import express from 'express';
import condicionController from '../controllers/condicion.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/condicion.yaml
router.get('/', condicionController.getAll.bind(condicionController));
router.get('/:id', condicionController.getById.bind(condicionController));
router.post('/', condicionController.create.bind(condicionController));
router.put('/:id', condicionController.update.bind(condicionController));
router.delete('/:id', condicionController.delete.bind(condicionController));

// Si necesitas proteger las rutas, descomenta la siguiente línea:
// router.use(authMiddleware);

export default router;

