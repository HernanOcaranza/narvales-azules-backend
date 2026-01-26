import detallePagoRepository from '../repositories/detalle_pago.repository.js';
import pagoRepository from '../repositories/pago.repository.js';

class DetallePagoService {
  async getAllDetalles() {
    try {
      return await detallePagoRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener detalles de pago: ${error.message}`);
    }
  }

  async getDetalleById(id) {
    try {
      const detalle = await detallePagoRepository.findById(id);
      if (!detalle) {
        throw new Error('Detalle de pago no encontrado');
      }
      return detalle;
    } catch (error) {
      throw new Error(`Error al obtener detalle de pago: ${error.message}`);
    }
  }

  async getDetallesByPagoId(idPago) {
    try {
      // Verificar que el pago existe
      const pago = await pagoRepository.findById(idPago);
      if (!pago) {
        throw new Error('Pago no encontrado');
      }
      return await detallePagoRepository.findByPagoId(idPago);
    } catch (error) {
      throw new Error(`Error al obtener detalles de pago: ${error.message}`);
    }
  }

  async createDetalle(data) {
    try {
      // Validaciones de negocio
      if (!data.metodo_pago || !data.monto_parcial || !data.fecha_detalle || !data.id_pago) {
        throw new Error('Los campos metodo_pago, monto_parcial, fecha_detalle e id_pago son obligatorios');
      }

      // Validar que el pago existe
      const pago = await pagoRepository.findById(data.id_pago);
      if (!pago) {
        throw new Error('El pago especificado no existe');
      }

      // Validar monto
      if (data.monto_parcial <= 0) {
        throw new Error('El monto parcial debe ser mayor a 0');
      }

      // Validar longitud de campos
      if (data.metodo_pago.length > 20) {
        throw new Error('El campo metodo_pago no puede exceder 20 caracteres');
      }
      if (data.referencia_transferencia && data.referencia_transferencia.length > 50) {
        throw new Error('El campo referencia_transferencia no puede exceder 50 caracteres');
      }

      return await detallePagoRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear detalle de pago: ${error.message}`);
    }
  }

  async updateDetalle(id, data) {
    try {
      // Validar monto si se está actualizando
      if (data.monto_parcial !== undefined && data.monto_parcial <= 0) {
        throw new Error('El monto parcial debe ser mayor a 0');
      }

      // Validar longitud de campos
      if (data.metodo_pago && data.metodo_pago.length > 20) {
        throw new Error('El campo metodo_pago no puede exceder 20 caracteres');
      }
      if (data.referencia_transferencia && data.referencia_transferencia.length > 50) {
        throw new Error('El campo referencia_transferencia no puede exceder 50 caracteres');
      }

      const detalle = await detallePagoRepository.update(id, data);
      if (!detalle) {
        throw new Error('Detalle de pago no encontrado');
      }
      return detalle;
    } catch (error) {
      throw new Error(`Error al actualizar detalle de pago: ${error.message}`);
    }
  }

  async deleteDetalle(id) {
    try {
      const deleted = await detallePagoRepository.delete(id);
      if (!deleted) {
        throw new Error('Detalle de pago no encontrado');
      }
      return { message: 'Detalle de pago eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar detalle de pago: ${error.message}`);
    }
  }
}

export default new DetallePagoService();

