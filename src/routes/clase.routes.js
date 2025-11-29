import express from 'express';
import claseController from '../controllers/clase.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/clase.yaml
router.get('/grupo/:idGrupo', claseController.getByGrupo.bind(claseController));
router.get('/fecha', claseController.getByFecha.bind(claseController));
router.get('/fecha-range', claseController.getByFechaRange.bind(claseController));
router.post('/generar-todas', claseController.generarTodas.bind(claseController));
router.post('/actualizar-estados', claseController.actualizarEstados.bind(claseController));
router.get('/', claseController.getAll.bind(claseController));
router.get('/:id', claseController.getById.bind(claseController));
router.post('/', claseController.create.bind(claseController));
router.put('/:id', claseController.update.bind(claseController));
router.delete('/:id', claseController.delete.bind(claseController));

// Si necesitas proteger las rutas, descomenta la siguiente línea:
// router.use(authMiddleware);

export default router;

