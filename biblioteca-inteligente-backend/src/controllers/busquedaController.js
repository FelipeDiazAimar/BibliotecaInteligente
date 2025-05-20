const { Busqueda } = require('../models');

// Trae todas las búsquedas realizadas por los usuarios
exports.getAll = async (req, res) => {
  try {
    const busquedas = await Busqueda.findAll();
    res.json(busquedas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Guarda una nueva búsqueda realizada por un usuario
exports.create = async (req, res) => {
  try {
    // Guarda la búsqueda y asocia el usuario que la hizo
    const busqueda = await Busqueda.create({
      ...req.body,
      usuarioId: req.usuario.id
    });
    res.status(201).json(busqueda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};