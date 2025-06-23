const axios = require('axios');
const { Libro, Prompt, Respuesta } = require('../models');
const { jsonrepair } = require('jsonrepair');

exports.ask = async (req, res) => {
  try {
    // 1. Traer todos los libros
    const libros = await Libro.findAll({
      attributes: [
        'titulo',
        'autor',
        'anioPublicacion',
        'editorial',
        'idioma',
        'paginas',
        'disponible'
      ]
    });

    // 2. Armar el texto de libros
    const librosTexto = libros.map(libro =>
      `Título: ${libro.titulo}, Autor: ${libro.autor}, Año: ${libro.anioPublicacion}, Editorial: ${libro.editorial}, Idioma: ${libro.idioma}, Páginas: ${libro.paginas}, Disponible: ${libro.disponible ? 'Sí' : 'No'}`
    ).join('\n');

    // 3. Prepara el prompt para OpenRouter con la lista de libros
    let openrouterPrompt = `Base de datos de libros:\n${librosTexto}\n\nPregunta del usuario: ${req.body.prompt}`;

    let respuestaFinal = '';

    try {
      const openrouterResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "mistralai/mistral-7b-instruct:free",
          messages: [{ role: "user", content: openrouterPrompt }],
          max_tokens: 200
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      respuestaFinal = openrouterResponse.data.choices[0].message.content;
    } catch (error) {
      console.error('Error consultando OpenRouter:', error);
      respuestaFinal = "Error consultando OpenRouter.";
    }

    // Guarda el historial
    try {
      const usuarioId = req.usuario?.id || 1;
      const promptGuardado = await Prompt.create({
        texto: req.body.prompt,
        usuarioId
      });

      await Respuesta.create({
        texto: respuestaFinal,
        promptId: promptGuardado.id,
        usuarioId
      });
    } catch (e) {
      console.error('Error guardando historial de asistente:', e);
    }

    // Devuelve la respuesta de OpenRouter directamente
    res.json({ respuesta: respuestaFinal });
  } catch (error) {
    console.error('Error en /api/asistente/ask:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.historial = async (req, res) => {
  try {
    // Fallback temporal para pruebas
    const usuarioId = req.usuario?.id || 1;
    const prompts = await Prompt.findAll({
      where: { usuarioId },
      include: [{ model: Respuesta, as: 'Respuesta' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(prompts);
  } catch (error) {
    console.error('Error en /api/asistente/historial:', error);
    res.status(500).json({ error: error.message });
  }
};