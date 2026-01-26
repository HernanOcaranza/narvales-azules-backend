import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Tipo_Membrecia = sequelize.define('Tipo_Membrecia', {
  id_tipo_membrecia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_tipo_membrecia'
  },
  tipo_membrecia: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  frecuencia_semanal: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Tipo_Membrecia',
  timestamps: false
});

export default Tipo_Membrecia;

