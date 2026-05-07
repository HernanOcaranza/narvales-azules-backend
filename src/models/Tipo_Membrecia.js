import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Tipo_Membrecia = sequelize.define('Tipo_Membrecia', {
  id_tipo_membrecia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_tipo_membrecia'
  },
  tipo_membrecia: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  frecuencia_semanal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duracion_dias: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'duracion_dias',
    comment: 'Duración en días de la membresía (ej: 30 para mensual, 15 para quincenal)'
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
  tableName: 'Tipo_Membrecia',
  timestamps: false
});

export default Tipo_Membrecia;

