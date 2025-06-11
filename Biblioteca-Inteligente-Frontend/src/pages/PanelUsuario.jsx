import '../styles/PanelUsuario.css';
import Header from '../components/Header';
import vozImg from '../assets/ondas-sonoras.png';
import { Link } from 'react-router-dom';

export default function PanelUsuario({ usuario, onAtras, onVozIA, onLogout }) {
  return (
    <div className="panel-overlay">
      <Header
        left={
          <div className="panel-logo">
            <span>BIBLIOTECA<br />INTELIGENTE</span>
            <span className="panel-utn">UTN <span role="img" aria-label="libro">📚</span></span>
          </div>
        }
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' , marginRight: '80px'}}>
            <Link to="#" className="panel-link" onClick={onAtras}>Atrás</Link>
            <Link to="#" className="panel-link" onClick={onLogout}>Cerrar sesión</Link>
          </div>
        }
      />
      <main className="panel-main">
        <div className="panel-user-card">
          <div className="panel-user-avatar">
            <svg width="38" height="38" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
          </div>
          <div>
            <div className="panel-user-name">{usuario.nombre}</div>
          </div>
        </div>
        <div className="panel-links">
          <a className="panel-link panel-link-turnero" href="#">
            <span className="panel-link-icon">🕒</span>
            Turnero Virtual
          </a>
          <a className="panel-link panel-link-catalogo" href="/catalogo">
            <span className="panel-link-icon">📖</span>
            Catalogo Virtual
          </a>
          <Link className="panel-link panel-link-contacto" to="/contacto">
            <span className="panel-link-icon">📞</span>
            Contacto
          </Link>
        </div>
        <button
          className="panel-voz-btn"
          onClick={onVozIA}
        >
          <span className="panel-voz-icon">
            <img src={vozImg} alt="Voz" width={32} height={32} />
          </span>
        </button>
      </main>
      <footer className="panel-footer">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}
