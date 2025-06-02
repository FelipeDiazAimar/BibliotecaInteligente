const express = require('express');
const router = express.Router();
const asistenteController = require('../controllers/asistenteController');
const auth = require('../middlewares/auth');

// Ruta para hacerle una pregunta al asistente virtual (requiere estar autenticado)
router.post('/ask', auth, asistenteController.ask);

// Historial de consultas del usuario autenticado
router.get('/historial', auth, asistenteController.historial);

module.exports = router;