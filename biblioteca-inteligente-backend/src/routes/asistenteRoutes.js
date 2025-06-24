const express = require('express');
const router = express.Router();
const asistenteController = require('../controllers/asistenteController');
const auth = require('../middlewares/auth');

// Correcto: NO uses paréntesis
router.post('/ask', auth, asistenteController.ask);
router.get('/historial', auth, asistenteController.historial);

module.exports = router;