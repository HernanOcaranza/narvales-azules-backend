import express from 'express';
import membresiaController from '../controllers/membrecia.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdminOrRecepcionista } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAdminOrRecepcionista, membresiaController.getAll.bind(membresiaController));
router.get('/alumno/:idAlumno', requireAdminOrRecepcionista, membresiaController.getByAlumnoId.bind(membresiaController));
router.get('/:id/completo', requireAdminOrRecepcionista, membresiaController.getCompletoById.bind(membresiaController));
router.get('/:id', requireAdminOrRecepcionista, membresiaController.getById.bind(membresiaController));
router.post('/', requireAdminOrRecepcionista, membresiaController.create.bind(membresiaController));
router.put('/:id', requireAdminOrRecepcionista, membresiaController.update.bind(membresiaController));
router.delete('/:id', requireAdminOrRecepcionista, membresiaController.delete.bind(membresiaController));

export default router;

