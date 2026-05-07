import db from '../models/index.js';

const { Detalle_Pago, Pago } = db;

class DetallePagoRepository {
  async findAll() {
    return await Detalle_Pago.findAll({
      where: { estado: 1 },
      include: [
        {
          model: Pago,
          as: 'pago',
          required: false
        }
      ],
      order: [['fecha_detalle', 'DESC']]
    });
  }

  async findById(id) {
    return await Detalle_Pago.findOne({
      where: { id_detalle_pago: id, estado: 1 },
      include: [
        {
          model: Pago,
          as: 'pago',
          required: false
        }
      ]
    });
  }

  async findByPagoId(idPago, transaction = null) {
    const options = transaction ? { transaction } : {};
    return await Detalle_Pago.findAll({
      where: { id_pago: idPago, estado: 1 },
      include: [
        {
          model: Pago,
          as: 'pago',
          required: false
        }
      ],
      order: [['fecha_detalle', 'DESC']],
      ...options
    });
  }

  async create(data, transaction = null) {
    const options = transaction ? { transaction } : {};
    return await Detalle_Pago.create(data, options);
  }

  async update(id, data, transaction = null) {
    const options = transaction ? { transaction } : {};
    const detalle = await Detalle_Pago.findOne({ where: { id_detalle_pago: id, estado: 1 }, ...options });
    if (!detalle) {
      return null;
    }
    return await detalle.update(data, options);
  }

  async delete(id, transaction = null) {
    const options = transaction ? { transaction } : {};
    const detalle = await Detalle_Pago.findOne({ where: { id_detalle_pago: id, estado: 1 }, ...options });
    if (!detalle) {
      return false;
    }
    await detalle.update({ estado: 0, eliminado_en: new Date() }, options);
    return true;
  }
}

export default new DetallePagoRepository();

