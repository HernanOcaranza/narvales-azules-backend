import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Disciplina = sequelize.define('Disciplina', {
  id_disciplina: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_disciplina'
  },
  disciplina: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  estado: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  },
  eliminado_en: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Disciplina',
  timestamps: false
});

export default Disciplina;

