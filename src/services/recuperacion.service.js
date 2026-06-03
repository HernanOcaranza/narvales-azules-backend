import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import empleadoRepository from '../repositories/empleado.repository.js';
import recuperacionRepository from '../repositories/recuperacion.repository.js';
import mailService from './mail.service.js';

class RecuperacionService {
  async solicitarRecuperacion(email) {
    const empleado = await empleadoRepository.findByEmail(email);

    if (empleado) {
      await recuperacionRepository.invalidateByEmpleado(empleado.id_empleado);

      const otp = crypto.randomInt(100000, 999999).toString();
      const expira_en = new Date(Date.now() + 25 * 60 * 1000);

      await recuperacionRepository.create(empleado.id_empleado, otp, expira_en);

      const resetLink = `http://localhost:5173/cambiar-clave?otp=${otp}`;

      await mailService.sendMail({
        to: empleado.email,
        subject: 'Recuperación de contraseña - Narvales Azules',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e3a5f; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0;">Narvales Azules</h1>
            </div>
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1e3a5f;">Recuperación de contraseña</h2>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Hola <strong>${empleado.nombre}</strong>, recibimos una solicitud para restablecer tu contraseña.
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Hacé clic <a href="${resetLink}" style="color: #1e3a5f; font-weight: bold;">aquí</a> para crear una nueva contraseña.
              </p>
              <p style="color: #888; font-size: 14px;">
                Este enlace expira en 25 minutos. Si no solicitaste este cambio, ignorá este mensaje.
              </p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #888; font-size: 14px;">
                <p>Narvales Azules - Academia de Natación</p>
              </div>
            </div>
          </div>
        `
      });
    }
  }

  async validarOtp(otp) {
    const record = await recuperacionRepository.findByOtp(otp);

    if (!record) {
      throw new Error('El código de recuperación no es válido o ha expirado');
    }

    await recuperacionRepository.markAsUsed(record.id_recuperacion);

    const token = jwt.sign(
      { id_empleado: record.id_empleado, type: 'password_reset' },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { token };
  }

  async cambiarContrasenia(id_empleado, nuevaContrasenia) {
    if (!nuevaContrasenia || nuevaContrasenia.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasenia, 10);
    await empleadoRepository.update(id_empleado, { contrasenia: hashedPassword });

    const empleado = await empleadoRepository.findById(id_empleado);
    if (!empleado) {
      throw new Error('Empleado no encontrado');
    }

    const authToken = jwt.sign(
      { id_empleado: empleado.id_empleado, usuario: empleado.usuario, tipo: empleado.tipo },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    const { contrasenia: _, ...empleadoSinPassword } = empleado.toJSON();

    return { token: authToken, empleado: empleadoSinPassword };
  }

  async cambiarConAutenticacion(id_empleado, contraseniaActual, nuevaContrasenia) {
    if (!contraseniaActual) {
      throw new Error('La contraseña actual es obligatoria');
    }
    if (!nuevaContrasenia || nuevaContrasenia.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }

    const empleado = await empleadoRepository.findById(id_empleado);
    if (!empleado) {
      throw new Error('Empleado no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(contraseniaActual, empleado.contrasenia);
    if (!isPasswordValid) {
      throw new Error('La contraseña actual no es correcta');
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasenia, 10);
    await empleadoRepository.update(id_empleado, { contrasenia: hashedPassword });

    return { message: 'Contraseña actualizada correctamente' };
  }
}

export default new RecuperacionService();
