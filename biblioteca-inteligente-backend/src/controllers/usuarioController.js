const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controlador para iniciar sesión de usuario
exports.login = async (req, res) => {
  try {
    const { legajo, password } = req.body;
    // Busca el usuario por legajo
    const usuario = await Usuario.findOne({ where: { legajo } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Verifica la contraseña
    const isValidPassword = await bcrypt.compare(password, usuario.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Genera un token para el usuario
    const token = jwt.sign(
      { id: usuario.id, legajo: usuario.legajo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Trae todos los usuarios (sin mostrar las contraseñas)
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Trae un usuario por su ID (sin mostrar la contraseña)
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};