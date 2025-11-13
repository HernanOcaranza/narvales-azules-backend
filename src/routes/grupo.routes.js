import express from 'express';
import grupoController from '../controllers/grupo.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/grupo.yaml
router.get('/', grupoController.getAll.bind(grupoController));
router.get('/:id', grupoController.getById.bind(grupoController));
router.get('/disciplina/:id_disciplina', grupoController.getByDisciplina.bind(grupoController));
router.get('/categoria/:id_categoria', grupoController.getByCategoria.bind(grupoController));
router.post('/', grupoController.create.bind(grupoController));
router.put('/:id', grupoController.update.bind(grupoController));
router.delete('/:id', grupoController.delete.bind(grupoController));

// Si necesitas proteger las rutas, descomenta la siguiente línea:
// router.use(authMiddleware);

export default router;

