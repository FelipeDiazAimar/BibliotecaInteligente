import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegistroUsuario.css';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext.jsx';
import { DEMO_MODE, DEMO_CREDENTIALS, demoDelay, fetchConFallback, mensajeErrorAmable } from '../lib/demo.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = 'http://localhost:3000/api/auth/register';
const USUARIOS_URL = 'http://localhost:3000/api/usuarios';

function Toast({ show, message, type, onClose }) {
  if (!show) return null;
  return (
    <div
      className={`registro-toast ${type}`}
      onClick={onClose}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

function validar(form) {
  const errores = {};
  if (!form.nombre.trim()) {
    errores.nombre = 'Ingresá tu nombre completo.';
  }
  if (!EMAIL_RE.test(form.email.trim())) {
    errores.email = 'Ingresá un email válido (ej: nombre@correo.com).';
  }
  if (!form.dni.trim()) {
    errores.dni = 'Ingresá tu DNI.';
  }
  if (form.password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (form.confirmar !== form.password) {
    errores.confirmar = 'Las contraseñas no coinciden.';
  }
  return errores;
}

function RegistroUsuario({ onRegistrado, onAtras }) {
  const navigate = useNavigate();
  const { usuario, loginDemo, logout } = useUser();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    dni: '',
    password: '',
    confirmar: '',
    rol: 'usuario' // "usuario" por defecto
  });
  const [errores, setErrores] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [nextAdminName, setNextAdminName] = useState('admin1');
  const [enviando, setEnviando] = useState(false);
  const [entrandoDemo, setEntrandoDemo] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const ocupado = enviando || entrandoDemo;
  const sesionActiva = Boolean(usuario && (usuario.isDemo || usuario.email));

  // Al montar, consulta cuántos admins existen (tolerante a backend caído).
  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const res = await fetchConFallback(USUARIOS_URL, {}, []);
        let users = [];
        if (Array.isArray(res)) {
          users = res;
        } else if (res && typeof res.json === 'function') {
          users = await res.json();
        }
        if (!vivo) return;
        const adminUsers = Array.isArray(users)
          ? users.filter(u => u && u.rol === 'admin')
          : [];
        setNextAdminName('admin' + (adminUsers.length + 1));
      } catch {
        if (vivo) setNextAdminName('admin1');
      }
    })();
    return () => { vivo = false; };
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrores(prev => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3500);
  };

  // Rellena el formulario con datos demo de ejemplo (1 click).
  const handleRellenoDemo = () => {
    setForm(f => ({
      ...f,
      nombre: f.nombre.trim() || 'Usuario Demo',
      email: f.email.trim() || DEMO_CREDENTIALS.email,
      dni: f.dni.trim() || '12345678',
      password: f.password || DEMO_CREDENTIALS.password,
      confirmar: DEMO_CREDENTIALS.password
    }));
    setErrores({});
  };

  // Entrada demo directa, sin completar el formulario (100% sin backend).
  const handleEntrarDemo = async () => {
    if (ocupado) return;
    setEntrandoDemo(true);
    try {
      await demoDelay();
      const sesion = await loginDemo();
      showToast(`¡Hola, ${sesion.nombre}! Entraste como demo.`, 'success');
      setTimeout(() => {
        navigate('/');
      }, 900);
    } catch {
      showToast('No se pudo iniciar la sesión demo.', 'error');
    } finally {
      setEntrandoDemo(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (enviando) return;

    const erroresVal = validar(form);
    setErrores(erroresVal);
    if (Object.keys(erroresVal).length > 0) {
      showToast('Revisá los campos marcados.', 'error');
      return;
    }

    // Si selecciona admin, solo permite nombre adminN (regla original).
    if (
      form.rol === 'admin' &&
      form.nombre.trim().toLowerCase() !== nextAdminName
    ) {
      showToast('No es posible crear una cuenta de administrador.', 'error');
      return;
    }

    // Rama demo: simula registro exitoso sin backend y guarda la sesión
    // demo con el nombre/email ingresados (persiste en 'biblio_demo_session').
    if (DEMO_MODE) {
      setEnviando(true);
      try {
        await demoDelay();
        const sesion = await loginDemo({
          nombre: form.nombre.trim(),
          email: form.email.trim().toLowerCase()
        });
        showToast(`¡Cuenta demo creada! Bienvenido/a, ${sesion.nombre}.`, 'success');
        if (onRegistrado) onRegistrado();
        setTimeout(() => {
          navigate('/');
        }, 1400);
      } catch {
        showToast('No se pudo crear la cuenta demo.', 'error');
      } finally {
        setEnviando(false);
      }
      return;
    }

    // Rama real (intacta).
    setEnviando(true);
    try {
      const res = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          dni: form.dni,
          password: form.password,
          rol: form.rol
        })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(mensajeErrorAmable(data.error, 'No se pudo crear la cuenta. Revisá los datos.'), 'error');
        return;
      }
      showToast('¡Usuario creado correctamente!', 'success');
      setTimeout(() => {
        if (onRegistrado) onRegistrado();
        navigate('/login');
      }, 1500);
    } catch {
      showToast('Error de red', 'error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="registro-overlay">
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      <Navbar
        extraLinks={[
          { to: '/login', label: 'Iniciar sesión' },
          { to: '/', label: 'Atrás' }
        ]}
        hideLinks={['login']}
      />
      <main className="registro-main">
        <section className="registro-card" aria-labelledby="registro-titulo">
          <div className="registro-brand">
            <div className="registro-avatar" aria-hidden="true">
              <svg width="30" height="30" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
              </svg>
            </div>
            <p className="registro-title-row">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m16 6 4 14"></path>
                <path d="M12 6v14"></path>
                <path d="M8 8v12"></path>
                <path d="M4 4v16"></path>
              </svg>
              <span className="registro-title" id="registro-titulo">
                Crear cuenta
              </span>
            </p>
            <p className="registro-subtitle">BiblioTech · en segundos</p>
          </div>

          {sesionActiva && (
            <div className="registro-session" role="status">
              <p className="registro-session-text">
                Sesión activa como <strong>{usuario.nombre ?? usuario.email}</strong>
                {usuario.isDemo ? ' (demo)' : ''}.
              </p>
              <div className="registro-session-actions">
                <Link
                  className="registro-session-go"
                  to="/"
                >
                  Ir al inicio
                </Link>
                <button
                  type="button"
                  className="registro-session-out"
                  onClick={() => logout()}
                  disabled={ocupado}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}

          {DEMO_MODE && (
            <div className="registro-demo-block">
              <p className="registro-demo-badge" role="note">
                <span aria-hidden="true">⚡</span> MODO DEMO · SIN BACKEND · 1 CLICK
              </p>
              <button
                type="button"
                className="registro-btn registro-btn-demo"
                onClick={handleEntrarDemo}
                disabled={ocupado}
                aria-busy={entrandoDemo}
                autoFocus={!sesionActiva}
              >
                {entrandoDemo ? 'Entrando…' : 'Entrar como demo'}
              </button>
              <div className="registro-divider" aria-hidden="true">
                <span>o registrate</span>
              </div>
              <button
                type="button"
                className="registro-demo-autofill"
                onClick={handleRellenoDemo}
                disabled={ocupado}
              >
                Rellenar con datos demo
              </button>
            </div>
          )}

          <form className="registro-form" onSubmit={handleSubmit} noValidate={false}>
            <div className="registro-field">
              <label className="registro-label" htmlFor="registro-nombre">
                Nombre completo
              </label>
              <input
                id="registro-nombre"
                name="nombre"
                type="text"
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={handleChange}
                autoComplete="name"
                required
                disabled={ocupado}
                aria-invalid={Boolean(errores.nombre)}
                aria-describedby={errores.nombre ? 'registro-nombre-error' : undefined}
              />
              {errores.nombre && (
                <p className="registro-field-error" id="registro-nombre-error" role="alert">
                  {errores.nombre}
                </p>
              )}
            </div>

            <div className="registro-grid-2">
              <div className="registro-field">
                <label className="registro-label" htmlFor="registro-email">
                  Correo electrónico
                </label>
                <input
                  id="registro-email"
                  name="email"
                  type="email"
                  placeholder="Correo electrónico"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  inputMode="email"
                  required
                  disabled={ocupado}
                  aria-invalid={Boolean(errores.email)}
                  aria-describedby={errores.email ? 'registro-email-error' : undefined}
                />
                {errores.email && (
                  <p className="registro-field-error" id="registro-email-error" role="alert">
                    {errores.email}
                  </p>
                )}
              </div>

              <div className="registro-field">
                <label className="registro-label" htmlFor="registro-dni">
                  DNI
                </label>
                <input
                  id="registro-dni"
                  name="dni"
                  type="text"
                  placeholder="DNI"
                  value={form.dni}
                  onChange={handleChange}
                  autoComplete="off"
                  inputMode="numeric"
                  required
                  disabled={ocupado}
                  aria-invalid={Boolean(errores.dni)}
                  aria-describedby={errores.dni ? 'registro-dni-error' : undefined}
                />
                {errores.dni && (
                  <p className="registro-field-error" id="registro-dni-error" role="alert">
                    {errores.dni}
                  </p>
                )}
              </div>
            </div>

            <div className="registro-field registro-field-rol">
              <label className="registro-label" htmlFor="registro-rol">
                Rol
              </label>
              <select
                id="registro-rol"
                name="rol"
                value={form.rol}
                onChange={handleChange}
                required
                disabled={ocupado}
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="registro-grid-2">
              <div className="registro-field">
                <label className="registro-label" htmlFor="registro-password">
                  Contraseña (mín. 6)
                </label>
                <div className="registro-password-wrap">
                  <input
                    id="registro-password"
                    name="password"
                    type={mostrarPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    disabled={ocupado}
                    aria-invalid={Boolean(errores.password)}
                    aria-describedby={errores.password ? 'registro-password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="registro-password-toggle"
                    onClick={() => setMostrarPassword(v => !v)}
                    aria-pressed={mostrarPassword}
                    aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    disabled={ocupado}
                  >
                    {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {errores.password && (
                  <p className="registro-field-error" id="registro-password-error" role="alert">
                    {errores.password}
                  </p>
                )}
              </div>

              <div className="registro-field">
                <label className="registro-label" htmlFor="registro-confirmar">
                  Confirmar contraseña
                </label>
                <div className="registro-password-wrap">
                  <input
                    id="registro-confirmar"
                    name="confirmar"
                    type={mostrarConfirmar ? 'text' : 'password'}
                    placeholder="Confirmar contraseña"
                    value={form.confirmar}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={ocupado}
                    aria-invalid={Boolean(errores.confirmar)}
                    aria-describedby={errores.confirmar ? 'registro-confirmar-error' : undefined}
                  />
                  <button
                    type="button"
                    className="registro-password-toggle"
                    onClick={() => setMostrarConfirmar(v => !v)}
                    aria-pressed={mostrarConfirmar}
                    aria-label={mostrarConfirmar ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                    disabled={ocupado}
                  >
                    {mostrarConfirmar ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {errores.confirmar && (
                  <p className="registro-field-error" id="registro-confirmar-error" role="alert">
                    {errores.confirmar}
                  </p>
                )}
              </div>
            </div>

            <button type="submit" className="registro-btn registro-btn-submit" disabled={ocupado} aria-busy={enviando}>
              {enviando ? 'Creando cuenta…' : 'Registrarse'}
            </button>
          </form>

          <p className="registro-login">
            ¿Ya tienes una cuenta?{' '}
            {onAtras ? (
              <button type="button" className="registro-link-btn" onClick={onAtras} disabled={ocupado}>
                Inicia sesión
              </button>
            ) : (
              <Link className="registro-login-link" to="/login">Inicia sesión</Link>
            )}
          </p>
        </section>
      </main>
      <footer className="registro-footer">
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default RegistroUsuario;
