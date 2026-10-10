import vozImg from '../assets/ondas-sonoras.png';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import '../styles/Header.css';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { DEMO_MODE, DEMO_USER } from '../lib/demo.js';
import AdminTabs from './AdminTabs';
import ThemeToggle from './ThemeToggle';

// Tabla única de rutas reales (según las <Route> de App.jsx).
const PUBLIC_LINKS = [
  { key: 'inicio', to: '/', label: 'Inicio', end: true },
  { key: 'catalogo', to: '/catalogo', label: 'Catálogo' },
  { key: 'voz', to: '/voz-ia', label: 'Asistente IA' },
  { key: 'acerca', to: '/acerca', label: 'Acerca de' },
  { key: 'contacto', to: '/contacto', label: 'Contacto' },
];
const USER_LINKS = [
  { key: 'turnos', to: '/turnos', label: 'Turnos' },
  { key: 'panel', to: '/panel', label: 'Mi panel' },
];
const ADMIN_LINKS = [
  { key: 'admin', to: '/admin', label: 'Admin' },
  { key: 'admin-turnos', to: '/admin-turnos', label: 'Turnos admin' },
];

export default function Header({
  hideVozIA,
  hideLinks = [],
  hideLoginLink = false,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, setUsuario } = useUser();

  // Cierra el menú mobile al cambiar de ruta.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Sesión efectiva: usuario real del contexto o, en modo demo, DEMO_USER
  // (contrato de sesión R3: si el demo fue cerrado explícitamente vía
  // logout, 'biblio_demo_closed'='1' suprime el DEMO_USER).
  const demoMode = DEMO_MODE === true;
  const demoCerrado = typeof localStorage !== 'undefined' && localStorage.getItem('biblio_demo_closed') === '1';
  const sessionUser = usuario ?? (demoMode && !demoCerrado ? DEMO_USER : null);
  const isAdmin = sessionUser?.rol === 'admin';
  const displayName = sessionUser?.nombre || sessionUser?.email || '';

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('usuario');
    localStorage.removeItem('biblio_demo_session');
    localStorage.setItem('biblio_demo_closed', '1');
    if (onLogout) onLogout();
    navigate('/login');
  };

  // Mantiene los estilos del Link, pero controla el acceso
  const handleAskAIClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token || demoMode) {
      navigate('/voz-ia');
    } else {
      navigate('/login');
    }
  };

  // Detecta si está en panel admin
  const isAdminPanel = location.pathname.startsWith('/admin');

  const isHidden = (key) => hideLinks.includes(key);

  const navLinks = [
    ...PUBLIC_LINKS.filter((l) => !isHidden(l.key)),
    ...(sessionUser && !isAdmin
      ? USER_LINKS.filter((l) => !isHidden(l.key))
      : []),
    ...(isAdmin ? ADMIN_LINKS.filter((l) => !isHidden(l.key)) : []),
  ];

  const showLoginLink =
    !sessionUser && !hideLoginLink && !isHidden('login');

  const enlacesNav = navLinks.map((link) => (
    <NavLink
      key={link.key}
      to={link.to}
      end={link.end}
      className={({ isActive }) =>
        `bi-nav-link${isActive ? ' bi-nav-link--active' : ''}`
      }
    >
      {link.label}
    </NavLink>
  ));

  const bloqueAcciones = (
    <>
      {/* SOLO muestra Ask AI si NO está en panel admin */}
      {!hideVozIA && !isAdminPanel && (
        <Link
          to="/voz-ia"
          className="header-voz-btn"
          title="Ir al asistente IA"
          aria-label="Ir al asistente IA"
          onClick={handleAskAIClick}
        >
          <img src={vozImg} alt="" aria-hidden="true" className="header-voz-icon" />
          <span className="header-voz-text">Ask AI</span>
        </Link>
      )}
      {/* Tabs de administración solo para admin */}
      {isAdmin && <AdminTabs />}
      {/* Sesión: chip único con avatar + logout, o link a login */}
      {sessionUser ? (
        <span className="bi-session">
          <Link to="/panel" className="bi-user-chip" title={displayName}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <span className="bi-user-name">{displayName}</span>
          </Link>
          <button
            type="button"
            className="panel-link-cs"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            Salir
          </button>
        </span>
      ) : (
        showLoginLink && (
          <Link to="/login" className="bi-login-link">
            Iniciar sesión
          </Link>
        )
      )}
      {/* Toggle claro/oscuro autocontenido (dueño: R2-2 / ThemeToggle.jsx).
          Lee/escribe localStorage 'header-theme' y setea
          document.documentElement.dataset.theme + body[data-header-theme]. */}
      <ThemeToggle />
    </>
  );

  // Cierra con Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const alTeclado = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', alTeclado);
    return () => window.removeEventListener('keydown', alTeclado);
  }, [menuOpen]);

  return (
    <header className="panel-navbar">
      <div className="panel-navbar-left">
        <div
          className="panel-logo"
          onClick={() => navigate('/')}
          title="Ir al inicio"
        >
          <span>BiblioTech</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m16 6 4 14"></path>
            <path d="M12 6v14"></path>
            <path d="M8 8v12"></path>
            <path d="M4 4v16"></path>
          </svg>
        </div>
        {demoMode && (
          <span className="bi-demo-chip" title="Sitio en modo demostración">
            Demo
          </span>
        )}
      </div>

      <button
        type="button"
        className="bi-hamburger"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          {menuOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <nav
        className="bi-nav"
        aria-label="Navegación principal"
      >
        {enlacesNav}
      </nav>

      <div className="panel-navbar-right">
        {bloqueAcciones}
      </div>

      {/* Sidebar mobile: portal al body porque el blur del header rompe
          el posicionamiento fixed de sus descendientes. Solo vive bajo 1120px. */}
      {createPortal(
        <>
          <div
            className={`bi-drawer-backdrop${menuOpen ? ' is-open' : ''}`}
            aria-hidden={!menuOpen}
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className={`bi-drawer${menuOpen ? ' is-open' : ''}`}
            aria-label="Menú"
            aria-hidden={!menuOpen}
          >
            <div className="bi-drawer-head">
              <span className="bi-drawer-logo">BiblioTech</span>
              <button
                type="button"
                className="bi-drawer-close"
                aria-label="Cerrar menú"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <nav className="bi-drawer-nav" aria-label="Navegación principal">
              {enlacesNav}
            </nav>
            <div className="bi-drawer-foot">
              {bloqueAcciones}
            </div>
          </aside>
        </>,
        document.body
      )}
    </header>
  );
}
