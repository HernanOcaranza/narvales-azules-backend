import db from '../models/index.js';

const { Precio_Membrecia, Tipo_Membrecia, Sequelize } = db;

class PrecioMembreciaRepository {
  async findAll() {
    return await Precio_Membrecia.findAll({
      include: [
        {
          model: Tipo_Membrecia,
          as: 'tipo_membrecia',
          required: false
        }
      ],
      order: [['fecha_inicio_vigencia', 'DESC']]
    });
  }

  async findById(id) {
    return await Precio_Membrecia.findByPk(id, {
      include: [
        {
          model: Tipo_Membrecia,
          as: 'tipo_membrecia',
          required: false
        }
      ]
    });
  }

  async findByTipoMembreciaId(idTipoMembrecia) {
    return await Precio_Membrecia.findAll({
      where: { id_tipo_membrecia: idTipoMembrecia },
      include: [
        {
          model: Tipo_Membrecia,
          as: 'tipo_membrecia',
          required: false
        }
      ],
      order: [['fecha_inicio_vigencia', 'DESC']]
    });
  }

  async findPrecioVigente(idTipoMembrecia, fecha) {
    const fechaConsulta = fecha || new Date();
    return await Precio_Membrecia.findOne({
      where: {
        id_tipo_membrecia: idTipoMembrecia,
        fecha_inicio_vigencia: {
          [Sequelize.Op.lte]: fechaConsulta
        },
        [Sequelize.Op.or]: [
          { fecha_fin_vigencia: null },
          { fecha_fin_vigencia: { [Sequelize.Op.gte]: fechaConsulta } }
        ]
      },
      include: [
        {
          model: Tipo_Membrecia,
          as: 'tipo_membrecia',
          required: false
        }
      ],
      order: [['fecha_inicio_vigencia', 'DESC']]
    });
  }

  async create(data) {
    return await Precio_Membrecia.create(data);
  }

  async update(id, data) {
    const precio = await Precio_Membrecia.findByPk(id);
    if (!precio) {
      return null;
    }
    return await precio.update(data);
  }

  async delete(id) {
    const precio = await Precio_Membrecia.findByPk(id);
    if (!precio) {
      return false;
    }
    await precio.destroy();
    return true;
  }
}

export default new PrecioMembreciaRepository();

