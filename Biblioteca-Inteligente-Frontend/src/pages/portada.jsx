// portada.jsx (home) — Agente 4
// Home pública: funciona 100% sin backend usando librosDemo (agente 3).
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { librosDemo } from '../data/demoLibros.js';
import '../styles/portada.css';

function contarMaterias(libros) {
  return new Set((libros || []).map((l) => l?.materia).filter(Boolean)).size;
}

export default function Portada() {
  const navigate = useNavigate();

  const destacados = useMemo(() => {
    if (!Array.isArray(librosDemo)) return [];
    return librosDemo.filter((l) => l?.disponible).slice(0, 4);
  }, []);

  const totalLibros = Array.isArray(librosDemo) ? librosDemo.length : 0;
  const totalDisponibles = Array.isArray(librosDemo)
    ? librosDemo.filter((l) => l?.disponible).length
    : 0;
  const totalMaterias = useMemo(() => contarMaterias(librosDemo), []);

  const demoHref = destacados.length > 0 ? `/libros/${destacados[0].id}` : '/catalogo';

  return (
    <div className="portada-page portada-root">
      {/* HERO */}
      <div className="portada-hero">
        <div className="portada-hero-veil" aria-hidden="true" />
        <Navbar />
        <main className="portada-main">
          <div className="portada-header-wrap">
            <p className="portada-eyebrow">Catálogo · Turnos · Asistente IA</p>
            <div className="portada-logo-row">
              <span className="portada-logo-icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="72"
                  height="72"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m16 6 4 14" />
                  <path d="M12 6v14" />
                  <path d="M8 8v12" />
                  <path d="M4 4v16" />
                </svg>
              </span>
              <h1 className="portada-title">BiblioTech</h1>
            </div>

            <p className="portada-tagline">
              Tu biblioteca inteligente: explorá el catálogo, descubrí destacados
              y reservá en segundos.
            </p>

            <div className="portada-cta-row">
              <button
                type="button"
                className="portada-acceder-btn"
                onClick={() => navigate('/catalogo')}
              >
                Explorar catálogo
              </button>
              <button
                type="button"
                className="portada-ghost-btn"
                onClick={() => navigate(demoHref)}
              >
                Ver un libro
              </button>
            </div>

            <div className="portada-hero-stats" aria-label="Estadísticas">
              <div><strong>{totalLibros}</strong><span>títulos</span></div>
              <div><strong>{totalDisponibles}</strong><span>disponibles</span></div>
              <div><strong>{totalMaterias}</strong><span>materias</span></div>
            </div>

            <a className="portada-scroll-cue" href="#destacados" aria-label="Bajar a destacados">
              <span aria-hidden="true">⌄</span> Ver destacados
            </a>
          </div>
        </main>
      </div>

      {/* CUERPO — fondo continuo que empalma con el hero (sin franjas) */}
      <div className="portada-body">
      {/* DESTACADOS */}
      <section id="destacados" className="portada-section portada-destacados" aria-label="Libros destacados">
        <h2 className="portada-section-title">Destacados de la semana</h2>
        <p className="portada-section-sub">
          Una selección de {destacados.length > 0 ? destacados.length : 4} títulos
          disponibles de nuestra colección.
        </p>

        {destacados.length === 0 ? (
          <p className="portada-empty">
            Aún no hay destacados para mostrar.{' '}
            <Link to="/catalogo">Ir al catálogo</Link>
          </p>
        ) : (
          <div className="portada-grid">
            {destacados.map((libro) => (
              <Link
                key={String(libro.id)}
                to={`/libros/${libro.id}`}
                className="portada-card"
              >
                <div className="portada-card-img">
                  {libro.portada ? (
                    <img
                      src={libro.portada}
                      alt={`Portada de ${libro.titulo}`}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="portada-card-placeholder" aria-label="Sin portada">📖</div>
                  )}
                </div>
                <div className="portada-card-body">
                  {libro.materia && (
                    <span className="portada-card-materia">{libro.materia}</span>
                  )}
                  <strong className="portada-card-titulo">{libro.titulo}</strong>
                  <span className="portada-card-autor">{libro.autor}</span>
                  <span className="portada-card-meta">
                    {libro.anio ?? '-'} · Disponible
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="portada-center">
          <button
            type="button"
            className="portada-secondary-btn"
            onClick={() => navigate('/catalogo')}
          >
            Ver catálogo completo
          </button>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="portada-section portada-como" aria-label="Cómo funciona">
        <h2 className="portada-section-title">Cómo funciona</h2>
        <p className="portada-section-sub">Reservar un libro lleva menos de un minuto.</p>
        <div className="portada-pasos">
          <div className="portada-paso">
            <span className="portada-paso-num">1</span>
            <h3>Explorá</h3>
            <p>Buscá por título, autor o materia en el catálogo, con o sin conexión al servidor.</p>
          </div>
          <div className="portada-paso">
            <span className="portada-paso-num">2</span>
            <h3>Reservá</h3>
            <p>Elegí un título disponible y confirmá tu reserva en un clic desde el detalle.</p>
          </div>
          <div className="portada-paso">
            <span className="portada-paso-num">3</span>
            <h3>Retirá</h3>
            <p>Pasá por la biblioteca a retirar tu ejemplar o gestioná tu turno desde el panel.</p>
          </div>
        </div>
      </section>
      </div>{/* /portada-body */}

      {/* STATS DECORATIVAS */}
      <section className="portada-stats" aria-label="La biblioteca en números">
        <div className="portada-stat">
          <strong>{totalLibros}+</strong>
          <span>Títulos en catálogo</span>
        </div>
        <div className="portada-stat">
          <strong>{totalMaterias}</strong>
          <span>Materias distintas</span>
        </div>
        <div className="portada-stat">
          <strong>3</strong>
          <span>Pasos para reservar</span>
        </div>
        <div className="portada-stat">
          <strong>24/7</strong>
          <span>Catálogo disponible</span>
        </div>
      </section>

      <footer className="portada-footer">
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}
