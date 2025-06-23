const express = require('express');
const router = express.Router();
const asistenteController = require('../controllers/asistenteController');

// Correcto: NO uses paréntesis
router.post('/ask', asistenteController.ask);
router.get('/historial', asistenteController.historial);

module.exports = router;