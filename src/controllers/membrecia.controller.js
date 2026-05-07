import membresiaService from '../services/membrecia.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class MembreciaController {
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // Extraer filtros de los query parameters
      const filtros = {
        page,
        limit,
        idAlumno: req.query.idAlumno,
        estado: req.query.estado,
        idTipoMembrecia: req.query.idTipoMembrecia,
        idGrupo: req.query.idGrupo,
        fechaDesde: req.query.fechaDesde,
        fechaHasta: req.query.fechaHasta
      };

      const result = await membresiaService.getAllMembresias(filtros);
      return successResponse(res, {
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      }, 'Membresías obtenidas correctamente');
    } catch (error) {
      // Determinar código de estado según el tipo de error
      const statusCode = error.message.includes('debe ser') || 
                        error.message.includes('formato') ||
                        error.message.includes('mayor que') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
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
      // Si viene con id_pago, usar el método tradicional (compatibilidad hacia atrás)
      // Si no viene con id_pago, usar el método con transacciones (crea pago automáticamente)
      let membresia;
      if (req.body.id_pago) {
        membresia = await membresiaService.createMembrecia(req.body);
      } else {
        // Si no viene objeto pago, crear uno vacío automáticamente
        const dataConPago = {
          ...req.body,
          pago: req.body.pago || {
            estado: 'pendiente',
            fecha_pago: req.body.fecha_inicio || new Date().toISOString().split('T')[0],
            detalles: []
          }
        };
        membresia = await membresiaService.createMembreciaConPago(dataConPago);
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

  async getCompletoById(req, res) {
    try {
      const { id } = req.params;
      const membresia = await membresiaService.getMembreciaCompletaById(id);
      return successResponse(res, membresia, 'Información completa de la membresía obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new MembreciaController();

