import jwt from 'jsonwebtoken';
import env from '../config/env.js';

function passwordResetMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de recuperación requerido'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (decoded.type !== 'password_reset') {
      return res.status(403).json({
        success: false,
        message: 'Token inválido para esta operación'
      });
    }

    req.id_empleado = decoded.id_empleado;
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'El enlace ha expirado. Solicita uno nuevo.'
      : 'Token de recuperación inválido';

    return res.status(401).json({
      success: false,
      message
    });
  }
}

export default passwordResetMiddleware;
