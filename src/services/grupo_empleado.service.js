import grupoEmpleadoRepository from '../repositories/grupo_empleado.repository.js';
import db from '../models/index.js';
import { sequelize } from '../config/database.js';

const { Grupo, Empleado } = db;

class GrupoEmpleadoService {
  async getAllGrupoEmpleados() {
    try {
      return await grupoEmpleadoRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener asignaciones grupo-empleado: ${error.message}`);
    }
  }

  async getGrupoEmpleadoById(id) {
    try {
      const record = await grupoEmpleadoRepository.findById(id);
      if (!record) {
        throw new Error('Asignación grupo-empleado no encontrada');
      }
      return record;
    } catch (error) {
      throw new Error(`Error al obtener asignación: ${error.message}`);
    }
  }

  async getEmpleadosByGrupo(idGrupo) {
    try {
      const grupo = await Grupo.findByPk(idGrupo);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }
      return await grupoEmpleadoRepository.findByGrupo(idGrupo);
    } catch (error) {
      throw new Error(`Error al obtener empleados del grupo: ${error.message}`);
    }
  }

  async getGruposByEmpleado(idEmpleado) {
    try {
      const empleado = await Empleado.findByPk(idEmpleado);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }
      return await grupoEmpleadoRepository.findByEmpleado(idEmpleado);
    } catch (error) {
      throw new Error(`Error al obtener grupos del empleado: ${error.message}`);
    }
  }

  async createGrupoEmpleado(data) {
    try {
      const { id_grupo, id_empleado, rol } = data;

      if (!id_grupo || !id_empleado || !rol) {
        throw new Error('Los campos id_grupo, id_empleado y rol son obligatorios');
      }

      if (rol.length > 20) {
        throw new Error('El campo rol no puede exceder 20 caracteres');
      }

      const grupo = await Grupo.findByPk(id_grupo);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }

      const empleado = await Empleado.findOne({ where: { id_empleado, estado: 1 } });
      if (!empleado) {
        throw new Error('Empleado no encontrado o inactivo');
      }

      const existing = await grupoEmpleadoRepository.findByGrupoYEmpleado(id_grupo, id_empleado);
      if (existing) {
        throw new Error('El empleado ya está asignado a este grupo');
      }

      return await grupoEmpleadoRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear asignación: ${error.message}`);
    }
  }

  async updateGrupoEmpleado(id, data) {
    try {
      if (data.rol && data.rol.length > 20) {
        throw new Error('El campo rol no puede exceder 20 caracteres');
      }

      if (data.id_grupo || data.id_empleado) {
        throw new Error('No se pueden actualizar los campos id_grupo e id_empleado');
      }

      const record = await grupoEmpleadoRepository.update(id, data);
      if (!record) {
        throw new Error('Asignación grupo-empleado no encontrada');
      }
      return record;
    } catch (error) {
      throw new Error(`Error al actualizar asignación: ${error.message}`);
    }
  }

  async deleteGrupoEmpleado(id) {
    try {
      const deleted = await grupoEmpleadoRepository.delete(id);
      if (!deleted) {
        throw new Error('Asignación grupo-empleado no encontrada');
      }
      return { message: 'Asignación eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar asignación: ${error.message}`);
    }
  }

  async asignarEmpleadosAGrupo(idGrupo, empleados) {
    const t = await sequelize.transaction();
    try {
      const grupo = await Grupo.findByPk(idGrupo);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }

      if (!Array.isArray(empleados) || empleados.length === 0) {
        throw new Error('Debe proporcionar al menos un empleado');
      }

      const idsEmpleados = empleados.map(e => e.id_empleado);
      if (new Set(idsEmpleados).size !== idsEmpleados.length) {
        throw new Error('No se permiten empleados duplicados en la asignación');
      }

      for (const emp of empleados) {
        if (!emp.id_empleado || !emp.rol) {
          throw new Error('Cada empleado debe tener id_empleado y rol');
        }
        if (emp.rol.length > 20) {
          throw new Error('El campo rol no puede exceder 20 caracteres');
        }
        const empleado = await Empleado.findOne({
          where: { id_empleado: emp.id_empleado, estado: 1 },
          transaction: t
        });
        if (!empleado) {
          throw new Error(`Empleado con ID ${emp.id_empleado} no encontrado o inactivo`);
        }
      }

      await grupoEmpleadoRepository.deleteByGrupo(idGrupo, t);

      if (empleados.length > 0) {
        const records = empleados.map(emp => ({
          id_grupo: idGrupo,
          id_empleado: emp.id_empleado,
          rol: emp.rol
        }));
        await grupoEmpleadoRepository.bulkCreate(records, t);
      }

      await t.commit();
      return await grupoEmpleadoRepository.findByGrupo(idGrupo);
    } catch (error) {
      await t.rollback();
      throw new Error(`Error al asignar empleados al grupo: ${error.message}`);
    }
  }
}

export default new GrupoEmpleadoService();
