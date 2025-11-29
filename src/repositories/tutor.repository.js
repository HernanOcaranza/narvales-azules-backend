import db from '../models/index.js';
import { Op } from 'sequelize';

const { Tutor } = db;

class TutorRepository {
  async findAll() {
    return await Tutor.findAll({
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  }

  async findById(id) {
    return await Tutor.findByPk(id);
  }

  async findByDni(dni) {
    return await Tutor.findOne({ 
      where: { dni } 
    });
  }

  async findByNombre(nombre) {
    return await Tutor.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${nombre}%` } },
          { apellido: { [Op.like]: `%${nombre}%` } }
        ]
      },
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  }

  async create(data) {
    return await Tutor.create(data);
  }

  async update(id, data) {
    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return null;
    }
    return await tutor.update(data);
  }

  async delete(id) {
    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return false;
    }
    await tutor.destroy();
    return true;
  }
}

export default new TutorRepository();

