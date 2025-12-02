import membresiaService from '../services/membrecia.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class MembreciaController {
  async getAll(req, res) {
    try {
      const membresias = await membresiaService.getAllMembresias();
      return successResponse(res, membresias, 'Membresías obtenidas correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const membresia = await membresiaService.getMembreciaById(id);
      return successResponse(res, membresia, 'Membresía obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') || 
                        error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByAlumnoId(req, res) {
    try {
      const { idAlumno } = req.params;
      const membresias = await membresiaService.getMembresiasByAlumnoId(idAlumno);
      return successResponse(res, membresias, 'Membresías del alumno obtenidas correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      // Si viene con datos de pago (sin id_pago), usar el método con transacciones
      // Si viene con id_pago, usar el método tradicional (compatibilidad hacia atrás)
      let membresia;
      if (req.body.pago && !req.body.id_pago) {
        membresia = await membresiaService.createMembreciaConPago(req.body);
      } else {
        membresia = await membresiaService.createMembrecia(req.body);
      }
      return successResponse(res, membresia, 'Membresía creada correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || 
                        error.message.includes('debe ser') || 
                        error.message.includes('no existe') ||
                        error.message.includes('anterior') ||
                        error.message.includes('debe ser uno de') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const membresia = await membresiaService.updateMembrecia(id, req.body);
      return successResponse(res, membresia, 'Membresía actualizada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') || 
                        error.message.includes('no encontrada') ? 404 : 
                        error.message.includes('debe ser') || 
                        error.message.includes('anterior') ||
                        error.message.includes('no existe') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await membresiaService.deleteMembrecia(id);
      return successResponse(res, result, 'Membresía eliminada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new MembreciaController();

