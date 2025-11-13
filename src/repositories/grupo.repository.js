import db from '../models/index.js';

const { Grupo, Disciplina, Categoria } = db;

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

