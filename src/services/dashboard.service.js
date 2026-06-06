import db from '../models/index.js';
import { Op } from 'sequelize';

const { Alumno, Membrecia, Pago, Detalle_Pago, Clase, Grupo, Disciplina, Categoria, Tipo_Membrecia, Tutor, Asistencia, Empleado, Condicion } = db;

class DashboardService {
  async getStats({ fechaDesde, fechaHasta } = {}) {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const hoyStr = hoy.toISOString().split('T')[0];

      // Si se proporcionan fechas, usar esas; si no, usar el mes actual
      const primerDiaMes = fechaDesde || new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
      const ultimoDiaMes = fechaHasta || new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];

      // Calcular período anterior de la misma duración
      const diffDias = Math.round((new Date(ultimoDiaMes) - new Date(primerDiaMes)) / (1000 * 60 * 60 * 24)) + 1;
      const fechaInicioAnterior = new Date(primerDiaMes);
      fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - diffDias);
      const primerDiaMesAnterior = fechaInicioAnterior.toISOString().split('T')[0];
      const fechaFinAnterior = new Date(primerDiaMes);
      fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);
      const ultimoDiaMesAnterior = fechaFinAnterior.toISOString().split('T')[0];

      const [
        totalAlumnos,
        alumnosInactivos,
        alumnosNuevosEsteMes,
        membresiasActivasRes,
        membresiasVencidasRes,
        pagosPendientesRes,
        pagosParcialesRes,
        clasesHoy,
        clasesRealizadasHoy,
        gruposActivos,
        tutoresRegistrados,
        empleadosActivos,
        empleadosPorRol,
        disciplinasConAlumnos,
        categoriasConAlumnos,
        condicionesConAlumnos,
        gruposOcupacion,
      ] = await Promise.all([
        Alumno.count({ where: { estado: 1 } }),
        Alumno.count({ where: { estado: { [Op.ne]: 1 }, eliminado_en: null } }),
        Alumno.count({ where: { fecha_registro: { [Op.gte]: primerDiaMes }, estado: 1 } }),
        db.sequelize.query(
          `SELECT COUNT(DISTINCT m.id_membrecia) as total FROM Membrecia m WHERE m.estado = 'activa'`,
          { type: db.Sequelize.QueryTypes.SELECT }
        ),
        db.sequelize.query(
          `SELECT COUNT(DISTINCT m.id_membrecia) as total FROM Membrecia m WHERE m.estado = 'vencida'`,
          { type: db.Sequelize.QueryTypes.SELECT }
        ),
        db.sequelize.query(
          `SELECT COUNT(DISTINCT p.id_pago) as total FROM Pago p WHERE p.tipo = 'ingreso' AND p.estado = 'pendiente'`,
          { type: db.Sequelize.QueryTypes.SELECT }
        ),
        db.sequelize.query(
          `SELECT COUNT(DISTINCT p.id_pago) as total FROM Pago p WHERE p.tipo = 'ingreso' AND p.estado = 'parcial'`,
          { type: db.Sequelize.QueryTypes.SELECT }
        ),
        Clase.count({ where: { fecha_clase: hoyStr, eliminado_en: null } }),
        Clase.count({ where: { fecha_clase: hoyStr, estado: 'realizada', eliminado_en: null } }),
        Grupo.count({ where: { estado: 1 } }),
        Tutor.count({ where: { estado: 1 } }),
        Empleado.count({ where: { estado: 1 } }),
        db.sequelize.query(
          `SELECT tipo, COUNT(*) as total FROM Empleado WHERE estado = 1 GROUP BY tipo ORDER BY total DESC`,
          { type: db.Sequelize.QueryTypes.SELECT }
        ),
        db.sequelize.query(
          `SELECT d.id_disciplina, d.disciplina as nombre, COUNT(DISTINCT a.id_alumno) as totalAlumnos
           FROM Disciplina d
           LEFT JOIN Grupo g ON d.id_disciplina = g.id_disciplina AND g.estado = 1
           LEFT JOIN Membrecia m ON g.id_grupo = m.id_grupo AND m.estado = 'activa'
           LEFT JOIN Alumno a ON m.id_alumno = a.id_alumno AND a.estado = 1
           WHERE d.estado = 1
           GROUP BY d.id_disciplina, d.disciplina
           ORDER BY totalAlumnos DESC`,
          { type: db.Sequelize.QueryTypes.SELECT }
        ),
        db.sequelize.query(
          `SELECT c.id_categoria, c.categoria as nombre, c.descripcion, COUNT(a.id_alumno) as totalAlumnos
           FROM Categoria c
           LEFT JOIN Alumno a ON c.id_categoria = a.id_categoria AND a.estado = 1
           WHERE c.estado = 1
           GROUP BY c.id_categoria, c.categoria, c.descripcion
           ORDER BY totalAlumnos DESC`,
          { type: db.Sequelize.QueryTypes.SELECT }
        ),
        db.sequelize.query(
          `SELECT c.id_condicion, c.condicion as nombre, c.atencion, COUNT(a.id_alumno) as totalAlumnos
           FROM Condicion c
           LEFT JOIN Alumno a ON c.id_condicion = a.id_condicion AND a.estado = 1
           WHERE c.estado = 1
           GROUP BY c.id_condicion, c.condicion, c.atencion
           ORDER BY totalAlumnos DESC`,
          { type: db.Sequelize.QueryTypes.SELECT }
        ),
        db.sequelize.query(
          `SELECT COUNT(*) as totalGrupos, SUM(g.cupo_maximo) as cupoTotal,
                  (SELECT COUNT(*) FROM Membrecia WHERE estado = 'activa') as miembrosActivos
           FROM Grupo g WHERE g.estado = 1`,
          { type: db.Sequelize.QueryTypes.SELECT }
        ),
      ]);

      const membresiasActivas = membresiasActivasRes[0]?.total || 0;
      const membresiasVencidas = membresiasVencidasRes[0]?.total || 0;
      const pagosPendientes = pagosPendientesRes[0]?.total || 0;
      const pagosParciales = pagosParcialesRes[0]?.total || 0;
      const ocupacion = gruposOcupacion[0] || {};
      const ocupacionPorcentaje = ocupacion.cupoTotal > 0
        ? Math.round((ocupacion.miembrosActivos / ocupacion.cupoTotal) * 100)
        : 0;

      const resultados = await Promise.all([
        this._getTotalMontos('ingreso', primerDiaMes, ultimoDiaMes),
        this._getTotalMontos('egreso', primerDiaMes, ultimoDiaMes),
        this._getTotalMontos('ingreso', primerDiaMesAnterior, ultimoDiaMesAnterior),
        this._getTotalMontos('egreso', primerDiaMesAnterior, ultimoDiaMesAnterior),
        this._getMembresiasPorVencer(7),
        this._getUltimasMembresias(5),
        this._getProximasClases(5),
        this._getPromedioAsistencia(),
        this._getMembresiaPorTipo(),
        this._getPagosRecientes(5),
        this._getEgresosRecientes(5),
        this._getIngresosUltimos6Meses(),
      ]);

      const ingresosMes = parseFloat(resultados[0] || 0);
      const egresosMes = parseFloat(resultados[1] || 0);
      const ingresosMesAnterior = parseFloat(resultados[2] || 0);
      const egresosMesAnterior = parseFloat(resultados[3] || 0);

      return {
        resumen: {
          totalAlumnos: totalAlumnos || 0,
          alumnosInactivos: alumnosInactivos || 0,
          alumnosNuevosEsteMes: alumnosNuevosEsteMes || 0,
          miembrosActivos: ocupacion.miembrosActivos || 0,
          membresiasActivas,
          membresiasVencidas,
          pagosPendientes,
          pagosParciales,
          clasesHoy: clasesHoy || 0,
          clasesRealizadasHoy: clasesRealizadasHoy || 0,
          ingresosMes,
          egresosMes,
          gananciaNeta: ingresosMes - egresosMes,
          ingresosMesAnterior,
          egresosMesAnterior,
          gananciaMesAnterior: ingresosMesAnterior - egresosMesAnterior,
          gruposActivos: gruposActivos || 0,
          tutoresRegistrados: tutoresRegistrados || 0,
          empleadosActivos: empleadosActivos || 0,
          membresiasPorVencer: resultados[4],
          ocupacionPorcentaje,
          cupoTotal: ocupacion.cupoTotal || 0,
        },
        disciplinas: disciplinasConAlumnos,
        categorias: categoriasConAlumnos,
        condiciones: condicionesConAlumnos,
        empleadosPorRol,
        membresiaPorTipo: resultados[8],
        ultimasMembresias: resultados[5],
        ultimasClases: resultados[6],
        promedioAsistencia: resultados[7],
        pagosRecientes: resultados[9],
        egresosRecientes: resultados[10],
        tendencias: {
          mensual: resultados[11],
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas del dashboard: ${error.message}`);
    }
  }

  async _getTotalMontos(tipo, fechaInicio, fechaFin) {
    const [result] = await db.sequelize.query(
      `SELECT COALESCE(SUM(dp.monto_parcial), 0) as total
       FROM Detalle_Pago dp
       INNER JOIN Pago p ON dp.id_pago = p.id_pago
       WHERE p.tipo = ?
         AND p.estado IN ('completo', 'completado', 'parcial', 'pendiente')
         AND dp.fecha_detalle BETWEEN ? AND ?`,
      { replacements: [tipo, fechaInicio, fechaFin], type: db.Sequelize.QueryTypes.SELECT }
    );
    return result?.total || 0;
  }

  async _getMembresiasPorVencer(dias) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    const [result] = await db.sequelize.query(
      `SELECT COUNT(*) as total FROM Membrecia WHERE estado = 'activa' AND fecha_fin BETWEEN CURDATE() AND ?`,
      { replacements: [fechaLimite.toISOString().split('T')[0]], type: db.Sequelize.QueryTypes.SELECT }
    );
    return result?.total || 0;
  }

  async _getUltimasMembresias(limit) {
    return await Membrecia.findAll({
      where: { eliminado_en: null },
      include: [
        { model: Alumno, as: 'alumno', where: { estado: 1 }, attributes: ['nombre', 'apellido'], required: false },
        { model: Tipo_Membrecia, as: 'tipo_membrecia', where: { estado: 1 }, attributes: ['tipo_membrecia'], required: false },
        {
          model: Grupo, as: 'grupo', where: { estado: 1 },
          attributes: ['nombre'],
          include: [{ model: Disciplina, as: 'disciplina', where: { estado: 1 }, attributes: ['disciplina'], required: false }],
          required: false
        },
      ],
      order: [['fecha_inicio', 'DESC']],
      limit,
    });
  }

  async _getProximasClases(limit) {
    return await Clase.findAll({
      where: { fecha_clase: { [Op.gte]: new Date().toISOString().split('T')[0] }, eliminado_en: null },
      include: [{
        model: Grupo, as: 'grupo', where: { estado: 1 },
        attributes: ['nombre', 'cupo_maximo'],
        required: false,
        include: [
          { model: Disciplina, as: 'disciplina', where: { estado: 1 }, attributes: ['disciplina'], required: false },
          { model: Categoria, as: 'categoria', where: { estado: 1 }, attributes: ['categoria'], required: false },
        ],
      }],
      order: [['fecha_clase', 'ASC'], ['hora_inicio', 'ASC']],
      limit,
    });
  }

  async _getPromedioAsistencia() {
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    const fechaStr = hace7Dias.toISOString().split('T')[0];
    const hoy = new Date().toISOString().split('T')[0];

    const [result] = await db.sequelize.query(
      `SELECT SUM(CASE WHEN a.presente = 1 THEN 1 ELSE 0 END) as presentes,
              COUNT(*) as total
       FROM Asistencia a
       INNER JOIN Clase c ON a.id_clase = c.id_clase
       WHERE c.fecha_clase BETWEEN ? AND ?
         AND c.eliminado_en IS NULL`,
      { replacements: [fechaStr, hoy], type: db.Sequelize.QueryTypes.SELECT }
    );

    const total = parseInt(result?.total || 0);
    const presentes = parseInt(result?.presentes || 0);

    return {
      porcentaje: total > 0 ? Math.round((presentes / total) * 100) : 0,
      total,
      presentes,
    };
  }

  async _getMembresiaPorTipo() {
    return await db.sequelize.query(
      `SELECT tm.tipo_membrecia, COUNT(m.id_membrecia) as total
       FROM Membrecia m
       INNER JOIN Tipo_Membrecia tm ON m.id_tipo_membrecia = tm.id_tipo_membrecia
       WHERE m.estado = 'activa'
       GROUP BY tm.id_tipo_membrecia, tm.tipo_membrecia`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );
  }

  async _getPagosRecientes(limit) {
    return await Pago.findAll({
      where: { tipo: 'ingreso', estado: { [Op.ne]: 'eliminado' } },
      include: [{
        model: Membrecia, as: 'membresia',
        where: { eliminado_en: null }, required: false,
        include: [{ model: Alumno, as: 'alumno', where: { estado: 1 }, attributes: ['nombre', 'apellido'], required: false }],
      }],
      order: [['fecha_pago', 'DESC']],
      limit,
    });
  }

  async _getEgresosRecientes(limit) {
    return await Pago.findAll({
      where: { tipo: 'egreso', estado: { [Op.ne]: 'eliminado' } },
      include: [
        { model: Empleado, as: 'empleado', attributes: ['nombre', 'apellido'], required: false },
        { model: Detalle_Pago, as: 'detalles', where: { estado: 1 }, attributes: ['monto_parcial', 'metodo_pago', 'fecha_detalle'], required: false },
      ],
      order: [['fecha_pago', 'DESC']],
      limit,
    });
  }

  async _getIngresosUltimos6Meses() {
    const rows = await db.sequelize.query(
      `SELECT DATE_FORMAT(dp.fecha_detalle, '%Y-%m') as mes, p.tipo,
              COALESCE(SUM(dp.monto_parcial), 0) as total
       FROM Detalle_Pago dp
       INNER JOIN Pago p ON dp.id_pago = p.id_pago
        WHERE p.estado IN ('completo', 'completado', 'parcial', 'pendiente')
          AND dp.fecha_detalle >= DATE_ADD(CURDATE(), INTERVAL -6 MONTH)
       GROUP BY mes, p.tipo
       ORDER BY mes ASC`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );

    const meses = {};
    for (const row of rows) {
      if (!meses[row.mes]) {
        meses[row.mes] = { mes: row.mes, ingresos: 0, egresos: 0 };
      }
      if (row.tipo === 'ingreso') {
        meses[row.mes].ingresos = parseFloat(row.total);
      } else {
        meses[row.mes].egresos = parseFloat(row.total);
      }
    }

    for (const key of Object.keys(meses)) {
      meses[key].ganancia = meses[key].ingresos - meses[key].egresos;
    }

    return Object.values(meses).sort((a, b) => a.mes.localeCompare(b.mes));
  }
}

export default new DashboardService();
