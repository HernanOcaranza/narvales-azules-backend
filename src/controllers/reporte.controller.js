import reporteService from '../services/reporte.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class ReporteController {
  async getAsistenciaAlumnos(req, res) {
    try {
      const { tipo = 'general', idGrupo, idAlumno, fechaDesde, fechaHasta, soloActivas } = req.query;

      if (tipo === 'grupo' && !idGrupo) {
        return errorResponse(res, 'El parámetro idGrupo es obligatorio para tipo=grupo', 400);
      }
      if (tipo === 'alumno' && !idAlumno) {
        return errorResponse(res, 'El parámetro idAlumno es obligatorio para tipo=alumno', 400);
      }

      const data = await reporteService.getAsistenciaAlumnos({
        tipo,
        idGrupo: idGrupo ? parseInt(idGrupo) : undefined,
        idAlumno: idAlumno ? parseInt(idAlumno) : undefined,
        fechaDesde,
        fechaHasta,
        soloActivas: soloActivas !== 'false'
      });

      return successResponse(res, data, 'Reporte de asistencia de alumnos generado correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getAsistenciaAlumnosPDF(req, res) {
    try {
      const { tipo = 'general', idGrupo, idAlumno, fechaDesde, fechaHasta, soloActivas } = req.query;

      if (tipo === 'grupo' && !idGrupo) {
        return errorResponse(res, 'El parámetro idGrupo es obligatorio para tipo=grupo', 400);
      }
      if (tipo === 'alumno' && !idAlumno) {
        return errorResponse(res, 'El parámetro idAlumno es obligatorio para tipo=alumno', 400);
      }

      const data = await reporteService.getAsistenciaAlumnos({
        tipo,
        idGrupo: idGrupo ? parseInt(idGrupo) : undefined,
        idAlumno: idAlumno ? parseInt(idAlumno) : undefined,
        fechaDesde,
        fechaHasta,
        soloActivas: soloActivas !== 'false'
      });

      const pdfDoc = reporteService.generarPDFAsistenciaAlumnos(data, tipo, { fechaDesde, fechaHasta, soloActivas: soloActivas !== 'false' });

      const buffer = await pdfDoc.getBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=asistencia-alumnos-${tipo}.pdf`);
      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getAsistenciaEmpleados(req, res) {
    try {
      const { tipo = 'general', idEmpleado, fechaDesde, fechaHasta } = req.query;

      if (tipo === 'empleado' && !idEmpleado) {
        return errorResponse(res, 'El parámetro idEmpleado es obligatorio para tipo=empleado', 400);
      }

      const data = await reporteService.getAsistenciaEmpleados({
        tipo,
        idEmpleado: idEmpleado ? parseInt(idEmpleado) : undefined,
        fechaDesde,
        fechaHasta
      });

      return successResponse(res, data, 'Reporte de asistencia de empleados generado correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getAsistenciaEmpleadosPDF(req, res) {
    try {
      const { tipo = 'general', idEmpleado, fechaDesde, fechaHasta } = req.query;

      if (tipo === 'empleado' && !idEmpleado) {
        return errorResponse(res, 'El parámetro idEmpleado es obligatorio para tipo=empleado', 400);
      }

      const data = await reporteService.getAsistenciaEmpleados({
        tipo,
        idEmpleado: idEmpleado ? parseInt(idEmpleado) : undefined,
        fechaDesde,
        fechaHasta
      });

      const pdfDoc = reporteService.generarPDFAsistenciaEmpleados(data, tipo, { fechaDesde, fechaHasta });

      const buffer = await pdfDoc.getBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=asistencia-empleados-${tipo}.pdf`);
      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getMembresias(req, res) {
    try {
      const { tipo = 'listado', estado, idTipoMembrecia, idGrupo, idAlumno, fechaDesde, fechaHasta, dias, agrupar } = req.query;

      const data = await reporteService.getMembresias({
        tipo,
        estado,
        idTipoMembrecia: idTipoMembrecia ? parseInt(idTipoMembrecia) : undefined,
        idGrupo: idGrupo ? parseInt(idGrupo) : undefined,
        idAlumno: idAlumno ? parseInt(idAlumno) : undefined,
        fechaDesde,
        fechaHasta,
        dias: dias ? parseInt(dias) : 30,
        agrupar: agrupar || 'mensual'
      });

      return successResponse(res, data, 'Reporte de membresías generado correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getMembresiasPDF(req, res) {
    try {
      const { tipo = 'listado', estado, idTipoMembrecia, idGrupo, idAlumno, fechaDesde, fechaHasta, dias, agrupar } = req.query;

      const data = await reporteService.getMembresias({
        tipo,
        estado,
        idTipoMembrecia: idTipoMembrecia ? parseInt(idTipoMembrecia) : undefined,
        idGrupo: idGrupo ? parseInt(idGrupo) : undefined,
        idAlumno: idAlumno ? parseInt(idAlumno) : undefined,
        fechaDesde,
        fechaHasta,
        dias: dias ? parseInt(dias) : 30,
        agrupar: agrupar || 'mensual'
      });

      const pdfDoc = reporteService.generarPDFMembresias(data, tipo, { fechaDesde, fechaHasta });

      const buffer = await pdfDoc.getBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=membresias-${tipo}.pdf`);
      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getReporteFinanciero(req, res) {
    try {
      const { fechaDesde, fechaHasta, agrupar } = req.query;
      const data = await reporteService.getReporteFinanciero({ fechaDesde, fechaHasta, agrupar: agrupar || 'mensual' });
      return successResponse(res, data, 'Reporte financiero generado correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getReporteFinancieroPDF(req, res) {
    try {
      const { fechaDesde, fechaHasta, agrupar } = req.query;
      const data = await reporteService.getReporteFinanciero({ fechaDesde, fechaHasta, agrupar: agrupar || 'mensual' });
      const pdfDoc = reporteService.generarPDFReporteFinanciero(data, { fechaDesde, fechaHasta, agrupar: agrupar || 'mensual' });
      const buffer = await pdfDoc.getBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-financiero.pdf');
      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

export default new ReporteController();
