import '../styles/Footer.css';
import { useUser } from '../context/UserContext';

export default function Footer() {
  const { usuario, setUsuario } = useUser();

  return (
    <footer className="custom-footer">
      <div className="footer-content">
        <span className="footer-copy">
          © 2025 BiblioTech. Todos los derechos reservados.
        </span>
        <div className="footer-socials">
          <a
            href="https://facebook.com/"
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="13" cy="13" r="12" fill="none"/>
              <path d="M17 2.5h-2.2C12.1 2.5 11 3.6 11 5.3V7H9v3h2v7h3v-7h2.1l.4-3H14V5.5c0-.3.2-.5.5-.5H17V2.5z"
                fill="#222" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/"
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="13" cy="13" r="12" fill="none"/>
              <path d="M6.94 8.94a1.12 1.12 0 1 1 0-2.24 1.12 1.12 0 0 1 0 2.24zM7 10h2v7H7v-7zm4 0h2v1h.03c.28-.53.97-1.09 2-1.09 2.14 0 2.54 1.41 2.54 3.24V17h-2v-3.13c0-.75-.01-1.71-1.04-1.71-1.04 0-1.2.81-1.2 1.65V17h-2v-7z"
                fill="#222" />
            </svg>
          </a>
          <a
            href="https://twitter.com/"
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="13" cy="13" r="12" fill="none"/>
              <path d="M22 5.92a8.38 8.38 0 0 1-2.36.65A4.13 4.13 0 0 0 21.4 4.1a8.27 8.27 0 0 1-2.61 1A4.13 4.13 0 0 0 12 8.13c0 .32.04.63.1.93A11.7 11.7 0 0 1 3 4.89a4.13 4.13 0 0 0 1.28 5.5A4.07 4.07 0 0 1 2.8 9.5v.05a4.13 4.13 0 0 0 3.31 4.05c-.2.05-.41.08-.62.08-.15 0-.3-.01-.45-.04a4.13 4.13 0 0 0 3.85 2.86A8.3 8.3 0 0 1 2 19.54a11.72 11.72 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.18 8.18 0 0 0 22 5.92z"
                fill="#222" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}