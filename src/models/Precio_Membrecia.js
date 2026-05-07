import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Precio_Membrecia = sequelize.define('Precio_Membrecia', {
  id_precio_membrecia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_precio_membrecia'
  },
  fecha_inicio_vigencia: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_fin_vigencia: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  id_tipo_membrecia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_tipo_membrecia',
    references: {
      model: 'Tipo_Membrecia',
      key: 'id_tipo_membrecia'
    }
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
  tableName: 'Precio_Membrecia',
  timestamps: false
});

export default Precio_Membrecia;

