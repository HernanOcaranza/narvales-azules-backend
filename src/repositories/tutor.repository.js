import db from '../models/index.js';
import { Op } from 'sequelize';

const { Tutor } = db;

class TutorRepository {
  async findAll() {
    return await Tutor.findAll({
      where: { estado: 1 },
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  }

  async findById(id) {
    return await Tutor.findOne({
      where: { id_tutor: id, estado: 1 }
    });
  }

  async findByDni(dni) {
    return await Tutor.findOne({ 
      where: { dni, estado: 1 } 
    });
  }

  async findByNombre(nombre) {
    return await Tutor.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${nombre}%` } },
          { apellido: { [Op.like]: `%${nombre}%` } }
        ],
        estado: 1
      },
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  }

  async create(data) {
    return await Tutor.create(data);
  }

  async update(id, data) {
    const tutor = await Tutor.findOne({ where: { id_tutor: id, estado: 1 } });
    if (!tutor) {
      return null;
    }
    return await tutor.update(data);
  }

  async delete(id) {
    const tutor = await Tutor.findOne({ where: { id_tutor: id, estado: 1 } });
    if (!tutor) {
      return false;
    }
    await tutor.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }
}

export default new TutorRepository();

