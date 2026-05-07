import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Clase = sequelize.define('Clase', {
  id_clase: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_clase'
  },
  fecha_clase: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_grupo',
    references: {
      model: 'Grupo',
      key: 'id_grupo'
    }
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'realizada', 'suspendida'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  eliminado_en: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Clase',
  timestamps: false
});

export default Clase;

