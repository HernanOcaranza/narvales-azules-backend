import tipoMembreciaRepository from '../repositories/tipo_membrecia.repository.js';
import precioMembreciaRepository from '../repositories/precio_membrecia.repository.js';
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

      // Crear el tipo de membresía
      const tipo = await tipoMembreciaRepository.create(data);

      // Si se proporciona precio, crear el registro de precio
      if (data.precio && data.precio > 0) {
        const precioData = {
          id_tipo_membrecia: tipo.id_tipo_membrecia,
          precio: data.precio,
          fecha_inicio_vigencia: data.fecha_inicio_vigencia || new Date().toISOString().split('T')[0],
          fecha_fin_vigencia: data.fecha_fin_vigencia || null,
          estado: 1
        };
        await precioMembreciaRepository.create(precioData);
      }

      return tipo;
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

      // Si se proporciona un nuevo precio, crear un nuevo registro de precio (histórico)
      if (data.precio && data.precio > 0) {
        // Obtener el precio actual
        const preciosActuales = await precioMembreciaRepository.findByTipoMembreciaId(id);
        const precioActual = preciosActuales.find(p => p.estado === 1);

        if (precioActual) {
          // Desactivar el precio actual
          await precioMembreciaRepository.update(precioActual.id_precio_membrecia, {
            estado: 0,
            fecha_fin_vigencia: new Date().toISOString().split('T')[0]
          });
        }

        // Crear el nuevo precio
        await precioMembreciaRepository.create({
          id_tipo_membrecia: id,
          precio: data.precio,
          fecha_inicio_vigencia: new Date().toISOString().split('T')[0],
          fecha_fin_vigencia: null,
          estado: 1
        });
      }

      // Actualizar solo los datos del tipo (sin el precio)
      const { precio, fecha_inicio_vigencia, fecha_fin_vigencia, ...tipoData } = data;
      const tipo = await tipoMembreciaRepository.update(id, tipoData);
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

