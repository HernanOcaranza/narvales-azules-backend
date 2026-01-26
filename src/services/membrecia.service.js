import membresiaRepository from '../repositories/membrecia.repository.js';
import pagoRepository from '../repositories/pago.repository.js';
import detallePagoRepository from '../repositories/detalle_pago.repository.js';
import tipoMembreciaRepository from '../repositories/tipo_membrecia.repository.js';
import alumnoRepository from '../repositories/alumno.repository.js';
import grupoRepository from '../repositories/grupo.repository.js';
import { sequelize } from '../config/database.js';

class MembreciaService {
  async getAllMembresias(filtros = {}) {
    try {
      // Validar y procesar filtros
      const filtrosProcesados = {};

      // Validar idAlumno
      if (filtros.idAlumno !== undefined && filtros.idAlumno !== null && filtros.idAlumno !== '') {
        const idAlumno = parseInt(filtros.idAlumno);
        if (isNaN(idAlumno)) {
          throw new Error('El filtro idAlumno debe ser un número válido');
        }
        filtrosProcesados.idAlumno = idAlumno;
      }

      // Validar estado
      if (filtros.estado !== undefined && filtros.estado !== null && filtros.estado !== '') {
        const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
        if (!estadosValidos.includes(filtros.estado.toLowerCase())) {
          throw new Error(`El filtro estado debe ser uno de: ${estadosValidos.join(', ')}`);
        }
        filtrosProcesados.estado = filtros.estado.toLowerCase();
      }

      // Validar idTipoMembrecia
      if (filtros.idTipoMembrecia !== undefined && filtros.idTipoMembrecia !== null && filtros.idTipoMembrecia !== '') {
        const idTipoMembrecia = parseInt(filtros.idTipoMembrecia);
        if (isNaN(idTipoMembrecia)) {
          throw new Error('El filtro idTipoMembrecia debe ser un número válido');
        }
        filtrosProcesados.idTipoMembrecia = idTipoMembrecia;
      }

      // Validar idGrupo
      if (filtros.idGrupo !== undefined && filtros.idGrupo !== null && filtros.idGrupo !== '') {
        const idGrupo = parseInt(filtros.idGrupo);
        if (isNaN(idGrupo)) {
          throw new Error('El filtro idGrupo debe ser un número válido');
        }
        filtrosProcesados.idGrupo = idGrupo;
      }

      // Validar fechaDesde
      if (filtros.fechaDesde !== undefined && filtros.fechaDesde !== null && filtros.fechaDesde !== '') {
        const fechaDesde = new Date(filtros.fechaDesde);
        if (isNaN(fechaDesde.getTime())) {
          throw new Error('El filtro fechaDesde debe tener formato YYYY-MM-DD');
        }
        // Validar formato YYYY-MM-DD
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(filtros.fechaDesde)) {
          throw new Error('El filtro fechaDesde debe tener formato YYYY-MM-DD');
        }
        filtrosProcesados.fechaDesde = filtros.fechaDesde;
      }

      // Validar fechaHasta
      if (filtros.fechaHasta !== undefined && filtros.fechaHasta !== null && filtros.fechaHasta !== '') {
        const fechaHasta = new Date(filtros.fechaHasta);
        if (isNaN(fechaHasta.getTime())) {
          throw new Error('El filtro fechaHasta debe tener formato YYYY-MM-DD');
        }
        // Validar formato YYYY-MM-DD
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(filtros.fechaHasta)) {
          throw new Error('El filtro fechaHasta debe tener formato YYYY-MM-DD');
        }
        filtrosProcesados.fechaHasta = filtros.fechaHasta;
      }

      // Validar que fechaDesde no sea mayor que fechaHasta
      if (filtrosProcesados.fechaDesde && filtrosProcesados.fechaHasta) {
        if (filtrosProcesados.fechaDesde > filtrosProcesados.fechaHasta) {
          throw new Error('La fechaDesde no puede ser mayor que fechaHasta');
        }
      }

      return await membresiaRepository.findAll(filtrosProcesados);
    } catch (error) {
      throw new Error(`Error al obtener membresías: ${error.message}`);
    }
  }

  async getMembreciaById(id) {
    try {
      const membresia = await membresiaRepository.findById(id);
      if (!membresia) {
        throw new Error('Membresía no encontrada');
      }
      return membresia;
    } catch (error) {
      throw new Error(`Error al obtener membresía: ${error.message}`);
    }
  }

  async getMembresiasByAlumnoId(idAlumno) {
    try {
      // Verificar que el alumno existe
      const alumno = await alumnoRepository.findById(idAlumno);
      if (!alumno) {
        throw new Error('Alumno no encontrado');
      }
      return await membresiaRepository.findByAlumnoId(idAlumno);
    } catch (error) {
      throw new Error(`Error al obtener membresías del alumno: ${error.message}`);
    }
  }

  async createMembrecia(data) {
    try {
      // Validaciones de negocio
      if (!data.fecha_inicio || !data.estado || !data.id_alumno || 
          !data.id_pago || !data.id_tipo_membrecia || !data.id_grupo) {
        throw new Error('Los campos fecha_inicio, estado, id_alumno, id_pago, id_tipo_membrecia e id_grupo son obligatorios');
      }

      // Validar que el alumno existe
      const alumno = await alumnoRepository.findById(data.id_alumno);
      if (!alumno) {
        throw new Error('El alumno especificado no existe');
      }

      // Validar que el pago existe y es de tipo ingreso
      const pago = await pagoRepository.findById(data.id_pago);
      if (!pago) {
        throw new Error('El pago especificado no existe');
      }
      if (pago.tipo !== 'ingreso') {
        throw new Error('El pago debe ser de tipo ingreso para asociarlo a una membresía');
      }

      // Validar que el tipo de membresía existe
      const tipo = await tipoMembreciaRepository.findById(data.id_tipo_membrecia);
      if (!tipo) {
        throw new Error('El tipo de membresía especificado no existe');
      }

      // Validar que el grupo existe
      const grupo = await grupoRepository.findById(data.id_grupo);
      if (!grupo) {
        throw new Error('El grupo especificado no existe');
      }

      // Validar fechas
      if (data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
        throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
      }

      // Validar estado
      const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
      if (!estadosValidos.includes(data.estado.toLowerCase())) {
        throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
      }

      return await membresiaRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear membresía: ${error.message}`);
    }
  }

  async createMembreciaConPago(data) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validaciones básicas
      if (!data.fecha_inicio || !data.id_alumno || !data.id_tipo_membrecia || !data.id_grupo) {
        throw new Error('Los campos fecha_inicio, id_alumno, id_tipo_membrecia e id_grupo son obligatorios');
      }

      // Validar que el alumno existe
      const alumno = await alumnoRepository.findById(data.id_alumno);
      if (!alumno) {
        throw new Error('El alumno especificado no existe');
      }

      // Validar que el tipo de membresía existe
      const tipo = await tipoMembreciaRepository.findById(data.id_tipo_membrecia);
      if (!tipo) {
        throw new Error('El tipo de membresía especificado no existe');
      }

      // Validar que el grupo existe
      const grupo = await grupoRepository.findById(data.id_grupo);
      if (!grupo) {
        throw new Error('El grupo especificado no existe');
      }

      // Validar fechas
      if (data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
        throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
      }

      // Validar estado de membresía
      const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
      const estadoMembrecia = data.estado || 'activa';
      if (!estadosValidos.includes(estadoMembrecia.toLowerCase())) {
        throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
      }

      // Preparar datos del pago
      // Si viene el objeto pago, usar sus valores, sino crear uno por defecto
      const fechaPago = data.pago?.fecha_pago || data.fecha_inicio;
      const estadoPago = data.pago?.estado || 'pendiente';
      const observacionesPago = data.pago?.observaciones || null;

      // Validar estado del pago
      const estadosPagoValidos = ['pendiente', 'parcial', 'completo', 'cancelado'];
      if (!estadosPagoValidos.includes(estadoPago.toLowerCase())) {
        throw new Error(`El estado del pago debe ser uno de: ${estadosPagoValidos.join(', ')}`);
      }

      // Crear el pago (siempre se crea, incluso sin detalles)
      const pagoData = {
        tipo: 'ingreso',
        fecha_pago: fechaPago,
        estado: estadoPago,
        observaciones: observacionesPago,
        id_empleado: null // Los ingresos no tienen empleado asociado
      };

      const pago = await pagoRepository.create(pagoData, transaction);

      // Crear detalles de pago si se proporcionan (opcional)
      // Si no se proporcionan detalles, el pago se crea vacío (sin detalles)
      const detallesPago = data.pago?.detalles || [];
      if (detallesPago.length > 0) {
        for (const detalle of detallesPago) {
          if (!detalle.metodo_pago || detalle.monto_parcial === undefined || detalle.monto_parcial === null || !detalle.fecha_detalle) {
            throw new Error('Los detalles de pago deben tener metodo_pago, monto_parcial y fecha_detalle');
          }

          const detalleData = {
            metodo_pago: detalle.metodo_pago,
            monto_parcial: detalle.monto_parcial,
            fecha_detalle: detalle.fecha_detalle,
            referencia_transferencia: detalle.referencia_transferencia || null,
            id_pago: pago.id_pago
          };

          await detallePagoRepository.create(detalleData, transaction);
        }
      }
      // Si no hay detalles, el pago se crea sin detalles (esto es válido)

      // Crear la membresía
      const membresiaData = {
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin || null,
        estado: estadoMembrecia,
        id_alumno: data.id_alumno,
        id_pago: pago.id_pago,
        id_tipo_membrecia: data.id_tipo_membrecia,
        id_grupo: data.id_grupo
      };

      const membresia = await membresiaRepository.create(membresiaData, transaction);

      // Commit de la transacción
      await transaction.commit();

      // Retornar la membresía con sus relaciones
      return await membresiaRepository.findById(membresia.id_membrecia);
    } catch (error) {
      // Rollback en caso de error
      await transaction.rollback();
      throw new Error(`Error al crear membresía con pago: ${error.message}`);
    }
  }

  async updateMembrecia(id, data) {
    try {
      // Si viene con datos de pago y detalles, usar el método con transacciones
      if (data.pago) {
        return await this.updateMembreciaConPago(id, data);
      }

      // Validar fechas si se están actualizando
      if (data.fecha_inicio && data.fecha_fin) {
        if (data.fecha_fin < data.fecha_inicio) {
          throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
      }

      // Validar estado si se está actualizando
      if (data.estado) {
        const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
        if (!estadosValidos.includes(data.estado.toLowerCase())) {
          throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
        }
      }

      // Validar relaciones si se están actualizando
      if (data.id_pago) {
        const pago = await pagoRepository.findById(data.id_pago);
        if (!pago) {
          throw new Error('El pago especificado no existe');
        }
        if (pago.tipo !== 'ingreso') {
          throw new Error('El pago debe ser de tipo ingreso');
        }
      }

      if (data.id_tipo_membrecia) {
        const tipo = await tipoMembreciaRepository.findById(data.id_tipo_membrecia);
        if (!tipo) {
          throw new Error('El tipo de membresía especificado no existe');
        }
      }

      if (data.id_alumno) {
        const alumno = await alumnoRepository.findById(data.id_alumno);
        if (!alumno) {
          throw new Error('El alumno especificado no existe');
        }
      }

      if (data.id_grupo) {
        const grupo = await grupoRepository.findById(data.id_grupo);
        if (!grupo) {
          throw new Error('El grupo especificado no existe');
        }
      }

      const membresia = await membresiaRepository.update(id, data);
      if (!membresia) {
        throw new Error('Membresía no encontrada');
      }
      return membresia;
    } catch (error) {
      throw new Error(`Error al actualizar membresía: ${error.message}`);
    }
  }

  async updateMembreciaConPago(id, data) {
    const transaction = await sequelize.transaction();
    
    try {
      // Verificar que la membresía existe
      const membresiaExistente = await membresiaRepository.findById(id);
      if (!membresiaExistente) {
        throw new Error('Membresía no encontrada');
      }

      // Validar fechas si se están actualizando
      if (data.fecha_inicio && data.fecha_fin) {
        if (data.fecha_fin < data.fecha_inicio) {
          throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
      }

      // Validar estado si se está actualizando
      if (data.estado) {
        const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
        if (!estadosValidos.includes(data.estado.toLowerCase())) {
          throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
        }
      }

      // Validar relaciones si se están actualizando
      if (data.id_tipo_membrecia) {
        const tipo = await tipoMembreciaRepository.findById(data.id_tipo_membrecia);
        if (!tipo) {
          throw new Error('El tipo de membresía especificado no existe');
        }
      }

      if (data.id_alumno) {
        const alumno = await alumnoRepository.findById(data.id_alumno);
        if (!alumno) {
          throw new Error('El alumno especificado no existe');
        }
      }

      if (data.id_grupo) {
        const grupo = await grupoRepository.findById(data.id_grupo);
        if (!grupo) {
          throw new Error('El grupo especificado no existe');
        }
      }

      // Obtener el ID del pago existente de la membresía
      const idPagoExistente = membresiaExistente.id_pago;

      // Preparar datos de la membresía (sin incluir el objeto pago)
      const membresiaData = {
        ...(data.fecha_inicio && { fecha_inicio: data.fecha_inicio }),
        ...(data.fecha_fin !== undefined && { fecha_fin: data.fecha_fin }),
        ...(data.estado && { estado: data.estado }),
        ...(data.id_alumno && { id_alumno: data.id_alumno }),
        ...(data.id_tipo_membrecia && { id_tipo_membrecia: data.id_tipo_membrecia }),
        ...(data.id_grupo && { id_grupo: data.id_grupo })
      };

      // Actualizar la membresía
      await membresiaRepository.update(id, membresiaData, transaction);

      // Manejar actualización del pago si viene en los datos
      if (data.pago && idPagoExistente) {
        const pagoData = data.pago;

        // Validar estado del pago si se está actualizando
        if (pagoData.estado) {
          const estadosPagoValidos = ['pendiente', 'parcial', 'completo', 'cancelado'];
          if (!estadosPagoValidos.includes(pagoData.estado.toLowerCase())) {
            throw new Error(`El estado del pago debe ser uno de: ${estadosPagoValidos.join(', ')}`);
          }
        }

        // Actualizar el pago
        const pagoUpdateData = {
          ...(pagoData.fecha_pago && { fecha_pago: pagoData.fecha_pago }),
          ...(pagoData.estado && { estado: pagoData.estado }),
          ...(pagoData.observaciones !== undefined && { observaciones: pagoData.observaciones })
        };

        if (Object.keys(pagoUpdateData).length > 0) {
          await pagoRepository.update(idPagoExistente, pagoUpdateData, transaction);
        }

        // Manejar detalles de pago
        if (pagoData.detalles && Array.isArray(pagoData.detalles)) {
          // Obtener detalles existentes
          const detallesExistentes = await detallePagoRepository.findByPagoId(idPagoExistente);
          const idsDetallesExistentes = detallesExistentes.map(d => d.id_detalle_pago);
          const idsDetallesEnviados = pagoData.detalles
            .filter(d => d.id_detalle_pago)
            .map(d => d.id_detalle_pago);

          // Eliminar detalles que no están en la lista enviada
          const idsDetallesAEliminar = idsDetallesExistentes.filter(
            id => !idsDetallesEnviados.includes(id)
          );
          for (const idDetalle of idsDetallesAEliminar) {
            await detallePagoRepository.delete(idDetalle, transaction);
          }

          // Procesar cada detalle enviado
          for (const detalle of pagoData.detalles) {
            if (!detalle.metodo_pago || !detalle.monto_parcial || !detalle.fecha_detalle) {
              throw new Error('Los detalles de pago deben tener metodo_pago, monto_parcial y fecha_detalle');
            }

            if (detalle.id_detalle_pago) {
              // Actualizar detalle existente
              const detalleUpdateData = {
                metodo_pago: detalle.metodo_pago,
                monto_parcial: detalle.monto_parcial,
                fecha_detalle: detalle.fecha_detalle,
                ...(detalle.referencia_transferencia !== undefined && { 
                  referencia_transferencia: detalle.referencia_transferencia 
                })
              };
              await detallePagoRepository.update(detalle.id_detalle_pago, detalleUpdateData, transaction);
            } else {
              // Crear nuevo detalle
              const detalleCreateData = {
                metodo_pago: detalle.metodo_pago,
                monto_parcial: detalle.monto_parcial,
                fecha_detalle: detalle.fecha_detalle,
                referencia_transferencia: detalle.referencia_transferencia || null,
                id_pago: idPagoExistente
              };
              await detallePagoRepository.create(detalleCreateData, transaction);
            }
          }
        }
      }

      // Commit de la transacción
      await transaction.commit();

      // Retornar la membresía actualizada con sus relaciones
      return await membresiaRepository.findByIdWithAllDetails(id);
    } catch (error) {
      // Rollback en caso de error
      await transaction.rollback();
      throw new Error(`Error al actualizar membresía con pago: ${error.message}`);
    }
  }

  async deleteMembrecia(id) {
    try {
      const deleted = await membresiaRepository.delete(id);
      if (!deleted) {
        throw new Error('Membresía no encontrada');
      }
      return { message: 'Membresía eliminada correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar membresía: ${error.message}`);
    }
  }

  async getMembreciaCompletaById(id) {
    try {
      const membresia = await membresiaRepository.findByIdWithAllDetails(id);
      if (!membresia) {
        throw new Error('Membresía no encontrada');
      }
      return membresia;
    } catch (error) {
      throw new Error(`Error al obtener membresía completa: ${error.message}`);
    }
  }
}

export default new MembreciaService();

