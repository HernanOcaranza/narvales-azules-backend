import express from 'express';
import claseController from '../controllers/clase.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAnyRole, requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/grupo/:idGrupo', requireAnyRole, claseController.getByGrupo.bind(claseController));
router.get('/fecha', requireAnyRole, claseController.getByFecha.bind(claseController));
router.get('/fecha-range', requireAnyRole, claseController.getByFechaRange.bind(claseController));
router.post('/generar-todas', requireAdmin, claseController.generarTodas.bind(claseController));
router.post('/actualizar-estados', requireAdmin, claseController.actualizarEstados.bind(claseController));
router.get('/', requireAnyRole, claseController.getAll.bind(claseController));
router.get('/:id', requireAnyRole, claseController.getById.bind(claseController));
router.post('/', requireAdmin, claseController.create.bind(claseController));
router.put('/:id', requireAdmin, claseController.update.bind(claseController));
router.delete('/:id', requireAdmin, claseController.delete.bind(claseController));

export default router;

