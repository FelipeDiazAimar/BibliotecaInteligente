const axios = require('axios');
const { Libro } = require('../models');

exports.ask = async (req, res) => {
  try {
    // Traer todos los libros con más atributos
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

    // Armar el texto para el prompt con más detalles
    const listaLibros = libros.map(l =>
      `Título: ${l.titulo}\nAutor: ${l.autor}\nAño: ${l.anioPublicacion || '-'}\nEditorial: ${l.editorial || '-'}\nIdioma: ${l.idioma || '-'}\nPáginas: ${l.paginas || '-'}\nDisponible: ${l.disponible ? 'Sí' : 'No'}`
    ).join('\n\n');

    const promptIA = `Estos son los libros disponibles en la biblioteca:\n\n${listaLibros}\n\nResponde a la siguiente consulta del usuario usando la información de los libros:\n${req.body.prompt}`;

    // Enviar el prompt a la IA
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: promptIA }],
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ respuesta: response.data.choices[0].message.content });
  } catch (error) {
    if (error.response) {
      res.status(500).json({ error: `OpenRouter: ${error.response.status} - ${JSON.stringify(error.response.data)}` });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};