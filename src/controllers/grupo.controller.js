import grupoService from '../services/grupo.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class GrupoController {
  async getAll(req, res) {
    try {
      const grupos = await grupoService.getAllGrupos();
      return successResponse(res, grupos, 'Grupos obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const grupo = await grupoService.getGrupoById(id);
      return successResponse(res, grupo, 'Grupo obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByDisciplina(req, res) {
    try {
      const { id_disciplina } = req.params;
      const grupos = await grupoService.getGruposByDisciplina(id_disciplina);
      return successResponse(res, grupos, 'Grupos obtenidos correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByCategoria(req, res) {
    try {
      const { id_categoria } = req.params;
      const grupos = await grupoService.getGruposByCategoria(id_categoria);
      return successResponse(res, grupos, 'Grupos obtenidos correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const grupo = await grupoService.createGrupo(req.body);
      return successResponse(res, grupo, 'Grupo creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('ya existe') ? 409 : 
                        error.message.includes('obligatorio') || error.message.includes('exceder') || 
                        error.message.includes('mayor a cero') || error.message.includes('no encontrada') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const grupo = await grupoService.updateGrupo(id, req.body);
      return successResponse(res, grupo, 'Grupo actualizado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') || error.message.includes('no encontrada') ? 404 : 
                        error.message.includes('ya existe') ? 409 :
                        error.message.includes('exceder') || error.message.includes('mayor a cero') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await grupoService.deleteGrupo(id);
      return successResponse(res, result, 'Grupo eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new GrupoController();

