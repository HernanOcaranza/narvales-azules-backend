import express from 'express';
import grupoHorarioController from '../controllers/grupo_horario.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdminOrRecepcionista } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireAdminOrRecepcionista, grupoHorarioController.getAll.bind(grupoHorarioController));
router.get('/:id', requireAdminOrRecepcionista, grupoHorarioController.getById.bind(grupoHorarioController));
router.get('/grupo/:id_grupo', requireAdminOrRecepcionista, grupoHorarioController.getByGrupo.bind(grupoHorarioController));
router.post('/', requireAdminOrRecepcionista, grupoHorarioController.create.bind(grupoHorarioController));
router.post('/multiple', requireAdminOrRecepcionista, grupoHorarioController.createMany.bind(grupoHorarioController));
router.put('/:id', requireAdminOrRecepcionista, grupoHorarioController.update.bind(grupoHorarioController));
router.delete('/:id', requireAdminOrRecepcionista, grupoHorarioController.delete.bind(grupoHorarioController));

export default router;

