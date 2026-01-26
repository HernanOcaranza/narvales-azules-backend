import grupoHorarioRepository from '../repositories/grupo_horario.repository.js';
import claseRepository from '../repositories/clase.repository.js';
import db from '../models/index.js';

const { Grupo } = db;

class ClaseGeneratorService {
  /**
   * Genera todas las clases de un grupo para un mes específico
   * basándose en los horarios configurados del grupo
   * 
   * @param {number} idGrupo - ID del grupo
   * @param {Date} fechaInicio - Fecha de inicio del mes (primer día del mes)
   * @param {Date} fechaFin - Fecha de fin del mes (último día del mes)
   * @returns {Promise<Array>} Array de clases creadas
   */
  async generarClasesParaMes(idGrupo, fechaInicio, fechaFin) {
    try {
      // Verificar que el grupo existe
      const grupo = await Grupo.findByPk(idGrupo);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }

      // Verificar que el grupo esté activo
      if (grupo.estado !== 1) {
        throw new Error('No se pueden generar clases para un grupo inactivo');
      }

      // Obtener todos los horarios activos del grupo
      const horarios = await grupoHorarioRepository.findByGrupo(idGrupo);
      
      if (!horarios || horarios.length === 0) {
        throw new Error('El grupo no tiene horarios configurados');
      }

      // Normalizar fechas
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      // Asegurar que las fechas sean del inicio y fin del mes
      inicio.setHours(0, 0, 0, 0);
      fin.setHours(23, 59, 59, 999);

      const clasesCreadas = [];
      const clasesExistentes = await this.obtenerClasesExistentes(idGrupo, inicio, fin);

      // Para cada horario, generar las clases del mes
      for (const horario of horarios) {
        const fechasDelMes = this.calcularFechasDelMes(
          horario.dia_semana,
          inicio,
          fin
        );

        // Crear clase para cada fecha
        for (const fecha of fechasDelMes) {
          // Verificar si ya existe una clase para esta fecha y hora
          const existe = clasesExistentes.some(
            clase => 
              clase.fecha_clase.toISOString().split('T')[0] === fecha.toISOString().split('T')[0] &&
              clase.hora_inicio === horario.hora_inicio
          );

          if (!existe) {
            try {
              const nuevaClase = await claseRepository.create({
                fecha_clase: fecha,
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
                id_grupo: idGrupo,
                estado: 'pendiente'
              });
              clasesCreadas.push(nuevaClase);
            } catch (error) {
              // Si hay un error al crear una clase específica, continuar con las demás
              console.error(`Error al crear clase para ${fecha}:`, error.message);
            }
          }
        }
      }

      return clasesCreadas;
    } catch (error) {
      throw new Error(`Error al generar clases: ${error.message}`);
    }
  }

  /**
   * Calcula todas las fechas de un mes que corresponden a un día de la semana específico
   * 
   * @param {number} diaSemana - Día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
   * @param {Date} fechaInicio - Fecha de inicio del mes
   * @param {Date} fechaFin - Fecha de fin del mes
   * @returns {Array<Date>} Array de fechas que corresponden al día de la semana
   */
  calcularFechasDelMes(diaSemana, fechaInicio, fechaFin) {
    const fechas = [];
    const fechaActual = new Date(fechaInicio);

    // Avanzar hasta el primer día de la semana que coincida
    while (fechaActual.getDay() !== diaSemana && fechaActual <= fechaFin) {
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    // Si no encontramos el día en el rango, retornar array vacío
    if (fechaActual > fechaFin) {
      return fechas;
    }

    // Agregar todas las fechas que coincidan con el día de la semana
    while (fechaActual <= fechaFin) {
      fechas.push(new Date(fechaActual));
      fechaActual.setDate(fechaActual.getDate() + 7); // Siguiente semana
    }

    return fechas;
  }

  /**
   * Obtiene las clases existentes de un grupo en un rango de fechas
   * 
   * @param {number} idGrupo - ID del grupo
   * @param {Date} fechaInicio - Fecha de inicio
   * @param {Date} fechaFin - Fecha de fin
   * @returns {Promise<Array>} Array de clases existentes
   */
  async obtenerClasesExistentes(idGrupo, fechaInicio, fechaFin) {
    const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
    const fechaFinStr = fechaFin.toISOString().split('T')[0];
    
    const todasLasClases = await claseRepository.findByFechaRange(fechaInicioStr, fechaFinStr);
    
    // Filtrar solo las clases del grupo específico
    return todasLasClases.filter(clase => clase.id_grupo === idGrupo);
  }

  /**
   * Genera clases para el mes actual de un grupo
   * 
   * @param {number} idGrupo - ID del grupo
   * @returns {Promise<Array>} Array de clases creadas
   */
  async generarClasesMesActual(idGrupo) {
    const ahora = new Date();
    const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
    
    return await this.generarClasesParaMes(idGrupo, primerDia, ultimoDia);
  }

  /**
   * Genera clases para el próximo mes de un grupo
   * 
   * @param {number} idGrupo - ID del grupo
   * @returns {Promise<Array>} Array de clases creadas
   */
  async generarClasesProximoMes(idGrupo) {
    const ahora = new Date();
    const primerDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1);
    const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 2, 0);
    
    return await this.generarClasesParaMes(idGrupo, primerDia, ultimoDia);
  }

  /**
   * Genera clases para todos los grupos activos del mes actual o de un mes específico
   * 
   * @param {number} mes - Mes específico (1-12). Si no se proporciona, usa el mes actual
   * @param {number} anio - Año específico. Si no se proporciona, usa el año actual
   * @returns {Promise<Object>} Objeto con resumen de clases creadas por grupo
   */
  async generarClasesTodosLosGrupos(mes = null, anio = null) {
    try {
      const grupos = await Grupo.findAll({
        where: { estado: 1 }
      });

      const resultado = {
        gruposProcesados: 0,
        gruposConError: 0,
        totalClasesCreadas: 0,
        detalles: [],
        mes: null,
        anio: null
      };

      // Determinar mes y año
      let fechaInicio, fechaFin;
      if (mes && anio) {
        fechaInicio = new Date(anio, mes - 1, 1);
        fechaFin = new Date(anio, mes, 0);
        resultado.mes = mes;
        resultado.anio = anio;
      } else {
        const ahora = new Date();
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        fechaFin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
        resultado.mes = ahora.getMonth() + 1;
        resultado.anio = ahora.getFullYear();
      }

      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin.setHours(23, 59, 59, 999);

      for (const grupo of grupos) {
        try {
          let clasesCreadas;
          if (mes && anio) {
            clasesCreadas = await this.generarClasesParaMes(grupo.id_grupo, fechaInicio, fechaFin);
          } else {
            clasesCreadas = await this.generarClasesMesActual(grupo.id_grupo);
          }
          
          resultado.gruposProcesados++;
          resultado.totalClasesCreadas += clasesCreadas.length;
          resultado.detalles.push({
            id_grupo: grupo.id_grupo,
            nombre: grupo.nombre,
            clasesCreadas: clasesCreadas.length,
            exito: true
          });
        } catch (error) {
          resultado.gruposConError++;
          resultado.detalles.push({
            id_grupo: grupo.id_grupo,
            nombre: grupo.nombre,
            clasesCreadas: 0,
            exito: false,
            error: error.message
          });
        }
      }

      return resultado;
    } catch (error) {
      throw new Error(`Error al generar clases para todos los grupos: ${error.message}`);
    }
  }
}

export default new ClaseGeneratorService();

