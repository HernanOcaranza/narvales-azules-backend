import express from 'express';
import reporteController from '../controllers/reporte.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAnyRole, requireAdminOrRecepcionista } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/asistencia-alumnos', requireAnyRole, reporteController.getAsistenciaAlumnos.bind(reporteController));
router.get('/asistencia-alumnos/pdf', requireAnyRole, reporteController.getAsistenciaAlumnosPDF.bind(reporteController));
router.get('/asistencia-empleados', requireAnyRole, reporteController.getAsistenciaEmpleados.bind(reporteController));
router.get('/asistencia-empleados/pdf', requireAnyRole, reporteController.getAsistenciaEmpleadosPDF.bind(reporteController));
router.get('/membresias', requireAdminOrRecepcionista, reporteController.getMembresias.bind(reporteController));
router.get('/membresias/pdf', requireAdminOrRecepcionista, reporteController.getMembresiasPDF.bind(reporteController));

export default router;
