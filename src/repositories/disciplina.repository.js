import db from '../models/index.js';

const { Disciplina } = db;

class DisciplinaRepository {
  async findAll() {
    return await Disciplina.findAll({
      where: { estado: 1 },
      order: [['disciplina', 'ASC']]
    });
  }

  async findById(id) {
    return await Disciplina.findOne({
      where: { id_disciplina: id, estado: 1 }
    });
  }

  async findByDisciplina(disciplina) {
    return await Disciplina.findOne({ 
      where: { disciplina, estado: 1 } 
    });
  }

  async create(data) {
    return await Disciplina.create(data);
  }

  async update(id, data) {
    const disciplina = await Disciplina.findOne({ where: { id_disciplina: id, estado: 1 } });
    if (!disciplina) {
      return null;
    }
    return await disciplina.update(data);
  }

  async delete(id) {
    const disciplina = await Disciplina.findOne({ where: { id_disciplina: id, estado: 1 } });
    if (!disciplina) {
      return false;
    }
    await disciplina.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }
}

export default new DisciplinaRepository();

