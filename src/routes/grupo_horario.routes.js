import express from 'express';
import grupoHorarioController from '../controllers/grupo_horario.controller.js';

const router = express.Router();

// Rutas - Documentación en src/docs/grupo_horario.yaml
router.get('/', grupoHorarioController.getAll.bind(grupoHorarioController));
router.get('/:id', grupoHorarioController.getById.bind(grupoHorarioController));
router.get('/grupo/:id_grupo', grupoHorarioController.getByGrupo.bind(grupoHorarioController));
router.post('/', grupoHorarioController.create.bind(grupoHorarioController));
router.post('/multiple', grupoHorarioController.createMany.bind(grupoHorarioController));
router.put('/:id', grupoHorarioController.update.bind(grupoHorarioController));
router.delete('/:id', grupoHorarioController.delete.bind(grupoHorarioController));

export default router;

