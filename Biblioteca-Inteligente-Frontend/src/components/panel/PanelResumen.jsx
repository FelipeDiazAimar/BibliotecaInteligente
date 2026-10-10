import { Link } from 'react-router-dom';

function IconoSpark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    </svg>
  );
}

export function PanelResumen() {
  return (
    <section aria-label="Asistente" className="pnl-resumen">
      <div className="pnl-card">
        <h3 className="pnl-card-titulo"><IconoSpark />Asistente IA</h3>
        <p className="pnl-card-desc">Recomendaciones de lectura</p>
        <Link className="pnl-card-link" to="/voz-ia">Preguntar a la IA</Link>
      </div>
    </section>
  );
}
