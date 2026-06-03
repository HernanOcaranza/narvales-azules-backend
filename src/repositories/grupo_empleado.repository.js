import db from '../models/index.js';
import { Op } from 'sequelize';

const { GrupoEmpleado, Grupo, Empleado } = db;

class GrupoEmpleadoRepository {
  async findAll() {
    return await GrupoEmpleado.findAll({
      where: { estado: 1 },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          where: { eliminado_en: null },
          attributes: ['id_grupo', 'nombre'],
          required: false
        },
        {
          model: Empleado,
          as: 'empleado',
          where: { estado: 1 },
          attributes: ['id_empleado', 'nombre', 'apellido', 'tipo'],
          required: false
        }
      ],
      order: [['id_grupo', 'ASC'], ['id_empleado', 'ASC']]
    });
  }

  async findById(id) {
    return await GrupoEmpleado.findOne({
      where: { id_grupo_empleado: id, estado: 1 },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id_grupo', 'nombre']
        },
        {
          model: Empleado,
          as: 'empleado',
          attributes: ['id_empleado', 'nombre', 'apellido', 'tipo']
        }
      ]
    });
  }

  async findByGrupo(idGrupo) {
    return await GrupoEmpleado.findAll({
      where: { id_grupo: idGrupo, estado: 1 },
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
    return await GrupoEmpleado.findAll({
      where: { id_empleado: idEmpleado, estado: 1 },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          where: { eliminado_en: null },
          attributes: ['id_grupo', 'nombre'],
          required: false
        }
      ],
      order: [['id_grupo', 'ASC']]
    });
  }

  async findByGrupoYEmpleado(idGrupo, idEmpleado) {
    return await GrupoEmpleado.findOne({
      where: {
        id_grupo: idGrupo,
        id_empleado: idEmpleado,
        estado: 1
      }
    });
  }

  async create(data) {
    return await GrupoEmpleado.create(data);
  }

  async update(id, data) {
    const record = await GrupoEmpleado.findOne({
      where: { id_grupo_empleado: id, estado: 1 }
    });
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id) {
    const record = await GrupoEmpleado.findOne({
      where: { id_grupo_empleado: id, estado: 1 }
    });
    if (!record) return false;
    await record.update({ estado: 0, eliminado_en: new Date() });
    return true;
  }

  async deleteByGrupo(idGrupo, transaction = null) {
    const options = { where: { id_grupo: idGrupo } };
    if (transaction) options.transaction = transaction;
    return await GrupoEmpleado.destroy(options);
  }

  async bulkCreate(empleados, transaction = null) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return await GrupoEmpleado.bulkCreate(empleados, options);
  }

  async findByGrupoRaw(idGrupo) {
    return await GrupoEmpleado.findAll({
      where: { id_grupo: idGrupo, estado: 1 },
      attributes: ['id_grupo_empleado', 'id_grupo', 'id_empleado', 'rol']
    });
  }
}

export default new GrupoEmpleadoRepository();
