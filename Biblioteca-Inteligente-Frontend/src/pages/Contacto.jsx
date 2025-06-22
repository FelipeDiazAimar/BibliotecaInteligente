import { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Contacto.css';
import emailjs from '@emailjs/browser';

function ContactPage({ usuario }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const formRef = useRef();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    // Validación simple
    if (!form.nombre || !form.email || !form.mensaje) {
      setStatus({ type: 'error', msg: 'Completa todos los campos obligatorios.' });
      return;
    }

    try {
      await emailjs.sendForm(
        'service_hpobx7d',
        'template_mwsu2cg',
        formRef.current,
        'R4sHYJJWxUgNJQY0w'
      );
      setStatus({ type: 'success', msg: '¡Mensaje enviado correctamente!' });
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' });
    } catch {
      setStatus({ type: 'error', msg: 'Error al enviar el mensaje. Intenta nuevamente.' });
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
    <div>
      <Header
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginRight: '80px' }}>
            <button type="button" className="panel-link" onClick={() => goTo('/catalogo')}>Catálogo</button>
            <button type="button" className="panel-link" onClick={() => goTo('/turnos')}>Turnos</button>
          </div>
        }
      />
      <div className="contact-container">
        <h1>Contactanos</h1>
        <form ref={formRef} className="contact-form" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Tu nombre"
          />
          <label htmlFor="email">Correo electrónico *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
          />
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
            required
            placeholder="Escribe tu mensaje aquí..."
          />
          <button
            type="submit"
            style={{
              background: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: 50,
              padding: '0.9em 2.5em',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginTop: 16,
              marginBottom: 24,
            }}
          >
            Enviar Mensaje
          </button>
          {status.msg && (
            <div style={{
              color: status.type === 'success' ? '#2196f3' : '#e53935',
              background: status.type === 'success' ? '#e3f2fd' : '#ffebee',
              borderRadius: 6,
              padding: 10,
              marginTop: 8,
              textAlign: 'center'
            }}>
              {status.msg}
            </div>
          )}
        </form>
        <div className="contact-info">
          <div className="contact-title">Datos de contacto</div>
          <div>📍 Zeballos 1341, S2000BQA Rosario, Santa Fe</div>
          <div>☎️ (0341) 448-1871</div>
          <div>✉️ info@frro..edu.ar</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ContactPage;