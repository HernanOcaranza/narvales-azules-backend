import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Grupo = sequelize.define('Grupo', {
  id_grupo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_grupo'
  },
  nombre: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  cupo_maximo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  },
  id_disciplina: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_disciplina',
    references: {
      model: 'Disciplina',
      key: 'id_disciplina'
    }
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_categoria',
    references: {
      model: 'Categoria',
      key: 'id_categoria'
    }
  }
}, {
  tableName: 'Grupo',
  timestamps: false
});

export default Grupo;

