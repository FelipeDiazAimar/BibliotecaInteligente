const express = require('express');
const router = express.Router();
const busquedaController = require('../controllers/busquedaController');
const { body } = require('express-validator');

// GET /api/busquedas
router.get('/', busquedaController.getBusquedas);

// GET /api/busquedas/:id
router.get('/:id', busquedaController.getBusquedaById);

// POST /api/busquedas
router.post(
  '/',
  body('termino').notEmpty().withMessage('El término es obligatorio'),
  body('usuarioId').isInt().withMessage('usuarioId debe ser un número'),
  busquedaController.createBusqueda
);

// PUT /api/busquedas/:id
router.put(
  '/:id',
  body('termino').notEmpty().withMessage('El término es obligatorio'),
  busquedaController.updateBusqueda
);

// DELETE /api/busquedas/:id
router.delete('/:id', busquedaController.deleteBusqueda);

module.exports = router;