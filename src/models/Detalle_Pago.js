import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Detalle_Pago = sequelize.define('Detalle_Pago', {
  id_detalle_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle_pago'
  },
  metodo_pago: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  monto_parcial: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fecha_detalle: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  referencia_transferencia: {
    type: DataTypes.STRING(50),
    allowNull: true
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
  tableName: 'Detalle_Pago',
  timestamps: false
});

export default Detalle_Pago;

