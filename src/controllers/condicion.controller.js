import condicionService from '../services/condicion.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class CondicionController {
  async getAll(req, res) {
    try {
      const condiciones = await condicionService.getAllCondiciones();
      return successResponse(res, condiciones, 'Condiciones obtenidas correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const condicion = await condicionService.getCondicionById(id);
      return successResponse(res, condicion, 'Condición obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const condicion = await condicionService.createCondicion(req.body);
      return successResponse(res, condicion, 'Condición creada correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('ya existe') ? 409 : 
                        error.message.includes('obligatorio') || error.message.includes('exceder') || error.message.includes('debe ser') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const condicion = await condicionService.updateCondicion(id, req.body);
      return successResponse(res, condicion, 'Condición actualizada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 
                        error.message.includes('ya existe') ? 409 :
                        error.message.includes('exceder') || error.message.includes('debe ser') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await condicionService.deleteCondicion(id);
      return successResponse(res, result, 'Condición eliminada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new CondicionController();

