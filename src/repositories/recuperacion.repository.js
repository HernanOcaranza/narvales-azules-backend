import db from '../models/index.js';
import { Op } from 'sequelize';

const { RecuperacionClave } = db;

class RecuperacionRepository {
  async create(id_empleado, otp, expira_en) {
    return await RecuperacionClave.create({ id_empleado, otp, expira_en });
  }

  async findByOtp(otp) {
    return await RecuperacionClave.findOne({
      where: {
        otp,
        usado: 0,
        expira_en: { [Op.gt]: new Date() }
      }
    });
  }

  async markAsUsed(id_recuperacion) {
    return await RecuperacionClave.update(
      { usado: 1 },
      { where: { id_recuperacion } }
    );
  }

  async invalidateByEmpleado(id_empleado) {
    return await RecuperacionClave.update(
      { usado: 1 },
      { where: { id_empleado, usado: 0, expira_en: { [Op.gt]: new Date() } } }
    );
  }
}

export default new RecuperacionRepository();
