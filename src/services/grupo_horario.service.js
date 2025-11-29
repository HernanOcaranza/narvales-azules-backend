import grupoHorarioRepository from '../repositories/grupo_horario.repository.js';
import db from '../models/index.js';

const { Grupo } = db;

class GrupoHorarioService {
  async getAllHorarios() {
    try {
      return await grupoHorarioRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener horarios: ${error.message}`);
    }
  }

  async getHorarioById(id) {
    try {
      const horario = await grupoHorarioRepository.findById(id);
      if (!horario) {
        throw new Error('Horario no encontrado');
      }
      return horario;
    } catch (error) {
      throw new Error(`Error al obtener horario: ${error.message}`);
    }
  }

  async getHorariosByGrupo(idGrupo) {
    try {
      // Verificar que el grupo existe
      const grupo = await Grupo.findByPk(idGrupo);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }
      return await grupoHorarioRepository.findByGrupo(idGrupo);
    } catch (error) {
      throw new Error(`Error al obtener horarios por grupo: ${error.message}`);
    }
  }

  async createHorario(data) {
    try {
      // Validaciones
      if (!data.id_grupo || data.dia_semana === undefined || !data.hora_inicio || !data.hora_fin) {
        throw new Error('Los campos id_grupo, dia_semana, hora_inicio y hora_fin son obligatorios');
      }

      // Validar día de la semana
      if (data.dia_semana < 0 || data.dia_semana > 6) {
        throw new Error('El día de la semana debe estar entre 0 (Domingo) y 6 (Sábado)');
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

      return await grupoHorarioRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear horario: ${error.message}`);
    }
  }

  async createManyHorarios(horarios) {
    try {
      if (!Array.isArray(horarios) || horarios.length === 0) {
        throw new Error('Se debe proporcionar un array de horarios');
      }

      // Validar cada horario
      for (const horario of horarios) {
        if (!horario.id_grupo || horario.dia_semana === undefined || !horario.hora_inicio || !horario.hora_fin) {
          throw new Error('Cada horario debe tener id_grupo, dia_semana, hora_inicio y hora_fin');
        }

        if (horario.dia_semana < 0 || horario.dia_semana > 6) {
          throw new Error(`El día de la semana debe estar entre 0 y 6. Horario inválido: ${JSON.stringify(horario)}`);
        }

        // Validar formato de horas
        const horaInicioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        const horaInicioSimpleRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        
        if (!horaInicioRegex.test(horario.hora_inicio) && !horaInicioSimpleRegex.test(horario.hora_inicio)) {
          throw new Error(`Formato de hora_inicio inválido en horario: ${JSON.stringify(horario)}`);
        }
        
        if (!horaInicioRegex.test(horario.hora_fin) && !horaInicioSimpleRegex.test(horario.hora_fin)) {
          throw new Error(`Formato de hora_fin inválido en horario: ${JSON.stringify(horario)}`);
        }

        // Validar que hora_fin sea mayor a hora_inicio
        const horaInicio = horario.hora_inicio.split(':').map(Number);
        const horaFin = horario.hora_fin.split(':').map(Number);
        const minutosInicio = horaInicio[0] * 60 + horaInicio[1];
        const minutosFin = horaFin[0] * 60 + horaFin[1];
        
        if (minutosFin <= minutosInicio) {
          throw new Error(`La hora de fin debe ser mayor a la hora de inicio en horario: ${JSON.stringify(horario)}`);
        }
      }

      return await grupoHorarioRepository.createMany(horarios);
    } catch (error) {
      throw new Error(`Error al crear horarios: ${error.message}`);
    }
  }

  async updateHorario(id, data) {
    try {
      // Validar día de la semana si se proporciona
      if (data.dia_semana !== undefined && (data.dia_semana < 0 || data.dia_semana > 6)) {
        throw new Error('El día de la semana debe estar entre 0 (Domingo) y 6 (Sábado)');
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
      }

      const horario = await grupoHorarioRepository.update(id, data);
      if (!horario) {
        throw new Error('Horario no encontrado');
      }
      return horario;
    } catch (error) {
      throw new Error(`Error al actualizar horario: ${error.message}`);
    }
  }

  async deleteHorario(id) {
    try {
      const deleted = await grupoHorarioRepository.delete(id);
      if (!deleted) {
        throw new Error('Horario no encontrado');
      }
      return { message: 'Horario eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar horario: ${error.message}`);
    }
  }
}

export default new GrupoHorarioService();

