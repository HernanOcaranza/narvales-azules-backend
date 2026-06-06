import express from 'express';
import reporteController from '../controllers/reporte.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/asistencia-alumnos', requireAdmin, reporteController.getAsistenciaAlumnos.bind(reporteController));
router.get('/asistencia-alumnos/pdf', requireAdmin, reporteController.getAsistenciaAlumnosPDF.bind(reporteController));
router.get('/asistencia-empleados', requireAdmin, reporteController.getAsistenciaEmpleados.bind(reporteController));
router.get('/asistencia-empleados/pdf', requireAdmin, reporteController.getAsistenciaEmpleadosPDF.bind(reporteController));
router.get('/membresias', requireAdmin, reporteController.getMembresias.bind(reporteController));
router.get('/membresias/pdf', requireAdmin, reporteController.getMembresiasPDF.bind(reporteController));
router.get('/financiero', requireAdmin, reporteController.getReporteFinanciero.bind(reporteController));
router.get('/financiero/pdf', requireAdmin, reporteController.getReporteFinancieroPDF.bind(reporteController));
export default router;
