import { Link } from 'react-router-dom';
import { librosDemo } from '../../data/demoLibros.js';

function Icono({ d }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function proximoTurno(turnos) {
  const lista = (Array.isArray(turnos) ? turnos : [])
    .map((t) => ({ t, f: t?.fecha ?? t?.dia ?? '' }))
    .filter((x) => !Number.isNaN(Date.parse(x.f)));
  if (lista.length === 0) return null;
  lista.sort((a, b) => Date.parse(a.f) - Date.parse(b.f));
  return lista[0];
}

export function PanelKpis({ reservas, turnos }) {
  const libros = Array.isArray(librosDemo) ? librosDemo : [];
  const listaReservas = Array.isArray(reservas) ? reservas : [];
  const listaTurnos = Array.isArray(turnos) ? turnos : [];
  const disponibles = libros.filter((l) => l?.disponible).length;
  const materias = new Set(libros.map((l) => l?.materia).filter(Boolean)).size;
  const prox = proximoTurno(listaTurnos);

  const kpis = [
    { icono: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z', titulo: 'Reservas', valor: String(listaReservas.length), to: '/catalogo', link: 'Ver catálogo' },
    { icono: 'M8 2v4M16 2v4M3.5 9.5h17M5 4.5h14a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-13a1 1 0 0 1 1-1Z', titulo: 'Turnos', valor: String(listaTurnos.length), to: '/turnos', link: 'Ver turnos' },
    { icono: 'M4 5h16M4 12h16M4 19h10', titulo: 'Títulos', valor: String(libros.length), to: '/catalogo', link: 'Explorar' },
    { icono: 'M20 6 9 17l-5-5', titulo: 'Disponibles', valor: String(disponibles), to: '/catalogo', link: 'Ver disponibles' },
    { icono: 'M12 3v18M3 12h18', titulo: 'Materias', valor: String(materias), to: '/catalogo', link: 'Filtrar' },
  ];

  return (
    <section aria-label="Indicadores" className="pnl-kpis">
      {kpis.map((k) => (
        <div key={k.titulo} className="pnl-card pnl-kpi">
          <h3 className="pnl-card-titulo"><Icono d={k.icono} />{k.titulo}</h3>
          <p className="pnl-numero">{k.valor}</p>
          <Link className="pnl-card-link" to={k.to}>{k.link}</Link>
        </div>
      ))}
      <div className="pnl-card pnl-kpi">
        <h3 className="pnl-card-titulo"><Icono d="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-9-9" />Próximo turno</h3>
        <p className="pnl-numero pnl-numero--texto">{prox ? prox.f : '—'}</p>
        <Link className="pnl-card-link" to="/turnos">{prox ? 'Ver detalle' : 'Reservar'}</Link>
      </div>
    </section>
  );
}
