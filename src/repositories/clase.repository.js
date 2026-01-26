import db from '../models/index.js';
import { Op } from 'sequelize';

const { Clase, Grupo } = db;

class ClaseRepository {
  async findAll() {
    return await Clase.findAll({
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

  async findById(id) {
    return await Clase.findByPk(id, {
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
      where: { id_grupo: idGrupo },
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
      where: { fecha_clase: fecha },
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
        }
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
    const clase = await Clase.findByPk(id);
    if (!clase) {
      return null;
    }
    return await clase.update(data);
  }

  async delete(id) {
    const clase = await Clase.findByPk(id);
    if (!clase) {
      return false;
    }
    await clase.destroy();
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

