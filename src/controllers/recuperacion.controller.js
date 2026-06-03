import recuperacionService from '../services/recuperacion.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class RecuperacionController {
  async solicitar(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return errorResponse(res, 'El email es obligatorio', 400);
      }

      await recuperacionService.solicitarRecuperacion(email);

      return successResponse(res, null, 'Te enviamos un correo con las instrucciones');
    } catch (error) {
      return errorResponse(res, 'Te enviamos un correo con las instrucciones', 200);
    }
  }

  async validar(req, res) {
    try {
      const { otp } = req.body;

      if (!otp) {
        return errorResponse(res, 'El código es obligatorio', 400);
      }

      const result = await recuperacionService.validarOtp(otp);

      return successResponse(res, result, 'Código válido');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async cambiar(req, res) {
    try {
      const { nueva_contrasenia } = req.body;

      if (!nueva_contrasenia) {
        return errorResponse(res, 'La nueva contraseña es obligatoria', 400);
      }

      const result = await recuperacionService.cambiarContrasenia(req.id_empleado, nueva_contrasenia);

      return successResponse(res, result, 'Contraseña actualizada correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async cambiarConAutenticacion(req, res) {
    try {
      const { contrasenia_actual, nueva_contrasenia } = req.body;

      if (!contrasenia_actual || !nueva_contrasenia) {
        return errorResponse(res, 'La contraseña actual y la nueva son obligatorias', 400);
      }

      const result = await recuperacionService.cambiarConAutenticacion(
        req.user.id_empleado,
        contrasenia_actual,
        nueva_contrasenia
      );

      return successResponse(res, result, 'Contraseña actualizada correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

export default new RecuperacionController();
