const axios = require('axios');

exports.ask = async (req, res) => {
  try {
    console.log('🔵 [AsistenteIA] Pregunta recibida:', req.body.prompt);
    console.log('🔵 [AsistenteIA] Usando clave:', process.env.OPENROUTER_KEY ? 'PRESENTE' : 'NO DEFINIDA');

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body.prompt }],
        max_tokens: 150 // <--- AJUSTA ESTE VALOR SEGÚN TU CUENTA
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('🟢 [AsistenteIA] Respuesta recibida de OpenRouter:', response.data);

    res.json({ respuesta: response.data.choices[0].message.content });
  } catch (error) {
    if (error.response) {
      console.error('🔴 [AsistenteIA] Error de OpenRouter:', error.response.status, error.response.data);
      res.status(500).json({ error: `OpenRouter: ${error.response.status} - ${JSON.stringify(error.response.data)}` });
    } else {
      console.error('🔴 [AsistenteIA] Error general:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
};