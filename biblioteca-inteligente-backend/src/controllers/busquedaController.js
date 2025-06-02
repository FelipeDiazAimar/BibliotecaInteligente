const { Busqueda } = require('../models');

// Trae todas las búsquedas realizadas por los usuarios, o solo las de un usuario si se pasa usuarioId
exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.usuarioId) {
      where.usuarioId = req.query.usuarioId;
    }
    const busquedas = await Busqueda.findAll({ where });
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