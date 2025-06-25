// Este archivo tiene las funciones que se usan para manejar los pedidos relacionados con libros.

const { Libro } = require('../models');

// Trae todos los libros de la base de datos y los devuelve como lista
exports.getAll = async (req, res) => {
  try {
    const libros = await Libro.findAll(); // Busca todos los libros
    res.json(libros); // Devuelve la lista de libros
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status(500).send('Error al obtener la portada');
  }
};