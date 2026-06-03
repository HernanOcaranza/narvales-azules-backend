import db from '../models/index.js';
import { Op } from 'sequelize';

const { Asistencia, Clase, Alumno, Grupo } = db;

class AsistenciaRepository {
  async findByClase(idClase) {
    return await Asistencia.findAll({
      where: { id_clase: idClase, eliminado_en: null },
      include: [
        {
          model: Alumno,
          as: 'alumno',
          where: { eliminado_en: null },
          attributes: ['id_alumno', 'nombre', 'apellido', 'dni'],
          required: false
        }
      ],
      order: [['id_alumno', 'ASC']]
    });
  }

  async findByClaseYAlumno(idClase, idAlumno) {
    return await Asistencia.findOne({
      where: { id_clase: idClase, id_alumno: idAlumno }
    });
  }

  async findByAlumno(idAlumno, filters = {}) {
    const where = { id_alumno: idAlumno, eliminado_en: null };
    const claseWhere = { eliminado_en: null };

    if (filters.fechaDesde) {
      claseWhere.fecha_clase = { ...claseWhere.fecha_clase, [Op.gte]: filters.fechaDesde };
    }
    if (filters.fechaHasta) {
      claseWhere.fecha_clase = { ...claseWhere.fecha_clase, [Op.lte]: filters.fechaHasta };
    }

    return await Asistencia.findAll({
      where,
      include: [
        {
          model: Clase,
          as: 'clase',
          where: claseWhere,
          attributes: ['id_clase', 'fecha_clase', 'hora_inicio', 'hora_fin', 'estado'],
          required: true,
          include: [
            {
              model: Grupo,
              as: 'grupo',
              attributes: ['id_grupo', 'nombre']
            }
          ]
        }
      ],
      order: [['id_clase', 'DESC']]
    });
  }

  async create(data) {
    return await Asistencia.create(data);
  }

  async createOrReactivate(idClase, idAlumno, data, transaction = null) {
    const options = { where: { id_clase: idClase, id_alumno: idAlumno } };
    if (transaction) options.transaction = transaction;

    const existing = await Asistencia.findOne(options);

    if (existing) {
      const updateData = {
        presente: data.presente ?? 0,
        es_recuperacion: data.es_recuperacion ?? 0,
        observacion: data.observacion ?? null
      };
      if (existing.eliminado_en) {
        updateData.eliminado_en = null;
      }
      await existing.update(updateData, { transaction });
      return existing;
    }

    return await Asistencia.create({
      id_clase: idClase,
      id_alumno: idAlumno,
      presente: data.presente ?? 0,
      es_recuperacion: data.es_recuperacion ?? 0,
      observacion: data.observacion ?? null
    }, { transaction });
  }

  async delete(id) {
    const registro = await Asistencia.findOne({
      where: { id_asistencia: id, eliminado_en: null }
    });
    if (!registro) return false;
    await registro.update({ eliminado_en: new Date() });
    return true;
  }
}

export default new AsistenciaRepository();
