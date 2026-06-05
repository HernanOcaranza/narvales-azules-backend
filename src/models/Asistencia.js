import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Asistencia = sequelize.define('Asistencia', {
  id_asistencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_asistencia'
  },
  observacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  presente: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  es_recuperacion: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  id_clase: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_clase',
    references: {
      model: 'Clase',
      key: 'id_clase'
    }
  },
  id_alumno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_alumno',
    references: {
      model: 'Alumno',
      key: 'id_alumno'
    }
  },
  eliminado_en: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Asistencia',
  timestamps: false
});

export default Asistencia;