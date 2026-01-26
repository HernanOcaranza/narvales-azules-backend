import db from '../models/index.js';
import { Op } from 'sequelize';

const { Membrecia, Alumno, Pago, Tipo_Membrecia, Grupo, Detalle_Pago, Tutor, Categoria, Condicion, Disciplina } = db;

class MembreciaRepository {
  async findAll(filtros = {}) {
    const where = {};

    // Filtro por id_alumno
    if (filtros.idAlumno !== undefined && filtros.idAlumno !== null) {
      where.id_alumno = parseInt(filtros.idAlumno);
    }

    // Filtro por estado
    if (filtros.estado !== undefined && filtros.estado !== null && filtros.estado !== '') {
      where.estado = filtros.estado;
    }

    // Filtro por id_tipo_membrecia
    if (filtros.idTipoMembrecia !== undefined && filtros.idTipoMembrecia !== null) {
      where.id_tipo_membrecia = parseInt(filtros.idTipoMembrecia);
    }

    // Filtro por id_grupo
    if (filtros.idGrupo !== undefined && filtros.idGrupo !== null) {
      where.id_grupo = parseInt(filtros.idGrupo);
    }

    // Filtro por rango de fechas
    if (filtros.fechaDesde || filtros.fechaHasta) {
      where.fecha_inicio = {};
      
      if (filtros.fechaDesde) {
        where.fecha_inicio[Op.gte] = filtros.fechaDesde;
      }
      
      if (filtros.fechaHasta) {
        where.fecha_inicio[Op.lte] = filtros.fechaHasta;
      }
    }

    return await Membrecia.findAll({
      where: Object.keys(where).length > 0 ? where : undefined,
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

  async update(id, data, transaction = null) {
    const options = transaction ? { transaction } : {};
    const membresia = await Membrecia.findByPk(id, options);
    if (!membresia) {
      return null;
    }
    return await membresia.update(data, options);
  }

  async delete(id) {
    const membresia = await Membrecia.findByPk(id);
    if (!membresia) {
      return false;
    }
    await membresia.destroy();
    return true;
  }

  async findByIdWithAllDetails(id) {
    return await Membrecia.findByPk(id, {
      include: [
        {
          model: Alumno,
          as: 'alumno',
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
            }
          ],
          attributes: ['id_alumno', 'nombre', 'apellido', 'dni', 'fecha_nacimiento', 'direccion', 'fecha_registro', 'estado', 'certificado']
        },
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
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado']
        },
        {
          model: Pago,
          as: 'pago',
          include: [
            {
              model: Detalle_Pago,
              as: 'detalles',
              attributes: ['id_detalle_pago', 'metodo_pago', 'monto_parcial', 'fecha_detalle', 'referencia_transferencia'],
              order: [['fecha_detalle', 'DESC']]
            }
          ],
          attributes: ['id_pago', 'tipo', 'fecha_pago', 'estado', 'observaciones']
        }
      ]
    });
  }
}

export default new MembreciaRepository();

