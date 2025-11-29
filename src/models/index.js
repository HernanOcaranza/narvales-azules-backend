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
};

export default db;

