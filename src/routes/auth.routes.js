import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

// Ruta de login - Documentación en src/docs/auth.yaml
router.post('/login', authController.login.bind(authController));

export default router;

