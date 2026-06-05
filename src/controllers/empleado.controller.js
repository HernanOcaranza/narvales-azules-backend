import empleadoService from '../services/empleado.service.js';
import claseEmpleadoService from '../services/clase_empleado.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class EmpleadoController {
  async getAll(req, res) {
    try {
      const empleados = await empleadoService.getAllEmpleados();
      return successResponse(res, empleados, 'Empleados obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const empleado = await empleadoService.getEmpleadoById(id);
      // No devolver la contraseña en la respuesta
      const { contrasenia, ...empleadoSinPassword } = empleado.toJSON();
      return successResponse(res, empleadoSinPassword, 'Empleado obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const empleado = await empleadoService.createEmpleado(req.body);
      // No devolver la contraseña en la respuesta
      const { contrasenia, ...empleadoSinPassword } = empleado.toJSON();
      return successResponse(res, empleadoSinPassword, 'Empleado creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('ya existe') ? 409 : 
                        error.message.includes('obligatorio') || error.message.includes('exceder') || 
                        error.message.includes('debe tener') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const empleado = await empleadoService.updateEmpleado(id, req.body);
      // No devolver la contraseña en la respuesta
      const { contrasenia, ...empleadoSinPassword } = empleado.toJSON();
      return successResponse(res, empleadoSinPassword, 'Empleado actualizado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 
                        error.message.includes('ya existe') ? 409 :
                        error.message.includes('exceder') || error.message.includes('debe tener') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await empleadoService.deleteEmpleado(id);
      return successResponse(res, result, 'Empleado eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getClasesDeEmpleado(req, res) {
    try {
      const { id } = req.params;
      const filtros = {};
      if (req.query.fechaDesde) filtros.fechaDesde = req.query.fechaDesde;
      if (req.query.fechaHasta) filtros.fechaHasta = req.query.fechaHasta;
      const result = await claseEmpleadoService.getClasesByEmpleado(id, filtros);
      return successResponse(res, result, 'Clases del empleado obtenidas correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') || error.message.includes('inactivo') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new EmpleadoController();

