// BookDetail.jsx — Agente 4
// Ruta verificada en App.jsx: <Route path="/libros/:id" element={<BookDetail />} />
// Param: `id` (useParams().id)
import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { DEMO_MODE, demoDelay, fetchConFallback } from '../lib/demo.js';
import { librosDemo } from '../data/demoLibros.js';
import '../styles/BookDetail.css';

const RESERVAS_KEY = 'biblio_demo_reservas';

function leerReservasDemo() {
  try {
    const raw = localStorage.getItem(RESERVAS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buscarEnDemo(idActual) {
  if (!Array.isArray(librosDemo)) return null;
  return librosDemo.find((l) => String(l?.id) === String(idActual)) ?? null;
}

function getAnio(libro) {
  if (!libro) return '-';
  return libro.anio ?? libro.anioPublicacion ?? '-';
}

function getPortadaUrl(libro) {
  if (!libro) return null;
  // Contrato demo: librosDemo usa `portada` (URL string). En modo demo no hay
  // backend, así que si viene vacía se muestra el placeholder directamente.
  if (libro.portada) return libro.portada;
  if (DEMO_MODE) return null;
  if (libro.id) return `http://localhost:3000/api/libros/${libro.id}/portada`;
  return null;
}

async function cargarLibro(idActual) {
  const fallbackDemo = buscarEnDemo(idActual);

  // Modo demo (agente 1): datos locales con delay simulado, sin backend.
  if (DEMO_MODE) {
    await demoDelay();
    return fallbackDemo;
  }

  // Modo real con fallback a demo (agente 1 + agente 3).
  // Firma real de src/lib/demo.js: fetchConFallback(url, options, fallback).
  try {
    const resultado = await fetchConFallback(
      `http://localhost:3000/api/libros/${idActual}`,
      undefined,
      fallbackDemo,
    );
    return resultado ?? fallbackDemo;
  } catch {
    return fallbackDemo;
  }
}

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [yaReservado, setYaReservado] = useState(false);

  useEffect(() => {
    let vivo = true;
    setLoading(true);
    setMensaje('');
    setImgError(false);
    setImgLoaded(false);
    setYaReservado(false);

    cargarLibro(id)
      .then((data) => {
        if (!vivo) return;
        // La API puede devolver null / {} cuando no existe.
        const valido = data && (data.id !== undefined || data.titulo) ? data : null;
        setLibro(valido);
        if (valido) {
          setYaReservado(
            leerReservasDemo().some((r) => String(r?.id) === String(valido.id)),
          );
        }
      })
      .catch(() => {
        if (vivo) setLibro(buscarEnDemo(id));
      })
      .finally(() => {
        if (vivo) setLoading(false);
      });

    return () => {
      vivo = false;
    };
  }, [id]);

  const relacionados = useMemo(() => {
    if (!libro || !Array.isArray(librosDemo)) return [];
    const porMateria = libro.materia
      ? librosDemo.filter(
          (l) => l?.materia === libro.materia && String(l?.id) !== String(libro.id),
        )
      : [];
    if (porMateria.length > 0) return porMateria.slice(0, 4);
    // Sin materia coincidente: otros del mismo autor, o los primeros disponibles.
    const porAutor = librosDemo.filter(
      (l) => String(l?.id) !== String(libro.id) && l?.autor === libro.autor,
    );
    if (porAutor.length > 0) return porAutor.slice(0, 4);
    return librosDemo.filter((l) => String(l?.id) !== String(libro.id)).slice(0, 4);
  }, [libro]);

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('usuario');
    localStorage.removeItem('biblio_demo_session');
    try { localStorage.setItem('biblio_demo_closed', '1'); } catch {}
    navigate('/login');
  };

  const handleReservar = () => {
    if (!libro) return;
    if (!libro.disponible) {
      setMensaje('Este ejemplar no está disponible para reserva por el momento.');
      return;
    }
    if (DEMO_MODE) {
      const reservas = leerReservasDemo();
      if (!reservas.some((r) => String(r?.id) === String(libro.id))) {
        reservas.push({
          id: libro.id,
          titulo: libro.titulo,
          autor: libro.autor,
          fecha: new Date().toISOString(),
        });
        localStorage.setItem(RESERVAS_KEY, JSON.stringify(reservas));
      }
      setYaReservado(true);
      setMensaje(`Reserva guardada: "${libro.titulo}". Te esperamos en biblioteca para retirarlo.`);
      return;
    }
    navigate('/contacto');
  };

  if (loading) return <Loader />;

  const headerRight = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginRight: '80px' }}>
      <Link to="/catalogo" className="panel-link">Catálogo</Link>
      <Link to="/turnos" className="panel-link">Turnero</Link>
    </div>
  );

  // ID inexistente: mensaje + link al catálogo.
  if (!libro) {
    return (
      <div className="bookdetail-bg">
        <Header onLogout={onLogout} right={headerRight} />
        <main className="bookdetail-main bookdetail-notfound">
          <h1 className="bookdetail-title">Libro no encontrado</h1>
          <p className="bookdetail-muted">
            No existe un libro con id <strong>&ldquo;{String(id)}&rdquo;</strong>.
            Puede que haya sido eliminado o que el enlace sea incorrecto.
          </p>
          <div className="bookdetail-actions">
            <Link to="/catalogo" className="bookdetail-btn bookdetail-link-btn">
              Volver al catálogo
            </Link>
            <button
              type="button"
              className="bookdetail-btn bookdetail-btn-back"
              onClick={() => navigate(-1)}
            >
              Atrás
            </button>
          </div>
        </main>
      </div>
    );
  }

  const portadaUrl = imgError ? null : getPortadaUrl(libro);

  return (
    <div className="bookdetail-bg">
      <Header onLogout={onLogout} right={headerRight} />
      <main className="bookdetail-main">
        <nav className="bookdetail-migas" aria-label="Miga de pan">
          <Link to="/catalogo" className="bookdetail-breadcrumb">
            <span aria-hidden="true">←</span> Volver al catálogo
          </Link>
        </nav>
        <div className="bookdetail-head">
          <div className="bookdetail-head-text">
            <h1 className="bookdetail-title">{libro.titulo}</h1>
            <p className="bookdetail-meta">
              {libro.autor && <span className="bookdetail-meta-autor">{libro.autor}</span>}
              {libro.autor && (getAnio(libro) !== '-' || libro.materia) && (
                <span className="bookdetail-meta-sep" aria-hidden="true"> · </span>
              )}
              {getAnio(libro) !== '-' && <span>{getAnio(libro)}</span>}
              {getAnio(libro) !== '-' && libro.materia && (
                <span className="bookdetail-meta-sep" aria-hidden="true"> · </span>
              )}
              {libro.materia && <span className="bookdetail-meta-materia">{libro.materia}</span>}
            </p>
          </div>
          <span
            className={libro.disponible ? 'bookdetail-badge is-ok' : 'bookdetail-badge is-off'}
            title={libro.disponible ? 'Ejemplar disponible' : 'Ejemplar no disponible'}
          >
            <span className="bookdetail-badge-dot" aria-hidden="true" />
            {libro.disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>

        <div className="bookdetail-content">
          <figure className="bookdetail-img-wrap">
            {portadaUrl ? (
              <>
                {!imgLoaded && <div className="bookdetail-img-skeleton" aria-hidden="true" />}
                <img
                  src={portadaUrl}
                  alt={`Portada de ${libro.titulo}`}
                  className={`bookdetail-img${imgLoaded ? ' is-loaded' : ' is-loading'}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                />
              </>
            ) : (
              <div className="bookdetail-img-placeholder" aria-label="Sin portada">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>
                <strong className="bookdetail-placeholder-inicial" aria-hidden="true">
                  {(libro.titulo || 'L').trim().charAt(0).toUpperCase()}
                </strong>
                <span>Sin portada</span>
              </div>
            )}
            {libro.materia && (
              <figcaption className="bookdetail-img-caption">{libro.materia}</figcaption>
            )}
          </figure>

          <div className="bookdetail-info">
            <dl className="bookdetail-specs">
              <div><dt>Título</dt><dd>{libro.titulo}</dd></div>
              <div><dt>Autor</dt><dd>{libro.autor || '-'}</dd></div>
              <div><dt>Año</dt><dd>{getAnio(libro)}</dd></div>
              <div><dt>Materia</dt><dd>{libro.materia || '-'}</dd></div>
              {libro.editorial && <div><dt>Editorial</dt><dd>{libro.editorial}</dd></div>}
              {libro.isbn && <div><dt>ISBN</dt><dd>{libro.isbn}</dd></div>}
              {libro.subtitulo && <div><dt>Subtítulo</dt><dd>{libro.subtitulo}</dd></div>}
              {libro.paginas && <div><dt>Páginas</dt><dd>{libro.paginas}</dd></div>}
              {libro.idioma && <div><dt>Idioma</dt><dd>{libro.idioma}</dd></div>}
              {libro.biblioteca && <div><dt>Biblioteca</dt><dd>{libro.biblioteca}</dd></div>}
            </dl>

            <p className="bookdetail-desc">
              {libro.descripcion || libro.observaciones || libro.sinopsis || 'Sin descripción disponible.'}
            </p>

            <div className="bookdetail-actions">
              <button
                type="button"
                className="bookdetail-btn bookdetail-btn-reservar"
                onClick={handleReservar}
                disabled={!libro.disponible}
                title={!libro.disponible ? 'No disponible' : yaReservado ? 'Ya reservado' : 'Reservar este libro'}
              >
                <span aria-hidden="true">{yaReservado && DEMO_MODE ? '✓ ' : ''}</span>
                {yaReservado && DEMO_MODE ? 'Reservado' : 'Reservar este libro'}
              </button>
              <button
                type="button"
                className="bookdetail-btn bookdetail-btn-back"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
            </div>

            {mensaje && (
              <p className="bookdetail-msg" role="status" aria-live="polite">
                {mensaje}
              </p>
            )}
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="bookdetail-rel" aria-label="Libros relacionados">
            <h2 className="bookdetail-rel-title">
              {libro.materia ? `Más de ${libro.materia}` : 'Libros relacionados'}
            </h2>
            <p className="bookdetail-rel-sub">
              Seguí explorando el catálogo a partir de este ejemplar.
            </p>
            <div className="bookdetail-rel-grid">
              {relacionados.map((rel) => {
                const relPortada = rel?.portada || null;
                return (
                  <Link
                    key={String(rel.id)}
                    to={`/libros/${rel.id}`}
                    className="bookdetail-rel-card"
                  >
                    {relPortada ? (
                      <img
                        src={relPortada}
                        alt={`Portada de ${rel.titulo}`}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="bookdetail-rel-placeholder" aria-hidden="true">
                        {(rel.titulo || 'L').trim().charAt(0).toUpperCase()}
                      </div>
                    )}
                    <strong>{rel.titulo}</strong>
                    <span>{rel.autor}</span>
                    <span className={`bookdetail-rel-estado ${rel.disponible ? 'is-ok' : 'is-off'}`}>
                      {rel.disponible ? 'Disponible' : 'Prestado'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
