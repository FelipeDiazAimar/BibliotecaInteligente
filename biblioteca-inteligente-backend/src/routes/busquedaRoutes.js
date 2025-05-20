const express = require('express');
const router = express.Router();
const busquedaController = require('../controllers/busquedaController');
const auth = require('../middlewares/auth');

// Ruta para ver todas las búsquedas (solo usuarios autenticados)
router.get('/', auth, busquedaController.getAll);
// Ruta para crear una nueva búsqueda (solo usuarios autenticados)
router.post('/', auth, busquedaController.create);

module.exports = router;