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
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('rol', data.rol);

        await onLogin(); // Esto actualiza el estado usuario en App

        // Redirige según el rol
        if (data.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/panel');
        }
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch {
      setError('Error de red');
    }
  };

  return (
    <div className="login-overlay">
      <Navbar
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
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}>
                  <path d="m16 6 4 14"></path>
                  <path d="M12 6v14"></path>
                  <path d="M8 8v12"></path>
                  <path d="M4 4v16"></path>
                </svg>
                <span className="login-title" style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', letterSpacing: 1, fontFamily: "'SF Pro', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                  BiblioTech
                </span>
              </span>
            <div className="login-"></div>
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
            {/* Mensaje de registro con SVG y sin subrayado */}
            <div style={{ marginTop: 18, textAlign: 'center', color: '#fff', fontSize: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span>
                ¿Aún no tienes una cuenta?{' '}
                <span
                  style={{ color: '#4eaaff', cursor: 'pointer' }}
                  onClick={() => navigate('/registro')}
                >
                  Regístrate
                </span>
              </span>
            </div>
          </form>
        </div>
      </main>
      <footer className="login-footer">
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}
