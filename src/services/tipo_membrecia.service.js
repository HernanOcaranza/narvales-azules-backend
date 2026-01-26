import tipoMembreciaRepository from '../repositories/tipo_membrecia.repository.js';
import membresiaRepository from '../repositories/membrecia.repository.js';

class TipoMembreciaService {
  async getAllTipos() {
    try {
      return await tipoMembreciaRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener tipos de membresía: ${error.message}`);
    }
  }

  async getTipoById(id) {
    try {
      const tipo = await tipoMembreciaRepository.findById(id);
      if (!tipo) {
        throw new Error('Tipo de membresía no encontrado');
      }
      return tipo;
    } catch (error) {
      throw new Error(`Error al obtener tipo de membresía: ${error.message}`);
    }
  }

  async createTipo(data) {
    try {
      // Validaciones de negocio
      if (!data.tipo_membrecia) {
        throw new Error('El campo tipo_membrecia es obligatorio');
      }

      // Validar longitud
      if (data.tipo_membrecia.length > 20) {
        throw new Error('El campo tipo_membrecia no puede exceder 20 caracteres');
      }

      // Validar frecuencia_semanal si se proporciona
      if (data.frecuencia_semanal !== undefined && data.frecuencia_semanal !== null) {
        if (data.frecuencia_semanal < 0) {
          throw new Error('La frecuencia semanal no puede ser negativa');
        }
      }

      return await tipoMembreciaRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear tipo de membresía: ${error.message}`);
    }
  }

  async updateTipo(id, data) {
    try {
      // Validar longitud
      if (data.tipo_membrecia && data.tipo_membrecia.length > 20) {
        throw new Error('El campo tipo_membrecia no puede exceder 20 caracteres');
      }

      // Validar frecuencia_semanal si se está actualizando
      if (data.frecuencia_semanal !== undefined && data.frecuencia_semanal !== null) {
        if (data.frecuencia_semanal < 0) {
          throw new Error('La frecuencia semanal no puede ser negativa');
        }
      }

      const tipo = await tipoMembreciaRepository.update(id, data);
      if (!tipo) {
        throw new Error('Tipo de membresía no encontrado');
      }
      return tipo;
    } catch (error) {
      throw new Error(`Error al actualizar tipo de membresía: ${error.message}`);
    }
  }

  async deleteTipo(id) {
    try {
      // Verificar si hay membresías asociadas
      const membresias = await membresiaRepository.findAll();
      const membresiasConTipo = membresias.filter(m => m.id_tipo_membrecia === parseInt(id));
      if (membresiasConTipo.length > 0) {
        throw new Error('No se puede eliminar un tipo de membresía que tiene membresías asociadas');
      }

      const deleted = await tipoMembreciaRepository.delete(id);
      if (!deleted) {
        throw new Error('Tipo de membresía no encontrado');
      }
      return { message: 'Tipo de membresía eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar tipo de membresía: ${error.message}`);
    }
  }
}

export default new TipoMembreciaService();

