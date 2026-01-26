import authService from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class AuthController {
  async login(req, res) {
    try {
      const { usuario, contrasenia } = req.body;

      if (!usuario || !contrasenia) {
        return errorResponse(res, 'Usuario y contraseña son obligatorios', 400);
      }

      const result = await authService.login(usuario, contrasenia);
      
      return successResponse(
        res,
        result,
        'Login exitoso',
        200
      );
    } catch (error) {
      const statusCode = error.message.includes('Credenciales inválidas') ? 401 :
                        error.message.includes('Usuario inactivo') ? 403 :
                        error.message.includes('obligatorios') ? 400 : 500;
      
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new AuthController();

