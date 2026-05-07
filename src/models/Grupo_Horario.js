import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const GrupoHorario = sequelize.define('Grupo_Horario', {
  id_grupo_horario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_grupo_horario'
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
  dia_semana: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment: '0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado',
    validate: {
      min: 0,
      max: 6
    }
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  activo: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1,
    comment: '1=Activo, 0=Inactivo'
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
  tableName: 'Grupo_Horario',
  timestamps: false,
  indexes: [
    {
      fields: ['id_grupo']
    },
    {
      fields: ['dia_semana']
    },
    {
      unique: true,
      fields: ['id_grupo', 'dia_semana', 'hora_inicio'],
      name: 'unique_grupo_dia_hora'
    }
  ]
});

export default GrupoHorario;

