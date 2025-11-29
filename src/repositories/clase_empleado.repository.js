import db from '../models/index.js';

const { ClaseEmpleado, Clase, Empleado } = db;

class ClaseEmpleadoRepository {
  async findAll() {
    return await ClaseEmpleado.findAll({
      include: [
        {
          model: Clase,
          as: 'clase',
          attributes: ['id_clase', 'fecha_clase', 'hora_inicio', 'hora_fin']
        },
        {
          model: Empleado,
          as: 'empleado',
          attributes: ['id_empleado', 'nombre', 'apellido', 'tipo', 'telefono']
        }
      ],
      order: [['id_clase', 'ASC'], ['id_empleado', 'ASC']]
    });
  }

  async findById(idClase, idEmpleado) {
    return await ClaseEmpleado.findOne({
      where: {
        id_clase: idClase,
        id_empleado: idEmpleado
      },
      include: [
        {
          model: Clase,
          as: 'clase',
          attributes: ['id_clase', 'fecha_clase', 'hora_inicio', 'hora_fin']
        },
        {
          model: Empleado,
          as: 'empleado',
          attributes: ['id_empleado', 'nombre', 'apellido', 'tipo', 'telefono']
        }
      ]
    });
  }

  async findByClase(idClase) {
    return await ClaseEmpleado.findAll({
      where: { id_clase: idClase },
      include: [
        {
          model: Empleado,
          as: 'empleado',
          attributes: ['id_empleado', 'nombre', 'apellido', 'tipo', 'telefono']
        }
      ],
      order: [['id_empleado', 'ASC']]
    });
  }

  async findByEmpleado(idEmpleado) {
    return await ClaseEmpleado.findAll({
      where: { id_empleado: idEmpleado },
      include: [
        {
          model: Clase,
          as: 'clase',
          attributes: ['id_clase', 'fecha_clase', 'hora_inicio', 'hora_fin']
        }
      ],
      order: [['id_clase', 'ASC']]
    });
  }

  async create(data) {
    return await ClaseEmpleado.create(data);
  }

  async update(idClase, idEmpleado, data) {
    const claseEmpleado = await ClaseEmpleado.findOne({
      where: {
        id_clase: idClase,
        id_empleado: idEmpleado
      }
    });
    if (!claseEmpleado) {
      return null;
    }
    return await claseEmpleado.update(data);
  }

  async delete(idClase, idEmpleado) {
    const claseEmpleado = await ClaseEmpleado.findOne({
      where: {
        id_clase: idClase,
        id_empleado: idEmpleado
      }
    });
    if (!claseEmpleado) {
      return false;
    }
    await claseEmpleado.destroy();
    return true;
  }
}

export default new ClaseEmpleadoRepository();

