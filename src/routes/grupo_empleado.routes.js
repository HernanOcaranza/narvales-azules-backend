import express from 'express';
import grupoEmpleadoController from '../controllers/grupo_empleado.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAnyRole, requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAnyRole, grupoEmpleadoController.getAll.bind(grupoEmpleadoController));
router.get('/grupo/:idGrupo', requireAnyRole, grupoEmpleadoController.getByGrupo.bind(grupoEmpleadoController));
router.get('/empleado/:idEmpleado', requireAnyRole, grupoEmpleadoController.getByEmpleado.bind(grupoEmpleadoController));
router.post('/', requireAnyRole, grupoEmpleadoController.create.bind(grupoEmpleadoController));
router.post('/grupo/:idGrupo', requireAdmin, grupoEmpleadoController.asignarEmpleados.bind(grupoEmpleadoController));
router.get('/:id', requireAnyRole, grupoEmpleadoController.getById.bind(grupoEmpleadoController));
router.put('/:id', requireAdmin, grupoEmpleadoController.update.bind(grupoEmpleadoController));
router.delete('/:id', requireAdmin, grupoEmpleadoController.delete.bind(grupoEmpleadoController));

export default router;
