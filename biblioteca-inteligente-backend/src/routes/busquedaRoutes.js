const express = require('express');
const router = express.Router();
const busquedaController = require('../controllers/busquedaController');

// GET /api/busquedas
router.get('/', busquedaController.getBusquedas);

// POST /api/busquedas
router.post('/', busquedaController.createBusqueda);

module.exports = router;