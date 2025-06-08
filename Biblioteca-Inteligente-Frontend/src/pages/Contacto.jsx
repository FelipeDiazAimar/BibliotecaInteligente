import { useState } from 'react';
import Header from '../components/Header';
import { useNavigate, Link } from 'react-router-dom';

function ContactPage() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onAtras = () => {
    navigate(-1);
  };

  const onLogout = () => {
    // Aquí puedes limpiar el estado de autenticación si es necesario
    navigate('/login');
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
              UTN <span role="img" aria-label="libro">📚</span>
            </div>
          </div>
        }
// ...existing code...
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' , marginRight: '80px'}}>
            <Link to="/voz" className="panel-link">Ask AI</Link>
            <Link to="/catalogo" className="panel-link">Catalogo</Link>
            <Link to="/turnero" className="panel-link">Turnero</Link>
            <Link to="#" className="panel-link" onClick={onAtras}>Atrás</Link>
            <Link to="#" className="panel-link" onClick={onLogout}>Cerrar sesión</Link>
          </div>
        }
// ...existing code...
      />
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
            transition: 'background 0.2s'
          }}
        >
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
}

export default ContactPage;