import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Condicion = sequelize.define('Condicion', {
  id_condicion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_condicion'
  },
  condicion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  atencion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'Condicion',
  timestamps: false
});

export default Condicion;

