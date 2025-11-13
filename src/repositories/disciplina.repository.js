import db from '../models/index.js';

const { Disciplina } = db;

class DisciplinaRepository {
  async findAll() {
    return await Disciplina.findAll({
      order: [['disciplina', 'ASC']]
    });
  }

  async findById(id) {
    return await Disciplina.findByPk(id);
  }

  async findByDisciplina(disciplina) {
    return await Disciplina.findOne({ 
      where: { disciplina } 
    });
  }

  async create(data) {
    return await Disciplina.create(data);
  }

  async update(id, data) {
    const disciplina = await Disciplina.findByPk(id);
    if (!disciplina) {
      return null;
    }
    return await disciplina.update(data);
  }

  async delete(id) {
    const disciplina = await Disciplina.findByPk(id);
    if (!disciplina) {
      return false;
    }
    await disciplina.destroy();
    return true;
  }
}

export default new DisciplinaRepository();

