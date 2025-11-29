import express from 'express';
import claseEmpleadoController from '../controllers/clase_empleado.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/clase_empleado.yaml
router.get('/clase/:idClase', claseEmpleadoController.getByClase.bind(claseEmpleadoController));
router.get('/empleado/:idEmpleado', claseEmpleadoController.getByEmpleado.bind(claseEmpleadoController));
router.get('/', claseEmpleadoController.getAll.bind(claseEmpleadoController));
router.get('/:idClase/:idEmpleado', claseEmpleadoController.getById.bind(claseEmpleadoController));
router.post('/', claseEmpleadoController.create.bind(claseEmpleadoController));
router.put('/:idClase/:idEmpleado', claseEmpleadoController.update.bind(claseEmpleadoController));
router.delete('/:idClase/:idEmpleado', claseEmpleadoController.delete.bind(claseEmpleadoController));

// Si necesitas proteger las rutas, descomenta la siguiente línea:
// router.use(authMiddleware);

export default router;

