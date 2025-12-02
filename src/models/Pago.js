import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Pago = sequelize.define('Pago', {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_pago'
  },
  tipo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['ingreso', 'egreso']]
    }
  },
  fecha_pago: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  observaciones: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_empleado',
    references: {
      model: 'Empleado',
      key: 'id_empleado'
    }
  }
}, {
  tableName: 'Pago',
  timestamps: false
});

export default Pago;

