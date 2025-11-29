import grupoHorarioService from '../services/grupo_horario.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class GrupoHorarioController {
  async getAll(req, res) {
    try {
      const horarios = await grupoHorarioService.getAllHorarios();
      return successResponse(res, horarios, 'Horarios obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const horario = await grupoHorarioService.getHorarioById(id);
      return successResponse(res, horario, 'Horario obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByGrupo(req, res) {
    try {
      const { id_grupo } = req.params;
      const horarios = await grupoHorarioService.getHorariosByGrupo(id_grupo);
      return successResponse(res, horarios, 'Horarios obtenidos correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const horario = await grupoHorarioService.createHorario(req.body);
      return successResponse(res, horario, 'Horario creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || 
                        error.message.includes('válido') || 
                        error.message.includes('mayor') ||
                        error.message.includes('entre') ? 400 : 
                        error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async createMany(req, res) {
    try {
      const { horarios } = req.body;
      if (!horarios || !Array.isArray(horarios)) {
        return errorResponse(res, 'Se debe proporcionar un array de horarios en el campo "horarios"', 400);
      }
      const horariosCreados = await grupoHorarioService.createManyHorarios(horarios);
      return successResponse(res, horariosCreados, 'Horarios creados correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || 
                        error.message.includes('válido') || 
                        error.message.includes('mayor') ||
                        error.message.includes('entre') ||
                        error.message.includes('proporcionar') ? 400 : 
                        error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const horario = await grupoHorarioService.updateHorario(id, req.body);
      return successResponse(res, horario, 'Horario actualizado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 
                        error.message.includes('válido') || 
                        error.message.includes('mayor') ||
                        error.message.includes('entre') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await grupoHorarioService.deleteHorario(id);
      return successResponse(res, result, 'Horario eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new GrupoHorarioController();

