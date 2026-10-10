import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { useUser } from '../context/UserContext';
import { DEMO_MODE } from '../lib/demo.js';

/* Iconos SVG inline (decorativos). */
function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M17 2.5h-2.2C12.1 2.5 11 3.6 11 5.3V7H9v3h2v7h3v-7h2.1l.4-3H14V5.5c0-.3.2-.5.5-.5H17V2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconLinkedIn(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M6.94 8.94a1.12 1.12 0 1 1 0-2.24 1.12 1.12 0 0 1 0 2.24ZM7 10h2v7H7v-7Zm4 0h2v1h.03c.28-.53.97-1.09 2-1.09 2.14 0 2.54 1.41 2.54 3.24V17h-2v-3.13c0-.75-.01-1.71-1.04-1.71-1.04 0-1.2.81-1.2 1.65V17h-2v-7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M17.7 3H21l-7.3 8.3L22.2 21h-6.7l-5.2-6.2L4.3 21H1l7.8-8.9L1.8 3h6.9l4.7 5.7L17.7 3Zm-1.2 16h1.9L7.1 4.9H5L16.5 19Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconPin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 2.5a7.2 7.2 0 0 0-7.2 7.2c0 5.2 6.1 10.9 6.7 11.4a.7.7 0 0 0 1 0c.6-.5 6.7-6.2 6.7-11.4A7.2 7.2 0 0 0 12 2.5Zm0 9.7a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconMail(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M3.5 5.5h17a1 1 0 0 1 1 1V17a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 17V6.5a1 1 0 0 1 1-1Zm8.5 7.2 7-4.5a.6.6 0 0 0-.65-1L12 11.1l-6.35-3.9a.6.6 0 0 0-.65 1l7 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  // Solo lectura: el contexto lo maneja el agente 2.
  const { usuario } = useUser();
  const isAdmin = usuario?.rol === 'admin';
  const year = new Date().getFullYear();

  return (
    <footer className="custom-footer">
      <div className="bi-footer-grid">
        <div className="bi-footer-brand">
          <span className="bi-footer-logo">BiblioTech</span>
          <p className="bi-footer-tagline">
            Biblioteca inteligente: catálogo, turnos y asistente por voz.
          </p>
          <p className="bi-footer-contact">
            <span className="bi-footer-contact-icon" aria-hidden="true">
              <IconPin width="15" height="15" />
            </span>
            Zeballos 1341, Rosario, Santa Fe
          </p>
          <p className="bi-footer-contact">
            <span className="bi-footer-contact-icon" aria-hidden="true">
              <IconMail width="15" height="15" />
            </span>
            info@frro.edu.ar
          </p>
          {DEMO_MODE === true && (
            <p className="bi-footer-demo">
              Sitio en modo demostración: los datos mostrados son de ejemplo.
            </p>
          )}
        </div>

        <nav className="bi-footer-col" aria-label="Explorar">
          <h3 className="bi-footer-title">Explorar</h3>
          <Link className="bi-footer-link" to="/catalogo">Catálogo</Link>
          <Link className="bi-footer-link" to="/turnos">Turnos</Link>
          <Link className="bi-footer-link" to="/voz-ia">Asistente IA</Link>
          <Link className="bi-footer-link" to="/acerca">Acerca de</Link>
        </nav>

        <nav className="bi-footer-col" aria-label="Ayuda y cuenta">
          <h3 className="bi-footer-title">Ayuda y cuenta</h3>
          <Link className="bi-footer-link" to="/contacto">Contacto</Link>
          {usuario ? (
            <Link
              className="bi-footer-link"
              to={isAdmin ? '/admin' : '/panel'}
            >
              {isAdmin ? 'Panel admin' : 'Mi panel'}
            </Link>
          ) : (
            <>
              <Link className="bi-footer-link" to="/login">Iniciar sesión</Link>
              <Link className="bi-footer-link" to="/registro">Registrarse</Link>
            </>
          )}
        </nav>
      </div>

      <div className="footer-content">
        <span className="footer-copy">
          © {year} BiblioTech. Todos los derechos reservados.
        </span>
        <div className="footer-socials">
          <a
            href="https://facebook.com/"
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <IconFacebook width="22" height="22" />
          </a>
          <a
            href="https://linkedin.com/"
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <IconLinkedIn width="22" height="22" />
          </a>
          <a
            href="https://twitter.com/"
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
          >
            <IconX width="20" height="20" />
          </a>
        </div>
      </div>
    </footer>
  );
}
