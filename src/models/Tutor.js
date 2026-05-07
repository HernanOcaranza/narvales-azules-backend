import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Tutor = sequelize.define('Tutor', {
  id_tutor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_tutor'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  telefono: {
    type: DataTypes.CHAR(10),
    allowNull: true
  },
  dni: {
    type: DataTypes.CHAR(8),
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATEONLY,
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
  tableName: 'Tutor',
  timestamps: false
});

export default Tutor;

