import db from '../models/index.js';
import pdfService from './pdf.service.js';

class ReporteService {
  async getAsistenciaAlumnos(filtros = {}) {
    const { tipo, idGrupo, idAlumno, fechaDesde, fechaHasta, soloActivas } = filtros;

    if (tipo === 'grupo') {
      return await this._asistenciaAlumnosPorGrupo(idGrupo, fechaDesde, fechaHasta, soloActivas);
    } else if (tipo === 'alumno') {
      return await this._asistenciaAlumnosPorAlumno(idAlumno, fechaDesde, fechaHasta);
    } else {
      return await this._asistenciaAlumnosGeneral(fechaDesde, fechaHasta, soloActivas);
    }
  }

  async _asistenciaAlumnosPorGrupo(idGrupo, fechaDesde, fechaHasta, soloActivas = true) {
    const grupo = await db.sequelize.query(
      `SELECT id_grupo, nombre FROM Grupo WHERE id_grupo = ? AND eliminado_en IS NULL`,
      { replacements: [idGrupo], type: db.Sequelize.QueryTypes.SELECT }
    );

    if (!grupo.length) throw new Error('Grupo no encontrado');

    const fechaFiltro = fechaDesde ? `AND c.fecha_clase BETWEEN ? AND ?` : '';
    const fechaParams = fechaDesde ? [fechaDesde, fechaHasta] : [];

    const clases = await db.sequelize.query(
      `SELECT c.id_clase, c.fecha_clase, c.hora_inicio, c.hora_fin
       FROM Clase c
       WHERE c.id_grupo = ? AND c.eliminado_en IS NULL AND c.estado = 'realizada'
       ${fechaFiltro}
       ORDER BY c.fecha_clase ASC, c.hora_inicio ASC`,
      { replacements: [idGrupo, ...fechaParams], type: db.Sequelize.QueryTypes.SELECT }
    );

    if (!clases.length) {
      return { grupo: grupo[0], clases: [], alumnos: [], totalClases: 0 };
    }

    const idsClases = clases.map(c => c.id_clase);

    let whereAdicional = soloActivas
      ? `AND m.estado = 'activa'`
      : `AND m.estado IN ('activa', 'vencida')`;

    const alumnos = await db.sequelize.query(
      `SELECT DISTINCT a.id_alumno, a.nombre, a.apellido, a.dni
       FROM Membrecia m
       INNER JOIN Alumno a ON m.id_alumno = a.id_alumno AND a.eliminado_en IS NULL AND a.estado = 1
       WHERE m.id_grupo = ? ${whereAdicional} AND m.eliminado_en IS NULL
       ORDER BY a.apellido, a.nombre`,
      { replacements: [idGrupo], type: db.Sequelize.QueryTypes.SELECT }
    );

    const asistencias = await db.sequelize.query(
      `SELECT a.id_alumno, a.id_clase, a.presente, a.observacion, a.es_recuperacion
       FROM Asistencia a
       WHERE a.id_clase IN (?) AND a.eliminado_en IS NULL`,
      { replacements: [idsClases], type: db.Sequelize.QueryTypes.SELECT }
    );

    const asistenciasMap = {};
    for (const asi of asistencias) {
      const key = `${asi.id_alumno}_${asi.id_clase}`;
      asistenciasMap[key] = asi;
    }

    const alumnosConAsistencia = alumnos.map(alumno => {
      const asistenciasAlumno = clases.map(clase => {
        const key = `${alumno.id_alumno}_${clase.id_clase}`;
        return asistenciasMap[key] || null;
      });
      const presentes = asistenciasAlumno.filter(a => a && a.presente === 1).length;
      const totales = asistenciasAlumno.filter(a => a !== null).length;
      return {
        id_alumno: alumno.id_alumno,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        dni: alumno.dni,
        asistencias: asistenciasAlumno,
        presentes,
        ausentes: totales - presentes,
        totalClases: totales,
        porcentaje: totales > 0 ? Math.round((presentes / totales) * 100) : 0
      };
    });

    return {
      grupo: grupo[0],
      clases,
      alumnos: alumnosConAsistencia,
      totalClases: clases.length
    };
  }

  async _asistenciaAlumnosPorAlumno(idAlumno, fechaDesde, fechaHasta) {
    const alumno = await db.sequelize.query(
      `SELECT id_alumno, nombre, apellido, dni FROM Alumno WHERE id_alumno = ? AND eliminado_en IS NULL`,
      { replacements: [idAlumno], type: db.Sequelize.QueryTypes.SELECT }
    );

    if (!alumno.length) throw new Error('Alumno no encontrado');

    let whereFecha = '';
    const params = [idAlumno];
    if (fechaDesde) {
      whereFecha = 'AND c.fecha_clase BETWEEN ? AND ?';
      params.push(fechaDesde, fechaHasta);
    }

    const asistencias = await db.sequelize.query(
      `SELECT a.id_asistencia, a.presente, a.observacion, a.es_recuperacion, a.id_clase,
              c.fecha_clase, c.hora_inicio, c.hora_fin, c.estado as estado_clase,
              g.nombre as grupo_nombre, g.id_grupo
       FROM Asistencia a
       INNER JOIN Clase c ON a.id_clase = c.id_clase AND c.eliminado_en IS NULL
       INNER JOIN Grupo g ON c.id_grupo = g.id_grupo AND g.eliminado_en IS NULL
       WHERE a.id_alumno = ? AND a.eliminado_en IS NULL
       ${whereFecha}
       ORDER BY c.fecha_clase DESC, c.hora_inicio DESC`,
      { replacements: params, type: db.Sequelize.QueryTypes.SELECT }
    );

    const presentes = asistencias.filter(a => a.presente === 1).length;
    const ausentes = asistencias.filter(a => a.presente === 0).length;

    return {
      alumno: alumno[0],
      total: asistencias.length,
      presentes,
      ausentes,
      porcentaje: asistencias.length > 0 ? Math.round((presentes / asistencias.length) * 100) : 0,
      asistencias
    };
  }

  async _asistenciaAlumnosGeneral(fechaDesde, fechaHasta, soloActivas = true) {
    let whereMembrecia = soloActivas ? "AND m.estado = 'activa'" : "AND m.estado IN ('activa', 'vencida')";
    let whereFecha = '';
    const params = [];
    if (fechaDesde) {
      whereFecha = 'AND c.fecha_clase BETWEEN ? AND ?';
      params.push(fechaDesde, fechaHasta);
    }

    const grupos = await db.sequelize.query(
      `SELECT g.id_grupo, g.nombre,
              COUNT(DISTINCT m.id_alumno) as total_alumnos,
              COUNT(DISTINCT c.id_clase) as total_clases
       FROM Grupo g
       LEFT JOIN Membrecia m ON g.id_grupo = m.id_grupo AND m.eliminado_en IS NULL ${whereMembrecia}
       LEFT JOIN Clase c ON g.id_grupo = c.id_grupo AND c.eliminado_en IS NULL AND c.estado = 'realizada' ${whereFecha}
       WHERE g.eliminado_en IS NULL AND g.estado = 1
       GROUP BY g.id_grupo, g.nombre
       ORDER BY g.nombre`,
      { replacements: params, type: db.Sequelize.QueryTypes.SELECT }
    );

    const resultado = [];
    for (const grupo of grupos) {
      let countParams = [grupo.id_grupo];
      let whereFechaCount = '';
      if (fechaDesde) {
        whereFechaCount = 'AND c.fecha_clase BETWEEN ? AND ?';
        countParams.push(fechaDesde, fechaHasta);
      }

      const asistenciasCount = await db.sequelize.query(
        `SELECT COUNT(*) as total,
                SUM(CASE WHEN a.presente = 1 THEN 1 ELSE 0 END) as presentes
         FROM Asistencia a
         INNER JOIN Clase c ON a.id_clase = c.id_clase AND c.eliminado_en IS NULL
         WHERE c.id_grupo = ? AND a.eliminado_en IS NULL ${whereFechaCount}`,
        { replacements: countParams, type: db.Sequelize.QueryTypes.SELECT }
      );

      const total = parseInt(asistenciasCount[0]?.total || 0);
      const presentes = parseInt(asistenciasCount[0]?.presentes || 0);

      resultado.push({
        id_grupo: grupo.id_grupo,
        grupo: grupo.nombre,
        total_alumnos: parseInt(grupo.total_alumnos),
        total_clases: parseInt(grupo.total_clases),
        total_asistencias: total,
        total_presentes: presentes,
        porcentaje: total > 0 ? Math.round((presentes / total) * 100) : 0
      });
    }

    return resultado;
  }

  async getAsistenciaEmpleados(filtros = {}) {
    const { tipo, idEmpleado, fechaDesde, fechaHasta } = filtros;

    if (tipo === 'empleado') {
      return await this._asistenciaEmpleadosPorEmpleado(idEmpleado, fechaDesde, fechaHasta);
    } else {
      return await this._asistenciaEmpleadosGeneral(fechaDesde, fechaHasta);
    }
  }

  async _asistenciaEmpleadosPorEmpleado(idEmpleado, fechaDesde, fechaHasta) {
    const empleado = await db.sequelize.query(
      `SELECT id_empleado, nombre, apellido, tipo, dni, email FROM Empleado WHERE id_empleado = ? AND estado = 1`,
      { replacements: [idEmpleado], type: db.Sequelize.QueryTypes.SELECT }
    );

    if (!empleado.length) throw new Error('Empleado no encontrado');

    let whereFecha = '';
    const params = [idEmpleado];
    if (fechaDesde) {
      whereFecha = 'AND c.fecha_clase BETWEEN ? AND ?';
      params.push(fechaDesde, fechaHasta);
    }

    const asistencias = await db.sequelize.query(
      `SELECT ce.id_clase, ce.presente, ce.rol,
              c.fecha_clase, c.hora_inicio, c.hora_fin, c.estado as estado_clase,
              g.nombre as grupo_nombre, g.id_grupo
       FROM Clase_Empleado ce
       INNER JOIN Clase c ON ce.id_clase = c.id_clase AND c.eliminado_en IS NULL
       INNER JOIN Grupo g ON c.id_grupo = g.id_grupo AND g.eliminado_en IS NULL
       WHERE ce.id_empleado = ?
       ${whereFecha}
       ORDER BY c.fecha_clase DESC, c.hora_inicio DESC`,
      { replacements: params, type: db.Sequelize.QueryTypes.SELECT }
    );

    const presentes = asistencias.filter(a => a.presente === 1).length;
    const ausentes = asistencias.filter(a => a.presente === 0).length;

    return {
      empleado: empleado[0],
      total: asistencias.length,
      presentes,
      ausentes,
      porcentaje: asistencias.length > 0 ? Math.round((presentes / asistencias.length) * 100) : 0,
      asistencias
    };
  }

  async _asistenciaEmpleadosGeneral(fechaDesde, fechaHasta) {
    let whereFecha = '';
    const params = [];
    if (fechaDesde) {
      whereFecha = 'AND c.fecha_clase BETWEEN ? AND ?';
      params.push(fechaDesde, fechaHasta);
    }

    const empleados = await db.sequelize.query(
      `SELECT e.id_empleado, e.nombre, e.apellido, e.tipo,
              COUNT(ce.id_clase) as total_clases,
              SUM(CASE WHEN ce.presente = 1 THEN 1 ELSE 0 END) as total_presentes
       FROM Empleado e
       LEFT JOIN Clase_Empleado ce ON e.id_empleado = ce.id_empleado
       LEFT JOIN Clase c ON ce.id_clase = c.id_clase AND c.eliminado_en IS NULL ${whereFecha}
       WHERE e.estado = 1
       GROUP BY e.id_empleado, e.nombre, e.apellido, e.tipo
       ORDER BY e.apellido, e.nombre`,
      { replacements: params, type: db.Sequelize.QueryTypes.SELECT }
    );

    return empleados.map(emp => ({
      id_empleado: emp.id_empleado,
      nombre: emp.nombre,
      apellido: emp.apellido,
      tipo: emp.tipo,
      total_clases: parseInt(emp.total_clases),
      total_presentes: parseInt(emp.total_presentes),
      total_ausentes: parseInt(emp.total_clases) - parseInt(emp.total_presentes),
      porcentaje: parseInt(emp.total_clases) > 0
        ? Math.round((parseInt(emp.total_presentes) / parseInt(emp.total_clases)) * 100)
        : 0
    }));
  }

  async getMembresias(filtros = {}) {
    const { tipo } = filtros;

    if (tipo === 'proximas-a-vencer') {
      return await this._membresiasProximasAVencer(filtros.dias);
    } else if (tipo === 'ingresos') {
      return await this._membresiasIngresos(filtros.fechaDesde, filtros.fechaHasta, filtros.agrupar);
    } else {
      return await this._membresiasListado(filtros);
    }
  }

  async _membresiasListado(filtros) {
    const condiciones = ['m.eliminado_en IS NULL'];
    const params = [];

    if (filtros.estado) {
      condiciones.push('m.estado = ?');
      params.push(filtros.estado);
    }
    if (filtros.idTipoMembrecia) {
      condiciones.push('m.id_tipo_membrecia = ?');
      params.push(filtros.idTipoMembrecia);
    }
    if (filtros.idGrupo) {
      condiciones.push('m.id_grupo = ?');
      params.push(filtros.idGrupo);
    }
    if (filtros.idAlumno) {
      condiciones.push('m.id_alumno = ?');
      params.push(filtros.idAlumno);
    }
    if (filtros.fechaDesde) {
      condiciones.push('(m.fecha_inicio BETWEEN ? AND ? OR m.fecha_fin BETWEEN ? AND ?)');
      params.push(filtros.fechaDesde, filtros.fechaHasta, filtros.fechaDesde, filtros.fechaHasta);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

    return await db.sequelize.query(
      `SELECT m.id_membrecia, m.fecha_inicio, m.fecha_fin, m.estado,
              a.id_alumno, a.nombre as alumno_nombre, a.apellido as alumno_apellido, a.dni as alumno_dni,
              tm.id_tipo_membrecia, tm.tipo_membrecia, tm.frecuencia_semanal,
              g.id_grupo, g.nombre as grupo_nombre,
              COALESCE(pm.precio, 0) as precio
       FROM Membrecia m
       INNER JOIN Alumno a ON m.id_alumno = a.id_alumno AND a.eliminado_en IS NULL
       INNER JOIN Tipo_Membrecia tm ON m.id_tipo_membrecia = tm.id_tipo_membrecia
       INNER JOIN Grupo g ON m.id_grupo = g.id_grupo AND g.eliminado_en IS NULL
       LEFT JOIN Precio_Membrecia pm ON m.id_tipo_membrecia = pm.id_tipo_membrecia
         AND m.fecha_inicio BETWEEN pm.fecha_inicio_vigencia AND COALESCE(pm.fecha_fin_vigencia, '9999-12-31')
       ${where}
       ORDER BY m.fecha_inicio DESC`,
      { replacements: params, type: db.Sequelize.QueryTypes.SELECT }
    );
  }

  async _membresiasProximasAVencer(dias = 30) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    const fechaStr = fechaLimite.toISOString().split('T')[0];
    const hoy = new Date().toISOString().split('T')[0];

    return await db.sequelize.query(
      `SELECT m.id_membrecia, m.fecha_inicio, m.fecha_fin, m.estado,
              DATEDIFF(m.fecha_fin, CURDATE()) as dias_restantes,
              a.id_alumno, a.nombre as alumno_nombre, a.apellido as alumno_apellido,
              tm.tipo_membrecia,
              g.nombre as grupo_nombre
       FROM Membrecia m
       INNER JOIN Alumno a ON m.id_alumno = a.id_alumno AND a.eliminado_en IS NULL
       INNER JOIN Tipo_Membrecia tm ON m.id_tipo_membrecia = tm.id_tipo_membrecia
       INNER JOIN Grupo g ON m.id_grupo = g.id_grupo AND g.eliminado_en IS NULL
       WHERE m.estado = 'activa'
         AND m.fecha_fin BETWEEN ? AND ?
         AND m.eliminado_en IS NULL
       ORDER BY m.fecha_fin ASC`,
      { replacements: [hoy, fechaStr], type: db.Sequelize.QueryTypes.SELECT }
    );
  }

  async _membresiasIngresos(fechaDesde, fechaHasta, agrupar = 'mensual') {
    let formatoFecha = '%Y-%m';
    if (agrupar === 'diario') formatoFecha = '%Y-%m-%d';
    if (agrupar === 'semanal') formatoFecha = '%Y-%u';
    if (agrupar === 'anual') formatoFecha = '%Y';

    let whereFecha = '';
    const params = [];
    if (fechaDesde) {
      whereFecha = 'WHERE dp.fecha_detalle BETWEEN ? AND ?';
      params.push(fechaDesde, fechaHasta);
    }

    return await db.sequelize.query(
      `SELECT DATE_FORMAT(dp.fecha_detalle, '${formatoFecha}') as periodo,
              COALESCE(SUM(dp.monto_parcial), 0) as total,
              tm.tipo_membrecia,
              COUNT(DISTINCT m.id_membrecia) as total_membresias
       FROM Detalle_Pago dp
       INNER JOIN Pago p ON dp.id_pago = p.id_pago AND p.tipo = 'ingreso' AND p.estado IN ('completo', 'parcial')
       LEFT JOIN Membrecia m ON dp.id_pago = m.id_pago AND m.eliminado_en IS NULL
       LEFT JOIN Tipo_Membrecia tm ON m.id_tipo_membrecia = tm.id_tipo_membrecia
       ${whereFecha}
       GROUP BY periodo, tm.tipo_membrecia
       ORDER BY periodo ASC`,
      { replacements: params, type: db.Sequelize.QueryTypes.SELECT }
    );
  }

  generarPDFAsistenciaAlumnos(datos, tipo, filtros) {
    const titulo = tipo === 'grupo'
      ? `Asistencia de Alumnos - ${datos.grupo?.nombre || ''}`
      : tipo === 'alumno'
        ? `Historial de Asistencia - ${datos.alumno?.nombre || ''} ${datos.alumno?.apellido || ''}`
        : 'Resumen de Asistencia de Alumnos';

    const { fechaDesde, fechaHasta, soloActivas } = filtros;

    let tabla;

    if (tipo === 'grupo') {
      const widthUnit = Math.floor((510 - 100) / Math.max(datos.clases.length, 1));
      const colWidths = [80, ...datos.clases.map(() => Math.min(widthUnit, 60))];

      tabla = {
        widths: colWidths,
        headers: ['Alumno', ...datos.clases.map(c => {
          const d = new Date(c.fecha_clase);
          return `${d.getDate()}/${d.getMonth() + 1}`;
        })],
        rows: datos.alumnos.map(alumno => [
          { text: `${alumno.apellido}, ${alumno.nombre}`, alignment: 'left' },
          ...alumno.asistencias.map(asi => {
            if (asi === null) return { text: '—', alignment: 'center', color: '#d1d5db' };
            return {
              text: asi.presente === 1 ? 'Sí' : 'No',
              alignment: 'center',
              color: asi.presente === 1 ? '#16a34a' : '#dc2626'
            };
          })
        ])
      };
    } else if (tipo === 'alumno') {
      tabla = {
        widths: [70, 40, 100, 50, 50, '*'],
        headers: ['Fecha', 'Hora', 'Grupo', 'Presente', 'Recuperación', 'Observación'],
        rows: datos.asistencias.map(a => [
          { text: a.fecha_clase ? new Date(a.fecha_clase).toLocaleDateString('es-AR') : '—', alignment: 'center' },
          { text: a.hora_inicio ? a.hora_inicio.substring(0, 5) : '—', alignment: 'center' },
          { text: a.grupo_nombre || '—' },
          { text: a.presente === 1 ? 'Sí' : 'No', alignment: 'center', color: a.presente === 1 ? '#16a34a' : '#dc2626' },
          { text: a.es_recuperacion ? 'Sí' : 'No', alignment: 'center' },
          { text: a.observacion || '—' }
        ])
      };
    } else {
      tabla = {
        widths: ['*', 60, 60, 70, 70, 60],
        headers: ['Grupo', 'Alumnos', 'Clases', 'Asistencias', 'Presentes', '% Asist.'],
        rows: datos.map(g => [
          { text: g.grupo },
          { text: `${g.total_alumnos}`, alignment: 'center' },
          { text: `${g.total_clases}`, alignment: 'center' },
          { text: `${g.total_asistencias}`, alignment: 'center' },
          { text: `${g.total_presentes}`, alignment: 'center' },
          { text: `${g.porcentaje}%`, alignment: 'center', color: g.porcentaje >= 75 ? '#16a34a' : g.porcentaje >= 50 ? '#ca8a04' : '#dc2626' }
        ])
      };
    }

    return pdfService.generarReporte(titulo, null, tabla, fechaDesde, fechaHasta);
  }

  generarPDFAsistenciaEmpleados(datos, tipo, filtros) {
    const titulo = tipo === 'empleado'
      ? `Asistencia de Empleado - ${datos.empleado?.nombre || ''} ${datos.empleado?.apellido || ''}`
      : 'Resumen de Asistencia de Empleados';

    const { fechaDesde, fechaHasta } = filtros;

    let tabla;

    if (tipo === 'empleado') {
      tabla = {
        widths: [70, 40, 80, 50, 50, '*'],
        headers: ['Fecha', 'Hora', 'Grupo', 'Presente', 'Rol', 'Estado'],
        rows: datos.asistencias.map(a => [
          { text: a.fecha_clase ? new Date(a.fecha_clase).toLocaleDateString('es-AR') : '—', alignment: 'center' },
          { text: a.hora_inicio ? a.hora_inicio.substring(0, 5) : '—', alignment: 'center' },
          { text: a.grupo_nombre || '—' },
          { text: a.presente === 1 ? 'Sí' : 'No', alignment: 'center', color: a.presente === 1 ? '#16a34a' : '#dc2626' },
          { text: a.rol || '—', alignment: 'center' },
          { text: a.estado_clase || '—', alignment: 'center' }
        ])
      };
    } else {
      tabla = {
        widths: ['*', 60, 60, 60, 60, 60],
        headers: ['Empleado', 'Tipo', 'Clases', 'Presentes', 'Ausentes', '% Asist.'],
        rows: datos.map(e => [
          { text: `${e.apellido}, ${e.nombre}` },
          { text: e.tipo, alignment: 'center' },
          { text: `${e.total_clases}`, alignment: 'center' },
          { text: `${e.total_presentes}`, alignment: 'center' },
          { text: `${e.total_ausentes}`, alignment: 'center' },
          { text: `${e.porcentaje}%`, alignment: 'center', color: e.porcentaje >= 75 ? '#16a34a' : e.porcentaje >= 50 ? '#ca8a04' : '#dc2626' }
        ])
      };
    }

    return pdfService.generarReporte(titulo, null, tabla, fechaDesde, fechaHasta);
  }

  generarPDFMembresias(datos, tipo, filtros) {
    const titulo = tipo === 'proximas-a-vencer'
      ? 'Membresías Próximas a Vencer'
      : tipo === 'ingresos'
        ? 'Ingresos por Membresías'
        : 'Listado de Membresías';

    const { fechaDesde, fechaHasta } = filtros;

    let tabla;

    if (tipo === 'proximas-a-vencer') {
      tabla = {
        widths: ['*', 60, 60, 60, 50, 60],
        headers: ['Alumno', 'Membresía', 'Inicio', 'Vencimiento', 'Días', 'Grupo'],
        rows: datos.map(m => [
          { text: `${m.alumno_apellido}, ${m.alumno_nombre}` },
          { text: m.tipo_membrecia, alignment: 'center' },
          { text: m.fecha_inicio ? new Date(m.fecha_inicio).toLocaleDateString('es-AR') : '—', alignment: 'center' },
          { text: m.fecha_fin ? new Date(m.fecha_fin).toLocaleDateString('es-AR') : '—', alignment: 'center' },
          { text: `${m.dias_restantes}`, alignment: 'center', color: m.dias_restantes <= 7 ? '#dc2626' : '#ca8a04' },
          { text: m.grupo_nombre, alignment: 'center' }
        ])
      };
    } else if (tipo === 'ingresos') {
      tabla = {
        widths: [80, 60, '*', 80],
        headers: ['Período', 'Total', 'Tipo Membresía', 'Cantidad'],
        rows: datos.map(m => [
          { text: m.periodo, alignment: 'center' },
          { text: `$${parseFloat(m.total).toFixed(2)}`, alignment: 'right' },
          { text: m.tipo_membrecia || 'Sin tipo', alignment: 'center' },
          { text: `${m.total_membresias}`, alignment: 'center' }
        ])
      };
    } else {
      tabla = {
        widths: ['*', 60, 60, 60, 60, 50],
        headers: ['Alumno', 'Tipo', 'Inicio', 'Fin', 'Estado', 'Grupo'],
        rows: datos.map(m => {
          let colorEstado = '#16a34a';
          if (m.estado === 'vencida') colorEstado = '#dc2626';
          else if (m.estado === 'suspendida') colorEstado = '#ca8a04';
          else if (m.estado === 'cancelada') colorEstado = '#6b7280';
          return [
            { text: `${m.alumno_apellido}, ${m.alumno_nombre}` },
            { text: m.tipo_membrecia, alignment: 'center' },
            { text: m.fecha_inicio ? new Date(m.fecha_inicio).toLocaleDateString('es-AR') : '—', alignment: 'center' },
            { text: m.fecha_fin ? new Date(m.fecha_fin).toLocaleDateString('es-AR') : '—', alignment: 'center' },
            { text: m.estado, alignment: 'center', color: colorEstado },
            { text: m.grupo_nombre, alignment: 'center' }
          ];
        })
      };
    }

    return pdfService.generarReporte(titulo, null, tabla, fechaDesde, fechaHasta);
  }
}

export default new ReporteService();
