import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const RecuperacionClave = sequelize.define('RecuperacionClave', {
  id_recuperacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_recuperacion'
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_empleado'
  },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  expira_en: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usado: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'RecuperacionClave',
  timestamps: false
});

export default RecuperacionClave;
