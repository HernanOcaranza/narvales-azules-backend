import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Categoria = sequelize.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_categoria'
  },
  categoria: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(50),
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
  tableName: 'Categoria',
  timestamps: false
});

export default Categoria;

