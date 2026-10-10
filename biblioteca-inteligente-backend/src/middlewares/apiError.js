// Helpers de errores de API: respuestas JSON consistentes sin exponer stack traces.
// Distingue "DB caída / inaccesible" (503) de errores internos genéricos (500).

function isDbConnectionError(err) {
  if (!err) return false;
  const names = [
    'SequelizeConnectionError',
    'SequelizeConnectionRefusedError',
    'SequelizeHostNotFoundError',
    'SequelizeHostNotReachableError',
    'SequelizeInvalidConnectionError',
    'SequelizeConnectionTimedOutError',
    'SequelizeConnectionAcquireTimeoutError',
    'SequelizeAccessDeniedError'
  ];
  if (err.name && names.includes(err.name)) return true;
  const code = (err.original && err.original.code) || (err.parent && err.parent.code) || err.code;
  if (code && ['ECONNREFUSED', 'ENOTFOUND', 'EHOSTUNREACH', 'ETIMEDOUT', 'ECONNRESET', '28P01', '3D000'].includes(code)) {
    return true;
  }
  const msg = `${err.message || ''} ${(err.original && err.original.message) || ''}`;
  return /ECONNREFUSED|ENOTFOUND|EHOSTUNREACH|ETIMEDOUT|connection (refused|timed out)|database ".+" does not exist|password authentication failed|connect /i.test(msg);
}

// 503 JSON claro cuando Postgres no está disponible. No incluye stack traces.
function sendDbUnavailable(res, err) {
  if (err) console.error('[db] Base de datos no disponible:', err.message);
  return res.status(503).json({
    error: 'Base de datos no disponible. Verifique que Postgres esté en ejecución y revise DATABASE_URL o DB_* en el archivo .env (ver .env.example).'
  });
}

// Clasifica el error: 503 si es conexión a DB, 500 genérico en otro caso.
// Nunca expone err.message crudo de la DB ni stack traces al cliente.
function sendDbOrInternal(res, err, fallbackMsg) {
  if (isDbConnectionError(err)) return sendDbUnavailable(res, err);
  console.error('[api] Error interno:', err && err.message ? err.message : err);
  return res.status(500).json({ error: fallbackMsg || 'Error interno del servidor' });
}

module.exports = { isDbConnectionError, sendDbUnavailable, sendDbOrInternal };
