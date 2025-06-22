// Este archivo es el "corazón" del backend. Aquí se configura todo lo necesario para que la app funcione.

// Importa librerías necesarias para crear el servidor y manejar pedidos.
const express = require('express');
const cors = require('cors'); // Permite que el frontend se conecte al backend
const morgan = require('morgan'); // Muestra en consola los pedidos que llegan
const axios = require('axios'); // Permite hacer pedidos HTTP a otros servicios
const app = express();

// Estas líneas preparan el servidor para aceptar pedidos y mostrar información útil en consola.
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // Permite recibir datos en formato JSON

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

// Manejo de errores generales. Si algo sale mal, muestra un mensaje.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno' });
});

// Esta función permite que el backend le pregunte algo a un asistente virtual externo (OpenRouter).
// No es necesario modificarla si no usás IA.
exports.ask = async (req, res) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body.prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ respuesta: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = app;