import db from '../models/index.js';
import { Op } from 'sequelize';

const { Alumno, Tutor, Categoria, Condicion, Membrecia, Tipo_Membrecia, Grupo, Disciplina, Pago, Detalle_Pago } = db;

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
        },
        {
          model: Membrecia,
          as: 'membresias',
          include: [
            {
              model: Tipo_Membrecia,
              as: 'tipo_membrecia',
              attributes: ['id_tipo_membrecia', 'tipo_membrecia', 'frecuencia_semanal']
            },
            {
              model: Grupo,
              as: 'grupo',
              attributes: ['id_grupo', 'nombre']
            },
            {
              model: Pago,
              as: 'pago',
              include: [
                {
                  model: Detalle_Pago,
                  as: 'detalles',
                  attributes: ['id_detalle_pago', 'metodo_pago', 'monto_parcial', 'fecha_detalle', 'referencia_transferencia']
                }
              ],
              attributes: ['id_pago', 'tipo', 'fecha_pago', 'estado', 'observaciones']
            }
          ],
          attributes: ['id_membrecia', 'fecha_inicio', 'fecha_fin', 'estado'],
          required: false,
          separate: true,
          order: [['fecha_inicio', 'DESC']]
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

  async findByIdWithAllDetails(id) {
    return await Alumno.findByPk(id, {
      attributes: ['id_alumno', 'nombre', 'apellido', 'dni', 'fecha_nacimiento', 'direccion', 'fecha_registro', 'estado', 'certificado'],
      include: [
        {
          model: Tutor,
          as: 'tutor',
          attributes: ['id_tutor', 'nombre', 'apellido', 'telefono', 'dni']
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
        },
        {
          model: Membrecia,
          as: 'membresias',
          include: [
            {
              model: Tipo_Membrecia,
              as: 'tipo_membrecia',
              attributes: ['id_tipo_membrecia', 'tipo_membrecia', 'frecuencia_semanal']
            },
            {
              model: Grupo,
              as: 'grupo',
              include: [
                {
                  model: Disciplina,
                  as: 'disciplina',
                  attributes: ['id_disciplina', 'disciplina']
                },
                {
                  model: Categoria,
                  as: 'categoria',
                  attributes: ['id_categoria', 'categoria']
                }
              ],
              attributes: ['id_grupo', 'nombre']
            },
            {
              model: Pago,
              as: 'pago',
              include: [
                {
                  model: Detalle_Pago,
                  as: 'detalles',
                  attributes: ['id_detalle_pago', 'metodo_pago', 'monto_parcial', 'fecha_detalle', 'referencia_transferencia']
                }
              ],
              attributes: ['id_pago', 'tipo', 'fecha_pago', 'estado', 'observaciones']
            }
          ],
          attributes: ['id_membrecia', 'fecha_inicio', 'fecha_fin', 'estado'],
          required: false,
          separate: true,
          order: [['fecha_inicio', 'DESC']]
        }
      ]
    });
  }
}

export default new AlumnoRepository();

