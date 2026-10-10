// Este archivo inicia el servidor y se asegura de que la base de datos esté lista.

require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');
const { isDemoMode, DEMO_TAG } = require('./src/config/demo');

const PORT = process.env.PORT || 3000;

// Conexión lazy: el servidor siempre escucha (así /api/health responde aun sin
// Postgres). La sincronización de la DB se intenta en segundo plano y un fallo
// solo se registra en consola, sin tumbar el proceso.
// NUNCA usar sync({ force: true }) ni drop: borraría datos reales.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}${isDemoMode() ? ` ${DEMO_TAG} DEMO_MODE activo` : ''}`);

  sequelize
    .authenticate()
    .then(() => sequelize.sync())
    .then(() => {
      console.log('Base de datos conectada y sincronizada.');
    })
    .catch((err) => {
      console.error('Aviso: no se pudo conectar/sincronizar la base de datos:', err.message);
      if (isDemoMode()) {
        console.log(`${DEMO_TAG} el servidor sigue respondiendo /api/health sin Postgres.`);
      } else {
        console.log('Revise DATABASE_URL o las variables DB_* en el archivo .env (ver .env.example).');
      }
    });
});
