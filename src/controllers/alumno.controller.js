import alumnoService from '../services/alumno.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class AlumnoController {
  async getAll(req, res) {
    try {
      const alumnos = await alumnoService.getAllAlumnos();
      return successResponse(res, alumnos, 'Alumnos obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const alumno = await alumnoService.getAlumnoById(id);
      return successResponse(res, alumno, 'Alumno obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByTutor(req, res) {
    try {
      const { idTutor } = req.params;
      const alumnos = await alumnoService.getAlumnosByTutor(idTutor);
      return successResponse(res, alumnos, 'Alumnos obtenidos correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async searchByNombre(req, res) {
    try {
      const { nombre } = req.query;
      const alumnos = await alumnoService.searchAlumnosByNombre(nombre);
      return successResponse(res, alumnos, 'Búsqueda de alumnos realizada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const alumno = await alumnoService.createAlumno(req.body);
      return successResponse(res, alumno, 'Alumno creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('ya existe') ? 409 : 
                        error.message.includes('obligatorio') || error.message.includes('exceder') || error.message.includes('formato') || error.message.includes('mayor') || error.message.includes('debe ser') || error.message.includes('certificado') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const alumno = await alumnoService.updateAlumno(id, req.body);
      return successResponse(res, alumno, 'Alumno actualizado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 
                        error.message.includes('ya existe') ? 409 :
                        error.message.includes('exceder') || error.message.includes('formato') || error.message.includes('mayor') || error.message.includes('debe ser') || error.message.includes('certificado') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await alumnoService.deleteAlumno(id);
      return successResponse(res, result, 'Alumno eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getCompletoById(req, res) {
    try {
      const { id } = req.params;
      const alumno = await alumnoService.getAlumnoCompletoById(id);
      return successResponse(res, alumno, 'Información completa del alumno obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new AlumnoController();

