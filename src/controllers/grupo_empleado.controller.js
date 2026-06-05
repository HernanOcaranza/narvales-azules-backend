import grupoEmpleadoService from '../services/grupo_empleado.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class GrupoEmpleadoController {
  async getAll(req, res) {
    try {
      const data = await grupoEmpleadoService.getAllGrupoEmpleados();
      return successResponse(res, data, 'Asignaciones obtenidas correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await grupoEmpleadoService.getGrupoEmpleadoById(id);
      return successResponse(res, data, 'Asignación obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByGrupo(req, res) {
    try {
      const { idGrupo } = req.params;
      const data = await grupoEmpleadoService.getEmpleadosByGrupo(idGrupo);
      return successResponse(res, data, 'Empleados del grupo obtenidos correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByEmpleado(req, res) {
    try {
      const { idEmpleado } = req.params;
      const data = await grupoEmpleadoService.getGruposByEmpleado(idEmpleado);
      return successResponse(res, data, 'Grupos del empleado obtenidos correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const data = await grupoEmpleadoService.createGrupoEmpleado(req.body);
      return successResponse(res, data, 'Asignación creada correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || error.message.includes('exceder') || error.message.includes('no encontrado') || error.message.includes('ya está asignado') || error.message.includes('inactivo') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await grupoEmpleadoService.updateGrupoEmpleado(id, req.body);
      return successResponse(res, data, 'Asignación actualizada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 :
        error.message.includes('exceder') || error.message.includes('No se pueden actualizar') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await grupoEmpleadoService.deleteGrupoEmpleado(id);
      return successResponse(res, result, 'Asignación eliminada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async asignarEmpleados(req, res) {
    try {
      const { idGrupo } = req.params;
      const { empleados } = req.body;
      const data = await grupoEmpleadoService.asignarEmpleadosAGrupo(idGrupo, empleados);
      return successResponse(res, data, 'Empleados asignados correctamente al grupo', 200);
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') || error.message.includes('obligatorio') || error.message.includes('duplicados') || error.message.includes('inactivo') || error.message.includes('exceder') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new GrupoEmpleadoController();
