// Este archivo agrupa y organiza las rutas principales de la API.
// Así puedes importar todas las rutas desde un solo lugar.

const express = require('express');
const router = express.Router();

// Importar rutas de usuarios y libros
const usuarioRoutes = require('./usuarioRoutes');
const libroRoutes = require('./libroRoutes');
// Agrega las rutas del turnero
const turnoRoutes = require('./Turnos/turnoRoutes');
const salaRoutes = require('./Turnos/salaRoutes');
const invitadoRoutes = require('./Turnos/invitadoRoutes');
const usuariosTurneroRoutes = require('./Turnos/usuariosRoutes');

// Configurar rutas: cuando se pida /usuarios o /libros, usa los archivos correspondientes
router.use('/usuarios', usuarioRoutes);
router.use('/libros', libroRoutes);
// Nuevas rutas del turnero
router.use('/turnos', turnoRoutes);
router.use('/salas', salaRoutes);
router.use('/invitados', invitadoRoutes);
router.use('/usuario', usuariosTurneroRoutes);

module.exports = router;