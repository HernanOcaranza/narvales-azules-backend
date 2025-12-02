import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import env from './config/env.js';
import swaggerSpec from './config/swagger.js';
import authMiddleware from './middlewares/auth.middleware.js';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import categoriaRoutes from './routes/categoria.routes.js';
import condicionRoutes from './routes/condicion.routes.js';
import disciplinaRoutes from './routes/disciplina.routes.js';
import empleadoRoutes from './routes/empleado.routes.js';
import grupoRoutes from './routes/grupo.routes.js';
import grupoHorarioRoutes from './routes/grupo_horario.routes.js';
import tutorRoutes from './routes/tutor.routes.js';
import alumnoRoutes from './routes/alumno.routes.js';
import claseRoutes from './routes/clase.routes.js';
import claseEmpleadoRoutes from './routes/clase_empleado.routes.js';
import pagoRoutes from './routes/pago.routes.js';
import detallePagoRoutes from './routes/detalle_pago.routes.js';
import tipoMembreciaRoutes from './routes/tipo_membrecia.routes.js';
import precioMembreciaRoutes from './routes/precio_membrecia.routes.js';
import membresiaRoutes from './routes/membrecia.routes.js';

const app = express();

// Middlewares globales
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Narvales Azules API Documentation'
}));

// Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);

// Health check - Documentación en src/docs/health.yaml
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas protegidas (requieren autenticación JWT)
app.use('/api/categorias', authMiddleware, categoriaRoutes);
app.use('/api/condiciones', authMiddleware, condicionRoutes);
app.use('/api/disciplinas', authMiddleware, disciplinaRoutes);
app.use('/api/empleados', authMiddleware, empleadoRoutes);
app.use('/api/grupos', authMiddleware, grupoRoutes);
app.use('/api/grupo-horarios', authMiddleware, grupoHorarioRoutes);
app.use('/api/tutores', authMiddleware, tutorRoutes);
app.use('/api/alumnos', authMiddleware, alumnoRoutes);
app.use('/api/clases', authMiddleware, claseRoutes);
app.use('/api/clase-empleados', authMiddleware, claseEmpleadoRoutes);
app.use('/api/pagos', authMiddleware, pagoRoutes);
app.use('/api/detalle-pagos', authMiddleware, detallePagoRoutes);
app.use('/api/tipo-membresias', authMiddleware, tipoMembreciaRoutes);
app.use('/api/precio-membresias', authMiddleware, precioMembreciaRoutes);
app.use('/api/membresias', authMiddleware, membresiaRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;

