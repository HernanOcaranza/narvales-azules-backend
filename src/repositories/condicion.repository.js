import db from '../models/index.js';

const { Condicion } = db;

class CondicionRepository {
  async findAll() {
    return await Condicion.findAll({
      order: [['condicion', 'ASC']]
    });
  }

  async findById(id) {
    return await Condicion.findByPk(id);
  }

  async findByCondicion(condicion) {
    return await Condicion.findOne({ 
      where: { condicion } 
    });
  }

  async create(data) {
    return await Condicion.create(data);
  }

  async update(id, data) {
    const condicion = await Condicion.findByPk(id);
    if (!condicion) {
      return null;
    }
    return await condicion.update(data);
  }

  async delete(id) {
    const condicion = await Condicion.findByPk(id);
    if (!condicion) {
      return false;
    }
    await condicion.destroy();
    return true;
  }
}

export default new CondicionRepository();

