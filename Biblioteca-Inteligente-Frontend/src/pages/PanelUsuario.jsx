import '../styles/PanelUsuario.css';
import Header from '../components/Header';
import vozImg from '../assets/ondas-sonoras.png';

export default function PanelUsuario({ usuario, onAtras, onVozIA }) {
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
          <button className="panel-atras-btn" onClick={onAtras}>
            Atrás
          </button>
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
            <div className="panel-user-carrera">{usuario.carrera}</div>
          </div>
        </div>
        <div className="panel-links">
          <a className="panel-link panel-link-turnero" href="#">
            <span className="panel-link-icon">🕒</span>
            Turnero Virtual
          </a>
          <a className="panel-link panel-link-catalogo" href="#">
            <span className="panel-link-icon">📖</span>
            Catalogo Virtual
          </a>
          <a className="panel-link panel-link-contacto" href="#">
            <span className="panel-link-icon">📞</span>
            Contacto
          </a>
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

// Ejemplo de uso:
// <PanelUsuario usuario={{nombre: "Valentin Mecchia", carrera: "Ing.Sistemas de informacion"}} onAtras={() => ...} />