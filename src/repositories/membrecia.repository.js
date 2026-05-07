import db from '../models/index.js';
import { Op } from 'sequelize';

const { Membrecia, Alumno, Pago, Tipo_Membrecia, Grupo, Detalle_Pago, Tutor, Categoria, Condicion, Disciplina } = db;

class MembreciaRepository {
  async findAll(filtros = {}) {
    const { limit = 10, offset = 0, ...filtrosRest } = filtros;
    const where = {};

    // Filtro por id_alumno
    if (filtrosRest.idAlumno !== undefined && filtrosRest.idAlumno !== null) {
      where.id_alumno = parseInt(filtrosRest.idAlumno);
    }

    // Filtro por estado
    if (filtrosRest.estado !== undefined && filtrosRest.estado !== null && filtrosRest.estado !== '') {
      where.estado = filtrosRest.estado;
    }

    // Filtro por id_tipo_membrecia
    if (filtrosRest.idTipoMembrecia !== undefined && filtrosRest.idTipoMembrecia !== null) {
      where.id_tipo_membrecia = parseInt(filtrosRest.idTipoMembrecia);
    }

    // Filtro por id_grupo
    if (filtrosRest.idGrupo !== undefined && filtrosRest.idGrupo !== null) {
      where.id_grupo = parseInt(filtrosRest.idGrupo);
    }

    // Filtro por rango de fechas
    if (filtrosRest.fechaDesde || filtrosRest.fechaHasta) {
      where.fecha_inicio = {};
      
      if (filtrosRest.fechaDesde) {
        where.fecha_inicio[Op.gte] = filtrosRest.fechaDesde;
      }
      
      if (filtrosRest.fechaHasta) {
        where.fecha_inicio[Op.lte] = filtrosRest.fechaHasta;
      }
    }

    const { count, rows } = await Membrecia.findAndCountAll({
      where: { 
        ...(Object.keys(where).length > 0 ? where : {}),
        eliminado_en: null
      },
      include: [
        {
          model: Alumno,
          as: 'alumno',
          required: false
        },
        {
          model: Pago,
          as: 'pago',
          required: false,
          include: [
            {
              model: Detalle_Pago,
              as: 'detalles',
              required: false
            }
          ]
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
      order: [['fecha_inicio', 'DESC']],
      limit,
      offset
    });
    return { data: rows, total: count };
  }

  async findById(id) {
    return await Membrecia.findOne({
      where: { id_membrecia: id, eliminado_en: null },
      include: [
        {
          model: Alumno,
          as: 'alumno',
          required: false
        },
        {
          model: Pago,
          as: 'pago',
          required: false,
          include: [
            {
              model: Detalle_Pago,
              as: 'detalles',
              required: false
            }
          ]
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
      where: { id_alumno: idAlumno, eliminado_en: null },
      include: [
        {
          model: Alumno,
          as: 'alumno',
          required: false
        },
        {
          model: Pago,
          as: 'pago',
          required: false,
          include: [
            {
              model: Detalle_Pago,
              as: 'detalles',
              required: false
            }
          ]
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
      where: { id_pago: idPago, eliminado_en: null },
      include: [
        {
          model: Alumno,
          as: 'alumno',
          required: false
        },
        {
          model: Pago,
          as: 'pago',
          required: false,
          include: [
            {
              model: Detalle_Pago,
              as: 'detalles',
              required: false
            }
          ]
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
    const membresia = await Membrecia.findOne({ where: { id_membrecia: id, eliminado_en: null }, ...options });
    if (!membresia) {
      return null;
    }
    return await membresia.update(data, options);
  }

  async delete(id) {
    const membresia = await Membrecia.findOne({ where: { id_membrecia: id, eliminado_en: null } });
    if (!membresia) {
      return false;
    }
    await membresia.update({ eliminado_en: new Date() });
    return true;
  }

  async findByIdWithAllDetails(id) {
    return await Membrecia.findOne({
      where: { id_membrecia: id, eliminado_en: null },
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
          attributes: ['id_tipo_membrecia', 'tipo_membrecia', 'frecuencia_semanal', 'duracion_dias']
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

  /**
   * Encuentra membresías activas que han vencido (fecha_fin < fecha actual)
   * @returns {Promise<Array>} Array de membresías vencidas
   */
  async findMembresiasVencidas() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaHoy = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    return await Membrecia.findAll({
      where: {
        estado: 'activa',
        fecha_fin: {
          [Op.lt]: fechaHoy
        }
      }
    });
  }

  /**
   * Actualiza el estado de múltiples membresías
   * @param {Array<number>} ids - Array de IDs de membresías a actualizar
   * @param {string} nuevoEstado - Nuevo estado a asignar
   * @param {Object} transaction - Transacción opcional
   * @returns {Promise<number>} Número de filas actualizadas
   */
  async updateEstadoMasivo(ids, nuevoEstado, transaction = null) {
    const options = transaction ? { transaction } : {};
    const [numActualizadas] = await Membrecia.update(
      { estado: nuevoEstado },
      {
        where: {
          id_membrecia: {
            [Op.in]: ids
          }
        },
        ...options
      }
    );
    return numActualizadas;
  }
}

export default new MembreciaRepository();

