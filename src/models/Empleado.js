import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Empleado = sequelize.define('Empleado', {
  id_empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_empleado'
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  contrasenia: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  dni: {
    type: DataTypes.CHAR(8),
    allowNull: true
  },
  telefono: {
    type: DataTypes.CHAR(10),
    allowNull: false
  },
  fecha_alta: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  estado: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'Empleado',
  timestamps: false
});

export default Empleado;

