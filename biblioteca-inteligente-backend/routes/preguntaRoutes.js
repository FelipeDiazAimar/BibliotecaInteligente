const express = require('express');
const router = express.Router();

// Ruta de ejemplo para preguntas
router.get('/', (req, res) => {
  res.json({ message: "Endpoint de preguntas" });
});

module.exports = router;