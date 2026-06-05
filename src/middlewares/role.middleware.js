import { errorResponse } from '../utils/response.js';

const ROLES_PERMITIDOS = {
  admin: ['admin', 'recepcionista', 'profesor', 'guardavidas'],
  recepcionista: ['recepcionista', 'profesor', 'guardavidas'],
  profesor: ['profesor', 'guardavidas'],
  guardavidas: ['guardavidas', 'profesor'],
};

const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Usuario no autenticado', 401);
      }

      const userRole = req.user.tipo;

      if (!allowedRoles.includes(userRole)) {
        return errorResponse(res, 'No tienes permisos para acceder a este recurso', 403);
      }

      next();
    } catch (error) {
      return errorResponse(res, 'Error en la verificación de permisos', 500);
    }
  };
};

export const requireAdmin = roleMiddleware(['admin']);
export const requireAdminOrRecepcionista = roleMiddleware(['admin', 'recepcionista']);
export const requireAdminOrProfesor = roleMiddleware(['admin', 'profesor']);
export const requireAdminOrProfesorOrGuardavidas = roleMiddleware(['admin', 'profesor', 'guardavidas']);
export const requireAnyRole = roleMiddleware(['admin', 'recepcionista', 'profesor', 'guardavidas']);

export default roleMiddleware;