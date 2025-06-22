const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Prompt, Respuesta, Busqueda } = require('../models');

// Controlador para registrar un usuario nuevo
exports.register = async (req, res) => {
  try {
    // Log incoming data for debugging
    console.log('Registro recibido:', req.body);

    // Validación de campos obligatorios
    const { nombre, email, dni, password, rol } = req.body;
    const missingFields = [];
    if (!nombre) missingFields.push('nombre');
    if (!email) missingFields.push('email');
    if (!dni) missingFields.push('dni');
    if (!password) missingFields.push('password');
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Faltan campos obligatorios: ${missingFields.join(', ')}` });
    }
    // Verifica si el email o dni ya existen
    const existeEmail = await Usuario.findOne({ where: { email } });
    if (existeEmail) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const existeDni = await Usuario.findOne({ where: { dni } });
    if (existeDni) {
      return res.status(400).json({ error: 'El DNI ya está registrado' });
    }
    // Crea el usuario con los datos recibidos
    const usuario = await Usuario.create({
      nombre,
      email,
      dni,
      password,
      rol
    });
    // Genera un token para que el usuario pueda autenticarse
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ token, id: usuario.id });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({ error: error.message });
  }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
  try {
    console.log('Login recibido:', req.body);

    // DEBUG: Mostrar todos los usuarios registrados
    const allUsers = await Usuario.findAll({ attributes: ['id', 'dni', 'email', 'nombre'] });
    console.log('Usuarios en base de datos:', allUsers.map(u => u.toJSON()));

    const { dni, password } = req.body;
    const missingFields = [];
    if (!dni) missingFields.push('dni');
    if (!password) missingFields.push('password');
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Faltan campos obligatorios: ${missingFields.join(', ')}` });
    }
    // Busca el usuario por dni
    const usuario = await Usuario.findOne({ where: { dni } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas (usuario no encontrado)' });
    }
    // Compara la contraseña recibida con la guardada
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas (contraseña incorrecta)' });
    }
    // Si todo está bien, genera un token para el usuario
    const token = jwt.sign(
      { id: usuario.id, dni: usuario.dni, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, id: usuario.id, rol: usuario.rol });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controlador para cerrar sesión y borrar prompts/respuestas del usuario
exports.logout = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Borra las búsquedas del usuario
    await Busqueda.destroy({ where: { usuarioId } });

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