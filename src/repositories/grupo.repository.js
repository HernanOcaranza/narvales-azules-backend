import db from '../models/index.js';

const { Grupo, Disciplina, Categoria, GrupoHorario } = db;

class GrupoRepository {
  async findAll() {
    return await Grupo.findAll({
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
      order: [['nombre', 'ASC']]
    });
  }

  async findById(id) {
    return await Grupo.findByPk(id, {
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
      where: { nombre } 
    });
  }

  async findByDisciplina(id_disciplina) {
    return await Grupo.findAll({
      where: { id_disciplina },
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
      where: { id_categoria },
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
    const grupo = await Grupo.findByPk(id);
    if (!grupo) {
      return null;
    }
    return await grupo.update(data);
  }

  async delete(id) {
    const grupo = await Grupo.findByPk(id);
    if (!grupo) {
      return false;
    }
    await grupo.destroy();
    return true;
  }
}

export default new GrupoRepository();

