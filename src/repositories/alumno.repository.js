import db from '../models/index.js';
import { Op } from 'sequelize';

const { Alumno, Tutor, Categoria, Condicion } = db;

class AlumnoRepository {
  async findAll() {
    return await Alumno.findAll({
      include: [
        {
          model: Tutor,
          as: 'tutor',
          attributes: ['id_tutor', 'nombre', 'apellido', 'telefono']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion']
        },
        {
          model: Condicion,
          as: 'condicion',
          attributes: ['id_condicion', 'condicion', 'atencion', 'descripcion']
        }
      ],
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  }

  async findById(id) {
    return await Alumno.findByPk(id, {
      include: [
        {
          model: Tutor,
          as: 'tutor',
          attributes: ['id_tutor', 'nombre', 'apellido', 'telefono']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion']
        },
        {
          model: Condicion,
          as: 'condicion',
          attributes: ['id_condicion', 'condicion', 'atencion', 'descripcion']
        }
      ]
    });
  }

  async findByDni(dni) {
    return await Alumno.findOne({ 
      where: { dni } 
    });
  }

  async findByTutor(idTutor) {
    return await Alumno.findAll({
      where: { id_tutor: idTutor },
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion']
        },
        {
          model: Condicion,
          as: 'condicion',
          attributes: ['id_condicion', 'condicion', 'atencion', 'descripcion']
        }
      ],
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  }

  async findByNombre(nombre) {
    return await Alumno.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${nombre}%` } },
          { apellido: { [Op.like]: `%${nombre}%` } }
        ]
      },
      include: [
        {
          model: Tutor,
          as: 'tutor',
          attributes: ['id_tutor', 'nombre', 'apellido', 'telefono']
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'categoria', 'descripcion']
        },
        {
          model: Condicion,
          as: 'condicion',
          attributes: ['id_condicion', 'condicion', 'atencion', 'descripcion']
        }
      ],
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  }

  async create(data) {
    return await Alumno.create(data);
  }

  async update(id, data) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) {
      return null;
    }
    return await alumno.update(data);
  }

  async delete(id) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) {
      return false;
    }
    await alumno.destroy();
    return true;
  }
}

export default new AlumnoRepository();

