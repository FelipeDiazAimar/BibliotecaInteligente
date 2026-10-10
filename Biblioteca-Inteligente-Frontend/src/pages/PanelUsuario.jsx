import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/PanelUsuario.css';
import { useUser } from '../context/UserContext';
import { DEMO_MODE, DEMO_USER } from '../lib/demo.js';
import { PanelResumen } from '../components/panel/PanelResumen';
import { PanelTurnos } from '../components/panel/PanelTurnos';
import { PanelAccesos } from '../components/panel/PanelAccesos';
import { PanelKpis } from '../components/panel/PanelKpis';

/* Solo lectura de las keys demo (formato propiedad de otros agentes). */
const KEY_SESSION = 'biblio_demo_session';
const KEY_RESERVAS = 'biblio_demo_reservas';
const KEY_TURNOS = 'biblio_demo_turnos';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === undefined ? fallback : parsed;
  } catch {
    return fallback;
  }
}

/* La sesión demo puede venir como objeto usuario directo o envuelta. */
function normalizeSession(session) {
  if (!session || typeof session !== 'object') return null;
  if (session.usuario && typeof session.usuario === 'object') return session.usuario;
  if (session.nombre || session.email) return session;
  return null;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function PanelUsuario({ usuario }) {
  const navigate = useNavigate();
  const { usuario: ctxUsuario, setUsuario } = useUser();

  /* Lectura igual que hoy: solo localStorage + prop/contexto, tolerante. */
  const demoSession = useMemo(() => normalizeSession(readJSON(KEY_SESSION, null)), []);
  const reservas = useMemo(() => asArray(readJSON(KEY_RESERVAS, [])), []);
  const turnosRaw = useMemo(() => readJSON(KEY_TURNOS, []), []);
  const turnos = asArray(turnosRaw);

  const demoCerrado = (() => {
    try {
      return localStorage.getItem('biblio_demo_closed') === '1';
    } catch {
      return false;
    }
  })();
  const effectiveUser =
    usuario || ctxUsuario || demoSession || (DEMO_MODE && !demoCerrado ? DEMO_USER : null);

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(KEY_SESSION);
    try { localStorage.setItem('biblio_demo_closed', '1'); } catch {}
    setUsuario(null);
    navigate('/login');
  };

  /* Sin sesión: solo CTA, sin widgets vacíos. */
  if (!effectiveUser) {
    return (
      <section className="pnl-root">
        <div className="pnl-cta">
          <p>Tu panel te está esperando</p>
          <p>Iniciá sesión para ver tus reservas, turnos y accesos.</p>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/registro">Crear cuenta</Link>
        </div>
      </section>
    );
  }

  const nombre = effectiveUser.nombre || effectiveUser.email || 'Lector/a';
  const inicial = (nombre.trim().charAt(0) || 'L').toUpperCase();
  const esDemo =
    Boolean(demoSession) ||
    (DEMO_MODE && effectiveUser.email === DEMO_USER.email);

  return (
    <section className="pnl-root">
      <div className="pnl-hero">
        <span className="pnl-avatar">{inicial}</span>
        <h1 className="pnl-saludo">Hola, {nombre}</h1>
        <span className="pnl-sesion">{esDemo ? 'Modo demo' : 'Sesión real'}</span>
        <button type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
      <PanelKpis reservas={reservas} turnos={turnos} />
      <div className="pnl-grid pnl-grid--panel">
        <PanelTurnos turnos={turnos} />
        <div className="pnl-col-asistente">
          <PanelResumen />
        </div>
        <div className="pnl-accesos">
          <h2 className="pnl-accesos-titulo">Accesos directos</h2>
          <PanelAccesos />
        </div>
      </div>
    </section>
  );
}
