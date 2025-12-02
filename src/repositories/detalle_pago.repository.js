import db from '../models/index.js';

const { Detalle_Pago, Pago } = db;

class DetallePagoRepository {
  async findAll() {
    return await Detalle_Pago.findAll({
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
    return await Detalle_Pago.findByPk(id, {
      include: [
        {
          model: Pago,
          as: 'pago',
          required: false
        }
      ]
    });
  }

  async findByPagoId(idPago) {
    return await Detalle_Pago.findAll({
      where: { id_pago: idPago },
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

  async create(data, transaction = null) {
    const options = transaction ? { transaction } : {};
    return await Detalle_Pago.create(data, options);
  }

  async update(id, data) {
    const detalle = await Detalle_Pago.findByPk(id);
    if (!detalle) {
      return null;
    }
    return await detalle.update(data);
  }

  async delete(id) {
    const detalle = await Detalle_Pago.findByPk(id);
    if (!detalle) {
      return false;
    }
    await detalle.destroy();
    return true;
  }
}

export default new DetallePagoRepository();

