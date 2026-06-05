import express from 'express';
import tutorController from '../controllers/tutor.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdminOrRecepcionista } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/search', requireAdminOrRecepcionista, tutorController.searchByNombre.bind(tutorController));
router.get('/', requireAdminOrRecepcionista, tutorController.getAll.bind(tutorController));
router.get('/:id', requireAdminOrRecepcionista, tutorController.getById.bind(tutorController));
router.post('/', requireAdminOrRecepcionista, tutorController.create.bind(tutorController));
router.put('/:id', requireAdminOrRecepcionista, tutorController.update.bind(tutorController));
router.delete('/:id', requireAdminOrRecepcionista, tutorController.delete.bind(tutorController));

export default router;

