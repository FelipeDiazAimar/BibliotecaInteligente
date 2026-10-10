// Este archivo es el "corazón" del backend. Aquí se configura todo lo necesario para que la app funcione.

require('dotenv').config();

// Importa librerías necesarias para crear el servidor y manejar pedidos.
const express = require('express');
const cors = require('cors'); // Permite que el frontend se conecte al backend
const morgan = require('morgan'); // Muestra en consola los pedidos que llegan
const app = express();

const { isDemoMode, DEMO_TAG } = require('./config/demo');
const { isDbConnectionError, sendDbUnavailable } = require('./middlewares/apiError');

// CORS: solo el frontend local. vite.config.js no define puerto custom,
// por lo que Vite usa el 5173 por defecto. Se puede ampliar con CORS_ORIGIN.
const FRONTEND_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: FRONTEND_ORIGINS }));

// Estas líneas preparan el servidor para aceptar pedidos y mostrar información útil en consola.
app.use(morgan('dev'));
app.use(express.json()); // Permite recibir datos en formato JSON

if (isDemoMode()) console.log(`${DEMO_TAG} DEMO_MODE activo: servicios externos (email, OpenRouter) usan stubs.`);

// Salud del backend. No toca la base de datos: responde igual sin Postgres.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', demo: isDemoMode(), hora: new Date().toISOString() });
});

// Aquí se conectan las rutas principales de la API.
// Por ejemplo, cuando el frontend pide /api/libros, se usa el archivo libroRoutes.js
app.use('/api/libros', require('./routes/libroRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/asistente', require('./routes/asistenteRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/busquedas', require('./routes/busquedaRoutes'));
app.use('/api/turnos', require('./routes/turnoRoutes'));
app.use('/api/salas', require('./routes/salaRoutes'));
app.use('/api/invitados', require('./routes/invitadoRoutes'));

// Ruta de prueba para saber si el backend está funcionando
app.get('/test', (req, res) => res.send('OK'));

// 404 JSON consistente para rutas desconocidas.
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores generales: siempre JSON, sin stack traces al cliente.
// Si la DB está caída, responde 503 con un mensaje claro.
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  if (isDbConnectionError(err)) return sendDbUnavailable(res, err);
  res.status(err && err.status ? err.status : 500).json({ error: 'Error interno' });
});

module.exports = app;
