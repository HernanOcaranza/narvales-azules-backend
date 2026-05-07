import claseRepository from '../repositories/clase.repository.js';
import db from '../models/index.js';

const { Grupo } = db;

class ClaseService {
  async getAllClases(options = {}) {
    try {
      const { page = 1, limit = 10, filters = {} } = options;
      const offset = (page - 1) * limit;
      return await claseRepository.findAll({ limit, offset, filters });
    } catch (error) {
      throw new Error(`Error al obtener clases: ${error.message}`);
    }
  }

  async getClaseById(id) {
    try {
      const clase = await claseRepository.findById(id);
      if (!clase) {
        throw new Error('Clase no encontrada');
      }
      return clase;
    } catch (error) {
      throw new Error(`Error al obtener clase: ${error.message}`);
    }
  }

  async getClasesByGrupo(idGrupo) {
    try {
      // Verificar que el grupo existe
      const grupo = await Grupo.findByPk(idGrupo);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }
      return await claseRepository.findByGrupo(idGrupo);
    } catch (error) {
      throw new Error(`Error al obtener clases por grupo: ${error.message}`);
    }
  }

  async getClasesByFecha(fecha) {
    try {
      // Validar formato de fecha
      const fechaClase = new Date(fecha);
      if (isNaN(fechaClase.getTime())) {
        throw new Error('El formato de fecha no es válido');
      }
      return await claseRepository.findByFecha(fecha);
    } catch (error) {
      throw new Error(`Error al obtener clases por fecha: ${error.message}`);
    }
  }

  async getClasesByFechaRange(fechaInicio, fechaFin) {
    try {
      // Validar formato de fechas
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);
      
      if (isNaN(fechaInicioDate.getTime())) {
        throw new Error('El formato de fecha_inicio no es válido');
      }
      if (isNaN(fechaFinDate.getTime())) {
        throw new Error('El formato de fecha_fin no es válido');
      }
      if (fechaInicioDate > fechaFinDate) {
        throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin');
      }
      
      return await claseRepository.findByFechaRange(fechaInicio, fechaFin);
    } catch (error) {
      throw new Error(`Error al obtener clases por rango de fechas: ${error.message}`);
    }
  }

  async createClase(data) {
    try {
      // Validaciones de negocio
      if (!data.fecha_clase || !data.hora_inicio || !data.hora_fin || !data.id_grupo) {
        throw new Error('Los campos fecha_clase, hora_inicio, hora_fin e id_grupo son obligatorios');
      }

      // Validar formato de fecha
      const fechaClase = new Date(data.fecha_clase);
      if (isNaN(fechaClase.getTime())) {
        throw new Error('El formato de fecha_clase no es válido');
      }

      // Validar formato de horas
      const horaInicioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
      const horaInicioSimpleRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      
      if (!horaInicioRegex.test(data.hora_inicio) && !horaInicioSimpleRegex.test(data.hora_inicio)) {
        throw new Error('El formato de hora_inicio no es válido (formato esperado: HH:MM o HH:MM:SS)');
      }
      
      if (!horaInicioRegex.test(data.hora_fin) && !horaInicioSimpleRegex.test(data.hora_fin)) {
        throw new Error('El formato de hora_fin no es válido (formato esperado: HH:MM o HH:MM:SS)');
      }

      // Validar que hora_fin sea mayor a hora_inicio
      const horaInicio = data.hora_inicio.split(':').map(Number);
      const horaFin = data.hora_fin.split(':').map(Number);
      const minutosInicio = horaInicio[0] * 60 + horaInicio[1];
      const minutosFin = horaFin[0] * 60 + horaFin[1];
      
      if (minutosFin <= minutosInicio) {
        throw new Error('La hora de fin debe ser mayor a la hora de inicio');
      }

      // Verificar que el grupo existe
      const grupo = await Grupo.findByPk(data.id_grupo);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }

      // Validar estado si se proporciona
      if (data.estado !== undefined) {
        const estadosValidos = ['pendiente', 'realizada', 'suspendida'];
        if (!estadosValidos.includes(data.estado)) {
          throw new Error('El campo estado debe ser uno de: pendiente, realizada, suspendida');
        }
      }

      return await claseRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear clase: ${error.message}`);
    }
  }

  async updateClase(id, data) {
    try {
      // Validar formato de fecha si se proporciona
      if (data.fecha_clase) {
        const fechaClase = new Date(data.fecha_clase);
        if (isNaN(fechaClase.getTime())) {
          throw new Error('El formato de fecha_clase no es válido');
        }
      }

      // Validar formato de horas si se proporcionan
      const horaInicioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
      const horaInicioSimpleRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

      if (data.hora_inicio) {
        if (!horaInicioRegex.test(data.hora_inicio) && !horaInicioSimpleRegex.test(data.hora_inicio)) {
          throw new Error('El formato de hora_inicio no es válido (formato esperado: HH:MM o HH:MM:SS)');
        }
      }

      if (data.hora_fin) {
        if (!horaInicioRegex.test(data.hora_fin) && !horaInicioSimpleRegex.test(data.hora_fin)) {
          throw new Error('El formato de hora_fin no es válido (formato esperado: HH:MM o HH:MM:SS)');
        }
      }

      // Validar que hora_fin sea mayor a hora_inicio si ambas se actualizan
      if (data.hora_inicio && data.hora_fin) {
        const horaInicio = data.hora_inicio.split(':').map(Number);
        const horaFin = data.hora_fin.split(':').map(Number);
        const minutosInicio = horaInicio[0] * 60 + horaInicio[1];
        const minutosFin = horaFin[0] * 60 + horaFin[1];
        
        if (minutosFin <= minutosInicio) {
          throw new Error('La hora de fin debe ser mayor a la hora de inicio');
        }
      } else if (data.hora_inicio || data.hora_fin) {
        // Si solo se actualiza una hora, obtener la clase actual para comparar
        const claseActual = await claseRepository.findById(id);
        if (claseActual) {
          const horaInicio = data.hora_inicio ? data.hora_inicio.split(':').map(Number) : claseActual.hora_inicio.split(':').map(Number);
          const horaFin = data.hora_fin ? data.hora_fin.split(':').map(Number) : claseActual.hora_fin.split(':').map(Number);
          const minutosInicio = horaInicio[0] * 60 + horaInicio[1];
          const minutosFin = horaFin[0] * 60 + horaFin[1];
          
          if (minutosFin <= minutosInicio) {
            throw new Error('La hora de fin debe ser mayor a la hora de inicio');
          }
        }
      }

      // Si se está actualizando el grupo, verificar que existe
      if (data.id_grupo) {
        const grupo = await Grupo.findByPk(data.id_grupo);
        if (!grupo) {
          throw new Error('Grupo no encontrado');
        }
      }

      // Validar estado si se proporciona
      if (data.estado !== undefined) {
        const estadosValidos = ['pendiente', 'realizada', 'suspendida'];
        if (!estadosValidos.includes(data.estado)) {
          throw new Error('El campo estado debe ser uno de: pendiente, realizada, suspendida');
        }
      }

      const clase = await claseRepository.update(id, data);
      if (!clase) {
        throw new Error('Clase no encontrada');
      }
      return clase;
    } catch (error) {
      throw new Error(`Error al actualizar clase: ${error.message}`);
    }
  }

  async deleteClase(id) {
    try {
      const deleted = await claseRepository.delete(id);
      if (!deleted) {
        throw new Error('Clase no encontrada');
      }
      return { message: 'Clase eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar clase: ${error.message}`);
    }
  }

  /**
   * Actualiza automáticamente el estado de las clases pendientes que ya terminaron
   * Cambia su estado a "realizada" si la fecha y hora de fin ya pasó
   * No actualiza clases que estén suspendidas
   */
  async actualizarEstadosAutomaticamente() {
    try {
      const clasesFinalizadas = await claseRepository.findClasesPendientesFinalizadas();
      
      if (clasesFinalizadas.length === 0) {
        return {
          clasesActualizadas: 0,
          mensaje: 'No hay clases pendientes que hayan finalizado'
        };
      }

      // Filtrar solo las que no están suspendidas (aunque el query ya filtra por pendiente)
      // Por seguridad, verificamos que el estado sea pendiente
      const idsParaActualizar = clasesFinalizadas
        .filter(clase => clase.estado === 'pendiente')
        .map(clase => clase.id_clase);

      if (idsParaActualizar.length === 0) {
        return {
          clasesActualizadas: 0,
          mensaje: 'No hay clases pendientes para actualizar'
        };
      }

      // Actualizar todas las clases a estado "realizada"
      const [numActualizadas] = await claseRepository.updateEstadoMasivo(idsParaActualizar, 'realizada');

      return {
        clasesActualizadas: numActualizadas,
        mensaje: `${numActualizadas} clase(s) actualizada(s) a estado "realizada"`
      };
    } catch (error) {
      throw new Error(`Error al actualizar estados automáticamente: ${error.message}`);
    }
  }
}

export default new ClaseService();

