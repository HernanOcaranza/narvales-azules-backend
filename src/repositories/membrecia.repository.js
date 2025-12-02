import db from '../models/index.js';

const { Membrecia, Alumno, Pago, Tipo_Membrecia, Grupo } = db;

class MembreciaRepository {
  async findAll() {
    return await Membrecia.findAll({
      include: [
        {
          model: Alumno,
          as: 'alumno',
          required: false
        },
        {
          model: Pago,
          as: 'pago',
          required: false
        },
        {
          model: Tipo_Membrecia,
          as: 'tipo_membrecia',
          required: false
        },
        {
          model: Grupo,
          as: 'grupo',
          required: false
        }
      ],
      order: [['fecha_inicio', 'DESC']]
    });
  }

  async findById(id) {
    return await Membrecia.findByPk(id, {
      include: [
        {
          model: Alumno,
          as: 'alumno',
          required: false
        },
        {
          model: Pago,
          as: 'pago',
          required: false
        },
        {
          model: Tipo_Membrecia,
          as: 'tipo_membrecia',
          required: false
        },
        {
          model: Grupo,
          as: 'grupo',
          required: false
        }
      ]
    });
  }

  async findByAlumnoId(idAlumno) {
    return await Membrecia.findAll({
      where: { id_alumno: idAlumno },
      include: [
        {
          model: Alumno,
          as: 'alumno',
          required: false
        },
        {
          model: Pago,
          as: 'pago',
          required: false
        },
        {
          model: Tipo_Membrecia,
          as: 'tipo_membrecia',
          required: false
        },
        {
          model: Grupo,
          as: 'grupo',
          required: false
        }
      ],
      order: [['fecha_inicio', 'DESC']]
    });
  }

  async findByPagoId(idPago) {
    return await Membrecia.findOne({
      where: { id_pago: idPago },
      include: [
        {
          model: Alumno,
          as: 'alumno',
          required: false
        },
        {
          model: Pago,
          as: 'pago',
          required: false
        },
        {
          model: Tipo_Membrecia,
          as: 'tipo_membrecia',
          required: false
        },
        {
          model: Grupo,
          as: 'grupo',
          required: false
        }
      ]
    });
  }

  async create(data, transaction = null) {
    const options = transaction ? { transaction } : {};
    return await Membrecia.create(data, options);
  }

  async update(id, data) {
    const membresia = await Membrecia.findByPk(id);
    if (!membresia) {
      return null;
    }
    return await membresia.update(data);
  }

  async delete(id) {
    const membresia = await Membrecia.findByPk(id);
    if (!membresia) {
      return false;
    }
    await membresia.destroy();
    return true;
  }
}

export default new MembreciaRepository();

