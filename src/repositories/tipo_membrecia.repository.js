import db from '../models/index.js';

const { Tipo_Membrecia, Precio_Membrecia } = db;

class TipoMembreciaRepository {
  async findAll() {
    return await Tipo_Membrecia.findAll({
      where: { estado: 1 },
      include: [
        {
          model: Precio_Membrecia,
          as: 'precios',
          where: { estado: 1 },
          required: false
        }
      ],
      order: [['tipo_membrecia', 'ASC']]
    });
  }

  async findById(id) {
    return await Tipo_Membrecia.findOne({
      where: { id_tipo_membrecia: id, estado: 1 },
      include: [
        {
          model: Precio_Membrecia,
          as: 'precios',
          where: { estado: 1 },
          required: false
        }
      ]
    });
  }

  async create(data) {
    return await Tipo_Membrecia.create(data);
  }

  async update(id, data) {
    const tipo = await Tipo_Membrecia.findOne({ where: { id_tipo_membrecia: id, estado: 1 } });
    if (!tipo) {
      return null;
    }
    return await tipo.update(data);
  }

  async delete(id) {
    const tipo = await Tipo_Membrecia.findOne({ where: { id_tipo_membrecia: id, estado: 1 } });
    if (!tipo) {
      return false;
    }
    await tipo.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }
}

export default new TipoMembreciaRepository();

