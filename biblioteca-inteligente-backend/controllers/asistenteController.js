const axios = require('axios');

exports.ask = async (req, res) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions', // OpenRouter endpoint
      {
        model: "openai/gpt-3.5-turbo", // Cambia el modelo si usas otro de OpenRouter
        messages: [{ role: "user", content: req.body.prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`, // Usa tu clave de OpenRouter
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ respuesta: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};