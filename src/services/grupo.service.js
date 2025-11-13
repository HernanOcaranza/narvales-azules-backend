import grupoRepository from '../repositories/grupo.repository.js';
import db from '../models/index.js';

const { Disciplina, Categoria } = db;

class GrupoService {
  async getAllGrupos() {
    try {
      return await grupoRepository.findAll();
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

      return await grupoRepository.create(data);
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

