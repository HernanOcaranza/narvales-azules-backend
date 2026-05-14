import express from 'express';
import alumnoController from '../controllers/alumno.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAnyRole, requireAdmin, requireAdminOrRecepcionista } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/search', requireAnyRole, alumnoController.searchByNombre.bind(alumnoController));
router.get('/', requireAnyRole, alumnoController.getAll.bind(alumnoController));
router.get('/tutor/:idTutor', requireAnyRole, alumnoController.getByTutor.bind(alumnoController));
router.get('/:id/completo', requireAnyRole, alumnoController.getCompletoById.bind(alumnoController));
router.get('/:id', requireAnyRole, alumnoController.getById.bind(alumnoController));
router.post('/', requireAdminOrRecepcionista, alumnoController.create.bind(alumnoController));
router.put('/:id', requireAdminOrRecepcionista, alumnoController.update.bind(alumnoController));
router.delete('/:id', requireAdmin, alumnoController.delete.bind(alumnoController));

export default router;

