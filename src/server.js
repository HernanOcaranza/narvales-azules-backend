import app from './app.js';
import env from './config/env.js';
import { testConnection, sequelize } from './config/database.js';
import schedulerService from './services/scheduler.service.js';

const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('Error: No se pudo conectar a la base de datos. Finalizando...');
      process.exit(1);
    }

    // Sincronizar modelos (solo en desarrollo)
    // En producción, usar migraciones de Sequelize
    if (env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // alter: true para modificar tablas existentes
      console.log('Modelos sincronizados con la base de datos.');
    }

    // Iniciar servidor
    app.listen(env.PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${env.PORT}`);
      console.log(`Entorno: ${env.NODE_ENV}`);
      
      // Iniciar tareas programadas
      schedulerService.iniciar();
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejar cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  schedulerService.detener();
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido. Cerrando servidor...');
  schedulerService.detener();
  await sequelize.close();
  process.exit(0);
});

startServer();

