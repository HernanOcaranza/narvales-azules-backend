import db from '../models/index.js';
import { Op } from 'sequelize';

const { Clase, Grupo, Disciplina, Categoria } = db;

class ClaseRepository {
  async findAll(options = {}) {
    const { limit = 10, offset = 0, filters = {} } = options;

    const where = { eliminado_en: null };
    const grupoWhere = { estado: 1 };

    if (filters.idGrupo) {
      where.id_grupo = filters.idGrupo;
    }

    if (filters.estado) {
      where.estado = filters.estado;
    }

    if (filters.fechaDesde) {
      where.fecha_clase = {
        ...where.fecha_clase,
        [Op.gte]: filters.fechaDesde
      };
    }

    if (filters.fechaHasta) {
      where.fecha_clase = {
        ...where.fecha_clase,
        [Op.lte]: filters.fechaHasta
      };
    }

    if (filters.idDisciplina || filters.idCategoria) {
      if (filters.idDisciplina) {
        grupoWhere.id_disciplina = filters.idDisciplina;
      }
      if (filters.idCategoria) {
        grupoWhere.id_categoria = filters.idCategoria;
      }
    }

    const { count, rows } = await Clase.findAndCountAll({
      where,
      attributes: {
        include: [
          [
            Clase.sequelize.literal(`(
              SELECT COUNT(*) FROM Clase_Empleado ce
              WHERE ce.id_clase = Clase.id_clase AND ce.estado = 1
            )`),
            'total_empleados_asistencia'
          ],
          [
            Clase.sequelize.literal(`(
              SELECT COUNT(*) FROM Asistencia a
              WHERE a.id_clase = Clase.id_clase AND a.eliminado_en IS NULL
            )`),
            'total_alumnos_asistencia'
          ]
        ]
      },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          where: Object.keys(grupoWhere).length > 0 ? grupoWhere : undefined,
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado', 'id_disciplina', 'id_categoria'],
          required: Object.keys(grupoWhere).length > 0,
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
          ]
        }
      ],
      order: [['fecha_clase', 'DESC'], ['hora_inicio', 'ASC']],
      limit,
      offset
    });
    return { data: rows, total: count };
  }

  async findById(id) {
    return await Clase.findOne({
      where: { id_clase: id, eliminado_en: null },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado']
        }
      ]
    });
  }

  async findByGrupo(idGrupo) {
    return await Clase.findAll({
      where: { id_grupo: idGrupo, eliminado_en: null },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado']
        }
      ],
      order: [['fecha_clase', 'DESC'], ['hora_inicio', 'ASC']]
    });
  }

  async findByFecha(fecha) {
    return await Clase.findAll({
      where: { fecha_clase: fecha, eliminado_en: null },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado']
        }
      ],
      order: [['hora_inicio', 'ASC']]
    });
  }

  async findByFechaRange(fechaInicio, fechaFin) {
    return await Clase.findAll({
      where: {
        fecha_clase: {
          [Op.between]: [fechaInicio, fechaFin]
        },
        eliminado_en: null
      },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id_grupo', 'nombre', 'cupo_maximo', 'estado']
        }
      ],
      order: [['fecha_clase', 'ASC'], ['hora_inicio', 'ASC']]
    });
  }

  async create(data) {
    return await Clase.create(data);
  }

  async update(id, data) {
    const clase = await Clase.findOne({ where: { id_clase: id, eliminado_en: null } });
    if (!clase) {
      return null;
    }
    return await clase.update(data);
  }

  async delete(id) {
    const clase = await Clase.findOne({ where: { id_clase: id, eliminado_en: null } });
    if (!clase) {
      return false;
    }
    await clase.update({ eliminado_en: new Date() });
    return true;
  }

  /**
   * Encuentra clases pendientes que ya terminaron (fecha + hora_fin ya pasó)
   * y que no están suspendidas
   */
  async findClasesPendientesFinalizadas() {
    const ahora = new Date();
    // Formatear fecha y hora actual para MySQL: 'YYYY-MM-DD HH:MM:SS'
    const fechaHoraActual = ahora.toISOString().slice(0, 19).replace('T', ' ');
    
    // Usar SQL para combinar fecha_clase y hora_fin y comparar con la fecha/hora actual
    // MySQL: CONCAT(fecha_clase, ' ', hora_fin) crea un datetime string
    return await Clase.findAll({
      where: {
        estado: 'pendiente',
        [Op.and]: [
          Clase.sequelize.literal(`CONCAT(fecha_clase, ' ', hora_fin) < '${fechaHoraActual}'`)
        ]
      }
    });
  }

  /**
   * Actualiza el estado de múltiples clases por sus IDs
   */
  async updateEstadoMasivo(ids, nuevoEstado) {
    return await Clase.update(
      { estado: nuevoEstado },
      {
        where: {
          id_clase: {
            [Op.in]: ids
          }
        }
      }
    );
  }
}

export default new ClaseRepository();

