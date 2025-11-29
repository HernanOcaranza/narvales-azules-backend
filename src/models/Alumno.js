import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Alumno = sequelize.define('Alumno', {
  id_alumno: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_alumno'
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
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  estado: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  },
  id_tutor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_tutor',
    references: {
      model: 'Tutor',
      key: 'id_tutor'
    }
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_categoria',
    references: {
      model: 'Categoria',
      key: 'id_categoria'
    }
  },
  id_condicion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_condicion',
    references: {
      model: 'Condicion',
      key: 'id_condicion'
    }
  }
}, {
  tableName: 'Alumno',
  timestamps: false
});

export default Alumno;

