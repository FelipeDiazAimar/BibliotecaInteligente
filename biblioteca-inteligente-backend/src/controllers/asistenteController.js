const axios = require('axios');
const { Libro, Prompt, Respuesta } = require('../models');
const { isDemoMode, DEMO_TAG, DEMO_BOOKS } = require('../config/demo');
const { sendDbOrInternal } = require('../middlewares/apiError');

// Stub determinístico del asistente para DEMO_MODE (sin llamar a OpenRouter).
function demoAnswer(prompt) {
  const disponibles = DEMO_BOOKS.filter((l) => l.disponible).length;
  return (
    `${DEMO_TAG} respuesta de demostración (sin IA externa). ` +
    `Recibí tu pregunta: "${prompt || '(vacía)'}". ` +
    `En la biblioteca demo hay ${DEMO_BOOKS.length} libros de ejemplo (${disponibles} disponibles). ` +
    `Configurá OPENROUTER_KEY y DEMO_MODE=false para usar el asistente real.`
  );
}

exports.ask = async (req, res) => {
  // Modo demo: responde el stub sin llamar a OpenRouter. Intenta guardar el
  // historial, pero si no hay DB lo omite sin fallar.
  if (isDemoMode()) {
    const respuestaFinal = demoAnswer(req.body && req.body.prompt);
    try {
      const usuarioId = (req.usuario && req.usuario.id) || 1;
      const promptGuardado = await Prompt.create({
        texto: (req.body && req.body.prompt) || '',
        usuarioId
      });
      await Respuesta.create({
        texto: respuestaFinal,
        promptId: promptGuardado.id,
        usuarioId
      });
    } catch (e) {
      console.error(`${DEMO_TAG} sin DB: historial del asistente no guardado:`, e.message);
    }
    return res.json({ respuesta: respuestaFinal, demo: true });
  }

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
      console.error('Error consultando OpenRouter:', error.message);
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
      console.error('Error guardando historial de asistente:', e.message);
    }

    // Devuelve la respuesta de OpenRouter directamente
    res.json({ respuesta: respuestaFinal });
  } catch (error) {
    return sendDbOrInternal(res, error, 'Error en el asistente');
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
    return sendDbOrInternal(res, error, 'Error al obtener el historial');
  }
};
