import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ClaseEmpleado = sequelize.define('ClaseEmpleado', {
  id_clase: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id_clase',
    references: {
      model: 'Clase',
      key: 'id_clase'
    }
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id_empleado',
    references: {
      model: 'Empleado',
      key: 'id_empleado'
    }
  },
  presente: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'Clase_Empleado',
  timestamps: false
});

export default ClaseEmpleado;

