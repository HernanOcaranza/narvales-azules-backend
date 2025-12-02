import precioMembreciaRepository from '../repositories/precio_membrecia.repository.js';
import tipoMembreciaRepository from '../repositories/tipo_membrecia.repository.js';

class PrecioMembreciaService {
  async getAllPrecios() {
    try {
      return await precioMembreciaRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener precios de membresía: ${error.message}`);
    }
  }

  async getPrecioById(id) {
    try {
      const precio = await precioMembreciaRepository.findById(id);
      if (!precio) {
        throw new Error('Precio de membresía no encontrado');
      }
      return precio;
    } catch (error) {
      throw new Error(`Error al obtener precio de membresía: ${error.message}`);
    }
  }

  async getPreciosByTipoMembreciaId(idTipoMembrecia) {
    try {
      // Verificar que el tipo de membresía existe
      const tipo = await tipoMembreciaRepository.findById(idTipoMembrecia);
      if (!tipo) {
        throw new Error('Tipo de membresía no encontrado');
      }
      return await precioMembreciaRepository.findByTipoMembreciaId(idTipoMembrecia);
    } catch (error) {
      throw new Error(`Error al obtener precios de membresía: ${error.message}`);
    }
  }

  async getPrecioVigente(idTipoMembrecia, fecha) {
    try {
      // Verificar que el tipo de membresía existe
      const tipo = await tipoMembreciaRepository.findById(idTipoMembrecia);
      if (!tipo) {
        throw new Error('Tipo de membresía no encontrado');
      }
      return await precioMembreciaRepository.findPrecioVigente(idTipoMembrecia, fecha);
    } catch (error) {
      throw new Error(`Error al obtener precio vigente: ${error.message}`);
    }
  }

  async createPrecio(data) {
    try {
      // Validaciones de negocio
      if (!data.fecha_inicio_vigencia || !data.precio || !data.id_tipo_membrecia) {
        throw new Error('Los campos fecha_inicio_vigencia, precio e id_tipo_membrecia son obligatorios');
      }

      // Validar que el tipo de membresía existe
      const tipo = await tipoMembreciaRepository.findById(data.id_tipo_membrecia);
      if (!tipo) {
        throw new Error('El tipo de membresía especificado no existe');
      }

      // Validar precio
      if (data.precio <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      // Validar fechas
      if (data.fecha_fin_vigencia && data.fecha_fin_vigencia < data.fecha_inicio_vigencia) {
        throw new Error('La fecha de fin de vigencia no puede ser anterior a la fecha de inicio');
      }

      return await precioMembreciaRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear precio de membresía: ${error.message}`);
    }
  }

  async updatePrecio(id, data) {
    try {
      // Validar precio si se está actualizando
      if (data.precio !== undefined && data.precio <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      // Validar fechas si se están actualizando
      if (data.fecha_inicio_vigencia && data.fecha_fin_vigencia) {
        if (data.fecha_fin_vigencia < data.fecha_inicio_vigencia) {
          throw new Error('La fecha de fin de vigencia no puede ser anterior a la fecha de inicio');
        }
      }

      const precio = await precioMembreciaRepository.update(id, data);
      if (!precio) {
        throw new Error('Precio de membresía no encontrado');
      }
      return precio;
    } catch (error) {
      throw new Error(`Error al actualizar precio de membresía: ${error.message}`);
    }
  }

  async deletePrecio(id) {
    try {
      const deleted = await precioMembreciaRepository.delete(id);
      if (!deleted) {
        throw new Error('Precio de membresía no encontrado');
      }
      return { message: 'Precio de membresía eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar precio de membresía: ${error.message}`);
    }
  }
}

export default new PrecioMembreciaService();

