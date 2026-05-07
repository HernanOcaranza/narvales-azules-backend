import db from '../models/index.js';

const { Categoria } = db;

class CategoriaRepository {
  async findAll() {
    return await Categoria.findAll({
      where: { estado: 1 },
      order: [['categoria', 'ASC']]
    });
  }

  async findById(id) {
    return await Categoria.findOne({
      where: { id_categoria: id, estado: 1 }
    });
  }

  async findByCategoria(categoria) {
    return await Categoria.findOne({ 
      where: { categoria, estado: 1 } 
    });
  }

  async create(data) {
    return await Categoria.create(data);
  }

  async update(id, data) {
    const categoria = await Categoria.findOne({ where: { id_categoria: id, estado: 1 } });
    if (!categoria) {
      return null;
    }
    return await categoria.update(data);
  }

  async delete(id) {
    const categoria = await Categoria.findOne({ where: { id_categoria: id, estado: 1 } });
    if (!categoria) {
      return false;
    }
    await categoria.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }
}

export default new CategoriaRepository();

