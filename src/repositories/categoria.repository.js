import db from '../models/index.js';

const { Categoria } = db;

class CategoriaRepository {
  async findAll() {
    return await Categoria.findAll({
      order: [['categoria', 'ASC']]
    });
  }

  async findById(id) {
    return await Categoria.findByPk(id);
  }

  async findByCategoria(categoria) {
    return await Categoria.findOne({ 
      where: { categoria } 
    });
  }

  async create(data) {
    return await Categoria.create(data);
  }

  async update(id, data) {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return null;
    }
    return await categoria.update(data);
  }

  async delete(id) {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return false;
    }
    await categoria.destroy();
    return true;
  }
}

export default new CategoriaRepository();

