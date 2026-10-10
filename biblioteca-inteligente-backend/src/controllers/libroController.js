// Este archivo tiene las funciones que se usan para manejar los pedidos relacionados con libros.

const { Libro } = require('../models');
const { isDemoMode } = require('../config/demo');
const { isDbConnectionError, sendDbUnavailable, sendDbOrInternal } = require('../middlewares/apiError');

// Trae todos los libros de la base de datos y los devuelve como lista
exports.getAll = async (req, res) => {
  try {
    const libros = await Libro.findAll(); // Busca todos los libros
    res.json(libros); // Devuelve la lista de libros
  } catch (error) {
    // En demo sin DB, devuelve los libros de ejemplo para que el catálogo funcione.
    if (isDemoMode() && isDbConnectionError(error)) {
      console.error(`${'[demo]'} sin DB: devolviendo libros de ejemplo:`, error.message);
      const { DEMO_BOOKS } = require('../config/demo');
      return res.json(DEMO_BOOKS);
    }
    return sendDbOrInternal(res, error, 'Error al obtener libros');
  }
};

// Busca un libro por su ID (identificador único)
exports.getById = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id); // Busca el libro por ID
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(libro); // Devuelve el libro encontrado
  } catch (error) {
    if (isDemoMode() && isDbConnectionError(error)) {
      const { DEMO_BOOKS } = require('../config/demo');
      const demo = DEMO_BOOKS.find((l) => String(l.id) === String(req.params.id));
      if (demo) return res.json(demo);
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    return sendDbOrInternal(res, error, 'Error al obtener el libro');
  }
};

// Agrega un libro nuevo a la base de datos
exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.portada = req.file.buffer;
    }
    const libro = await Libro.create(data);
    res.status(201).json(libro);
  } catch (error) {
    if (isDbConnectionError(error)) return sendDbUnavailable(res, error);
    res.status(400).json({ error: error.message });
  }
};

// Modifica los datos de un libro existente
exports.update = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    // Si hay archivo de portada, manejarlo aquí si usas multer
    if (req.file) {
      libro.portada = req.file.buffer;
    }
    await libro.update(req.body);
    res.json({ mensaje: 'Libro actualizado correctamente' });
  } catch (error) {
    if (isDbConnectionError(error)) return sendDbUnavailable(res, error);
    res.status(400).json({ error: error.message });
  }
};

// Borra un libro de la base de datos
exports.delete = async (req, res) => {
  try {
    const deleted = await Libro.destroy({ where: { id: req.params.id } }); // Borra el libro por ID
    if (!deleted) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.status(204).end(); // Si todo salió bien, responde sin contenido
  } catch (error) {
    if (isDbConnectionError(error)) return sendDbUnavailable(res, error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPortada = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro || !libro.portada) {
      return res.status(404).send('Portada no encontrada');
    }

    let portadaBuffer = libro.portada;
    if (Buffer.isBuffer(portadaBuffer)) {
      // Si es una URL hex (https://...), decodifica y redirige
      const asString = portadaBuffer.toString('utf8');
      if (/^https?:\/\//.test(asString)) {
        return res.redirect(302, asString);
      }
      // Si no es una URL, asume que es una imagen binaria
      res.set('Content-Type', 'image/jpeg');
      return res.send(portadaBuffer);
    } else if (typeof portadaBuffer === 'string' && portadaBuffer.startsWith('http')) {
      // Si por alguna razón es string (no buffer), redirige igual
      return res.redirect(302, portadaBuffer);
    } else {
      return res.status(404).send('Portada no válida');
    }
  } catch (error) {
    if (isDbConnectionError(error)) return res.status(503).send('Base de datos no disponible');
    res.status(500).send('Error al obtener la portada');
  }
};
