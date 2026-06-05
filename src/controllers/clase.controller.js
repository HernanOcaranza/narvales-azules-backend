import claseService from '../services/clase.service.js';
import claseGeneratorService from '../services/clase-generator.service.js';
import claseEmpleadoService from '../services/clase_empleado.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class ClaseController {
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filters = {};
      if (req.query.idGrupo) filters.idGrupo = parseInt(req.query.idGrupo);
      if (req.query.idDisciplina) filters.idDisciplina = parseInt(req.query.idDisciplina);
      if (req.query.idCategoria) filters.idCategoria = parseInt(req.query.idCategoria);
      if (req.query.estado) filters.estado = req.query.estado;
      if (req.query.fechaDesde) filters.fechaDesde = req.query.fechaDesde;
      if (req.query.fechaHasta) filters.fechaHasta = req.query.fechaHasta;

      const result = await claseService.getAllClases({ page, limit, filters });
      return successResponse(res, {
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      }, 'Clases obtenidas correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const clase = await claseService.getClaseById(id);
      return successResponse(res, clase, 'Clase obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByGrupo(req, res) {
    try {
      const { idGrupo } = req.params;
      const clases = await claseService.getClasesByGrupo(idGrupo);
      return successResponse(res, clases, 'Clases obtenidas correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByFecha(req, res) {
    try {
      const { fecha } = req.query;
      if (!fecha) {
        return errorResponse(res, 'El parámetro fecha es obligatorio', 400);
      }
      const clases = await claseService.getClasesByFecha(fecha);
      return successResponse(res, clases, 'Clases obtenidas correctamente');
    } catch (error) {
      const statusCode = error.message.includes('formato') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getByFechaRange(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin) {
        return errorResponse(res, 'Los parámetros fechaInicio y fechaFin son obligatorios', 400);
      }
      const clases = await claseService.getClasesByFechaRange(fechaInicio, fechaFin);
      return successResponse(res, clases, 'Clases obtenidas correctamente');
    } catch (error) {
      const statusCode = error.message.includes('formato') || error.message.includes('mayor') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const clase = await claseService.createClase(req.body);
      return successResponse(res, clase, 'Clase creada correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') || error.message.includes('formato') || error.message.includes('mayor') || error.message.includes('no encontrado') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const clase = await claseService.updateClase(id, req.body);
      return successResponse(res, clase, 'Clase actualizada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 
                        error.message.includes('formato') || error.message.includes('mayor') || error.message.includes('no encontrado') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await claseService.deleteClase(id);
      return successResponse(res, result, 'Clase eliminada correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async generarTodas(req, res) {
    try {
      const { mes, anio } = req.query;
      
      let mesNum = null;
      let anioNum = null;
      
      // Validar parámetros si se proporcionan
      if (mes || anio) {
        if (!mes || !anio) {
          return errorResponse(res, 'Si se especifica mes o año, ambos parámetros son obligatorios', 400);
        }
        
        mesNum = parseInt(mes);
        anioNum = parseInt(anio);
        
        if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
          return errorResponse(res, 'El mes debe ser un número entre 1 y 12', 400);
        }
        
        if (isNaN(anioNum) || anioNum < 2000 || anioNum > 2100) {
          return errorResponse(res, 'El año debe ser un número válido entre 2000 y 2100', 400);
        }
      }
      
      // Generar clases para todos los grupos
      const resultado = await claseGeneratorService.generarClasesTodosLosGrupos(mesNum, anioNum);
      
      const mensaje = mesNum && anioNum
        ? `Clases generadas correctamente para ${mesNum}/${anioNum}. ${resultado.totalClasesCreadas} clases creadas para ${resultado.gruposProcesados} grupos.`
        : `Clases generadas correctamente para el mes actual. ${resultado.totalClasesCreadas} clases creadas para ${resultado.gruposProcesados} grupos.`;
      
      return successResponse(res, resultado, mensaje, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async actualizarEstados(req, res) {
    try {
      const resultado = await claseService.actualizarEstadosAutomaticamente();
      return successResponse(res, resultado, resultado.mensaje, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async registrarAsistenciaEmpleados(req, res) {
    try {
      const { idClase } = req.params;
      const empleados = req.body;
      const result = await claseEmpleadoService.registrarAsistenciaEmpleados(idClase, empleados);
      return successResponse(res, result, 'Asistencia registrada correctamente', 200);
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') || error.message.includes('eliminada') ? 404 :
        error.message.includes('obligatorio') || error.message.includes('duplicados') || error.message.includes('inactivo') || error.message.includes('debe ser') || error.message.includes('exceder') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async getAsistenciaEmpleados(req, res) {
    try {
      const { idClase } = req.params;
      const result = await claseEmpleadoService.getAsistenciaEmpleadosConDefaults(idClase);
      return successResponse(res, result, 'Asistencia obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new ClaseController();

