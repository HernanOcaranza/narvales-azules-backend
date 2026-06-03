import asistenciaRepository from '../repositories/asistencia.repository.js';
import db from '../models/index.js';
import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';

const { Clase, Alumno, Grupo, Membrecia } = db;

class AsistenciaService {
  async registrarAsistenciaAlumnos(idClase, alumnos) {
    const t = await sequelize.transaction();
    try {
      const clase = await Clase.findOne({
        where: { id_clase: idClase, eliminado_en: null },
        transaction: t
      });
      if (!clase) {
        throw new Error('Clase no encontrada o eliminada');
      }

      if (!Array.isArray(alumnos) || alumnos.length === 0) {
        throw new Error('Debe proporcionar al menos un alumno');
      }

      const idsAlumnos = alumnos.map(a => a.id_alumno);
      if (new Set(idsAlumnos).size !== idsAlumnos.length) {
        throw new Error('No se permiten alumnos duplicados en la misma asistencia');
      }

      for (const al of alumnos) {
        if (!al.id_alumno) {
          throw new Error('Cada alumno debe tener un id_alumno');
        }

        const alumno = await Alumno.findOne({
          where: { id_alumno: al.id_alumno, eliminado_en: null },
          transaction: t
        });
        if (!alumno) {
          throw new Error(`Alumno con ID ${al.id_alumno} no encontrado`);
        }

        if (al.presente !== undefined && al.presente !== 0 && al.presente !== 1) {
          throw new Error(`El campo presente del alumno ${al.id_alumno} debe ser 0 o 1`);
        }

        await asistenciaRepository.createOrReactivate(
          idClase,
          al.id_alumno,
          {
            presente: al.presente ?? 0,
            es_recuperacion: al.es_recuperacion ?? 0
          },
          t
        );
      }

      await t.commit();
      return await this.getAsistenciaAlumnosConDefaults(idClase);
    } catch (error) {
      await t.rollback();
      throw new Error(`Error al registrar asistencia de alumnos: ${error.message}`);
    }
  }

  async getAsistenciaAlumnosConDefaults(idClase) {
    try {
      const clase = await Clase.findOne({
        where: { id_clase: idClase, eliminado_en: null },
        include: [
          {
            model: Grupo,
            as: 'grupo',
            attributes: ['id_grupo', 'nombre']
          }
        ]
      });
      if (!clase) {
        throw new Error('Clase no encontrada');
      }

      const [asistencias, membresias] = await Promise.all([
        asistenciaRepository.findByClase(idClase),
        Membrecia.findAll({
          where: {
            id_grupo: clase.id_grupo,
            estado: 'activa',
            eliminado_en: null
          },
          include: [
            {
              model: Alumno,
              as: 'alumno',
              where: { eliminado_en: null },
              attributes: ['id_alumno', 'nombre', 'apellido', 'dni'],
              required: true
            }
          ]
        })
      ]);

      const asistenciasMap = new Map(
        asistencias.map(a => [a.id_alumno, {
          presente: a.presente,
          es_recuperacion: a.es_recuperacion,
          id_asistencia: a.id_asistencia
        }])
      );

      const alumnosConAsistencia = membresias.map(m => ({
        id_alumno: m.alumno.id_alumno,
        nombre: m.alumno.nombre,
        apellido: m.alumno.apellido,
        dni: m.alumno.dni,
        presente: asistenciasMap.has(m.alumno.id_alumno)
          ? asistenciasMap.get(m.alumno.id_alumno).presente
          : null,
        es_recuperacion: asistenciasMap.has(m.alumno.id_alumno)
          ? asistenciasMap.get(m.alumno.id_alumno).es_recuperacion
          : 0,
        de_plantilla: true
      }));

      const idsMembresia = new Set(membresias.map(m => m.alumno.id_alumno));
      const extras = asistencias
        .filter(a => !idsMembresia.has(a.id_alumno))
        .map(a => ({
          id_alumno: a.alumno?.id_alumno,
          nombre: a.alumno?.nombre,
          apellido: a.alumno?.apellido,
          dni: a.alumno?.dni,
          presente: a.presente,
          es_recuperacion: a.es_recuperacion,
          de_plantilla: false
        }));

      return {
        clase: {
          id_clase: clase.id_clase,
          fecha_clase: clase.fecha_clase,
          hora_inicio: clase.hora_inicio,
          hora_fin: clase.hora_fin,
          estado: clase.estado
        },
        grupo: clase.grupo,
        alumnos: [...alumnosConAsistencia, ...extras]
      };
    } catch (error) {
      throw new Error(`Error al obtener asistencia de alumnos: ${error.message}`);
    }
  }

  async getClasesByAlumno(idAlumno, filtros = {}) {
    try {
      const alumno = await Alumno.findOne({
        where: { id_alumno: idAlumno, eliminado_en: null }
      });
      if (!alumno) {
        throw new Error('Alumno no encontrado');
      }

      return await asistenciaRepository.findByAlumno(idAlumno, filtros);
    } catch (error) {
      throw new Error(`Error al obtener clases del alumno: ${error.message}`);
    }
  }
}

export default new AsistenciaService();
