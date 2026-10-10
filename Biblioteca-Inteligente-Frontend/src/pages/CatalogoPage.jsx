import { useEffect, useMemo, useState } from 'react';
import LibroCard, { getAnio } from '../components/LibroCard';
import Header from '../components/Header';
import Loader from '../components/Loader'; // <-- Spinner de carga
import { Link, useNavigate } from 'react-router-dom';
import { DEMO_MODE, demoDelay, fetchConFallback } from '../lib/demo.js';
import { librosDemo } from '../data/demoLibros.js';
import '../styles/Catalogo.css';

const API_URL = 'http://localhost:3000/api/libros';
const PAGE_SIZE = 16;
const DEBOUNCE_MS = 300;

function normalizar(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function soloLetras(str) {
  return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
}

// Normaliza lo que devuelva fetchConFallback: puede ser un array,
// un objeto { data | libros }, o un Response con .json().
async function normalizarResultado(resultado) {
  if (!resultado) return null;
  if (typeof resultado.json === 'function') {
    const data = await resultado.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.libros)) return data.libros;
    return null;
  }
  if (Array.isArray(resultado)) return resultado;
  if (Array.isArray(resultado?.data)) return resultado.data;
  if (Array.isArray(resultado?.libros)) return resultado.libros;
  return null;
}

export default function Catalogo() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Estado de carga
  const [error, setError] = useState(''); // <-- Error fatal (sin datos para mostrar)
  const [aviso, setAviso] = useState(''); // <-- Aviso no bloqueante (fallback a demo)
  const [busqueda, setBusqueda] = useState('');
  const [busquedaDebounced, setBusquedaDebounced] = useState('');
  const [materia, setMateria] = useState('todas');
  const [disponibilidad, setDisponibilidad] = useState('todas');
  const [orden, setOrden] = useState('');
  const [pagina, setPagina] = useState(1);
  const [busquedasRecientes, setBusquedasRecientes] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const navigate = useNavigate();

  // --- Carga inicial: DEMO_MODE usa mocks; modo real intenta la API y cae a mocks ---
  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      setLoading(true);
      setError('');
      setAviso('');
      try {
        if (DEMO_MODE) {
          await demoDelay(500); // Simula latencia de red en demo
          if (!cancelado) setLibros(librosDemo);
          return;
        }
        let datos = null;
        try {
          // Contrato agente 1: fetchConFallback(url, options, fallback).
          // Devuelve la MISMA referencia del fallback si el backend falla.
          const resultado = await fetchConFallback(API_URL, {}, librosDemo);
          if (resultado === librosDemo) {
            datos = librosDemo;
          } else {
            datos = await normalizarResultado(resultado);
          }
        } catch {
          datos = null;
        }
        if (!datos) {
          // Fallback manual por si el helper no resolvió datos válidos
          try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            datos = await normalizarResultado(res);
          } catch {
            datos = null;
          }
          if (!datos) {
            datos = librosDemo;
          }
        }
        if (!cancelado) {
          if (Array.isArray(datos) && datos.length > 0) {
            setLibros(datos);
          } else {
            setLibros(librosDemo);
          }
        }
      } catch {
        if (!cancelado) {
          setLibros(librosDemo);
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  // --- Debounce simple del buscador (título/autor) ---
  useEffect(() => {
    const t = setTimeout(() => {
      setBusquedaDebounced(busqueda.trim());
      setPagina(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [busqueda]);

  const cargarBusquedasRecientes = () => {
    if (DEMO_MODE) return; // En demo no hay backend de búsquedas
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) return;
    fetch(`http://localhost:3000/api/busquedas?usuarioId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBusquedasRecientes(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setBusquedasRecientes([]));
  };

  useEffect(() => {
    cargarBusquedasRecientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Materias presentes en los datos cargados (funciona en demo y en modo real)
  const materias = useMemo(() => {
    const set = new Set();
    libros.forEach((l) => {
      if (l.materia) set.add(l.materia);
    });
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, [libros]);

  const handleBuscarLibro = async (e) => {
    if (e) e.preventDefault();
    if (DEMO_MODE) return; // En demo el filtrado ya es en vivo con debounce
    const filtroBusqueda = normalizar(busquedaDebounced || busqueda);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && filtroBusqueda && userId) {
      try {
        await fetch('http://localhost:3000/api/busquedas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ termino: filtroBusqueda, usuarioId: userId }),
        });
        cargarBusquedasRecientes();
      } catch {
        // No bloquear la búsqueda si falla el historial
      }
    }
  };

  const handleFocus = () => setMostrarSugerencias(true);
  const handleBlur = () => setTimeout(() => setMostrarSugerencias(false), 200);

  const handleLimpiar = () => {
    setBusqueda('');
    setBusquedaDebounced('');
    setMateria('todas');
    setDisponibilidad('todas');
    setOrden('');
    setPagina(1);
  };

  // --- Filtrado + orden derived ---
  const librosFiltrados = useMemo(() => {
    const q = normalizar(busquedaDebounced);
    const palabras = q ? q.split(/\s+/) : [];
    const filtrados = libros.filter((libro) => {
      if (materia !== 'todas' && libro.materia !== materia) return false;
      if (disponibilidad === 'disponibles' && !libro.disponible) return false;
      if (disponibilidad === 'prestados' && libro.disponible) return false;
      if (palabras.length > 0) {
        const texto = [libro.titulo, libro.autor].map(normalizar).join(' ');
        if (!palabras.every((p) => texto.includes(p))) return false;
      }
      return true;
    });

    const ordenados = [...filtrados];
    if (orden === 'titulo-az' || orden === 'titulo') {
      ordenados.sort((a, b) => soloLetras(a.titulo).localeCompare(soloLetras(b.titulo)));
    } else if (orden === 'titulo-za') {
      ordenados.sort((a, b) => soloLetras(b.titulo).localeCompare(soloLetras(a.titulo)));
    } else if (orden === 'autor-az' || orden === 'autor') {
      ordenados.sort((a, b) => soloLetras(a.autor).localeCompare(soloLetras(b.autor)));
    } else if (orden === 'anio-asc') {
      ordenados.sort((a, b) => (Number(getAnio(a)) || 0) - (Number(getAnio(b)) || 0));
    } else if (orden === 'anio-desc') {
      ordenados.sort((a, b) => (Number(getAnio(b)) || 0) - (Number(getAnio(a)) || 0));
    }
    return ordenados;
  }, [libros, busquedaDebounced, materia, disponibilidad, orden]);

  useEffect(() => {
    setPagina(1);
  }, [materia, disponibilidad, orden]);

  const totalPaginas = Math.max(1, Math.ceil(librosFiltrados.length / PAGE_SIZE));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const librosPagina = librosFiltrados.slice((paginaSegura - 1) * PAGE_SIZE, paginaSegura * PAGE_SIZE);

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('biblio_demo_session');
    try { localStorage.setItem('biblio_demo_closed', '1'); } catch {}
    navigate('/login');
  };

  if (loading) return <Loader />;

  if (error && librosFiltrados.length === 0) {
    return (
      <>
        <Header
          onLogout={onLogout}
          right={
            <div className="catalogo-nav">
              <Link to="/turnos" className="catalogo-link">Turnero</Link>
              <Link to="/contacto" className="catalogo-link">Contacto</Link>
            </div>
          }
        />
        <main className="catalogo-main">
        <h1 className="catalogo-titulo">Catálogo de Libros</h1>
          <div className="catalogo-error" role="alert">
            <p>{error}</p>
            <button type="button" className="catalogo-ai-btn" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        onLogout={onLogout}
        right={
          <div className="catalogo-nav">
            <Link to="/turnos" className="catalogo-link">Turnero</Link>
            <Link to="/contacto" className="catalogo-link">Contacto</Link>
          </div>
        }
      />
      <main className="catalogo-main">
        <h1 className="catalogo-titulo">Catálogo de Libros</h1>
        <p className="catalogo-subtitulo">
          Explorá, filtrá y descubrí tu próxima lectura.
        </p>

        {aviso && (
          <p className="catalogo-aviso" role="status">
            {aviso}
          </p>
        )}

        <form className="catalogo-busqueda-filtros-minimal" onSubmit={handleBuscarLibro} role="search">
          <div className="catalogo-busqueda-wrapper">
            <span className="catalogo-busqueda-icono" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
            </span>
            <input
              className="catalogo-busqueda catalogo-busqueda-con-icono"
              type="search"
              placeholder="Buscar libro por título o autor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete="off"
              aria-label="Buscar por título o autor"
            />
            {busqueda && (
              <button
                type="button"
                className="catalogo-busqueda-limpiar"
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
            {mostrarSugerencias && busquedasRecientes.length > 0 && (
              <ul className="catalogo-busquedas-sugerencias">
                {busquedasRecientes.map((b) => (
                  <li
                    key={b.id}
                    onMouseDown={() => {
                      setBusqueda(b.termino);
                      setMostrarSugerencias(false);
                    }}
                  >
                    {b.termino}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="catalogo-botones-filtros">
            <button type="submit" className="catalogo-ai-btn">
              Buscar
            </button>
            <button
              type="button"
              className="catalogo-ai-btn catalogo-btn-limpiar"
              onClick={handleLimpiar}
            >
              Limpiar
            </button>
          </div>
        </form>

        <div className="catalogo-filtros-secundarios">
          <label className="catalogo-filtro-grupo">
            Materia
            <select
              className="catalogo-filtro"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
            >
              <option value="todas">Todas</option>
              {materias.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="catalogo-filtro-grupo">
            Disponibilidad
            <select
              className="catalogo-filtro"
              value={disponibilidad}
              onChange={(e) => setDisponibilidad(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="disponibles">Disponibles</option>
              <option value="prestados">Prestados</option>
            </select>
          </label>
          <label className="catalogo-filtro-grupo">
            Orden
            <select
              className="catalogo-filtro"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="">Sin orden</option>
              <option value="titulo-az">Título (A-Z)</option>
              <option value="titulo-za">Título (Z-A)</option>
              <option value="autor-az">Autor (A-Z)</option>
              <option value="anio-asc">Año (ascendente)</option>
              <option value="anio-desc">Año (descendente)</option>
            </select>
          </label>
        </div>

        {materias.length > 0 && (
          <div className="catalogo-chips" role="group" aria-label="Filtrar por materia">
            <button
              type="button"
              className={`catalogo-chip${materia === 'todas' ? ' is-activa' : ''}`}
              onClick={() => setMateria('todas')}
              aria-pressed={materia === 'todas'}
            >
              Todas
            </button>
            {materias.map((m) => (
              <button
                key={m}
                type="button"
                className={`catalogo-chip${materia === m ? ' is-activa' : ''}`}
                onClick={() => setMateria(materia === m ? 'todas' : m)}
                aria-pressed={materia === m}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        <p className="catalogo-conteo" aria-live="polite">
          <span className="catalogo-conteo-pill">
            {librosFiltrados.length === 0
              ? 'Sin resultados'
              : `${librosFiltrados.length} ${librosFiltrados.length === 1 ? 'libro encontrado' : 'libros encontrados'}`}
          </span>
        </p>

        {librosFiltrados.length === 0 ? (
          <div className="catalogo-vacio" role="status">
            <svg className="catalogo-vacio-ilustracion" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
              <circle cx="48" cy="48" r="44" fill="currentColor" opacity="0.08" />
              <path d="M30 34c5-3 11-3 16 0 5-3 11-3 16 0v34c-5-3-11-3-16 0-5-3-11-3-16 0V34z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
              <line x1="46" y1="34" x2="46" y2="68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <circle cx="70" cy="26" r="9" stroke="currentColor" strokeWidth="3" />
              <line x1="77" y1="33" x2="84" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="36" y1="80" x2="60" y2="80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            </svg>
            <p className="catalogo-vacio-titulo">No se encontraron libros con esos filtros.</p>
            <p className="catalogo-vacio-detalle">
              Probá con otro título, autor, o quitá algún filtro para ver más resultados.
            </p>
            <button type="button" className="catalogo-ai-btn" onClick={handleLimpiar}>
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <div className="catalogo-grid">
            {librosPagina.map((libro) => (
              <LibroCard key={libro.id} libro={libro} />
            ))}
          </div>
        )}
        <Pagination pagina={paginaSegura} totalPaginas={totalPaginas} setPagina={setPagina} />
      </main>
      <footer className="catalogo-footer">
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </>
  );
}

function Pagination({ pagina, totalPaginas, setPagina }) {
  if (totalPaginas <= 1) return null;

  // Muestra máximo 5 números, con ... si hay muchas páginas
  const getPages = () => {
    const pages = [];
    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) pages.push(i);
    } else if (pagina <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPaginas);
    } else if (pagina >= totalPaginas - 2) {
      pages.push(1, '...', totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas);
    } else {
      pages.push(1, '...', pagina - 1, pagina, pagina + 1, '...', totalPaginas);
    }
    return pages;
  };

  return (
    <div className="catalogo-paginacion">
      <button type="button" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
        Anterior
      </button>
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} style={{ margin: '0 0.5rem', color: '#888' }}>…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={pagina === p ? 'catalogo-pagina-activa' : ''}
            style={{
              fontWeight: pagina === p ? 700 : 500,
              background: pagina === p ? '#e0e7ff' : 'none',
              color: pagina === p ? '#2563eb' : undefined,
            }}
            onClick={() => setPagina(p)}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>
        Siguiente
      </button>
    </div>
  );
}
