const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Prompt, Respuesta } = require('../models');

// Controlador para registrar un usuario nuevo
exports.register = async (req, res) => {
  try {
    // Crea el usuario con los datos recibidos
    const usuario = await Usuario.create({
      nombre: req.body.nombre,
      email: req.body.email,
      legajo: req.body.legajo,
      carrera: req.body.carrera, // <-- asegúrate de incluir esto
      password: req.body.password,
      rol: req.body.rol
    });
    // Genera un token para que el usuario pueda autenticarse
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ token, id: usuario.id });
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
    res.json({ token, id: usuario.id, rol: usuario.rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para cerrar sesión y borrar prompts/respuestas del usuario
exports.logout = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Encuentra todos los prompts del usuario
    const prompts = await Prompt.findAll({ where: { usuarioId } });
    const promptIds = prompts.map(p => p.id);
    console.log('Prompts encontrados:', promptIds);

    // Borra todas las respuestas asociadas a esos prompts
    if (promptIds.length > 0) {
      const deletedRespuestas = await Respuesta.destroy({ where: { promptId: promptIds } });
      console.log('Respuestas borradas por promptId:', deletedRespuestas);
    }

    // Borra todas las respuestas sueltas del usuario
    const deletedRespuestasUsuario = await Respuesta.destroy({ where: { usuarioId } });
    console.log('Respuestas borradas por usuarioId:', deletedRespuestasUsuario);

    // Borra los prompts del usuario
    const deletedPrompts = await Prompt.destroy({ where: { usuarioId } });
    console.log('Prompts borrados:', deletedPrompts);

    res.json({ mensaje: 'Sesión cerrada y datos eliminados.' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: error.message });
  }
};