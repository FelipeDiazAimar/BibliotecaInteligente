import { useState } from 'react';
import '../styles/LoginAlumno.css';

export default function LoginAlumno({ onLogin, onAtras, onCrearUsuario }) {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ legajo, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error de autenticación');
        return;
      }
      localStorage.setItem('token', data.token);
      if (onLogin) onLogin();
    } catch {
      setError('Error de red');
    }
  };

  return (
    <div className="login-overlay">
      <nav className="login-nav">
        <ul>
          <li><a href="#">Acerca de</a></li>
          <li><a href="#">Contacto</a></li>
          <li>
            <button
              className="login-nav-btn"
              onClick={onAtras}
            >Atrás</button>
          </li>
          <li>
            <button
              className="login-nav-btn"
              onClick={onCrearUsuario}
            >Crear usuario</button>
          </li>
        </ul>
      </nav>
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
            <div className="login-utn">UTN</div>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label>Legajo</label>
              <input
                type="text"
                value={legajo}
                onChange={e => setLegajo(e.target.value)}
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
              onClick={onCrearUsuario}
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
