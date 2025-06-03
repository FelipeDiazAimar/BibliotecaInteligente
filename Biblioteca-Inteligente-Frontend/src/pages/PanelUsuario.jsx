import '../styles/PanelUsuario.css';

export default function PanelUsuario({ usuario, onAtras }) {
  return (
    <div className="panel-overlay">
      <header className="panel-header">
        <div>
          <div className="panel-logo">
            <span>BIBLIOTECA<br />INTELIGENTE</span>
            <span className="panel-utn">UTN <span role="img" aria-label="libro">📚</span></span>
          </div>
        </div>
        <button className="panel-atras-btn" onClick={onAtras}>
          Atrás <span className="panel-user-icon">👤</span>
        </button>
      </header>
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
        <button className="panel-voz-btn">
          <span className="panel-voz-icon">
            <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 3v10m0 0a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v2a4 4 0 0 0 4 4zm0 0v4m-4 0h8"/>
            </svg>
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