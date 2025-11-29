import tutorRepository from '../repositories/tutor.repository.js';

class TutorService {
  async getAllTutores() {
    try {
      return await tutorRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener tutores: ${error.message}`);
    }
  }

  async getTutorById(id) {
    try {
      const tutor = await tutorRepository.findById(id);
      if (!tutor) {
        throw new Error('Tutor no encontrado');
      }
      return tutor;
    } catch (error) {
      throw new Error(`Error al obtener tutor: ${error.message}`);
    }
  }

  async searchTutoresByNombre(nombre) {
    try {
      if (!nombre || nombre.trim().length === 0) {
        throw new Error('El parámetro nombre es obligatorio');
      }
      return await tutorRepository.findByNombre(nombre.trim());
    } catch (error) {
      throw new Error(`Error al buscar tutores: ${error.message}`);
    }
  }

  async createTutor(data) {
    try {
      // Validaciones de negocio
      if (!data.nombre || !data.apellido) {
        throw new Error('Los campos nombre y apellido son obligatorios');
      }

      if (!data.fecha_registro) {
        throw new Error('El campo fecha_registro es obligatorio');
      }

      // Validar longitud de campos
      if (data.nombre.length > 50) {
        throw new Error('El campo nombre no puede exceder 50 caracteres');
      }
      if (data.apellido.length > 50) {
        throw new Error('El campo apellido no puede exceder 50 caracteres');
      }

      // Validar formato de teléfono si se proporciona
      if (data.telefono && data.telefono.length > 10) {
        throw new Error('El campo telefono no puede exceder 10 caracteres');
      }

      // Validar formato de DNI si se proporciona
      if (data.dni && data.dni.length > 8) {
        throw new Error('El campo dni no puede exceder 8 caracteres');
      }

      // Verificar si ya existe un tutor con el mismo DNI (si se proporciona)
      if (data.dni) {
        const existingTutor = await tutorRepository.findByDni(data.dni);
        if (existingTutor) {
          throw new Error('Ya existe un tutor con ese DNI');
        }
      }

      // Validar formato de fecha
      const fechaRegistro = new Date(data.fecha_registro);
      if (isNaN(fechaRegistro.getTime())) {
        throw new Error('El formato de fecha_registro no es válido');
      }

      return await tutorRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear tutor: ${error.message}`);
    }
  }

  async updateTutor(id, data) {
    try {
      // Validaciones de negocio
      if (data.nombre && data.nombre.length > 50) {
        throw new Error('El campo nombre no puede exceder 50 caracteres');
      }
      if (data.apellido && data.apellido.length > 50) {
        throw new Error('El campo apellido no puede exceder 50 caracteres');
      }
      if (data.telefono && data.telefono.length > 10) {
        throw new Error('El campo telefono no puede exceder 10 caracteres');
      }
      if (data.dni && data.dni.length > 8) {
        throw new Error('El campo dni no puede exceder 8 caracteres');
      }

      // Si se está actualizando el DNI, verificar que no exista otro tutor con ese DNI
      if (data.dni) {
        const existingTutor = await tutorRepository.findByDni(data.dni);
        if (existingTutor && existingTutor.id_tutor !== parseInt(id)) {
          throw new Error('Ya existe un tutor con ese DNI');
        }
      }

      // Validar formato de fecha si se proporciona
      if (data.fecha_registro) {
        const fechaRegistro = new Date(data.fecha_registro);
        if (isNaN(fechaRegistro.getTime())) {
          throw new Error('El formato de fecha_registro no es válido');
        }
      }

      const tutor = await tutorRepository.update(id, data);
      if (!tutor) {
        throw new Error('Tutor no encontrado');
      }
      return tutor;
    } catch (error) {
      throw new Error(`Error al actualizar tutor: ${error.message}`);
    }
  }

  async deleteTutor(id) {
    try {
      const deleted = await tutorRepository.delete(id);
      if (!deleted) {
        throw new Error('Tutor no encontrado');
      }
      return { message: 'Tutor eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar tutor: ${error.message}`);
    }
  }
}

export default new TutorService();

