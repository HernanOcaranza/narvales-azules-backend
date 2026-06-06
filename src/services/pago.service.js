import db from '../models/index.js';
import pagoRepository from '../repositories/pago.repository.js';
import detallePagoRepository from '../repositories/detalle_pago.repository.js';
import membresiaRepository from '../repositories/membrecia.repository.js';

const { sequelize } = db;

class PagoService {
  async getAllPagos(options = {}) {
    try {
      const { page = 1, limit = 10, tipo, estado, fechaDesde, fechaHasta, observaciones, id_empleado, sinEmpleado } = options;
      const offset = (page - 1) * limit;
      return await pagoRepository.findAll({ limit, offset, tipo, estado, fechaDesde, fechaHasta, observaciones, id_empleado, sinEmpleado });
    } catch (error) {
      throw new Error(`Error al obtener pagos: ${error.message}`);
    }
  }

  async getPagoById(id) {
    try {
      const pago = await pagoRepository.findById(id);
      if (!pago) {
        throw new Error('Pago no encontrado');
      }
      return pago;
    } catch (error) {
      throw new Error(`Error al obtener pago: ${error.message}`);
    }
  }

  async getPagosByTipo(tipo) {
    try {
      if (tipo !== 'ingreso' && tipo !== 'egreso') {
        throw new Error('El tipo debe ser "ingreso" o "egreso"');
      }
      return await pagoRepository.findByTipo(tipo);
    } catch (error) {
      throw new Error(`Error al obtener pagos por tipo: ${error.message}`);
    }
  }

  async createPago(data) {
    try {
      // Validaciones de negocio
      if (!data.tipo || !data.fecha_pago || !data.estado) {
        throw new Error('Los campos tipo, fecha_pago y estado son obligatorios');
      }

      if (data.tipo !== 'ingreso' && data.tipo !== 'egreso') {
        throw new Error('El tipo debe ser "ingreso" o "egreso"');
      }

      // Para egreso, se necesita id_empleado (pago a profesor) o al menos observaciones (gasto general)
      if (data.tipo === 'egreso' && !data.id_empleado && !data.observaciones) {
        throw new Error('Los pagos de tipo egreso deben tener un empleado asociado o una descripción');
      }

      // Validar que si es ingreso, no debe tener id_empleado (se relaciona con membresía)
      if (data.tipo === 'ingreso' && data.id_empleado) {
        throw new Error('Los pagos de tipo ingreso no deben tener empleado asociado (se relacionan con membresía)');
      }

      // Validar longitud de observaciones
      if (data.observaciones && data.observaciones.length > 60) {
        throw new Error('El campo observaciones no puede exceder 60 caracteres');
      }

      return await pagoRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear pago: ${error.message}`);
    }
  }

  async updatePago(id, data) {
    try {
      // Validar tipo si se está actualizando
      if (data.tipo && data.tipo !== 'ingreso' && data.tipo !== 'egreso') {
        throw new Error('El tipo debe ser "ingreso" o "egreso"');
      }

      // Validar longitud de observaciones
      if (data.observaciones && data.observaciones.length > 60) {
        throw new Error('El campo observaciones no puede exceder 60 caracteres');
      }

      // Validar coherencia entre tipo y id_empleado
      const pagoActual = await pagoRepository.findById(id);
      if (!pagoActual) {
        throw new Error('Pago no encontrado');
      }

      const tipoFinal = data.tipo || pagoActual.tipo;
      
      // Para egreso, se necesita id_empleado (pago a profesor) o al menos observaciones (gasto general)
      const idEmpleadoFinal = data.id_empleado !== undefined ? data.id_empleado : pagoActual.id_empleado;
      const observacionesFinal = data.observaciones !== undefined ? data.observaciones : pagoActual.observaciones;
      if (tipoFinal === 'egreso' && !idEmpleadoFinal && !observacionesFinal) {
        throw new Error('Los pagos de tipo egreso deben tener un empleado asociado o una descripción');
      }

      // Validar que si es ingreso, no debe tener id_empleado (se relaciona con membresía)
      if (tipoFinal === 'ingreso' && idEmpleadoFinal) {
        throw new Error('Los pagos de tipo ingreso no deben tener empleado asociado (se relacionan con membresía)');
      }

      const pago = await pagoRepository.update(id, data);
      if (!pago) {
        throw new Error('Pago no encontrado');
      }
      return pago;
    } catch (error) {
      throw new Error(`Error al actualizar pago: ${error.message}`);
    }
  }

  async createEgresoConDetalle(data) {
    const { id_empleado, observaciones, fecha_pago, monto, metodo_pago, referencia_transferencia } = data;

    if (!fecha_pago) {
      throw new Error('El campo fecha_pago es obligatorio');
    }
    if (!id_empleado && !observaciones) {
      throw new Error('Los pagos de tipo egreso deben tener un empleado asociado o una descripción');
    }
    if (!monto || !metodo_pago) {
      throw new Error('Los campos monto y metodo_pago son obligatorios');
    }
    if (parseFloat(monto) <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    if (observaciones && observaciones.length > 60) {
      throw new Error('El campo observaciones no puede exceder 60 caracteres');
    }
    if (metodo_pago.length > 20) {
      throw new Error('El campo metodo_pago no puede exceder 20 caracteres');
    }

    const transaction = await sequelize.transaction();
    try {
      const pago = await pagoRepository.create({
        tipo: 'egreso',
        fecha_pago,
        estado: 'completo',
        observaciones: observaciones || null,
        id_empleado: id_empleado || null
      }, transaction);

      await detallePagoRepository.create({
        id_pago: pago.id_pago,
        metodo_pago,
        monto_parcial: parseFloat(monto),
        fecha_detalle: fecha_pago,
        referencia_transferencia: referencia_transferencia || null
      }, transaction);

      await transaction.commit();
      return await pagoRepository.findById(pago.id_pago);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deletePago(id) {
    try {
      // Verificar si tiene detalles de pago asociados
      const detalles = await detallePagoRepository.findByPagoId(id);
      if (detalles && detalles.length > 0) {
        throw new Error('No se puede eliminar un pago que tiene detalles asociados');
      }

      // Verificar si tiene membresía asociada
      const membresia = await membresiaRepository.findByPagoId(id);
      if (membresia) {
        throw new Error('No se puede eliminar un pago que está asociado a una membresía');
      }

      const deleted = await pagoRepository.delete(id);
      if (!deleted) {
        throw new Error('Pago no encontrado');
      }
      return { message: 'Pago eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar pago: ${error.message}`);
    }
  }
}

export default new PagoService();

