const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Controlador para registrar un usuario nuevo
exports.register = async (req, res) => {
  try {
    // Crea el usuario con los datos recibidos
    const usuario = await Usuario.create(req.body);
    // Genera un token para que el usuario pueda autenticarse
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
  try {
    const { legajo, password } = req.body;
    // Busca el usuario por legajo
    const usuario = await Usuario.findOne({ where: { legajo } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Compara la contraseña recibida con la guardada
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Si todo está bien, genera un token para el usuario
    const token = jwt.sign(
      { id: usuario.id, legajo: usuario.legajo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};