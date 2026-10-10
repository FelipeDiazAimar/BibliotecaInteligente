import { Link } from 'react-router-dom';

function IconoReloj() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function fechaDe(turno) {
  if (!turno || typeof turno !== 'object') return '';
  return turno.fecha ?? turno.dia ?? '';
}

function horaDe(turno) {
  if (!turno || typeof turno !== 'object') return '';
  return turno.hora ?? turno.hora_inicio ?? '';
}

function salaDe(turno) {
  if (!turno || typeof turno !== 'object') return '';
  if (typeof turno.sala === 'string' && turno.sala.trim() !== '') return turno.sala;
  return turno.Sala?.nombre ?? '';
}

function motivoDe(turno) {
  if (!turno || typeof turno !== 'object') return '';
  return turno.motivo ?? turno.tematica ?? '';
}

function claveTurno(turno, idx) {
  if (turno && typeof turno === 'object') {
    return turno.id ?? `${fechaDe(turno)}-${horaDe(turno)}-${idx}`;
  }
  return `turno-${idx}`;
}

export function PanelTurnos({ turnos }) {
  const lista = Array.isArray(turnos) ? turnos : [];

  if (lista.length === 0) {
    return (
      <section aria-label="Próximos turnos">
        <div className="pnl-card is-vacio">
          <h3 className="pnl-card-titulo">Próximos turnos</h3>
          <p>No tenés turnos próximos.</p>
          <Link to="/turnos">Reservar un turno</Link>
        </div>
      </section>
    );
  }

  // Ordena por fecha cuando es parseable; si no lo es, conserva el orden original.
  const ordenados = [...lista].sort((a, b) => {
    const ta = Date.parse(fechaDe(a));
    const tb = Date.parse(fechaDe(b));
    const aOk = !Number.isNaN(ta);
    const bOk = !Number.isNaN(tb);
    if (aOk && bOk) return ta - tb;
    return 0;
  });

  const proximos = ordenados.slice(0, 3);

  return (
    <section aria-label="Próximos turnos" className="pnl-proximos">
      <div className="pnl-card">
        <h3 className="pnl-card-titulo"><IconoReloj />Próximos turnos</h3>
        <ul className="pnl-turnos-lista">
          {proximos.map((turno, idx) => (
            <li key={claveTurno(turno, idx)} className="pnl-turno">
              <span>{fechaDe(turno) || 'Fecha a convenir'}</span>
              {horaDe(turno) ? <span> {horaDe(turno)}</span> : null}
              {salaDe(turno) ? <span> · {salaDe(turno)}</span> : null}
              {motivoDe(turno) ? <span> · {motivoDe(turno)}</span> : null}
            </li>
          ))}
        </ul>
        <Link className="pnl-card-link" to="/turnos">Ver turnos</Link>
      </div>
    </section>
  );
}
