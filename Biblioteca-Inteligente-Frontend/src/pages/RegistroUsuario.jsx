import { useState } from 'react';
import '../styles/portada.css';

export default function RegistroUsuario({ onRegistrado, onAtras }) {
  const [form, setForm] = useState({
    legajo: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'estudiante'
  });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setOk('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al registrar usuario');
        return;
      }
      setOk('Usuario creado correctamente');
      setTimeout(() => {
        if (onRegistrado) onRegistrado();
      }, 1200);
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
              CREAR USUARIO
            </div>
            <div style={{ color: '#fff', fontSize: 15, marginTop: 2, letterSpacing: 2 }}>UTN</div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ color: '#fff', fontSize: 15 }}>Legajo</label>
              <input
                type="text"
                name="legajo"
                value={form.legajo}
                onChange={handleChange}
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
              <label style={{ color: '#fff', fontSize: 15 }}>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
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
            <div>
              <label style={{ color: '#fff', fontSize: 15 }}>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
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
            <div>
              <label style={{ color: '#fff', fontSize: 15 }}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
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
            <div>
              <label style={{ color: '#fff', fontSize: 15 }}>Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
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
            <div>
              <label style={{ color: '#fff', fontSize: 15 }}>Rol</label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.7em',
                  borderRadius: 7,
                  border: 'none',
                  marginTop: 4,
                  fontSize: 16
                }}
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && <div style={{ color: '#ffbaba', background: '#6a0000', borderRadius: 6, padding: '0.5em', fontSize: 14, textAlign: 'center' }}>{error}</div>}
            {ok && <div style={{ color: '#d4ffb2', background: '#1b5e20', borderRadius: 6, padding: '0.5em', fontSize: 14, textAlign: 'center' }}>{ok}</div>}
            <button type="submit" style={{
              background: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.9em 0',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 8
            }}>
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
