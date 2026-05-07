import db from '../models/index.js';
import { Op } from 'sequelize';

const { Pago, Empleado, Detalle_Pago, Membrecia } = db;

class PagoRepository {
  async findAll(options = {}) {
    const { limit = 10, offset = 0 } = options;
    const { count, rows } = await Pago.findAndCountAll({
      where: { estado: { [Op.ne]: 'eliminado' } },
      include: [
        {
          model: Empleado,
          as: 'empleado',
          where: { estado: 1 },
          required: false
        },
        {
          model: Detalle_Pago,
          as: 'detalles',
          where: { estado: 1 },
          required: false
        }
      ],
      order: [['fecha_pago', 'DESC']],
      limit,
      offset
    });
    return { data: rows, total: count };
  }

  async findById(id) {
    return await Pago.findOne({
      where: { id_pago: id, estado: { [Op.ne]: 'eliminado' } },
      include: [
        {
          model: Empleado,
          as: 'empleado',
          required: false
        },
        {
          model: Detalle_Pago,
          as: 'detalles',
          required: false
        },
        {
          model: Membrecia,
          as: 'membresia',
          required: false
        }
      ]
    });
  }

  async findByTipo(tipo) {
    return await Pago.findAll({
      where: { tipo, estado: { [Op.ne]: 'eliminado' } },
      include: [
        {
          model: Empleado,
          as: 'empleado',
          required: false
        },
        {
          model: Detalle_Pago,
          as: 'detalles',
          required: false
        }
      ],
      order: [['fecha_pago', 'DESC']]
    });
  }

  async create(data, transaction = null) {
    const options = transaction ? { transaction } : {};
    return await Pago.create(data, options);
  }

  async update(id, data, transaction = null) {
    const options = transaction ? { transaction } : {};
    const pago = await Pago.findOne({ where: { id_pago: id, estado: { [Op.ne]: 'eliminado' } }, ...options });
    if (!pago) {
      return null;
    }
    return await pago.update(data, options);
  }

  async delete(id, transaction = null) {
    const options = transaction ? { transaction } : {};
    const pago = await Pago.findOne({ where: { id_pago: id, estado: { [Op.ne]: 'eliminado' } }, ...options });
    if (!pago) {
      return false;
    }
    await pago.update({ estado: 'eliminado' }, options);
    return true;
  }
}

export default new PagoRepository();

