import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const GrupoEmpleado = sequelize.define('GrupoEmpleado', {
  id_grupo_empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_grupo_empleado'
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
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_empleado',
    references: {
      model: 'Empleado',
      key: 'id_empleado'
    }
  },
  rol: {
    type: DataTypes.STRING(20),
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
  tableName: 'Grupo_Empleado',
  timestamps: false,
  indexes: [
    {
      unique: true,
      name: 'unique_grupo_empleado',
      fields: ['id_grupo', 'id_empleado']
    }
  ]
});

export default GrupoEmpleado;
