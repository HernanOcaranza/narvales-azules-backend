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
  }
}, {
  tableName: 'Disciplina',
  timestamps: false
});

export default Disciplina;

