import express from 'express';
import empleadoController from '../controllers/empleado.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/empleado.yaml
router.get('/', empleadoController.getAll.bind(empleadoController));
router.get('/:id', empleadoController.getById.bind(empleadoController));
router.post('/', empleadoController.create.bind(empleadoController));
router.put('/:id', empleadoController.update.bind(empleadoController));
router.delete('/:id', empleadoController.delete.bind(empleadoController));

// Si necesitas proteger las rutas, descomenta la siguiente línea:
// router.use(authMiddleware);

export default router;

