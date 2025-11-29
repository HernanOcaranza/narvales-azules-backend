import cron from 'node-cron';
import claseGeneratorService from './clase-generator.service.js';
import claseService from './clase.service.js';

class SchedulerService {
  constructor() {
    this.tareas = [];
  }

  /**
   * Inicializa todas las tareas programadas
   */
  iniciar() {
    console.log('🕐 Iniciando tareas programadas...');

    // Tarea: Generar clases el día 1 de cada mes a las 00:00
    // Cron: '0 0 1 * *' = minuto 0, hora 0, día 1, cualquier mes, cualquier día de la semana
    const generarClasesMensual = cron.schedule('0 0 1 * *', async () => {
      console.log('📅 Ejecutando tarea programada: Generar clases del mes...');
      try {
        const resultado = await claseGeneratorService.generarClasesTodosLosGrupos();
        console.log('✅ Clases generadas correctamente:', {
          gruposProcesados: resultado.gruposProcesados,
          totalClasesCreadas: resultado.totalClasesCreadas,
          gruposConError: resultado.gruposConError
        });
      } catch (error) {
        console.error('❌ Error al generar clases automáticamente:', error.message);
      }
    }, {
      scheduled: false, // No iniciar automáticamente
      timezone: 'America/Argentina/Buenos_Aires' // Ajustar según tu zona horaria
    });

    this.tareas.push({
      nombre: 'generarClasesMensual',
      tarea: generarClasesMensual,
      descripcion: 'Genera clases para todos los grupos el día 1 de cada mes'
    });

    // Tarea: Actualizar estados de clases finalizadas cada 15 minutos
    // Cron: '*/15 * * * *' = cada 15 minutos
    const actualizarEstadosClases = cron.schedule('*/15 * * * *', async () => {
      console.log('🔄 Ejecutando tarea programada: Actualizar estados de clases finalizadas...');
      try {
        const resultado = await claseService.actualizarEstadosAutomaticamente();
        if (resultado.clasesActualizadas > 0) {
          console.log(`✅ ${resultado.mensaje}`);
        }
      } catch (error) {
        console.error('❌ Error al actualizar estados de clases automáticamente:', error.message);
      }
    }, {
      scheduled: false, // No iniciar automáticamente
      timezone: 'America/Argentina/Buenos_Aires' // Ajustar según tu zona horaria
    });

    this.tareas.push({
      nombre: 'actualizarEstadosClases',
      tarea: actualizarEstadosClases,
      descripcion: 'Actualiza automáticamente el estado de clases finalizadas cada 15 minutos'
    });

    // Iniciar todas las tareas
    this.tareas.forEach(tarea => {
      tarea.tarea.start();
      console.log(`✅ Tarea programada iniciada: ${tarea.descripcion}`);
    });

    console.log(`✅ ${this.tareas.length} tarea(s) programada(s) iniciada(s)`);
  }

  /**
   * Detiene todas las tareas programadas
   */
  detener() {
    console.log('🛑 Deteniendo tareas programadas...');
    this.tareas.forEach(tarea => {
      tarea.tarea.stop();
      console.log(`⏹️  Tarea detenida: ${tarea.descripcion}`);
    });
    this.tareas = [];
    console.log('✅ Todas las tareas han sido detenidas');
  }

  /**
   * Ejecuta manualmente la generación de clases (útil para testing)
   */
  async ejecutarGeneracionClases() {
    console.log('🔄 Ejecutando generación de clases manualmente...');
    try {
      const resultado = await claseGeneratorService.generarClasesTodosLosGrupos();
      console.log('✅ Clases generadas correctamente:', resultado);
      return resultado;
    } catch (error) {
      console.error('❌ Error al generar clases:', error.message);
      throw error;
    }
  }

  /**
   * Obtiene el estado de las tareas programadas
   */
  obtenerEstado() {
    return this.tareas.map(tarea => ({
      nombre: tarea.nombre,
      descripcion: tarea.descripcion,
      activa: tarea.tarea.running || false
    }));
  }
}

export default new SchedulerService();

