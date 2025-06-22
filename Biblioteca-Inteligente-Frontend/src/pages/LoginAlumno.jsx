import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginAlumno.css';
import Navbar from '../components/Navbar';

export default function LoginAlumno({ onLogin }) {
  const navigate = useNavigate();
  const [dni, setdni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error de autenticación');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);

      // Llama a la función para actualizar el usuario en App.jsx
      if (onLogin) await onLogin();
      if (data.rol === 'admin') navigate('/admin');
      else navigate('/panel');
    } catch {
      setError('Error de red');
    }
  };

  return (
    <div className="login-overlay">
      <Navbar
        extraClass="login-nav"
        extraLinks={[
          { to: '/registro', label: 'Crear usuario' },
          { to: '/', label: 'Atrás' }
        ]}
        hideLinks={['login']}
      />
      <main className="login-main">
        <div className="login-form-container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <div className="login-avatar">
              <svg width="54" height="54" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
              </svg>
            </div>
            <div className="login-title">
              BIBLIOTECA<br />INTELIGENTE
            </div>
            <div className="login- "> </div>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label>Documento</label>
              <input
                type="text"
                value={dni}
                onChange={e => setdni(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-btn">
              Iniciar Sesión
            </button>
            <button
              type="button"
              className="login-btn-secondary"
              onClick={() => navigate('/registro')}
            >
              Crear usuario
            </button>
          </form>
        </div>
      </main>
      <footer className="login-footer">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}
