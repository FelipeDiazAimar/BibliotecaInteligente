const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/Turnos/usuariosController');

// Ruta para iniciar sesión de usuario
router.post('/auth/login', usuarioController.login);

// Ruta para ver todos los usuarios
router.get('/', usuarioController.getAllUsuarios);

//Ruta para buscar usuario por dni
router.get('/dni/:dni', usuarioController.getUsuarioByDni);

// Ruta para ver un usuario por su ID
router.get('/:id', usuarioController.getUsuarioById);

// Ruta para actualizar usuario
router.put('/:id', usuarioController.updateUsuario);

// Ruta para eliminar usuario
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;