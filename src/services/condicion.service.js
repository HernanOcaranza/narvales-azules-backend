import condicionRepository from '../repositories/condicion.repository.js';

class CondicionService {
  async getAllCondiciones() {
    try {
      return await condicionRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener condiciones: ${error.message}`);
    }
  }

  async getCondicionById(id) {
    try {
      const condicion = await condicionRepository.findById(id);
      if (!condicion) {
        throw new Error('Condición no encontrada');
      }
      return condicion;
    } catch (error) {
      throw new Error(`Error al obtener condición: ${error.message}`);
    }
  }

  async createCondicion(data) {
    try {
      // Validaciones de negocio
      if (!data.condicion || data.atencion === undefined || data.atencion === null) {
        throw new Error('Los campos condicion y atencion son obligatorios');
      }

      // Verificar si ya existe una condición con el mismo nombre
      const existingCondicion = await condicionRepository.findByCondicion(data.condicion);
      if (existingCondicion) {
        throw new Error('Ya existe una condición con ese nombre');
      }

      // Validar longitud de campos
      if (data.condicion.length > 50) {
        throw new Error('El campo condicion no puede exceder 50 caracteres');
      }
      if (data.descripcion && data.descripcion.length > 100) {
        throw new Error('El campo descripcion no puede exceder 100 caracteres');
      }

      // Validar que atencion sea un número entero positivo
      if (!Number.isInteger(data.atencion) || data.atencion < 0) {
        throw new Error('El campo atencion debe ser un número entero positivo');
      }

      return await condicionRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear condición: ${error.message}`);
    }
  }

  async updateCondicion(id, data) {
    try {
      // Validaciones de negocio
      if (data.condicion && data.condicion.length > 50) {
        throw new Error('El campo condicion no puede exceder 50 caracteres');
      }
      if (data.descripcion && data.descripcion.length > 100) {
        throw new Error('El campo descripcion no puede exceder 100 caracteres');
      }

      // Validar que atencion sea un número entero positivo si se está actualizando
      if (data.atencion !== undefined && data.atencion !== null) {
        if (!Number.isInteger(data.atencion) || data.atencion < 0) {
          throw new Error('El campo atencion debe ser un número entero positivo');
        }
      }

      // Si se está actualizando el nombre, verificar que no exista otra condición con ese nombre
      if (data.condicion) {
        const existingCondicion = await condicionRepository.findByCondicion(data.condicion);
        if (existingCondicion && existingCondicion.id_condicion !== parseInt(id)) {
          throw new Error('Ya existe una condición con ese nombre');
        }
      }

      const condicion = await condicionRepository.update(id, data);
      if (!condicion) {
        throw new Error('Condición no encontrada');
      }
      return condicion;
    } catch (error) {
      throw new Error(`Error al actualizar condición: ${error.message}`);
    }
  }

  async deleteCondicion(id) {
    try {
      const deleted = await condicionRepository.delete(id);
      if (!deleted) {
        throw new Error('Condición no encontrada');
      }
      return { message: 'Condición eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar condición: ${error.message}`);
    }
  }
}

export default new CondicionService();

