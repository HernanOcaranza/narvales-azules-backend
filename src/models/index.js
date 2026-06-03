import { sequelize } from '../config/database.js';
import { Sequelize } from 'sequelize';

// Importar modelos
import Categoria from './Categoria.js';
import Condicion from './Condicion.js';
import Disciplina from './Disciplina.js';
import Empleado from './Empleado.js';
import Grupo from './Grupo.js';
import GrupoHorario from './Grupo_Horario.js';
import Tutor from './Tutor.js';
import Alumno from './Alumno.js';
import Clase from './Clase.js';
import ClaseEmpleado from './Clase_Empleado.js';
import GrupoEmpleado from './Grupo_Empleado.js';
import Pago from './Pago.js';
import Detalle_Pago from './Detalle_Pago.js';
import Tipo_Membrecia from './Tipo_Membrecia.js';
import Precio_Membrecia from './Precio_Membrecia.js';
import Membrecia from './Membrecia.js';
import Asistencia from './Asistencia.js';
import RecuperacionClave from './RecuperacionClave.js';

// Inicializar relaciones
Categoria.hasMany(Grupo, { foreignKey: 'id_categoria', as: 'grupos' });
Disciplina.hasMany(Grupo, { foreignKey: 'id_disciplina', as: 'grupos' });
Grupo.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Grupo.belongsTo(Disciplina, { foreignKey: 'id_disciplina', as: 'disciplina' });

// Relaciones de Alumno
Tutor.hasMany(Alumno, { foreignKey: 'id_tutor', as: 'alumnos' });
Categoria.hasMany(Alumno, { foreignKey: 'id_categoria', as: 'alumnos' });
Condicion.hasMany(Alumno, { foreignKey: 'id_condicion', as: 'alumnos' });
Alumno.belongsTo(Tutor, { foreignKey: 'id_tutor', as: 'tutor' });
Alumno.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Alumno.belongsTo(Condicion, { foreignKey: 'id_condicion', as: 'condicion' });

// Relaciones de Grupo_Horario
Grupo.hasMany(GrupoHorario, { foreignKey: 'id_grupo', as: 'horarios' });
GrupoHorario.belongsTo(Grupo, { foreignKey: 'id_grupo', as: 'grupo' });

// Relaciones de Clase
Grupo.hasMany(Clase, { foreignKey: 'id_grupo', as: 'clases' });
Clase.belongsTo(Grupo, { foreignKey: 'id_grupo', as: 'grupo' });

// Relaciones many-to-many entre Clase y Empleado
Clase.belongsToMany(Empleado, { 
  through: ClaseEmpleado, 
  foreignKey: 'id_clase', 
  otherKey: 'id_empleado',
  as: 'empleados' 
});
Empleado.belongsToMany(Clase, { 
  through: ClaseEmpleado, 
  foreignKey: 'id_empleado', 
  otherKey: 'id_clase',
  as: 'clases' 
});
ClaseEmpleado.belongsTo(Clase, { foreignKey: 'id_clase', as: 'clase' });
ClaseEmpleado.belongsTo(Empleado, { foreignKey: 'id_empleado', as: 'empleado' });

// Relaciones de Pago
Empleado.hasMany(Pago, { foreignKey: 'id_empleado', as: 'pagos' });
Pago.belongsTo(Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
Pago.hasMany(Detalle_Pago, { foreignKey: 'id_pago', as: 'detalles' });
Detalle_Pago.belongsTo(Pago, { foreignKey: 'id_pago', as: 'pago' });
Pago.hasOne(Membrecia, { foreignKey: 'id_pago', as: 'membresia' });
Membrecia.belongsTo(Pago, { foreignKey: 'id_pago', as: 'pago' });

// Relaciones de Tipo_Membrecia y Precio_Membrecia
Tipo_Membrecia.hasMany(Precio_Membrecia, { foreignKey: 'id_tipo_membrecia', as: 'precios' });
Precio_Membrecia.belongsTo(Tipo_Membrecia, { foreignKey: 'id_tipo_membrecia', as: 'tipo_membrecia' });

// Relaciones de Membrecia
Alumno.hasMany(Membrecia, { foreignKey: 'id_alumno', as: 'membresias' });
Membrecia.belongsTo(Alumno, { foreignKey: 'id_alumno', as: 'alumno' });
Tipo_Membrecia.hasMany(Membrecia, { foreignKey: 'id_tipo_membrecia', as: 'membresias' });
Membrecia.belongsTo(Tipo_Membrecia, { foreignKey: 'id_tipo_membrecia', as: 'tipo_membrecia' });
Grupo.hasMany(Membrecia, { foreignKey: 'id_grupo', as: 'membresias' });
Membrecia.belongsTo(Grupo, { foreignKey: 'id_grupo', as: 'grupo' });

// Relaciones de Grupo_Empleado (plantilla de empleados por grupo)
Grupo.belongsToMany(Empleado, {
  through: GrupoEmpleado,
  foreignKey: 'id_grupo',
  otherKey: 'id_empleado',
  as: 'empleados_asignados'
});
Empleado.belongsToMany(Grupo, {
  through: GrupoEmpleado,
  foreignKey: 'id_empleado',
  otherKey: 'id_grupo',
  as: 'grupos_asignados'
});
GrupoEmpleado.belongsTo(Grupo, { foreignKey: 'id_grupo', as: 'grupo' });
GrupoEmpleado.belongsTo(Empleado, { foreignKey: 'id_empleado', as: 'empleado' });

// Relaciones de Asistencia
Clase.hasMany(Asistencia, { foreignKey: 'id_clase', as: 'asistencias' });
Asistencia.belongsTo(Clase, { foreignKey: 'id_clase', as: 'clase' });
Alumno.hasMany(Asistencia, { foreignKey: 'id_alumno', as: 'asistencias' });
Asistencia.belongsTo(Alumno, { foreignKey: 'id_alumno', as: 'alumno' });

const db = {
  sequelize,
  Sequelize,
  // Exportar modelos
  Categoria,
  Condicion,
  Disciplina,
  Empleado,
  Grupo,
  GrupoHorario,
  Tutor,
  Alumno,
  Clase,
  ClaseEmpleado,
  GrupoEmpleado,
  Pago,
  Detalle_Pago,
  Tipo_Membrecia,
  Precio_Membrecia,
  Membrecia,
  Asistencia,
  RecuperacionClave,
};

// Relaciones de RecuperacionClave
Empleado.hasMany(RecuperacionClave, { foreignKey: 'id_empleado', as: 'recuperaciones' });
RecuperacionClave.belongsTo(Empleado, { foreignKey: 'id_empleado', as: 'empleado' });

export default db;

