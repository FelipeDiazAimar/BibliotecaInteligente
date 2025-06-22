const { Busqueda } = require('../models');
const { validationResult } = require('express-validator');

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { termino, usuarioId } = req.body;
    const nuevaBusqueda = await Busqueda.create({ termino, usuarioId });

    // Elimina las búsquedas antiguas, dejando solo las 3 más recientes
    const busquedas = await Busqueda.findAll({
      where: { usuarioId },
      order: [['createdAt', 'DESC']]
    });
    if (busquedas.length > 3) {
      const idsAEliminar = busquedas.slice(3).map(b => b.id);
      await Busqueda.destroy({ where: { id: idsAEliminar } });
    }

    res.status(201).json(nuevaBusqueda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/busquedas/:id
exports.updateBusqueda = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { termino } = req.body;
    if (!termino) return res.status(400).json({ error: 'El término es obligatorio' });
    const busqueda = await Busqueda.findByPk(req.params.id);
    if (!busqueda) return res.status(404).json({ error: 'Búsqueda no encontrada' });
    await busqueda.update({ termino });
    res.json(busqueda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/busquedas/:id
exports.deleteBusqueda = async (req, res) => {
  try {
    const busqueda = await Busqueda.findByPk(req.params.id);
    if (!busqueda) return res.status(404).json({ error: 'Búsqueda no encontrada' });
    await busqueda.destroy();
    res.json({ mensaje: 'Búsqueda eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};