import claseEmpleadoRepository from '../repositories/clase_empleado.repository.js';
import grupoEmpleadoRepository from '../repositories/grupo_empleado.repository.js';
import db from '../models/index.js';
import { sequelize } from '../config/database.js';

const { Clase, Empleado, Grupo } = db;

class ClaseEmpleadoService {
  async getAllClaseEmpleados() {
    try {
      return await claseEmpleadoRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener relaciones clase-empleado: ${error.message}`);
    }
  }

  async getClaseEmpleadoById(idClase, idEmpleado) {
    try {
      const claseEmpleado = await claseEmpleadoRepository.findById(idClase, idEmpleado);
      if (!claseEmpleado) {
        throw new Error('Relación clase-empleado no encontrada');
      }
      return claseEmpleado;
    } catch (error) {
      throw new Error(`Error al obtener relación clase-empleado: ${error.message}`);
    }
  }

  async getClaseEmpleadosByClase(idClase) {
    try {
      const clase = await Clase.findByPk(idClase);
      if (!clase) {
        throw new Error('Clase no encontrada');
      }
      return await claseEmpleadoRepository.findByClase(idClase);
    } catch (error) {
      throw new Error(`Error al obtener relaciones por clase: ${error.message}`);
    }
  }

  async getClaseEmpleadosByEmpleado(idEmpleado) {
    try {
      const empleado = await Empleado.findByPk(idEmpleado);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }
      return await claseEmpleadoRepository.findByEmpleado(idEmpleado);
    } catch (error) {
      throw new Error(`Error al obtener relaciones por empleado: ${error.message}`);
    }
  }

  async createClaseEmpleado(data) {
    try {
      if (!data.id_clase || !data.id_empleado || !data.rol) {
        throw new Error('Los campos id_clase, id_empleado y rol son obligatorios');
      }

      if (data.rol.length > 20) {
        throw new Error('El campo rol no puede exceder 20 caracteres');
      }

      if (data.presente !== undefined && data.presente !== 0 && data.presente !== 1) {
        throw new Error('El campo presente debe ser 0 o 1');
      }

      const clase = await Clase.findByPk(data.id_clase);
      if (!clase) {
        throw new Error('Clase no encontrada');
      }

      const empleado = await Empleado.findByPk(data.id_empleado);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }

      const existing = await claseEmpleadoRepository.findById(data.id_clase, data.id_empleado);
      if (existing) {
        throw new Error('Ya existe una relación entre esta clase y este empleado');
      }

      return await claseEmpleadoRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear relación clase-empleado: ${error.message}`);
    }
  }

  async updateClaseEmpleado(idClase, idEmpleado, data) {
    try {
      if (data.rol && data.rol.length > 20) {
        throw new Error('El campo rol no puede exceder 20 caracteres');
      }

      if (data.presente !== undefined && data.presente !== 0 && data.presente !== 1) {
        throw new Error('El campo presente debe ser 0 o 1');
      }

      if (data.id_clase || data.id_empleado) {
        throw new Error('No se pueden actualizar los campos id_clase e id_empleado');
      }

      const claseEmpleado = await claseEmpleadoRepository.update(idClase, idEmpleado, data);
      if (!claseEmpleado) {
        throw new Error('Relación clase-empleado no encontrada');
      }
      return claseEmpleado;
    } catch (error) {
      throw new Error(`Error al actualizar relación clase-empleado: ${error.message}`);
    }
  }

  async deleteClaseEmpleado(idClase, idEmpleado) {
    try {
      const deleted = await claseEmpleadoRepository.delete(idClase, idEmpleado);
      if (!deleted) {
        throw new Error('Relación clase-empleado no encontrada');
      }
      return { message: 'Relación clase-empleado eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar relación clase-empleado: ${error.message}`);
    }
  }

  async registrarAsistenciaEmpleados(idClase, empleados) {
    const t = await sequelize.transaction();
    try {
      const clase = await Clase.findOne({
        where: { id_clase: idClase, eliminado_en: null },
        transaction: t
      });
      if (!clase) {
        throw new Error('Clase no encontrada o eliminada');
      }

      if (!Array.isArray(empleados) || empleados.length === 0) {
        throw new Error('Debe proporcionar al menos un empleado');
      }

      const idsEmpleados = empleados.map(e => e.id_empleado);
      if (new Set(idsEmpleados).size !== idsEmpleados.length) {
        throw new Error('No se permiten empleados duplicados en la misma asistencia');
      }

      for (const emp of empleados) {
        if (!emp.id_empleado) {
          throw new Error('Cada empleado debe tener un id_empleado');
        }

        const empleado = await Empleado.findOne({
          where: { id_empleado: emp.id_empleado, estado: 1 },
          transaction: t
        });
        if (!empleado) {
          throw new Error(`Empleado con ID ${emp.id_empleado} no encontrado o inactivo`);
        }

        if (!emp.rol || emp.rol.length > 20) {
          throw new Error(`El rol del empleado ${emp.id_empleado} es obligatorio y no puede exceder 20 caracteres`);
        }

        if (emp.presente !== undefined && emp.presente !== 0 && emp.presente !== 1) {
          throw new Error(`El campo presente del empleado ${emp.id_empleado} debe ser 0 o 1`);
        }

        await claseEmpleadoRepository.upsert(
          idClase,
          emp.id_empleado,
          { presente: emp.presente ?? 0, rol: emp.rol },
          t
        );
      }

      await t.commit();
      return await claseEmpleadoRepository.findByClase(idClase);
    } catch (error) {
      await t.rollback();
      throw new Error(`Error al registrar asistencia: ${error.message}`);
    }
  }

  async getAsistenciaEmpleadosConDefaults(idClase) {
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

      const asistencias = await claseEmpleadoRepository.findByClase(idClase);
      const asistenciasMap = new Map(
        asistencias.map(a => [a.id_empleado, { presente: a.presente, rol: a.rol }])
      );

      const defaultsDelGrupo = await grupoEmpleadoRepository.findByGrupo(clase.id_grupo);

      const empleadosConAsistencia = defaultsDelGrupo.map(ge => ({
        id_empleado: ge.empleado?.id_empleado,
        nombre: ge.empleado?.nombre,
        apellido: ge.empleado?.apellido,
        tipo: ge.empleado?.tipo,
        rol: ge.rol,
        presente: asistenciasMap.has(ge.id_empleado)
          ? asistenciasMap.get(ge.id_empleado).presente
          : null,
        de_plantilla: true
      }));

      const extras = asistencias
        .filter(a => !defaultsDelGrupo.some(d => d.id_empleado === a.id_empleado))
        .map(a => ({
          id_empleado: a.empleado?.id_empleado,
          nombre: a.empleado?.nombre,
          apellido: a.empleado?.apellido,
          tipo: a.empleado?.tipo,
          rol: a.rol,
          presente: a.presente,
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
        empleados: [...empleadosConAsistencia, ...extras]
      };
    } catch (error) {
      throw new Error(`Error al obtener asistencia de empleados: ${error.message}`);
    }
  }

  async getClasesByEmpleado(idEmpleado, filtros = {}) {
    try {
      const empleado = await Empleado.findOne({
        where: { id_empleado: idEmpleado, estado: 1 }
      });
      if (!empleado) {
        throw new Error('Empleado no encontrado o inactivo');
      }

      return await claseEmpleadoRepository.findByEmpleadoWithClase(idEmpleado, filtros);
    } catch (error) {
      throw new Error(`Error al obtener clases del empleado: ${error.message}`);
    }
  }

  async calcularHorasTrabajadas(idEmpleado, fechaDesde, fechaHasta) {
    try {
      const clases = await claseEmpleadoRepository.findByEmpleadoWithClase(idEmpleado, {
        fechaDesde,
        fechaHasta
      });

      const soloPresentes = clases.filter(c => c.presente === 1 && c.clase);

      let totalMinutos = 0;
      for (const registro of soloPresentes) {
        const clase = registro.clase;
        if (clase.hora_inicio && clase.hora_fin) {
          const [hI, mI] = clase.hora_inicio.split(':').map(Number);
          const [hF, mF] = clase.hora_fin.split(':').map(Number);
          totalMinutos += (hF * 60 + mF) - (hI * 60 + mI);
        }
      }

      const horas = Math.floor(totalMinutos / 60);
      const minutos = totalMinutos % 60;

      return {
        id_empleado,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        total_clases: soloPresentes.length,
        total_minutos: totalMinutos,
        total_horas: `${horas}h ${minutos}m`,
        horas_decimal: parseFloat((totalMinutos / 60).toFixed(2))
      };
    } catch (error) {
      throw new Error(`Error al calcular horas trabajadas: ${error.message}`);
    }
  }
}

export default new ClaseEmpleadoService();
