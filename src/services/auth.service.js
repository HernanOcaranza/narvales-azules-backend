import empleadoRepository from '../repositories/empleado.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

class AuthService {
  async login(usuario, contrasenia) {
    try {
      // Validar que se proporcionen usuario y contraseña
      if (!usuario || !contrasenia) {
        throw new Error('Usuario y contraseña son obligatorios');
      }

      // Buscar el empleado por usuario
      const empleado = await empleadoRepository.findByUsuario(usuario);
      
      if (!empleado) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar que el empleado esté activo
      if (empleado.estado !== 1) {
        throw new Error('Usuario inactivo');
      }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(contrasenia, empleado.contrasenia);
      
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      // Generar el token JWT
      const token = jwt.sign(
        {
          id_empleado: empleado.id_empleado,
          usuario: empleado.usuario,
          tipo: empleado.tipo
        },
        env.JWT_SECRET,
        {
          expiresIn: env.JWT_EXPIRES_IN
        }
      );

      // Preparar los datos del empleado sin la contraseña
      const { contrasenia: _, ...empleadoSinPassword } = empleado.toJSON();

      return {
        token,
        empleado: empleadoSinPassword
      };
    } catch (error) {
      throw new Error(`Error en el login: ${error.message}`);
    }
  }

  async verifyToken(token) {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Token inválido');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expirado');
      }
      throw new Error('Error al verificar el token');
    }
  }
}

export default new AuthService();

