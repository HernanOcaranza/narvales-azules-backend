import tipoMembreciaService from '../services/tipo_membrecia.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class TipoMembreciaController {
  async getAll(req, res) {
    try {
      const tipos = await tipoMembreciaService.getAllTipos();
      return successResponse(res, tipos, 'Tipos de membresía obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const tipo = await tipoMembreciaService.getTipoById(id);
      return successResponse(res, tipo, 'Tipo de membresía obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const tipo = await tipoMembreciaService.createTipo(req.body);
      return successResponse(res, tipo, 'Tipo de membresía creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || 
                        error.message.includes('exceder') ||
                        error.message.includes('negativa') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const tipo = await tipoMembreciaService.updateTipo(id, req.body);
      return successResponse(res, tipo, 'Tipo de membresía actualizado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 
                        error.message.includes('exceder') ||
                        error.message.includes('negativa') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await tipoMembreciaService.deleteTipo(id);
      return successResponse(res, result, 'Tipo de membresía eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 
                        error.message.includes('asociadas') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new TipoMembreciaController();

