import { useState } from 'react';
import Header from '../components/Header';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Contacto.css';

function ContactPage() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onAtras = () => {
    navigate(-1);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Message submitted:', message);
    setMessage('');
  };

  return (
    <div>
      <Header
        left={
          <div style={{ fontWeight: 'bold', fontSize: '1.7rem', letterSpacing: 1 }}>
            BIBLIOTECA<br />INTELIGENTE
            <div style={{ fontSize: '1rem', letterSpacing: 2, marginTop: 2 }}>
              <span role="img" aria-label="libro">📚</span>
            </div>
          </div>
        }
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' , marginRight: '80px'}}>
            <Link to="/login" className="panel-link">Ask AI</Link>
            <Link to="/login" className="panel-link">Catalogo</Link>
            <Link to="/login" className="panel-link">Turnero</Link>
            <Link to="#" className="panel-link" onClick={onAtras}>Atrás</Link>
          </div>
        }
      />
      <div className="contact-container">
        <h1>Contactanos:</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="message">Mensaje:</label>
            <textarea
              id="message"
              rows="8"
              cols="50"
              value={message}
              onChange={handleMessageChange}
              style={{
                background: '#fff',
                color: '#222',
                border: '1px solid #bbb',
                borderRadius: 8,
                padding: '1em',
                fontSize: '1.1rem',
                width: '100%',
                maxWidth: 500,
                boxSizing: 'border-box',
                marginTop: 8,
                marginBottom: 16,
                resize: 'vertical'
              }}
              placeholder="Escribe tu mensaje aquí..."
            ></textarea>
          </div>
          <button
            type="submit"
            style={{
              background: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.9em 2.5em',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginBottom: '2.5rem',
            }}
          >
            Enviar Mensaje
          </button>
        </form>
        <div className="contact-info">
          <div className="contact-title">Datos de contacto</div>
          <div>📍 Zeballos 1341, S2000BQA Rosario, Santa Fe</div>
          <div>☎️ (0341) 448-1871</div>
          <div>✉️ info@frro. .edu.ar</div>
        <div className="contact-socials contact-socials-bottom">
          <a
            href="https://www.facebook.com/ frro"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-link"
            aria-label="Facebook  "
          >
            <span className="contact-icon contact-icon-fb" />
          </a>
          <a
            href="https://x.com/ frro"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-link"
            aria-label="X  "
          >
            <span className="contact-icon contact-icon-x" />
          </a>
          <a
            href="https://www.instagram.com/ frro"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-link"
            aria-label="Instagram  "
          >
            <span className="contact-icon contact-icon-ig" />
          </a>
        </div>
      </div>
    </div>
    </div>
  );
}

export default ContactPage;