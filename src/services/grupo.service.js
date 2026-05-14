import grupoRepository from '../repositories/grupo.repository.js';
import grupoHorarioService from './grupo_horario.service.js';
import claseGeneratorService from './clase-generator.service.js';
import db from '../models/index.js';

const { Disciplina, Categoria } = db;

class GrupoService {
  async getAllGrupos(options = {}) {
    try {
      const { page = 1, limit = 10, filters = {} } = options;
      const offset = (page - 1) * limit;
      return await grupoRepository.findAll({ limit, offset, filters });
    } catch (error) {
      throw new Error(`Error al obtener grupos: ${error.message}`);
    }
  }

  async getGrupoById(id) {
    try {
      const grupo = await grupoRepository.findById(id);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }
      return grupo;
    } catch (error) {
      throw new Error(`Error al obtener grupo: ${error.message}`);
    }
  }

  async getGruposByDisciplina(id_disciplina) {
    try {
      // Verificar que la disciplina existe
      const disciplina = await Disciplina.findByPk(id_disciplina);
      if (!disciplina) {
        throw new Error('Disciplina no encontrada');
      }
      return await grupoRepository.findByDisciplina(id_disciplina);
    } catch (error) {
      throw new Error(`Error al obtener grupos por disciplina: ${error.message}`);
    }
  }

  async getGruposByCategoria(id_categoria) {
    try {
      // Verificar que la categoría existe
      const categoria = await Categoria.findByPk(id_categoria);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
      return await grupoRepository.findByCategoria(id_categoria);
    } catch (error) {
      throw new Error(`Error al obtener grupos por categoría: ${error.message}`);
    }
  }

  async createGrupo(data) {
    try {
      // Validaciones de negocio
      if (!data.nombre || !data.cupo_maximo || !data.id_disciplina || !data.id_categoria) {
        throw new Error('Los campos nombre, cupo_maximo, id_disciplina e id_categoria son obligatorios');
      }

      // Validar longitudes
      if (data.nombre.length > 40) {
        throw new Error('El campo nombre no puede exceder 40 caracteres');
      }

      // Validar cupo máximo
      if (data.cupo_maximo <= 0) {
        throw new Error('El cupo máximo debe ser mayor a cero');
      }

      // Verificar que la disciplina existe
      const disciplina = await Disciplina.findByPk(data.id_disciplina);
      if (!disciplina) {
        throw new Error('Disciplina no encontrada');
      }

      // Verificar que la categoría existe
      const categoria = await Categoria.findByPk(data.id_categoria);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }

      // Verificar si ya existe un grupo con el mismo nombre
      const existingGrupo = await grupoRepository.findByNombre(data.nombre);
      if (existingGrupo) {
        throw new Error('Ya existe un grupo con ese nombre');
      }

      // Extraer horarios del data si vienen
      const horarios = data.horarios || [];
      delete data.horarios; // Remover horarios del data para crear el grupo

      // Crear el grupo
      const grupo = await grupoRepository.create(data);

      // Si se proporcionaron horarios, crearlos
      if (horarios.length > 0) {
        const horariosConGrupo = horarios.map(horario => ({
          ...horario,
          id_grupo: grupo.id_grupo,
          activo: horario.activo !== undefined ? horario.activo : 1
        }));

        await grupoHorarioService.createManyHorarios(horariosConGrupo);

        // Generar clases del mes actual para el grupo recién creado
        try {
          await claseGeneratorService.generarClasesMesActual(grupo.id_grupo);
        } catch (error) {
          // Si falla la generación de clases, no fallar la creación del grupo
          // pero registrar el error
          console.error(`Error al generar clases iniciales para el grupo ${grupo.id_grupo}:`, error.message);
        }
      }

      // Obtener el grupo con sus horarios para retornarlo
      const grupoCompleto = await grupoRepository.findById(grupo.id_grupo);
      return grupoCompleto;
    } catch (error) {
      throw new Error(`Error al crear grupo: ${error.message}`);
    }
  }

  async updateGrupo(id, data) {
    try {
      // Validaciones de longitud
      if (data.nombre && data.nombre.length > 40) {
        throw new Error('El campo nombre no puede exceder 40 caracteres');
      }

      // Validar cupo máximo
      if (data.cupo_maximo !== undefined && data.cupo_maximo <= 0) {
        throw new Error('El cupo máximo debe ser mayor a cero');
      }

      // Si se está actualizando la disciplina, verificar que existe
      if (data.id_disciplina) {
        const disciplina = await Disciplina.findByPk(data.id_disciplina);
        if (!disciplina) {
          throw new Error('Disciplina no encontrada');
        }
      }

      // Si se está actualizando la categoría, verificar que existe
      if (data.id_categoria) {
        const categoria = await Categoria.findByPk(data.id_categoria);
        if (!categoria) {
          throw new Error('Categoría no encontrada');
        }
      }

      // Si se está actualizando el nombre, verificar que no exista otro grupo con ese nombre
      if (data.nombre) {
        const existingGrupo = await grupoRepository.findByNombre(data.nombre);
        if (existingGrupo && existingGrupo.id_grupo !== parseInt(id)) {
          throw new Error('Ya existe un grupo con ese nombre');
        }
      }

      const grupo = await grupoRepository.update(id, data);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }
      return grupo;
    } catch (error) {
      throw new Error(`Error al actualizar grupo: ${error.message}`);
    }
  }

  async deleteGrupo(id) {
    try {
      const deleted = await grupoRepository.delete(id);
      if (!deleted) {
        throw new Error('Grupo no encontrado');
      }
      return { message: 'Grupo eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar grupo: ${error.message}`);
    }
  }
}

export default new GrupoService();

