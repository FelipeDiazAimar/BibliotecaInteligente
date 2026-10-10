// Servicio de correo del backend.
// En DEMO_MODE devuelve un stub determinístico con aviso [demo] (no llama a
// ningún proveedor externo). En modo real lanza un error claro: el envío con
// EmailJS (@emailjs/browser) se hace desde el frontend; si a futuro se cablea
// un proveedor en el backend, implementarlo aquí con las variables EMAILJS_*.

const { isDemoMode, DEMO_TAG } = require('../config/demo');

async function sendEmail({ to, subject, text } = {}) {
  if (isDemoMode()) {
    console.log(`${DEMO_TAG} email stub -> para: ${to || '(sin destinatario)'} | asunto: ${subject || '(sin asunto)'}`);
    return {
      demo: true,
      message: `${DEMO_TAG} correo no enviado (servicio externo deshabilitado en modo demo).`,
      to: to || null,
      subject: subject || null
    };
  }
  throw new Error('Envío de correo no configurado en el backend (modo real). El envío con EmailJS se realiza desde el frontend.');
}

module.exports = { sendEmail };
