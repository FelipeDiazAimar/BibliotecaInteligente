const { Busqueda } = require('../models');

exports.getBusquedas = async (req, res) => {
  try {
    const where = {};
    if (req.query.usuarioId) where.usuarioId = req.query.usuarioId;
    const busquedas = await Busqueda.findAll({ where });
    res.json(busquedas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBusqueda = async (req, res) => {
  try {
    const { termino, usuarioId } = req.body;
    const nuevaBusqueda = await Busqueda.create({ termino, usuarioId });
    res.status(201).json(nuevaBusqueda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};