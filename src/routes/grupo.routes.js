import express from 'express';
import grupoController from '../controllers/grupo.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAnyRole, requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAnyRole, grupoController.getAll.bind(grupoController));
router.get('/:id', requireAnyRole, grupoController.getById.bind(grupoController));
router.get('/disciplina/:id_disciplina', requireAnyRole, grupoController.getByDisciplina.bind(grupoController));
router.get('/categoria/:id_categoria', requireAnyRole, grupoController.getByCategoria.bind(grupoController));
router.post('/', requireAdmin, grupoController.create.bind(grupoController));
router.put('/:id', requireAdmin, grupoController.update.bind(grupoController));
router.delete('/:id', requireAdmin, grupoController.delete.bind(grupoController));

export default router;

