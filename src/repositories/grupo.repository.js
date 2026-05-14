import db from '../models/index.js';
import { Op } from 'sequelize';

const { Grupo, Disciplina, Categoria, GrupoHorario } = db;

class GrupoRepository {
  async findAll(options = {}) {
    const { limit = 10, offset = 0, filters = {} } = options;

    const where = {};

    if (filters.estado !== undefined && filters.estado !== '') {
      where.estado = parseInt(filters.estado);
    } else {
      where.estado = 1;
    }

    if (filters.idDisciplina) {
      where.id_disciplina = filters.idDisciplina;
    }

    if (filters.idCategoria) {
      where.id_categoria = filters.idCategoria;
    }

    if (filters.nombre) {
      where.nombre = { [Op.like]: `%${filters.nombre}%` };
    }

    const { count, rows } = await Grupo.findAndCountAll({
      where,
      include: [
        {
          model: Disciplina,
          as: 'disciplina',
          attributes: ['id_disciplina', 'disciplina']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion']
        },
        {
          model: GrupoHorario,
          as: 'horarios',
          attributes: ['id_grupo_horario', 'dia_semana', 'hora_inicio', 'hora_fin', 'activo'],
          required: false
        }
      ],
      order: [['nombre', 'ASC']],
      limit,
      offset
    });
    return { data: rows, total: count };
  }

  async findById(id) {
    return await Grupo.findOne({
      where: { id_grupo: id, estado: 1 },
      include: [
        {
          model: Disciplina,
          as: 'disciplina',
          attributes: ['id_disciplina', 'disciplina']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion']
        },
        {
          model: GrupoHorario,
          as: 'horarios',
          attributes: ['id_grupo_horario', 'dia_semana', 'hora_inicio', 'hora_fin', 'activo'],
          required: false
        }
      ]
    });
  }

  async findByNombre(nombre) {
    return await Grupo.findOne({ 
      where: { nombre, estado: 1 } 
    });
  }

  async findByDisciplina(id_disciplina) {
    return await Grupo.findAll({
      where: { id_disciplina, estado: 1 },
      include: [
        {
          model: Disciplina,
          as: 'disciplina',
          attributes: ['id_disciplina', 'disciplina']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion']
        },
        {
          model: GrupoHorario,
          as: 'horarios',
          attributes: ['id_grupo_horario', 'dia_semana', 'hora_inicio', 'hora_fin', 'activo'],
          required: false
        }
      ]
    });
  }

  async findByCategoria(id_categoria) {
    return await Grupo.findAll({
      where: { id_categoria, estado: 1 },
      include: [
        {
          model: Disciplina,
          as: 'disciplina',
          attributes: ['id_disciplina', 'disciplina']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion']
        },
        {
          model: GrupoHorario,
          as: 'horarios',
          attributes: ['id_grupo_horario', 'dia_semana', 'hora_inicio', 'hora_fin', 'activo'],
          required: false
        }
      ]
    });
  }

  async create(data) {
    return await Grupo.create(data);
  }

  async update(id, data) {
    const grupo = await Grupo.findOne({ where: { id_grupo: id, estado: 1 } });
    if (!grupo) {
      return null;
    }
    return await grupo.update(data);
  }

  async delete(id) {
    const grupo = await Grupo.findOne({ where: { id_grupo: id, estado: 1 } });
    if (!grupo) {
      return false;
    }
    await grupo.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }
}

export default new GrupoRepository();

