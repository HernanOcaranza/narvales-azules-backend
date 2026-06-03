import db from '../models/index.js';

const { Empleado } = db;

class EmpleadoRepository {
  async findAll() {
    return await Empleado.findAll({
      where: { estado: 1 },
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  }

  async findById(id) {
    return await Empleado.findOne({
      where: { id_empleado: id, estado: 1 }
    });
  }

  async findByUsuario(usuario) {
    return await Empleado.findOne({ 
      where: { usuario, estado: 1 } 
    });
  }

  async findByEmail(email) {
    return await Empleado.findOne({ 
      where: { email, estado: 1 } 
    });
  }

  async findByDni(dni) {
    return await Empleado.findOne({ 
      where: { dni, estado: 1 } 
    });
  }

  async create(data) {
    return await Empleado.create(data);
  }

  async update(id, data) {
    const empleado = await Empleado.findOne({ where: { id_empleado: id, estado: 1 } });
    if (!empleado) {
      return null;
    }
    return await empleado.update(data);
  }

  async delete(id) {
    const empleado = await Empleado.findOne({ where: { id_empleado: id, estado: 1 } });
    if (!empleado) {
      return false;
    }
    await empleado.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }
}

export default new EmpleadoRepository();

