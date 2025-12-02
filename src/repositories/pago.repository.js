import db from '../models/index.js';

const { Pago, Empleado, Detalle_Pago, Membrecia } = db;

class PagoRepository {
  async findAll() {
    return await Pago.findAll({
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

  async findById(id) {
    return await Pago.findByPk(id, {
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
      where: { tipo },
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

  async update(id, data) {
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return null;
    }
    return await pago.update(data);
  }

  async delete(id) {
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return false;
    }
    await pago.destroy();
    return true;
  }
}

export default new PagoRepository();

