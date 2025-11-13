import { sequelize } from '../config/database.js';
import { Sequelize } from 'sequelize';

// Importar modelos
import Categoria from './Categoria.js';
import Disciplina from './Disciplina.js';
import Empleado from './Empleado.js';
import Grupo from './Grupo.js';

// Inicializar relaciones
Categoria.hasMany(Grupo, { foreignKey: 'id_categoria', as: 'grupos' });
Disciplina.hasMany(Grupo, { foreignKey: 'id_disciplina', as: 'grupos' });
Grupo.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Grupo.belongsTo(Disciplina, { foreignKey: 'id_disciplina', as: 'disciplina' });

const db = {
  sequelize,
  Sequelize,
  // Exportar modelos
  Categoria,
  Disciplina,
  Empleado,
  Grupo,
};

export default db;

