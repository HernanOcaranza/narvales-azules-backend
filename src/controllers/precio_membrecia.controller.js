import precioMembreciaService from '../services/precio_membrecia.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class PrecioMembreciaController {
  async getAll(req, res) {
    try {
      const { idTipoMembrecia } = req.query;
      let precios;
      
      if (idTipoMembrecia) {
        precios = await precioMembreciaService.getPreciosByTipoMembreciaId(idTipoMembrecia);
      } else {
        precios = await precioMembreciaService.getAllPrecios();
      }
      
      return successResponse(res, precios, 'Precios de membresía obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const precio = await precioMembreciaService.getPrecioById(id);
      return successResponse(res, precio, 'Precio de membresía obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getPrecioVigente(req, res) {
    try {
      const { idTipoMembrecia } = req.params;
      const { fecha } = req.query;
      const precio = await precioMembreciaService.getPrecioVigente(idTipoMembrecia, fecha);
      return successResponse(res, precio, 'Precio vigente obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const precio = await precioMembreciaService.createPrecio(req.body);
      return successResponse(res, precio, 'Precio de membresía creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || 
                        error.message.includes('debe ser') || 
                        error.message.includes('no existe') ||
                        error.message.includes('anterior') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const precio = await precioMembreciaService.updatePrecio(id, req.body);
      return successResponse(res, precio, 'Precio de membresía actualizado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 
                        error.message.includes('debe ser') || 
                        error.message.includes('anterior') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await precioMembreciaService.deletePrecio(id);
      return successResponse(res, result, 'Precio de membresía eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new PrecioMembreciaController();

