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
    const libro = await Libro.create(req.body); // Crea un libro con los datos recibidos
    res.status(201).json(libro); // Devuelve el libro creado
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Modifica los datos de un libro existente
exports.update = async (req, res) => {
  try {
    const [updated] = await Libro.update(req.body, { where: { id: req.params.id } }); // Actualiza el libro
    if (!updated) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.status(204).end(); // Si todo salió bien, responde sin contenido
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