import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import env from './config/env.js';
import swaggerSpec from './config/swagger.js';

// Importar rutas
import categoriaRoutes from './routes/categoria.routes.js';
import disciplinaRoutes from './routes/disciplina.routes.js';
import empleadoRoutes from './routes/empleado.routes.js';
import grupoRoutes from './routes/grupo.routes.js';

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

// Rutas
app.use('/api/categorias', categoriaRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/grupos', grupoRoutes);

// Health check - Documentación en src/docs/health.yaml
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

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

