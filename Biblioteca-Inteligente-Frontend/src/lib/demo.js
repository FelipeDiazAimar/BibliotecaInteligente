// Utilidades del Modo Demo — contrato compartido (AGENTE 1).
// No cambiar los nombres de estos exports: otros agentes los importan.

export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE ?? 'true') !== 'false';

export const DEMO_USER = { id:'demo-1', nombre:'Usuario Demo', email:'demo@biblioteca.local', rol:'alumno' };

export const DEMO_CREDENTIALS = { email:'demo@biblioteca.local', password:'demo1234' };

export const demoDelay = (ms=400) => new Promise(r=>setTimeout(r,ms));

export async function fetchConFallback(url, options, fallback) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return fallback;
    try {
      return await res.json();
    } catch {
      return fallback;
    }
  } catch {
    return fallback;
  }
}

/* Mensajes de error para el usuario: nunca filtrar ruido de infraestructura
   (Postgres, DATABASE_URL, .env, stacks). Si el mensaje crudo parece
   técnico, se devuelve el fallback amable y el original va a consola. */
const RUIDO_INFRA = /(postgres|data\s*base|database|database_url|db_|dotenv|\.env|ECONN|fetch\s*failed|500|502|503)/i;

export function mensajeErrorAmable(crudo, fallback = 'Algo salió mal. Intentá de nuevo.') {
  const texto = typeof crudo === 'string' ? crudo : '';
  if (!texto || RUIDO_INFRA.test(texto)) {
    if (texto) console.warn('[api] error técnico ocultado al usuario:', texto.slice(0, 200));
    return fallback;
  }
  return texto;
}
