import detallePagoService from '../services/detalle_pago.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class DetallePagoController {
  async getAll(req, res) {
    try {
      const detalles = await detallePagoService.getAllDetalles();
      return successResponse(res, detalles, 'Detalles de pago obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const detalle = await detallePagoService.getDetalleById(id);
      return successResponse(res, detalle, 'Detalle de pago obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByPagoId(req, res) {
    try {
      const { idPago } = req.params;
      const detalles = await detallePagoService.getDetallesByPagoId(idPago);
      return successResponse(res, detalles, 'Detalles de pago obtenidos correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const detalle = await detallePagoService.createDetalle(req.body);
      return successResponse(res, detalle, 'Detalle de pago creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || 
                        error.message.includes('debe ser') || 
                        error.message.includes('exceder') ||
                        error.message.includes('no existe') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const detalle = await detallePagoService.updateDetalle(id, req.body);
      return successResponse(res, detalle, 'Detalle de pago actualizado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 
                        error.message.includes('debe ser') || 
                        error.message.includes('exceder') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await detallePagoService.deleteDetalle(id);
      return successResponse(res, result, 'Detalle de pago eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new DetallePagoController();

