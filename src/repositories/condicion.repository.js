import db from '../models/index.js';

const { Condicion } = db;

class CondicionRepository {
  async findAll() {
    return await Condicion.findAll({
      where: { estado: 1 },
      order: [['condicion', 'ASC']]
    });
  }

  async findById(id) {
    return await Condicion.findOne({
      where: { id_condicion: id, estado: 1 }
    });
  }

  async findByCondicion(condicion) {
    return await Condicion.findOne({ 
      where: { condicion, estado: 1 } 
    });
  }

  async create(data) {
    return await Condicion.create(data);
  }

  async update(id, data) {
    const condicion = await Condicion.findOne({ where: { id_condicion: id, estado: 1 } });
    if (!condicion) {
      return null;
    }
    return await condicion.update(data);
  }

  async delete(id) {
    const condicion = await Condicion.findOne({ where: { id_condicion: id, estado: 1 } });
    if (!condicion) {
      return false;
    }
    await condicion.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }
}

export default new CondicionRepository();

