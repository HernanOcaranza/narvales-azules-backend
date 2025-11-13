import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { errorResponse } from '../utils/response.js';

const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return errorResponse(res, 'Token no proporcionado', 401);
    }

    // El formato esperado es: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return errorResponse(res, 'Formato de token inválido', 401);
    }

    // Verificar el token
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Agregar la información del usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token inválido', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expirado', 401);
    }
    return errorResponse(res, 'Error en la autenticación', 500);
  }
};

export default authMiddleware;

