// Este middleware verifica si el usuario está autenticado usando un token JWT.
// Si el token es válido, deja pasar la petición. Si no, la bloquea.

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Busca el token en el header Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  try {
    // Verifica el token y guarda la info del usuario en req.usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};