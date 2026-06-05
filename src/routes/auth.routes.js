import express from 'express';
import authController from '../controllers/auth.controller.js';
import recuperacionController from '../controllers/recuperacion.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import passwordResetMiddleware from '../middlewares/passwordReset.middleware.js';

const router = express.Router();

router.post('/login', authController.login.bind(authController));

router.post('/recuperar', recuperacionController.solicitar.bind(recuperacionController));
router.post('/recuperar/validar', recuperacionController.validar.bind(recuperacionController));
router.post('/recuperar/cambiar', passwordResetMiddleware, recuperacionController.cambiar.bind(recuperacionController));

router.post('/cambiar-contrasenia', authMiddleware, recuperacionController.cambiarConAutenticacion.bind(recuperacionController));

export default router;
