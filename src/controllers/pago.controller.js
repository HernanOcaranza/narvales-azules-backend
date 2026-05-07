import pagoService from '../services/pago.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class PagoController {
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { tipo } = req.query;
      let result;
      
      if (tipo) {
        const pagos = await pagoService.getPagosByTipo(tipo);
        result = { data: pagos, total: pagos.length };
      } else {
        result = await pagoService.getAllPagos({ page, limit });
      }
      
      return successResponse(res, {
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      }, 'Pagos obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const pago = await pagoService.getPagoById(id);
      return successResponse(res, pago, 'Pago obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const pago = await pagoService.createPago(req.body);
      return successResponse(res, pago, 'Pago creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || 
                        error.message.includes('debe ser') || 
                        error.message.includes('exceder') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const pago = await pagoService.updatePago(id, req.body);
      return successResponse(res, pago, 'Pago actualizado correctamente');
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
      const result = await pagoService.deletePago(id);
      return successResponse(res, result, 'Pago eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 
                        error.message.includes('asociados') || 
                        error.message.includes('asociado') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new PagoController();

