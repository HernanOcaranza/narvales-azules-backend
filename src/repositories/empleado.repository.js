import db from '../models/index.js';

const { Empleado } = db;

class EmpleadoRepository {
  async findAll() {
    return await Empleado.findAll({
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  }

  async findById(id) {
    return await Empleado.findByPk(id);
  }

  async findByUsuario(usuario) {
    return await Empleado.findOne({ 
      where: { usuario } 
    });
  }

  async findByDni(dni) {
    return await Empleado.findOne({ 
      where: { dni } 
    });
  }

  async create(data) {
    return await Empleado.create(data);
  }

  async update(id, data) {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return null;
    }
    return await empleado.update(data);
  }

  async delete(id) {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return false;
    }
    await empleado.destroy();
    return true;
  }
}

export default new EmpleadoRepository();

