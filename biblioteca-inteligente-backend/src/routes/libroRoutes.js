// Este archivo define las rutas (endpoints) para los libros.
// Cada ruta indica qué función del controlador se debe usar.

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const libroController = require('../controllers/libroController');
const auth = require('../middlewares/auth');

// GET /api/libros - Trae todos los libros
router.get('/', libroController.getAll);

// GET /api/libros/:id - Trae un libro por su ID
router.get('/:id', libroController.getById);

// POST /api/libros - Agrega un libro nuevo (sin autenticación para pruebas)
router.post('/', body('titulo').notEmpty(), body('autor').notEmpty(), libroController.create);

// PUT /api/libros/:id - Modifica un libro existente (requiere estar logueado)
router.put('/:id', auth, libroController.update);

// DELETE /api/libros/:id - Borra un libro (requiere estar logueado)
router.delete('/:id', auth, libroController.delete);

module.exports = router;