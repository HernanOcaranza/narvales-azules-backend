import db from '../models/index.js';
import { Op } from 'sequelize';

const { ClaseEmpleado, Clase, Empleado, Grupo } = db;

class ClaseEmpleadoRepository {
  async findAll() {
    return await ClaseEmpleado.findAll({
      where: { estado: 1 },
      include: [
        {
          model: Clase,
          as: 'clase',
          where: { eliminado_en: null },
          attributes: ['id_clase', 'fecha_clase', 'hora_inicio', 'hora_fin'],
          required: false
        },
        {
          model: Empleado,
          as: 'empleado',
          where: { estado: 1 },
          attributes: ['id_empleado', 'nombre', 'apellido', 'tipo', 'telefono'],
          required: false
        }
      ],
      order: [['id_clase', 'ASC'], ['id_empleado', 'ASC']]
    });
  }

  async findById(idClase, idEmpleado) {
    return await ClaseEmpleado.findOne({
      where: {
        id_clase: idClase,
        id_empleado: idEmpleado,
        estado: 1
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

  async findByIdSinFiltroEstado(idClase, idEmpleado) {
    return await ClaseEmpleado.findOne({
      where: {
        id_clase: idClase,
        id_empleado: idEmpleado
      }
    });
  }

  async findByClase(idClase) {
    return await ClaseEmpleado.findAll({
      where: { id_clase: idClase, estado: 1 },
      include: [
        {
          model: Empleado,
          as: 'empleado',
          where: { estado: 1 },
          attributes: ['id_empleado', 'nombre', 'apellido', 'tipo', 'telefono'],
          required: false
        }
      ],
      order: [['id_empleado', 'ASC']]
    });
  }

  async findByEmpleado(idEmpleado) {
    return await ClaseEmpleado.findAll({
      where: { id_empleado: idEmpleado, estado: 1 },
      include: [
        {
          model: Clase,
          as: 'clase',
          where: { eliminado_en: null },
          attributes: ['id_clase', 'fecha_clase', 'hora_inicio', 'hora_fin'],
          required: false
        }
      ],
      order: [['id_clase', 'ASC']]
    });
  }

  async findByEmpleadoWithClase(idEmpleado, filters = {}) {
    const where = { id_empleado: idEmpleado, estado: 1 };
    const claseWhere = { eliminado_en: null };

    if (filters.fechaDesde) {
      claseWhere.fecha_clase = { ...claseWhere.fecha_clase, [Op.gte]: filters.fechaDesde };
    }
    if (filters.fechaHasta) {
      claseWhere.fecha_clase = { ...claseWhere.fecha_clase, [Op.lte]: filters.fechaHasta };
    }

    return await ClaseEmpleado.findAll({
      where,
      include: [
        {
          model: Clase,
          as: 'clase',
          where: claseWhere,
          attributes: ['id_clase', 'fecha_clase', 'hora_inicio', 'hora_fin', 'estado'],
          required: true,
          include: [
            {
              model: Grupo,
              as: 'grupo',
              attributes: ['id_grupo', 'nombre']
            }
          ]
        }
      ],
      order: [['id_clase', 'DESC']]
    });
  }

  async create(data) {
    return await ClaseEmpleado.create(data);
  }

  async update(idClase, idEmpleado, data) {
    const claseEmpleado = await ClaseEmpleado.findOne({
      where: {
        id_clase: idClase,
        id_empleado: idEmpleado,
        estado: 1
      }
    });
    if (!claseEmpleado) {
      return null;
    }
    return await claseEmpleado.update(data);
  }

  async upsert(idClase, idEmpleado, data, transaction = null) {
    const options = { where: { id_clase: idClase, id_empleado: idEmpleado } };
    if (transaction) options.transaction = transaction;

    const existing = await ClaseEmpleado.findOne(options);
    if (existing) {
      await existing.update({ ...data, estado: 1, eliminado_en: null }, { transaction });
      return existing;
    }
    return await ClaseEmpleado.create(
      { id_clase: idClase, id_empleado: idEmpleado, ...data },
      { transaction }
    );
  }

  async delete(idClase, idEmpleado) {
    const claseEmpleado = await ClaseEmpleado.findOne({
      where: {
        id_clase: idClase,
        id_empleado: idEmpleado,
        estado: 1
      }
    });
    if (!claseEmpleado) {
      return false;
    }
    await claseEmpleado.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }
}

export default new ClaseEmpleadoRepository();
