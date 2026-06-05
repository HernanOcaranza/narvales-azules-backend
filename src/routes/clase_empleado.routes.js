import express from 'express';
import claseEmpleadoController from '../controllers/clase_empleado.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAnyRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/clase/:idClase', requireAnyRole, claseEmpleadoController.getByClase.bind(claseEmpleadoController));
router.get('/empleado/:idEmpleado', requireAnyRole, claseEmpleadoController.getByEmpleado.bind(claseEmpleadoController));
router.get('/', requireAnyRole, claseEmpleadoController.getAll.bind(claseEmpleadoController));
router.get('/:idClase/:idEmpleado', requireAnyRole, claseEmpleadoController.getById.bind(claseEmpleadoController));
router.post('/', requireAnyRole, claseEmpleadoController.create.bind(claseEmpleadoController));
router.put('/:idClase/:idEmpleado', requireAnyRole, claseEmpleadoController.update.bind(claseEmpleadoController));
router.delete('/:idClase/:idEmpleado', requireAnyRole, claseEmpleadoController.delete.bind(claseEmpleadoController));

export default router;

