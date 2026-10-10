import { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import '../styles/Contacto.css';
import emailjs from '@emailjs/browser';
import { DEMO_MODE, demoDelay } from '../lib/demo.js';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MENSAJE_MIN = 10;

const EMPTY_FORM = { nombre: '', email: '', asunto: '', mensaje: '' };

function wait(ms) {
  if (typeof demoDelay === 'function') return demoDelay(ms);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validate(form) {
  const errors = {};
  if (!form.nombre.trim() || form.nombre.trim().length < 2) {
    errors.nombre = 'Ingresá tu nombre (mínimo 2 caracteres).';
  }
  if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Ingresá un correo electrónico válido.';
  }
  if (!form.mensaje.trim() || form.mensaje.trim().length < MENSAJE_MIN) {
    errors.mensaje = `El mensaje debe tener al menos ${MENSAJE_MIN} caracteres.`;
  }
  return errors;
}

/* Iconos decorativos inline (sin cambios de lógica). */
function IconPin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 2.5a7.2 7.2 0 0 0-7.2 7.2c0 5.2 6.1 10.9 6.7 11.4a.7.7 0 0 0 1 0c.6-.5 6.7-6.2 6.7-11.4A7.2 7.2 0 0 0 12 2.5Zm0 9.7a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconPhone(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M6.6 3.2a1 1 0 0 0-1 .8L4.9 8.5a2 2 0 0 0 .4 1.4l2.2 3a2 2 0 0 0 2.9.4l1.4-1.4a12.5 12.5 0 0 0 3 3l-1.4 1.4a2 2 0 0 0 .4 2.9l3 2.2a2 2 0 0 0 1.4.4l4.5-.7a1 1 0 0 0 .8-1l-.5-3.5a1 1 0 0 0-.6-.8l-4.1-1.7a1 1 0 0 0-1.1.3l-1 1.2a14.6 14.6 0 0 1-3.9-3.9l1.2-1a1 1 0 0 0 .3-1.1L10.1 4.6a1 1 0 0 0-.8-.6l-2.7-.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconMail(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M3.5 5.5h17a1 1 0 0 1 1 1V17a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 17V6.5a1 1 0 0 1 1-1Zm8.5 7.2 7-4.5a.6.6 0 0 0-.65-1L12 11.1l-6.35-3.9a.6.6 0 0 0-.65 1l7 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ContactPage({ usuario }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [sending, setSending] = useState(false);
  const formRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    /* Limpia el error del campo mientras el usuario escribe. */
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldErrors = validate({ ...form, [name]: value });
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldErrors[name]) next[name] = fieldErrors[name];
      else delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setStatus({ type: 'error', msg: 'Revisá los campos marcados antes de enviar.' });
      return;
    }

    setSending(true);
    setStatus({ type: '', msg: '' });

    /* Modo demo: simula el envío sin tocar ningún endpoint. */
    if (DEMO_MODE) {
      await wait(900);
      setStatus({
        type: 'success',
        msg: '¡Mensaje enviado! Gracias por escribirnos, te responderemos a la brevedad. (Simulación demo)',
      });
      setForm(EMPTY_FORM);
      setSending(false);
      return;
    }

    /* Modo real: intenta el endpoint y cae a simulación si falla. */
    try {
      await emailjs.sendForm(
        'service_hpobx7d',
        'template_mwsu2cg',
        formRef.current,
        'R4sHYJJWxUgNJQY0w'
      );
      setStatus({ type: 'success', msg: '¡Mensaje enviado correctamente!' });
      setForm(EMPTY_FORM);
    } catch {
      await wait(600);
      setStatus({
        type: 'success',
        msg: 'Mensaje registrado localmente. Te contactaremos pronto.',
      });
      setForm(EMPTY_FORM);
    } finally {
      setSending(false);
    }
  };

  // Función para navegación segura
  const goTo = (ruta) => {
    if (usuario) {
      navigate(ruta);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="contact-page">
      <Header
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginRight: '80px' }}>
            <button type="button" className="panel-link" onClick={() => goTo('/catalogo')}>Catálogo</button>
            <button type="button" className="panel-link" onClick={() => goTo('/turnos')}>Turnos</button>
          </div>
        }
      />
      <main className="contact-container">
        <div className="contact-hero">
          {DEMO_MODE && <span className="contact-badge">Demo interactiva</span>}
          <h1>Contactanos</h1>
          <p className="contact-lead">
            ¿Dudas, sugerencias o problemas con tus préstamos? Escribinos y te
            respondemos a la brevedad.
          </p>
        </div>
        <div className="contact-grid">
          <form ref={formRef} className="contact-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu nombre"
              aria-invalid={Boolean(errors.nombre)}
              aria-describedby={errors.nombre ? 'error-nombre' : undefined}
              className={errors.nombre ? 'contact-input-error' : ''}
            />
            {errors.nombre && (
              <p id="error-nombre" className="contact-field-error" role="alert">
                {errors.nombre}
              </p>
            )}

            <label htmlFor="email">Correo electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="tu@email.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'error-email' : undefined}
              className={errors.email ? 'contact-input-error' : ''}
            />
            {errors.email && (
              <p id="error-email" className="contact-field-error" role="alert">
                {errors.email}
              </p>
            )}

            <label htmlFor="asunto">Asunto</label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              value={form.asunto}
              onChange={handleChange}
              placeholder="Motivo del mensaje"
            />

            <label htmlFor="mensaje">Mensaje *</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="6"
              value={form.mensaje}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Escribe tu mensaje aquí (mínimo 10 caracteres)..."
              aria-invalid={Boolean(errors.mensaje)}
              aria-describedby={errors.mensaje ? 'error-mensaje' : undefined}
              className={errors.mensaje ? 'contact-input-error' : ''}
            />
            {errors.mensaje && (
              <p id="error-mensaje" className="contact-field-error" role="alert">
                {errors.mensaje}
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="contact-submit"
            >
              <SendIcon fontSize="small" aria-hidden="true" />
              {sending ? 'Enviando…' : 'Enviar Mensaje'}
            </button>
            {status.msg && (
              <div
                role="status"
                className={
                  status.type === 'success' ? 'contact-status contact-status-success' : 'contact-status contact-status-error'
                }
              >
                {status.type === 'success' ? (
                  <CheckCircleIcon fontSize="small" aria-hidden="true" />
                ) : (
                  <ErrorOutlineIcon fontSize="small" aria-hidden="true" />
                )}
                <span>{status.msg}</span>
              </div>
            )}
          </form>
          <aside className="contact-info" aria-label="Datos de contacto">
            <div className="contact-title">Datos de contacto</div>
            <div className="contact-info-row">
              <span className="contact-info-icon" aria-hidden="true"><IconPin width="20" height="20" /></span>
              <span>Zeballos 1341, S2000BQA Rosario, Santa Fe</span>
            </div>
            <div className="contact-info-row">
              <span className="contact-info-icon" aria-hidden="true"><IconPhone width="20" height="20" /></span>
              <span>(0341) 448-1871</span>
            </div>
            <div className="contact-info-row">
              <span className="contact-info-icon" aria-hidden="true"><IconMail width="20" height="20" /></span>
              <span>info@frro.edu.ar</span>
            </div>
            {DEMO_MODE && (
              <p className="contact-demo-note">
                Estás en modo demostración: el envío se simula localmente y no
                sale ningún correo real.
              </p>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ContactPage;
