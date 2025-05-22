import { useState } from 'react';
import '../styles/portada.css';

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
    <div className="overlay">
      <nav>
        <ul>
          <li><a href="#">Acerca de</a></li>
          <li><a href="#">Contacto</a></li>
          <li>
            <button
              style={{
                background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 500
              }}
              onClick={onAtras}
            >Atrás</button>
          </li>
          <li>
            <button
              style={{
                background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 500
              }}
              onClick={onCrearUsuario}
            >Crear usuario</button>
          </li>
        </ul>
      </nav>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: 'rgba(0,0,0,0.45)',
          borderRadius: 16,
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          minWidth: 340,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              border: '3px solid #fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 16
            }}>
              <svg width="54" height="54" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
              </svg>
            </div>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 22, textAlign: 'center', letterSpacing: 1 }}>
              BIBLIOTECA<br />INTELIGENTE
            </div>
            <div style={{ color: '#fff', fontSize: 15, marginTop: 2, letterSpacing: 2 }}>UTN</div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ color: '#fff', fontSize: 15 }}>Legajo</label>
              <input
                type="text"
                value={legajo}
                onChange={e => setLegajo(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.7em',
                  borderRadius: 7,
                  border: 'none',
                  marginTop: 4,
                  fontSize: 16
                }}
                autoFocus
              />
            </div>
            <div>
              <label style={{ color: '#fff', fontSize: 15 }}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.7em',
                  borderRadius: 7,
                  border: 'none',
                  marginTop: 4,
                  fontSize: 16
                }}
              />
            </div>
            {error && <div style={{ color: '#ffbaba', background: '#6a0000', borderRadius: 6, padding: '0.5em', fontSize: 14, textAlign: 'center' }}>{error}</div>}
            <button type="submit" style={{
              background: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.9em 0',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 8
            }}>
              Iniciar Sesión
            </button>
            <button
              type="button"
              style={{
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.9em 0',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 10
              }}
              onClick={onCrearUsuario}
            >
              Crear usuario
            </button>
          </form>
        </div>
      </main>
      <footer>
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}
