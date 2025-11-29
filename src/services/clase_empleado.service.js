import claseEmpleadoRepository from '../repositories/clase_empleado.repository.js';
import db from '../models/index.js';

const { Clase, Empleado } = db;

class ClaseEmpleadoService {
  async getAllClaseEmpleados() {
    try {
      return await claseEmpleadoRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener relaciones clase-empleado: ${error.message}`);
    }
  }

  async getClaseEmpleadoById(idClase, idEmpleado) {
    try {
      const claseEmpleado = await claseEmpleadoRepository.findById(idClase, idEmpleado);
      if (!claseEmpleado) {
        throw new Error('Relación clase-empleado no encontrada');
      }
      return claseEmpleado;
    } catch (error) {
      throw new Error(`Error al obtener relación clase-empleado: ${error.message}`);
    }
  }

  async getClaseEmpleadosByClase(idClase) {
    try {
      // Verificar que la clase existe
      const clase = await Clase.findByPk(idClase);
      if (!clase) {
        throw new Error('Clase no encontrada');
      }
      return await claseEmpleadoRepository.findByClase(idClase);
    } catch (error) {
      throw new Error(`Error al obtener relaciones por clase: ${error.message}`);
    }
  }

  async getClaseEmpleadosByEmpleado(idEmpleado) {
    try {
      // Verificar que el empleado existe
      const empleado = await Empleado.findByPk(idEmpleado);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }
      return await claseEmpleadoRepository.findByEmpleado(idEmpleado);
    } catch (error) {
      throw new Error(`Error al obtener relaciones por empleado: ${error.message}`);
    }
  }

  async createClaseEmpleado(data) {
    try {
      // Validaciones de negocio
      if (!data.id_clase || !data.id_empleado || !data.rol) {
        throw new Error('Los campos id_clase, id_empleado y rol son obligatorios');
      }

      // Validar longitud de rol
      if (data.rol.length > 20) {
        throw new Error('El campo rol no puede exceder 20 caracteres');
      }

      // Validar estado presente si se proporciona
      if (data.presente !== undefined && data.presente !== 0 && data.presente !== 1) {
        throw new Error('El campo presente debe ser 0 o 1');
      }

      // Verificar que la clase existe
      const clase = await Clase.findByPk(data.id_clase);
      if (!clase) {
        throw new Error('Clase no encontrada');
      }

      // Verificar que el empleado existe
      const empleado = await Empleado.findByPk(data.id_empleado);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }

      // Verificar si ya existe la relación
      const existing = await claseEmpleadoRepository.findById(data.id_clase, data.id_empleado);
      if (existing) {
        throw new Error('Ya existe una relación entre esta clase y este empleado');
      }

      return await claseEmpleadoRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear relación clase-empleado: ${error.message}`);
    }
  }

  async updateClaseEmpleado(idClase, idEmpleado, data) {
    try {
      // Validar longitud de rol si se proporciona
      if (data.rol && data.rol.length > 20) {
        throw new Error('El campo rol no puede exceder 20 caracteres');
      }

      // Validar estado presente si se proporciona
      if (data.presente !== undefined && data.presente !== 0 && data.presente !== 1) {
        throw new Error('El campo presente debe ser 0 o 1');
      }

      // No permitir actualizar las claves primarias
      if (data.id_clase || data.id_empleado) {
        throw new Error('No se pueden actualizar los campos id_clase e id_empleado');
      }

      const claseEmpleado = await claseEmpleadoRepository.update(idClase, idEmpleado, data);
      if (!claseEmpleado) {
        throw new Error('Relación clase-empleado no encontrada');
      }
      return claseEmpleado;
    } catch (error) {
      throw new Error(`Error al actualizar relación clase-empleado: ${error.message}`);
    }
  }

  async deleteClaseEmpleado(idClase, idEmpleado) {
    try {
      const deleted = await claseEmpleadoRepository.delete(idClase, idEmpleado);
      if (!deleted) {
        throw new Error('Relación clase-empleado no encontrada');
      }
      return { message: 'Relación clase-empleado eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar relación clase-empleado: ${error.message}`);
    }
  }
}

export default new ClaseEmpleadoService();

