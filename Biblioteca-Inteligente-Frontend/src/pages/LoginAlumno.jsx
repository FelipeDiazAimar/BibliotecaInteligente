import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginAlumno.css';
import { useUser } from '../context/UserContext.jsx';
import { DEMO_MODE, DEMO_CREDENTIALS, mensajeErrorAmable } from '../lib/demo.js';

const LOGIN_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api/auth/login`;

function esCredencialDemo(identificador, password) {
  return (
    String(identificador ?? '').trim().toLowerCase() ===
      String(DEMO_CREDENTIALS.email).toLowerCase() &&
    String(password ?? '') === String(DEMO_CREDENTIALS.password)
  );
}

function rutaSegunRol(_rol) {
  // El login siempre lleva al inicio; cada sección queda en el nav.
  return '/';
}

export default function LoginAlumno({ onLogin }) {
  const navigate = useNavigate();
  const { usuario, loginDemo, loginConCredencialesDemo, logout } = useUser();
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const ocupado = cargando;
  // App.jsx auto-crea sesión demo al arrancar (solo lectura): si ya hay
  // sesión, el login no debe parecer "faltante" sino ofrecer seguir o salir.
  const sesionActiva = Boolean(usuario && (usuario.isDemo || usuario.email));

  const handleAutocompletarDemo = () => {
    setIdentificador(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
    setErrores({});
  };

  const handleLogoutDemo = () => {
    logout();
    setIdentificador('');
    setPassword('');
    setError('');
    setErrores({});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const id = identificador.trim();
    // Entrada directa a la demo: sin completar nada, el botón principal entra.
    if (DEMO_MODE && !id && !password) {
      setCargando(true);
      try {
        const sesion = await loginDemo();
        navigate(rutaSegunRol(sesion.rol));
      } catch {
        setError('No se pudo iniciar la sesión demo. Intentá nuevamente.');
      } finally {
        setCargando(false);
      }
      return;
    }
    const campoErrores = {};
    if (!id) campoErrores.identificador = 'Ingresá tu documento o email.';
    if (!password) campoErrores.password = 'Ingresá tu contraseña.';
    setErrores(campoErrores);
    if (Object.keys(campoErrores).length > 0) return;
    setCargando(true);
    try {
      // Atajo demo: credenciales demo en modo demo entran sin llamar al backend.
      if (DEMO_MODE && esCredencialDemo(id, password)) {
        const sesion = await loginConCredencialesDemo(id, password);
        navigate(rutaSegunRol(sesion.rol));
        return;
      }

      // Flujo real (intacto): intento contra el backend con fetch directo.
      let res;
      try {
        res = await fetch(LOGIN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dni: id, password })
        });
      } catch {
        // Sin backend: solo las credenciales demo pueden continuar (modo demo).
        if (DEMO_MODE && esCredencialDemo(id, password)) {
          const sesion = await loginConCredencialesDemo(id, password);
          navigate(rutaSegunRol(sesion.rol));
          return;
        }
        setError(
          DEMO_MODE
            ? 'Sin conexión al servidor. Podés entrar como demo con demo@biblioteca.local / demo1234 o con el botón "Entrar como demo".'
            : 'Error de red'
        );
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('rol', data.rol);

        if (onLogin) await onLogin(); // Actualiza el estado usuario en App

        // Redirige según el rol
        navigate(rutaSegunRol(data.rol));
      } else {
        // El backend rechazó las credenciales, pero en modo demo las
        // credenciales demo siempre abren una sesión local.
        if (DEMO_MODE && esCredencialDemo(id, password)) {
          const sesion = await loginConCredencialesDemo(id, password);
          navigate(rutaSegunRol(sesion.rol));
          return;
        }
        setError(mensajeErrorAmable(data.error, 'Credenciales incorrectas. Intentá de nuevo.'));
      }
    } catch {
      setError('Error de red');
    } finally {
      setCargando(false);
    }
  };

  const formulario = (
    <form onSubmit={handleSubmit} className="login-form" noValidate={false}>
      <div className="login-field">
        <label className="login-label" htmlFor="login-identificador">
          Documento o email
        </label>
        <input
          id="login-identificador"
          className="login-input"
          type="text"
          value={identificador}
          onChange={e => {
            setIdentificador(e.target.value);
            setErrores(prev => (prev.identificador ? { ...prev, identificador: undefined } : prev));
          }}
          placeholder="DNI o demo@biblioteca.local"
          required
          autoComplete="username"
          spellCheck={false}
          disabled={ocupado}
          aria-invalid={Boolean(errores.identificador)}
          aria-describedby={errores.identificador ? 'login-identificador-error' : undefined}
        />
        {errores.identificador && (
          <p className="login-field-error" id="login-identificador-error" role="alert">
            {errores.identificador}
          </p>
        )}
      </div>
      <div className="login-field">
        <label className="login-label" htmlFor="login-password">
          Contraseña
        </label>
        <div className="login-password-wrap">
          <input
            id="login-password"
            className="login-input"
            type={mostrarPassword ? 'text' : 'password'}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setErrores(prev => (prev.password ? { ...prev, password: undefined } : prev));
            }}
            placeholder="Tu contraseña"
            required
            autoComplete="current-password"
            disabled={ocupado}
            aria-invalid={Boolean(errores.password)}
            aria-describedby={errores.password ? 'login-password-error' : undefined}
          />
          <button
            type="button"
            className="login-password-toggle"
            onClick={() => setMostrarPassword(v => !v)}
            aria-pressed={mostrarPassword}
            aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            disabled={ocupado}
          >
            {mostrarPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {errores.password && (
          <p className="login-field-error" id="login-password-error" role="alert">
            {errores.password}
          </p>
        )}
      </div>
      {error && (
        <div className="login-error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {DEMO_MODE ? (
        <button
          type="submit"
          className="login-btn login-btn-demo"
          disabled={ocupado}
          aria-busy={cargando}
          autoFocus={!sesionActiva}
        >
          {cargando ? 'Entrando…' : 'Entrar como demo'}
        </button>
      ) : (
        <button
          type="submit"
          className="login-btn login-btn-submit"
          disabled={ocupado}
          aria-busy={cargando}
        >
          {cargando ? 'Ingresando…' : 'Iniciar Sesión'}
        </button>
      )}
    </form>
  );

  return (
    <div className="login-overlay">
      <main className="login-main">
        <section className="login-form-container" aria-labelledby="login-titulo">
          <div className="login-brand">
            <div className="login-avatar" aria-hidden="true">
              <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
              </svg>
            </div>
            <div className="login-brand-text">
              <p className="login-title-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m16 6 4 14"></path>
                  <path d="M12 6v14"></path>
                  <path d="M8 8v12"></path>
                  <path d="M4 4v16"></path>
                </svg>
                <span className="login-title" id="login-titulo">
                  BiblioTech
                </span>
              </p>
              <p className="login-subtitle">Acceso de alumnos</p>
            </div>
          </div>

          {sesionActiva && (
            <div className="login-session" role="status">
              <p className="login-session-text">
                Sesión activa como <strong>{usuario.nombre ?? usuario.email}</strong>
                {usuario.isDemo ? ' (demo)' : ''}.
              </p>
              <div className="login-session-actions">
                <Link
                  className="login-session-go"
                  to="/"
                >
                  Ir al inicio
                </Link>
                <button
                  type="button"
                  className="login-session-out"
                  onClick={handleLogoutDemo}
                  disabled={ocupado}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}

          {DEMO_MODE && (
            <div className="login-divider" aria-hidden="true">
              <span>o con tu cuenta</span>
            </div>
          )}

          {formulario}

          {DEMO_MODE && (
            <button
              type="button"
              className="login-demo-autofill"
              onClick={handleAutocompletarDemo}
              disabled={ocupado}
              title="Rellena el formulario con las credenciales demo"
            >
              Autocompletar <code>demo@biblioteca.local / demo1234</code>
            </button>
          )}

          {!DEMO_MODE && (
            <p className="login-demo-hint">
              Ingresá con tu documento y contraseña registrados.
            </p>
          )}

          <p className="login-register">
            ¿Aún no tienes una cuenta?{' '}
            <Link className="login-register-link" to="/registro">
              Regístrate
            </Link>
          </p>
        </section>
      </main>
      <footer className="login-footer">
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}
