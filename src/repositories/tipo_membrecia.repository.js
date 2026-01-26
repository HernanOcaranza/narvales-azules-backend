import db from '../models/index.js';

const { Tipo_Membrecia, Precio_Membrecia } = db;

class TipoMembreciaRepository {
  async findAll() {
    return await Tipo_Membrecia.findAll({
      include: [
        {
          model: Precio_Membrecia,
          as: 'precios',
          required: false
        }
      ],
      order: [['tipo_membrecia', 'ASC']]
    });
  }

  async findById(id) {
    return await Tipo_Membrecia.findByPk(id, {
      include: [
        {
          model: Precio_Membrecia,
          as: 'precios',
          required: false
        }
      ]
    });
  }

  async create(data) {
    return await Tipo_Membrecia.create(data);
  }

  async update(id, data) {
    const tipo = await Tipo_Membrecia.findByPk(id);
    if (!tipo) {
      return null;
    }
    return await tipo.update(data);
  }

  async delete(id) {
    const tipo = await Tipo_Membrecia.findByPk(id);
    if (!tipo) {
      return false;
    }
    await tipo.destroy();
    return true;
  }
}

export default new TipoMembreciaRepository();

