import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Membrecia = sequelize.define('Membrecia', {
  id_membrecia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_membrecia'
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  eliminado_en: {
    type: DataTypes.DATE,
    allowNull: true
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
  id_pago: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_pago',
    references: {
      model: 'Pago',
      key: 'id_pago'
    }
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
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_grupo',
    references: {
      model: 'Grupo',
      key: 'id_grupo'
    }
  }
}, {
  tableName: 'Membrecia',
  timestamps: false
});

export default Membrecia;

