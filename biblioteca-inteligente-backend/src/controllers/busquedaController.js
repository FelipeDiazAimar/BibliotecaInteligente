const { Busqueda } = require('../models');

exports.getBusquedas = async (req, res) => {
  try {
    const where = {};
    if (req.query.usuarioId) where.usuarioId = req.query.usuarioId;
    // Solo trae las 3 más recientes
    const busquedas = await Busqueda.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 3
    });
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