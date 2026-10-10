import { Link } from 'react-router-dom';

function Flecha() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PanelAccesos() {
  return (
    <nav aria-label="Accesos directos" className="pnl-accesos-nav">
      <Link className="pnl-acceso" to="/">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M2.5 7 8 2.5 13.5 7M4 6.5V13.5h8V6.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Inicio</span>
        <Flecha />
      </Link>
      <Link className="pnl-acceso" to="/catalogo">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2H5v12H3.5A1.5 1.5 0 0 1 2 12.5v-9ZM6.5 2H12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 12 14H6.5V2Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
        <span>Explorar catálogo</span>
        <Flecha />
      </Link>
      <Link className="pnl-acceso" to="/turnos">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M2.5 3.5h11v9h-11v-9ZM2.5 6h11M5.5 1.5v3M10.5 1.5v3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Reservar turno</span>
        <Flecha />
      </Link>
      <Link className="pnl-acceso" to="/voz-ia">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M8 1.5 9.7 5.6 14 6.3 10.9 9.1 11.8 13.4 8 11.2 4.2 13.4 5.1 9.1 2 6.3 6.3 5.6 8 1.5Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
        <span>Preguntar a la IA</span>
        <Flecha />
      </Link>
    </nav>
  );
}
