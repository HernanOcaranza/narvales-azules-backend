import membresiaRepository from '../repositories/membrecia.repository.js';
import pagoRepository from '../repositories/pago.repository.js';
import detallePagoRepository from '../repositories/detalle_pago.repository.js';
import tipoMembreciaRepository from '../repositories/tipo_membrecia.repository.js';
import alumnoRepository from '../repositories/alumno.repository.js';
import grupoRepository from '../repositories/grupo.repository.js';
import precioMembreciaRepository from '../repositories/precio_membrecia.repository.js';
import { sequelize } from '../config/database.js';

class MembreciaService {
  /**
   * Calcula la fecha de fin basándose en la fecha de inicio y la duración en días
   * Si duracion_dias es 30, calcula como un mes calendario exacto
   * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD
   * @param {number} duracionDias - Duración en días
   * @returns {string|null} - Fecha de fin en formato YYYY-MM-DD o null
   */
  calcularFechaFin(fechaInicio, duracionDias) {
    if (!fechaInicio || !duracionDias) return null;
    
    const fecha = new Date(fechaInicio);
    
    // Si es 30 días, calcular como un mes calendario exacto
    if (duracionDias === 30) {
      const diaOriginal = fecha.getDate();
      fecha.setMonth(fecha.getMonth() + 1);
      // Ajustar si el día no existe en el mes siguiente (ej: 31 de enero -> 28/29 de febrero)
      const ultimoDiaDelMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
      fecha.setDate(Math.min(diaOriginal, ultimoDiaDelMes));
    } else {
      // Para otros valores, usar días fijos (el día de inicio cuenta como día 1)
      fecha.setDate(fecha.getDate() + duracionDias - 1);
    }
    
    return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  /**
   * Calcula el estado del pago basado en el total pagado y el precio de la membresía
   * @param {number} totalPagado - Total de los detalles de pago
   * @param {number} precioMembrecia - Precio de la membresía
   * @returns {string} - Estado del pago: 'pendiente', 'parcial', 'completo'
   */
  calcularEstadoPago(totalPagado, precioMembrecia) {
    if (!precioMembrecia || precioMembrecia <= 0) {
      // Si no hay precio definido, considerar como pendiente
      return 'pendiente';
    }

    if (totalPagado <= 0) {
      return 'pendiente';
    } else if (totalPagado >= precioMembrecia) {
      return 'completo';
    } else {
      return 'parcial';
    }
  }

  /**
   * Calcula el total pagado a partir de los detalles de pago
   * @param {Array} detalles - Array de detalles de pago
   * @returns {number} - Total pagado
   */
  calcularTotalPagado(detalles) {
    if (!detalles || detalles.length === 0) {
      return 0;
    }
    return detalles.reduce((total, detalle) => {
      const monto = parseFloat(detalle.monto_parcial) || 0;
      return total + monto;
    }, 0);
  }

  async getAllMembresias(filtros = {}) {
    try {
      const { page = 1, limit = 10, ...filtrosRest } = filtros;
      const offset = (page - 1) * limit;
      
      // Validar y procesar filtros
      const filtrosProcesados = {};

      // Validar idAlumno
      if (filtrosRest.idAlumno !== undefined && filtrosRest.idAlumno !== null && filtrosRest.idAlumno !== '') {
        const idAlumno = parseInt(filtrosRest.idAlumno);
        if (isNaN(idAlumno)) {
          throw new Error('El filtro idAlumno debe ser un número válido');
        }
        filtrosProcesados.idAlumno = idAlumno;
      }

      // Validar estado
      if (filtrosRest.estado !== undefined && filtrosRest.estado !== null && filtrosRest.estado !== '') {
        const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
        if (!estadosValidos.includes(filtrosRest.estado.toLowerCase())) {
          throw new Error(`El filtro estado debe ser uno de: ${estadosValidos.join(', ')}`);
        }
        filtrosProcesados.estado = filtrosRest.estado.toLowerCase();
      }

      // Validar idTipoMembrecia
      if (filtrosRest.idTipoMembrecia !== undefined && filtrosRest.idTipoMembrecia !== null && filtrosRest.idTipoMembrecia !== '') {
        const idTipoMembrecia = parseInt(filtrosRest.idTipoMembrecia);
        if (isNaN(idTipoMembrecia)) {
          throw new Error('El filtro idTipoMembrecia debe ser un número válido');
        }
        filtrosProcesados.idTipoMembrecia = idTipoMembrecia;
      }

      // Validar idGrupo
      if (filtrosRest.idGrupo !== undefined && filtrosRest.idGrupo !== null && filtrosRest.idGrupo !== '') {
        const idGrupo = parseInt(filtrosRest.idGrupo);
        if (isNaN(idGrupo)) {
          throw new Error('El filtro idGrupo debe ser un número válido');
        }
        filtrosProcesados.idGrupo = idGrupo;
      }

      // Validar fechaDesde
      if (filtrosRest.fechaDesde !== undefined && filtrosRest.fechaDesde !== null && filtrosRest.fechaDesde !== '') {
        const fechaDesde = new Date(filtrosRest.fechaDesde);
        if (isNaN(fechaDesde.getTime())) {
          throw new Error('El filtro fechaDesde debe tener formato YYYY-MM-DD');
        }
        // Validar formato YYYY-MM-DD
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(filtrosRest.fechaDesde)) {
          throw new Error('El filtro fechaDesde debe tener formato YYYY-MM-DD');
        }
        filtrosProcesados.fechaDesde = filtrosRest.fechaDesde;
      }

      // Validar fechaHasta
      if (filtrosRest.fechaHasta !== undefined && filtrosRest.fechaHasta !== null && filtrosRest.fechaHasta !== '') {
        const fechaHasta = new Date(filtrosRest.fechaHasta);
        if (isNaN(fechaHasta.getTime())) {
          throw new Error('El filtro fechaHasta debe tener formato YYYY-MM-DD');
        }
        // Validar formato YYYY-MM-DD
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(filtrosRest.fechaHasta)) {
          throw new Error('El filtro fechaHasta debe tener formato YYYY-MM-DD');
        }
        filtrosProcesados.fechaHasta = filtrosRest.fechaHasta;
      }

      // Validar que fechaDesde no sea mayor que fechaHasta
      if (filtrosProcesados.fechaDesde && filtrosProcesados.fechaHasta) {
        if (filtrosProcesados.fechaDesde > filtrosProcesados.fechaHasta) {
          throw new Error('La fechaDesde no puede ser mayor que fechaHasta');
        }
      }

      return await membresiaRepository.findAll({ ...filtrosProcesados, limit, offset });
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

      // Calcular fecha_fin automáticamente basándose en duracion_dias del tipo de membresía
      // La fecha_fin se calcula siempre en el backend, ignorando cualquier valor que venga del frontend
      let fechaFin = null;
      if (tipo.duracion_dias) {
        const fechaInicio = new Date(data.fecha_inicio);
        fechaInicio.setDate(fechaInicio.getDate() + tipo.duracion_dias - 1); // -1 porque el día de inicio cuenta
        fechaFin = fechaInicio.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      }

      // Validar estado
      const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
      if (!estadosValidos.includes(data.estado.toLowerCase())) {
        throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
      }

      // Crear la membresía con la fecha_fin calculada automáticamente
      const membresiaData = {
        fecha_inicio: data.fecha_inicio,
        fecha_fin: this.calcularFechaFin(data.fecha_inicio, tipo.duracion_dias), // Siempre usar la fecha calculada, ignorar data.fecha_fin del frontend
        estado: data.estado,
        id_alumno: data.id_alumno,
        id_pago: data.id_pago,
        id_tipo_membrecia: data.id_tipo_membrecia,
        id_grupo: data.id_grupo
      };

      return await membresiaRepository.create(membresiaData);
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

      // Calcular fecha_fin automáticamente basándose en duracion_dias del tipo de membresía
      // La fecha_fin se calcula siempre en el backend, ignorando cualquier valor que venga del frontend
      const fechaFin = this.calcularFechaFin(data.fecha_inicio, tipo.duracion_dias);

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
        fecha_fin: fechaFin || null,
        estado: estadoMembrecia,
        id_alumno: data.id_alumno,
        id_pago: pago.id_pago,
        id_tipo_membrecia: data.id_tipo_membrecia,
        id_grupo: data.id_grupo
      };

      const membresia = await membresiaRepository.create(membresiaData, transaction);

      // Calcular el estado del pago basado en el total pagado y el precio de la membresía
      // Obtener los detalles de pago creados
      const detallesCreados = await detallePagoRepository.findByPagoId(pago.id_pago, transaction);
      const totalPagado = this.calcularTotalPagado(detallesCreados);
      
      // Obtener el precio vigente de la membresía para la fecha de inicio
      const precioVigente = await precioMembreciaRepository.findPrecioVigente(
        data.id_tipo_membrecia,
        data.fecha_inicio
      );
      
      const precioMembrecia = precioVigente ? parseFloat(precioVigente.precio) : 0;
      const nuevoEstadoPago = this.calcularEstadoPago(totalPagado, precioMembrecia);
      
      // Actualizar el estado del pago si es diferente al inicial
      if (nuevoEstadoPago !== estadoPago.toLowerCase()) {
        await pagoRepository.update(pago.id_pago, { estado: nuevoEstadoPago }, transaction);
      }

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

      // Obtener la membresía existente para usar valores actuales si no se actualizan
      const membresiaExistente = await membresiaRepository.findById(id);
      if (!membresiaExistente) {
        throw new Error('Membresía no encontrada');
      }

      // Determinar el tipo de membresía a usar (nuevo o existente)
      const idTipoMembrecia = data.id_tipo_membrecia || membresiaExistente.id_tipo_membrecia;
      const tipo = await tipoMembreciaRepository.findById(idTipoMembrecia);
      if (!tipo) {
        throw new Error('El tipo de membresía especificado no existe');
      }

      // Determinar la fecha de inicio a usar (nueva o existente)
      const fechaInicio = data.fecha_inicio || membresiaExistente.fecha_inicio;

      // Calcular fecha_fin automáticamente si se actualiza fecha_inicio o id_tipo_membrecia
      // La fecha_fin siempre se calcula en el backend, ignorando cualquier valor del frontend
      const fechaFin = this.calcularFechaFin(fechaInicio, tipo.duracion_dias);

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

      // Preparar datos de actualización, ignorando fecha_fin del frontend y usando la calculada
      // Si fechaFin es null (tipo sin duracion_dias), mantener la fecha_fin existente
      const { fecha_fin, ...dataSinFechaFin } = data; // Excluir fecha_fin del frontend
      const dataActualizada = {
        ...dataSinFechaFin,
        ...(fechaFin !== null && { fecha_fin: fechaFin }) // Solo agregar si se calculó
      };

      const membresia = await membresiaRepository.update(id, dataActualizada);
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

      // Determinar el tipo de membresía a usar (nuevo o existente)
      const idTipoMembrecia = data.id_tipo_membrecia || membresiaExistente.id_tipo_membrecia;
      const tipo = await tipoMembreciaRepository.findById(idTipoMembrecia);
      if (!tipo) {
        throw new Error('El tipo de membresía especificado no existe');
      }

      // Determinar la fecha de inicio a usar (nueva o existente)
      const fechaInicio = data.fecha_inicio || membresiaExistente.fecha_inicio;

      // Calcular fecha_fin automáticamente si se actualiza fecha_inicio o id_tipo_membrecia
      // La fecha_fin siempre se calcula en el backend, ignorando cualquier valor del frontend
      let fechaFin = null;
      if (tipo.duracion_dias && fechaInicio) {
        const fecha = new Date(fechaInicio);
        fecha.setDate(fecha.getDate() + tipo.duracion_dias - 1); // -1 porque el día de inicio cuenta
        fechaFin = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      }

      // Validar estado si se está actualizando
      if (data.estado) {
        const estadosValidos = ['activa', 'vencida', 'suspendida', 'cancelada'];
        if (!estadosValidos.includes(data.estado.toLowerCase())) {
          throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
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
      // La fecha_fin siempre se calcula automáticamente, ignorando cualquier valor del frontend
      const membresiaData = {
        ...(data.fecha_inicio && { fecha_inicio: data.fecha_inicio }),
        ...(fechaFin !== null && { fecha_fin: fechaFin }),
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
          const detallesExistentes = await detallePagoRepository.findByPagoId(idPagoExistente, transaction);
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

          // Recalcular el estado del pago después de actualizar los detalles
          const detallesActualizados = await detallePagoRepository.findByPagoId(idPagoExistente, transaction);
          const totalPagado = this.calcularTotalPagado(detallesActualizados);
          
          // Obtener el tipo de membresía actual (puede haber cambiado)
          const membresiaActualizada = await membresiaRepository.findById(id, transaction);
          const idTipoMembreciaActual = membresiaActualizada.id_tipo_membrecia;
          const fechaInicioActual = membresiaActualizada.fecha_inicio;
          
          // Obtener el precio vigente de la membresía
          const precioVigente = await precioMembreciaRepository.findPrecioVigente(
            idTipoMembreciaActual,
            fechaInicioActual
          );
          
          const precioMembrecia = precioVigente ? parseFloat(precioVigente.precio) : 0;
          const nuevoEstadoPago = this.calcularEstadoPago(totalPagado, precioMembrecia);
          
          // Actualizar el estado del pago si es diferente al actual
          const pagoActual = await pagoRepository.findById(idPagoExistente);
          if (pagoActual && nuevoEstadoPago !== pagoActual.estado.toLowerCase()) {
            await pagoRepository.update(idPagoExistente, { estado: nuevoEstadoPago }, transaction);
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

  /**
   * Actualiza automáticamente el estado de las membresías activas que han vencido
   * Cambia su estado a "vencida" si la fecha_fin ya pasó
   * Solo actualiza membresías que estén en estado "activa"
   */
  async actualizarEstadosAutomaticamente() {
    try {
      const membresiasVencidas = await membresiaRepository.findMembresiasVencidas();
      
      if (membresiasVencidas.length === 0) {
        return {
          membresiasActualizadas: 0,
          mensaje: 'No hay membresías activas que hayan vencido'
        };
      }

      // Filtrar solo las que están activas (aunque el query ya filtra por activa)
      // Por seguridad, verificamos que el estado sea activa
      const idsParaActualizar = membresiasVencidas
        .filter(membresia => membresia.estado === 'activa')
        .map(membresia => membresia.id_membrecia);

      if (idsParaActualizar.length === 0) {
        return {
          membresiasActualizadas: 0,
          mensaje: 'No hay membresías activas para actualizar'
        };
      }

      // Actualizar todas las membresías a estado "vencida"
      const numActualizadas = await membresiaRepository.updateEstadoMasivo(idsParaActualizar, 'vencida');

      return {
        membresiasActualizadas: numActualizadas,
        mensaje: `${numActualizadas} membresía(s) actualizada(s) a estado "vencida"`
      };
    } catch (error) {
      throw new Error(`Error al actualizar estados automáticamente: ${error.message}`);
    }
  }
}

export default new MembreciaService();

