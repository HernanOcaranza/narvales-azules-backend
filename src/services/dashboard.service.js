import db from '../models/index.js';
import { Op } from 'sequelize';

const { Alumno, Membrecia, Pago, Detalle_Pago, Clase, Grupo, Disciplina, Categoria, Tipo_Membrecia, Tutor, Asistencia, Empleado } = db;

class DashboardService {
  async getStats() {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const hoyStr = hoy.toISOString().split('T')[0];
      const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
      const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];

      const [totalAlumnos, membresiasActivasRes, membresiasVencidasRes, pagosPendientesRes, pagosParcialesRes, clasesHoy, gruposActivos, tutoresRegistrados, empleadosActivos, disciplinas, categorias] = await Promise.all([
        Alumno.count({ where: { estado: 1 } }),
        db.sequelize.query(`
          SELECT COUNT(DISTINCT m.id_membrecia) as total
          FROM Membrecia m
          WHERE m.estado = 'activa'
        `, { type: db.Sequelize.QueryTypes.SELECT }),
        db.sequelize.query(`
          SELECT COUNT(DISTINCT m.id_membrecia) as total
          FROM Membrecia m
          WHERE m.estado = 'vencida'
        `, { type: db.Sequelize.QueryTypes.SELECT }),
        db.sequelize.query(`
          SELECT COUNT(DISTINCT p.id_pago) as total
          FROM Pago p
          WHERE p.tipo = 'ingreso' AND p.estado = 'pendiente'
        `, { type: db.Sequelize.QueryTypes.SELECT }),
        db.sequelize.query(`
          SELECT COUNT(DISTINCT p.id_pago) as total
          FROM Pago p
          WHERE p.tipo = 'ingreso' AND p.estado = 'parcial'
        `, { type: db.Sequelize.QueryTypes.SELECT }),
        Clase.count({ where: { fecha_clase: hoyStr } }),
        Grupo.count({ where: { estado: 1 } }),
        Tutor.count(),
        Empleado.count({ where: { estado: 1 } }),
        Disciplina.findAll(),
        Categoria.findAll(),
      ]);

      const membresiasActivas = membresiasActivasRes[0]?.total || 0;
      const membresiasVencidas = membresiasVencidasRes[0]?.total || 0;
      const pagosPendientes = pagosPendientesRes[0]?.total || 0;
      const pagosParciales = pagosParcialesRes[0]?.total || 0;

      const resultados = await Promise.all([
        this.getTotalIngresos(primerDiaMes, ultimoDiaMes),
        this.getTotalEgresos(primerDiaMes, ultimoDiaMes),
        this.getMembresiasPorVencer(7),
        this.getUltimasMembresias(5),
        this.getProximasClases(5),
        this.getPromedioAsistencia(),
        this.getMembresiaPorTipo(),
        this.getPagosRecientes(5),
      ]);

      const ingresosMes = resultados[0];
      const egresosMes = resultados[1];
      const membresiasPorVencer = resultados[2];
      const ultimasMembresias = resultados[3];
      const ultimasClases = resultados[4];
      const promedioAsistencia = resultados[5];
      const membresiaPorTipo = resultados[6];
      const pagosRecientes = resultados[7];

      const disciplinasConAlumnos = await Promise.all(
        disciplinas.map(async (disciplina) => {
          const count = await this.getAlumnosPorDisciplina(disciplina.id_disciplina);
          return {
            id: disciplina.id_disciplina,
            nombre: disciplina.disciplina,
            totalAlumnos: count,
          };
        })
      );

      const categoriasConAlumnos = await Promise.all(
        categorias.map(async (categoria) => {
          const count = await this.getAlumnosPorCategoria(categoria.id_categoria);
          return {
            id: categoria.id_categoria,
            nombre: categoria.categoria,
            descripcion: categoria.descripcion,
            totalAlumnos: count,
          };
        })
      );

      return {
        resumen: {
          totalAlumnos: totalAlumnos || 0,
          membresiasActivas,
          membresiasVencidas,
          pagosPendientes,
          pagosParciales,
          clasesHoy: clasesHoy || 0,
          ingresosMes: parseFloat(ingresosMes || 0),
          egresosMes: parseFloat(egresosMes || 0),
          gananciaNeta: parseFloat(ingresosMes || 0) - parseFloat(egresosMes || 0),
          gruposActivos: gruposActivos || 0,
          tutoresRegistrados: tutoresRegistrados || 0,
          empleadosActivos: empleadosActivos || 0,
          membresiasPorVencer,
        },
        disciplinas: disciplinasConAlumnos,
        categorias: categoriasConAlumnos,
        membresiaPorTipo,
        ultimasMembresias,
        ultimasClases,
        promedioAsistencia,
        pagosRecientes,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas del dashboard: ${error.message}`);
    }
  }

  async getTotalIngresos(fechaInicio, fechaFin) {
    const [result] = await db.sequelize.query(`
      SELECT COALESCE(SUM(dp.monto_parcial), 0) as total
      FROM Detalle_Pago dp
      INNER JOIN Pago p ON dp.id_pago = p.id_pago
      WHERE p.tipo = 'ingreso' 
        AND p.estado IN ('completo', 'parcial')
        AND dp.fecha_detalle BETWEEN '${fechaInicio}' AND '${fechaFin}'
    `, { type: db.Sequelize.QueryTypes.SELECT });
    return result[0]?.total || 0;
  }

  async getTotalEgresos(fechaInicio, fechaFin) {
    const [result] = await db.sequelize.query(`
      SELECT COALESCE(SUM(dp.monto_parcial), 0) as total
      FROM Detalle_Pago dp
      INNER JOIN Pago p ON dp.id_pago = p.id_pago
      WHERE p.tipo = 'egreso' 
        AND p.estado IN ('completo', 'parcial')
        AND dp.fecha_detalle BETWEEN '${fechaInicio}' AND '${fechaFin}'
    `, { type: db.Sequelize.QueryTypes.SELECT });
    return result[0]?.total || 0;
  }

  async getAlumnosPorDisciplina(idDisciplina) {
    const [result] = await db.sequelize.query(`
      SELECT COUNT(DISTINCT a.id_alumno) as total
      FROM Alumno a
      INNER JOIN Membrecia m ON a.id_alumno = m.id_alumno
      INNER JOIN Grupo g ON m.id_grupo = g.id_grupo
      WHERE a.estado = 1 
        AND m.estado = 'activa'
        AND g.id_disciplina = ${idDisciplina}
    `, { type: db.Sequelize.QueryTypes.SELECT });
    return result[0]?.total || 0;
  }

  async getAlumnosPorCategoria(idCategoria) {
    return await Alumno.count({
      where: { id_categoria: idCategoria, estado: 1 },
    });
  }

  async getMembresiasPorVencer(dias) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    const fechaLimiteStr = fechaLimite.toISOString().split('T')[0];
    const fechaActual = new Date().toISOString().split('T')[0];

    const [result] = await db.sequelize.query(`
      SELECT COUNT(*) as total
      FROM Membrecia
      WHERE estado = 'activa'
        AND fecha_fin BETWEEN '${fechaActual}' AND '${fechaLimiteStr}'
    `, { type: db.Sequelize.QueryTypes.SELECT });
    return result[0]?.total || 0;
  }

  async getUltimasMembresias(limit) {
    return await Membrecia.findAll({
      include: [
        { model: Alumno, as: 'alumno', attributes: ['nombre', 'apellido'] },
        { model: Tipo_Membrecia, as: 'tipo_membrecia', attributes: ['tipo_membrecia'] },
        { 
          model: Grupo, 
          as: 'grupo', 
          attributes: ['nombre'],
          include: [{ model: Disciplina, as: 'disciplina', attributes: ['disciplina'] }],
        },
      ],
      order: [['fecha_inicio', 'DESC']],
      limit,
    });
  }

  async getProximasClases(limit) {
    const hoy = new Date().toISOString().split('T')[0];
    
    return await Clase.findAll({
      where: {
        fecha_clase: { [Op.gte]: hoy },
      },
      include: [{
        model: Grupo,
        as: 'grupo',
        attributes: ['nombre', 'cupo_maximo'],
        include: [
          { model: Disciplina, as: 'disciplina', attributes: ['disciplina'] },
          { model: Categoria, as: 'categoria', attributes: ['categoria'] },
        ],
      }],
      order: [['fecha_clase', 'ASC'], ['hora_inicio', 'ASC']],
      limit,
    });
  }

  async getPromedioAsistencia() {
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    const fechaStr = hace7Dias.toISOString().split('T')[0];
    const hoy = new Date().toISOString().split('T')[0];

    const [result] = await db.sequelize.query(`
      SELECT 
        SUM(CASE WHEN presente = 1 THEN 1 ELSE 0 END) as presentes,
        COUNT(*) as total
      FROM Asistencia
      WHERE id_clase IN (
        SELECT id_clase FROM Clase 
        WHERE fecha_clase BETWEEN '${fechaStr}' AND '${hoy}'
      )
    `, { type: db.Sequelize.QueryTypes.SELECT });

    const total = parseInt(result[0]?.total || 0);
    const presentes = parseInt(result[0]?.presentes || 0);
    
    return {
      porcentaje: total > 0 ? Math.round((presentes / total) * 100) : 0,
      total,
      presentes,
    };
  }

  async getMembresiaPorTipo() {
    return await db.sequelize.query(`
      SELECT tm.tipo_membrecia, COUNT(m.id_membrecia) as total
      FROM Membrecia m
      INNER JOIN Tipo_Membrecia tm ON m.id_tipo_membrecia = tm.id_tipo_membrecia
      GROUP BY tm.id_tipo_membrecia, tm.tipo_membrecia
    `, { type: db.Sequelize.QueryTypes.SELECT });
  }

  async getPagosRecientes(limit) {
    return await Pago.findAll({
      where: { tipo: 'ingreso' },
      include: [{
        model: Membrecia,
        as: 'membresia',
        include: [{ model: Alumno, as: 'alumno', attributes: ['nombre', 'apellido'] }],
      }],
      order: [['fecha_pago', 'DESC']],
      limit,
    });
  }
}

export default new DashboardService();