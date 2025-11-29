import tutorService from '../services/tutor.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class TutorController {
  async getAll(req, res) {
    try {
      const tutores = await tutorService.getAllTutores();
      return successResponse(res, tutores, 'Tutores obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const tutor = await tutorService.getTutorById(id);
      return successResponse(res, tutor, 'Tutor obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async searchByNombre(req, res) {
    try {
      const { nombre } = req.query;
      const tutores = await tutorService.searchTutoresByNombre(nombre);
      return successResponse(res, tutores, 'Búsqueda de tutores realizada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const tutor = await tutorService.createTutor(req.body);
      return successResponse(res, tutor, 'Tutor creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('ya existe') ? 409 : 
                        error.message.includes('obligatorio') || error.message.includes('exceder') || error.message.includes('formato') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const tutor = await tutorService.updateTutor(id, req.body);
      return successResponse(res, tutor, 'Tutor actualizado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 
                        error.message.includes('ya existe') ? 409 :
                        error.message.includes('exceder') || error.message.includes('formato') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await tutorService.deleteTutor(id);
      return successResponse(res, result, 'Tutor eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new TutorController();

