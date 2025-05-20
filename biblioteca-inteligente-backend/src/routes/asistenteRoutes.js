const express = require('express');
const router = express.Router();
const asistenteController = require('../src/controllers/asistenteController');
const auth = require('../src/middlewares/auth');

// Ruta para hacerle una pregunta al asistente virtual (requiere estar autenticado)
router.post('/ask', auth, asistenteController.ask);

module.exports = router;