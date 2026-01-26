import claseEmpleadoService from '../services/clase_empleado.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class ClaseEmpleadoController {
  async getAll(req, res) {
    try {
      const claseEmpleados = await claseEmpleadoService.getAllClaseEmpleados();
      return successResponse(res, claseEmpleados, 'Relaciones clase-empleado obtenidas correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { idClase, idEmpleado } = req.params;
      const claseEmpleado = await claseEmpleadoService.getClaseEmpleadoById(idClase, idEmpleado);
      return successResponse(res, claseEmpleado, 'Relación clase-empleado obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByClase(req, res) {
    try {
      const { idClase } = req.params;
      const claseEmpleados = await claseEmpleadoService.getClaseEmpleadosByClase(idClase);
      return successResponse(res, claseEmpleados, 'Relaciones clase-empleado obtenidas correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') || error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByEmpleado(req, res) {
    try {
      const { idEmpleado } = req.params;
      const claseEmpleados = await claseEmpleadoService.getClaseEmpleadosByEmpleado(idEmpleado);
      return successResponse(res, claseEmpleados, 'Relaciones clase-empleado obtenidas correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const claseEmpleado = await claseEmpleadoService.createClaseEmpleado(req.body);
      return successResponse(res, claseEmpleado, 'Relación clase-empleado creada correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || error.message.includes('exceder') || error.message.includes('debe ser') || error.message.includes('no encontrada') || error.message.includes('no encontrado') || error.message.includes('Ya existe') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { idClase, idEmpleado } = req.params;
      const claseEmpleado = await claseEmpleadoService.updateClaseEmpleado(idClase, idEmpleado, req.body);
      return successResponse(res, claseEmpleado, 'Relación clase-empleado actualizada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 
                        error.message.includes('exceder') || error.message.includes('debe ser') || error.message.includes('No se pueden actualizar') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { idClase, idEmpleado } = req.params;
      const result = await claseEmpleadoService.deleteClaseEmpleado(idClase, idEmpleado);
      return successResponse(res, result, 'Relación clase-empleado eliminada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new ClaseEmpleadoController();

