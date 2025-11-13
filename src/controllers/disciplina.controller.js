import disciplinaService from '../services/disciplina.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class DisciplinaController {
  async getAll(req, res) {
    try {
      const disciplinas = await disciplinaService.getAllDisciplinas();
      return successResponse(res, disciplinas, 'Disciplinas obtenidas correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const disciplina = await disciplinaService.getDisciplinaById(id);
      return successResponse(res, disciplina, 'Disciplina obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const disciplina = await disciplinaService.createDisciplina(req.body);
      return successResponse(res, disciplina, 'Disciplina creada correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('ya existe') ? 409 : 
                        error.message.includes('obligatorio') || error.message.includes('exceder') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const disciplina = await disciplinaService.updateDisciplina(id, req.body);
      return successResponse(res, disciplina, 'Disciplina actualizada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 
                        error.message.includes('ya existe') ? 409 :
                        error.message.includes('exceder') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await disciplinaService.deleteDisciplina(id);
      return successResponse(res, result, 'Disciplina eliminada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new DisciplinaController();

