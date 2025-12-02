import membresiaRepository from '../repositories/membrecia.repository.js';
import pagoRepository from '../repositories/pago.repository.js';
import detallePagoRepository from '../repositories/detalle_pago.repository.js';
import tipoMembreciaRepository from '../repositories/tipo_membrecia.repository.js';
import alumnoRepository from '../repositories/alumno.repository.js';
import grupoRepository from '../repositories/grupo.repository.js';
import { sequelize } from '../config/database.js';

class MembreciaService {
  async getAllMembresias() {
    try {
      return await membresiaRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener membresías: ${error.message}`);
    }
  }

  async getMembreciaById(id) {
    try {
      const membresia = await membresiaRepository.findById(id);
      if (!membresia) {
        throw new Error('Membresía no encontrada');
      }
      return membresia;
    } catch (error) {
      throw new Error(`Error al obtener membresía: ${error.message}`);
    }
  }

  async getMembresiasByAlumnoId(idAlumno) {
    try {
      // Verificar que el alumno existe
      const alumno = await alumnoRepository.findById(idAlumno);
      if (!alumno) {
        throw new Error('Alumno no encontrado');
      }
      return await membresiaRepository.findByAlumnoId(idAlumno);
    } catch (error) {
      throw new Error(`Error al obtener membresías del alumno: ${error.message}`);
    }
  }

  async createMembrecia(data) {
    try {
      // Validaciones de negocio
      if (!data.fecha_inicio || !data.estado || !data.id_alumno || 
          !data.id_pago || !data.id_tipo_membrecia || !data.id_grupo) {
        throw new Error('Los campos fecha_inicio, estado, id_alumno, id_pago, id_tipo_membrecia e id_grupo son obligatorios');
      }

      // Validar que el alumno existe
      const alumno = await alumnoRepository.findById(data.id_alumno);
      if (!alumno) {
        throw new Error('El alumno especificado no existe');
      }

      // Validar que el pago existe y es de tipo ingreso
      const pago = await pagoRepository.findById(data.id_pago);
      if (!pago) {
        throw new Error('El pago especificado no existe');
      }
      if (pago.tipo !== 'ingreso') {
        throw new Error('El pago debe ser de tipo ingreso para asociarlo a una membresía');
      }

      // Validar que el tipo de membresía existe
      const tipo = await tipoMembreciaRepository.findById(data.id_tipo_membrecia);
      if (!tipo) {
        throw new Error('El tipo de membresía especificado no existe');
      }

      // Validar que el grupo existe
      const grupo = await grupoRepository.findById(data.id_grupo);
      if (!grupo) {
        throw new Error('El grupo especificado no existe');
      }

      // Validar fechas
      if (data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
        throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
      }

      // Validar estado
      const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
      if (!estadosValidos.includes(data.estado.toLowerCase())) {
        throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
      }

      return await membresiaRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear membresía: ${error.message}`);
    }
  }

  async createMembreciaConPago(data) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validaciones básicas
      if (!data.fecha_inicio || !data.id_alumno || !data.id_tipo_membrecia || !data.id_grupo) {
        throw new Error('Los campos fecha_inicio, id_alumno, id_tipo_membrecia e id_grupo son obligatorios');
      }

      // Validar que el alumno existe
      const alumno = await alumnoRepository.findById(data.id_alumno);
      if (!alumno) {
        throw new Error('El alumno especificado no existe');
      }

      // Validar que el tipo de membresía existe
      const tipo = await tipoMembreciaRepository.findById(data.id_tipo_membrecia);
      if (!tipo) {
        throw new Error('El tipo de membresía especificado no existe');
      }

      // Validar que el grupo existe
      const grupo = await grupoRepository.findById(data.id_grupo);
      if (!grupo) {
        throw new Error('El grupo especificado no existe');
      }

      // Validar fechas
      if (data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
        throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
      }

      // Validar estado de membresía
      const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
      const estadoMembrecia = data.estado || 'activa';
      if (!estadosValidos.includes(estadoMembrecia.toLowerCase())) {
        throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
      }

      // Preparar datos del pago
      const fechaPago = data.pago?.fecha_pago || data.fecha_inicio;
      const estadoPago = data.pago?.estado || 'pendiente';
      const observacionesPago = data.pago?.observaciones || null;

      // Validar estado del pago
      const estadosPagoValidos = ['pendiente', 'parcial', 'completo', 'cancelado'];
      if (!estadosPagoValidos.includes(estadoPago.toLowerCase())) {
        throw new Error(`El estado del pago debe ser uno de: ${estadosPagoValidos.join(', ')}`);
      }

      // Crear el pago
      const pagoData = {
        tipo: 'ingreso',
        fecha_pago: fechaPago,
        estado: estadoPago,
        observaciones: observacionesPago,
        id_empleado: null // Los ingresos no tienen empleado asociado
      };

      const pago = await pagoRepository.create(pagoData, transaction);

      // Crear detalles de pago si se proporcionan
      const detallesPago = data.pago?.detalles || [];
      if (detallesPago.length > 0) {
        for (const detalle of detallesPago) {
          if (!detalle.metodo_pago || !detalle.monto_parcial || !detalle.fecha_detalle) {
            throw new Error('Los detalles de pago deben tener metodo_pago, monto_parcial y fecha_detalle');
          }

          const detalleData = {
            metodo_pago: detalle.metodo_pago,
            monto_parcial: detalle.monto_parcial,
            fecha_detalle: detalle.fecha_detalle,
            referencia_transferencia: detalle.referencia_transferencia || null,
            id_pago: pago.id_pago
          };

          await detallePagoRepository.create(detalleData, transaction);
        }
      }

      // Crear la membresía
      const membresiaData = {
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin || null,
        estado: estadoMembrecia,
        id_alumno: data.id_alumno,
        id_pago: pago.id_pago,
        id_tipo_membrecia: data.id_tipo_membrecia,
        id_grupo: data.id_grupo
      };

      const membresia = await membresiaRepository.create(membresiaData, transaction);

      // Commit de la transacción
      await transaction.commit();

      // Retornar la membresía con sus relaciones
      return await membresiaRepository.findById(membresia.id_membrecia);
    } catch (error) {
      // Rollback en caso de error
      await transaction.rollback();
      throw new Error(`Error al crear membresía con pago: ${error.message}`);
    }
  }

  async updateMembrecia(id, data) {
    try {
      // Validar fechas si se están actualizando
      if (data.fecha_inicio && data.fecha_fin) {
        if (data.fecha_fin < data.fecha_inicio) {
          throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
      }

      // Validar estado si se está actualizando
      if (data.estado) {
        const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
        if (!estadosValidos.includes(data.estado.toLowerCase())) {
          throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
        }
      }

      // Validar relaciones si se están actualizando
      if (data.id_pago) {
        const pago = await pagoRepository.findById(data.id_pago);
        if (!pago) {
          throw new Error('El pago especificado no existe');
        }
        if (pago.tipo !== 'ingreso') {
          throw new Error('El pago debe ser de tipo ingreso');
        }
      }

      if (data.id_tipo_membrecia) {
        const tipo = await tipoMembreciaRepository.findById(data.id_tipo_membrecia);
        if (!tipo) {
          throw new Error('El tipo de membresía especificado no existe');
        }
      }

      if (data.id_alumno) {
        const alumno = await alumnoRepository.findById(data.id_alumno);
        if (!alumno) {
          throw new Error('El alumno especificado no existe');
        }
      }

      if (data.id_grupo) {
        const grupo = await grupoRepository.findById(data.id_grupo);
        if (!grupo) {
          throw new Error('El grupo especificado no existe');
        }
      }

      const membresia = await membresiaRepository.update(id, data);
      if (!membresia) {
        throw new Error('Membresía no encontrada');
      }
      return membresia;
    } catch (error) {
      throw new Error(`Error al actualizar membresía: ${error.message}`);
    }
  }

  async deleteMembrecia(id) {
    try {
      const deleted = await membresiaRepository.delete(id);
      if (!deleted) {
        throw new Error('Membresía no encontrada');
      }
      return { message: 'Membresía eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar membresía: ${error.message}`);
    }
  }
}

export default new MembreciaService();

