import asistenciaService from '../services/asistencia.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class AsistenciaController {
  async registrarAsistenciaAlumnos(req, res) {
    try {
      const { idClase } = req.params;
      const alumnos = req.body;
      const result = await asistenciaService.registrarAsistenciaAlumnos(idClase, alumnos);
      return successResponse(res, result, 'Asistencia de alumnos registrada correctamente', 200);
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') || error.message.includes('eliminada') ? 404 :
        error.message.includes('obligatorio') || error.message.includes('duplicados') || error.message.includes('debe ser') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getAsistenciaAlumnos(req, res) {
    try {
      const { idClase } = req.params;
      const result = await asistenciaService.getAsistenciaAlumnosConDefaults(idClase);
      return successResponse(res, result, 'Asistencia de alumnos obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getClasesDeAlumno(req, res) {
    try {
      const { id } = req.params;
      const filtros = {};
      if (req.query.fechaDesde) filtros.fechaDesde = req.query.fechaDesde;
      if (req.query.fechaHasta) filtros.fechaHasta = req.query.fechaHasta;
      const result = await asistenciaService.getClasesByAlumno(id, filtros);
      return successResponse(res, result, 'Clases del alumno obtenidas correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new AsistenciaController();
