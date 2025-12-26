import alumnoRepository from '../repositories/alumno.repository.js';
import db from '../models/index.js';

const { Tutor, Categoria, Condicion } = db;

class AlumnoService {
  async getAllAlumnos() {
    try {
      return await alumnoRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener alumnos: ${error.message}`);
    }
  }

  async getAlumnoById(id) {
    try {
      const alumno = await alumnoRepository.findById(id);
      if (!alumno) {
        throw new Error('Alumno no encontrado');
      }
      return alumno;
    } catch (error) {
      throw new Error(`Error al obtener alumno: ${error.message}`);
    }
  }

  async getAlumnosByTutor(idTutor) {
    try {
      // Verificar que el tutor existe
      const tutor = await Tutor.findByPk(idTutor);
      if (!tutor) {
        throw new Error('Tutor no encontrado');
      }
      return await alumnoRepository.findByTutor(idTutor);
    } catch (error) {
      throw new Error(`Error al obtener alumnos por tutor: ${error.message}`);
    }
  }

  async searchAlumnosByNombre(nombre) {
    try {
      if (!nombre || nombre.trim().length === 0) {
        throw new Error('El parámetro nombre es obligatorio');
      }
      return await alumnoRepository.findByNombre(nombre.trim());
    } catch (error) {
      throw new Error(`Error al buscar alumnos: ${error.message}`);
    }
  }

  async createAlumno(data) {
    try {
      // Validaciones de negocio
      if (!data.nombre || !data.apellido || !data.fecha_registro) {
        throw new Error('Los campos nombre, apellido y fecha_registro son obligatorios');
      }

      if (!data.id_tutor || !data.id_categoria || !data.id_condicion) {
        throw new Error('Los campos id_tutor, id_categoria e id_condicion son obligatorios');
      }

      // Validar longitudes
      if (data.nombre.length > 50) {
        throw new Error('El campo nombre no puede exceder 50 caracteres');
      }
      if (data.apellido.length > 50) {
        throw new Error('El campo apellido no puede exceder 50 caracteres');
      }
      if (data.direccion && data.direccion.length > 80) {
        throw new Error('El campo direccion no puede exceder 80 caracteres');
      }

      // Validar formato de teléfono si se proporciona
      if (data.dni && data.dni.length > 8) {
        throw new Error('El campo dni no puede exceder 8 caracteres');
      }

      // Verificar que el tutor existe
      const tutor = await Tutor.findByPk(data.id_tutor);
      if (!tutor) {
        throw new Error('Tutor no encontrado');
      }

      // Verificar que la categoría existe
      const categoria = await Categoria.findByPk(data.id_categoria);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }

      // Verificar que la condición existe
      const condicion = await Condicion.findByPk(data.id_condicion);
      if (!condicion) {
        throw new Error('Condición no encontrada');
      }

      // Verificar si ya existe un alumno con el mismo DNI (si se proporciona)
      if (data.dni) {
        const existingAlumno = await alumnoRepository.findByDni(data.dni);
        if (existingAlumno) {
          throw new Error('Ya existe un alumno con ese DNI');
        }
      }

      // Validar formato de fechas
      const fechaRegistro = new Date(data.fecha_registro);
      if (isNaN(fechaRegistro.getTime())) {
        throw new Error('El formato de fecha_registro no es válido');
      }

      if (data.fecha_nacimiento) {
        const fechaNacimiento = new Date(data.fecha_nacimiento);
        if (isNaN(fechaNacimiento.getTime())) {
          throw new Error('El formato de fecha_nacimiento no es válido');
        }
        // Validar que la fecha de nacimiento no sea mayor a la fecha de registro
        if (fechaNacimiento > fechaRegistro) {
          throw new Error('La fecha de nacimiento no puede ser mayor a la fecha de registro');
        }
      }

      // Validar estado si se proporciona
      if (data.estado !== undefined && data.estado !== 0 && data.estado !== 1) {
        throw new Error('El campo estado debe ser 0 o 1');
      }

      // Validar certificado si se proporciona
      if (data.certificado !== undefined && data.certificado !== 0 && data.certificado !== 1) {
        throw new Error('El campo certificado debe ser 0 o 1');
      }

      return await alumnoRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear alumno: ${error.message}`);
    }
  }

  async updateAlumno(id, data) {
    try {
      // Validaciones de longitud
      if (data.nombre && data.nombre.length > 50) {
        throw new Error('El campo nombre no puede exceder 50 caracteres');
      }
      if (data.apellido && data.apellido.length > 50) {
        throw new Error('El campo apellido no puede exceder 50 caracteres');
      }
      if (data.direccion && data.direccion.length > 80) {
        throw new Error('El campo direccion no puede exceder 80 caracteres');
      }
      if (data.dni && data.dni.length > 8) {
        throw new Error('El campo dni no puede exceder 8 caracteres');
      }

      // Si se está actualizando el tutor, verificar que existe
      if (data.id_tutor) {
        const tutor = await Tutor.findByPk(data.id_tutor);
        if (!tutor) {
          throw new Error('Tutor no encontrado');
        }
      }

      // Si se está actualizando la categoría, verificar que existe
      if (data.id_categoria) {
        const categoria = await Categoria.findByPk(data.id_categoria);
        if (!categoria) {
          throw new Error('Categoría no encontrada');
        }
      }

      // Si se está actualizando la condición, verificar que existe
      if (data.id_condicion) {
        const condicion = await Condicion.findByPk(data.id_condicion);
        if (!condicion) {
          throw new Error('Condición no encontrada');
        }
      }

      // Si se está actualizando el DNI, verificar que no exista otro alumno con ese DNI
      if (data.dni) {
        const existingAlumno = await alumnoRepository.findByDni(data.dni);
        if (existingAlumno && existingAlumno.id_alumno !== parseInt(id)) {
          throw new Error('Ya existe un alumno con ese DNI');
        }
      }

      // Validar formato de fechas si se proporcionan
      if (data.fecha_registro) {
        const fechaRegistro = new Date(data.fecha_registro);
        if (isNaN(fechaRegistro.getTime())) {
          throw new Error('El formato de fecha_registro no es válido');
        }
      }

      if (data.fecha_nacimiento) {
        const fechaNacimiento = new Date(data.fecha_nacimiento);
        if (isNaN(fechaNacimiento.getTime())) {
          throw new Error('El formato de fecha_nacimiento no es válido');
        }
        // Si también se actualiza fecha_registro, validar relación
        if (data.fecha_registro) {
          const fechaRegistro = new Date(data.fecha_registro);
          if (fechaNacimiento > fechaRegistro) {
            throw new Error('La fecha de nacimiento no puede ser mayor a la fecha de registro');
          }
        } else {
          // Obtener el alumno actual para comparar con fecha_registro existente
          const alumnoActual = await alumnoRepository.findById(id);
          if (alumnoActual && fechaNacimiento > new Date(alumnoActual.fecha_registro)) {
            throw new Error('La fecha de nacimiento no puede ser mayor a la fecha de registro');
          }
        }
      }

      // Validar estado si se proporciona
      if (data.estado !== undefined && data.estado !== 0 && data.estado !== 1) {
        throw new Error('El campo estado debe ser 0 o 1');
      }

      // Validar certificado si se proporciona
      if (data.certificado !== undefined && data.certificado !== 0 && data.certificado !== 1) {
        throw new Error('El campo certificado debe ser 0 o 1');
      }

      const alumno = await alumnoRepository.update(id, data);
      if (!alumno) {
        throw new Error('Alumno no encontrado');
      }
      return alumno;
    } catch (error) {
      throw new Error(`Error al actualizar alumno: ${error.message}`);
    }
  }

  async deleteAlumno(id) {
    try {
      const deleted = await alumnoRepository.delete(id);
      if (!deleted) {
        throw new Error('Alumno no encontrado');
      }
      return { message: 'Alumno eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar alumno: ${error.message}`);
    }
  }
}

export default new AlumnoService();

