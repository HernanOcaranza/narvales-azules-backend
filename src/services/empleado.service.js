import empleadoRepository from '../repositories/empleado.repository.js';
import bcrypt from 'bcrypt';

class EmpleadoService {
  async getAllEmpleados() {
    try {
      return await empleadoRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener empleados: ${error.message}`);
    }
  }

  async getEmpleadoById(id) {
    try {
      const empleado = await empleadoRepository.findById(id);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }
      return empleado;
    } catch (error) {
      throw new Error(`Error al obtener empleado: ${error.message}`);
    }
  }

  async createEmpleado(data) {
    try {
      // Validaciones de negocio
      if (!data.tipo || !data.usuario || !data.contrasenia || !data.nombre || 
          !data.apellido || !data.telefono || !data.fecha_alta) {
        throw new Error('Los campos tipo, usuario, contrasenia, nombre, apellido, telefono y fecha_alta son obligatorios');
      }

      // Validar longitudes
      if (data.usuario.length > 50) {
        throw new Error('El campo usuario no puede exceder 50 caracteres');
      }
      if (data.nombre.length > 50) {
        throw new Error('El campo nombre no puede exceder 50 caracteres');
      }
      if (data.apellido.length > 50) {
        throw new Error('El campo apellido no puede exceder 50 caracteres');
      }
      if (data.telefono && data.telefono.length !== 10) {
        throw new Error('El campo telefono debe tener 10 caracteres');
      }
      if (data.dni && data.dni.length !== 8) {
        throw new Error('El campo dni debe tener 8 caracteres');
      }

      // Verificar si ya existe un empleado con el mismo usuario
      const existingEmpleado = await empleadoRepository.findByUsuario(data.usuario);
      if (existingEmpleado) {
        throw new Error('Ya existe un empleado con ese usuario');
      }

      // Verificar si ya existe un empleado con el mismo DNI (si se proporciona)
      if (data.dni) {
        const existingDni = await empleadoRepository.findByDni(data.dni);
        if (existingDni) {
          throw new Error('Ya existe un empleado con ese DNI');
        }
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(data.contrasenia, 10);
      data.contrasenia = hashedPassword;

      return await empleadoRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear empleado: ${error.message}`);
    }
  }

  async updateEmpleado(id, data) {
    try {
      // Validaciones de longitud
      if (data.usuario && data.usuario.length > 50) {
        throw new Error('El campo usuario no puede exceder 50 caracteres');
      }
      if (data.nombre && data.nombre.length > 50) {
        throw new Error('El campo nombre no puede exceder 50 caracteres');
      }
      if (data.apellido && data.apellido.length > 50) {
        throw new Error('El campo apellido no puede exceder 50 caracteres');
      }
      if (data.telefono && data.telefono.length !== 10) {
        throw new Error('El campo telefono debe tener 10 caracteres');
      }
      if (data.dni && data.dni.length !== 8) {
        throw new Error('El campo dni debe tener 8 caracteres');
      }

      // Si se está actualizando el usuario, verificar que no exista otro con ese usuario
      if (data.usuario) {
        const existingEmpleado = await empleadoRepository.findByUsuario(data.usuario);
        if (existingEmpleado && existingEmpleado.id_empleado !== parseInt(id)) {
          throw new Error('Ya existe un empleado con ese usuario');
        }
      }

      // Si se está actualizando el DNI, verificar que no exista otro con ese DNI
      if (data.dni) {
        const existingDni = await empleadoRepository.findByDni(data.dni);
        if (existingDni && existingDni.id_empleado !== parseInt(id)) {
          throw new Error('Ya existe un empleado con ese DNI');
        }
      }

      // Si se está actualizando la contraseña, hashearla
      if (data.contrasenia) {
        data.contrasenia = await bcrypt.hash(data.contrasenia, 10);
      }

      const empleado = await empleadoRepository.update(id, data);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }
      return empleado;
    } catch (error) {
      throw new Error(`Error al actualizar empleado: ${error.message}`);
    }
  }

  async deleteEmpleado(id) {
    try {
      const deleted = await empleadoRepository.delete(id);
      if (!deleted) {
        throw new Error('Empleado no encontrado');
      }
      return { message: 'Empleado eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar empleado: ${error.message}`);
    }
  }
}

export default new EmpleadoService();

