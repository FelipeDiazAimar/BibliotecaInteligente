import React, { useEffect, useState } from 'react';
import LibroCard from '../components/LibroCard';
import Header from '../components/Header';
import Loader from '../components/Loader'; // <-- Importa el Loader
import { Link } from 'react-router-dom';
import '../styles/Catalogo.css';

const PAGE_SIZE = 8;

function soloLetras(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase();
}

export default function Catalogo() {
  const [libros, setLibros] = useState([]);
  const [librosFiltrados, setLibrosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Estado de carga
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [busquedasRecientes, setBusquedasRecientes] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/libros')
      .then(res => res.json())
      .then(data => {
        setLibros(data);
        setLibrosFiltrados(data);
        setLoading(false);
      });
  }, []);

  const cargarBusquedasRecientes = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) return;
    fetch(`http://localhost:3000/api/busquedas?usuarioId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBusquedasRecientes(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setBusquedasRecientes([]));
  };

  useEffect(() => {
    cargarBusquedasRecientes();
  }, []);

  const handleBuscarLibro = async (e) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const filtroBusqueda = busqueda.trim();

    if (filtroBusqueda) {
      const terminoLimpio = soloLetras(filtroBusqueda);
      const res = await fetch(`http://localhost:3000/api/libros/buscar?termino=${encodeURIComponent(terminoLimpio)}`);
      if (res.ok) {
        const data = await res.json();
        const disponibles = data.filter(l => l.disponible);
        setLibrosFiltrados(disponibles);
        setPagina(1);
      } else {
        setLibrosFiltrados([]);
      }
    } else {
      setLibrosFiltrados(libros);
      setPagina(1);
    }

    if (token && filtroBusqueda) {
      await fetch('http://localhost:3000/api/busquedas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ termino: filtroBusqueda, usuarioId: userId })
      });
      cargarBusquedasRecientes();
    }
  };

  const handleFocus = () => setMostrarSugerencias(true);
  const handleBlur = () => setTimeout(() => setMostrarSugerencias(false), 200);

  const handleLimpiar = () => {
    setBusqueda('');
    setLibrosFiltrados(libros);
    setPagina(1);
  };

  let librosOrdenados = [...librosFiltrados];

  if (filtro === "titulo-az") {
    librosOrdenados.sort((a, b) => soloLetras(a.titulo).localeCompare(soloLetras(b.titulo)));
  } else if (filtro === "titulo-za") {
    librosOrdenados.sort((a, b) => soloLetras(b.titulo).localeCompare(soloLetras(a.titulo)));
  } else if (filtro === "anio-asc") {
    librosOrdenados.sort((a, b) => (parseInt(a.anioPublicacion) || 0) - (parseInt(b.anioPublicacion) || 0));
  } else if (filtro === "anio-desc") {
    librosOrdenados.sort((a, b) => (parseInt(b.anioPublicacion) || 0) - (parseInt(a.anioPublicacion) || 0));
  }

  const totalPaginas = Math.ceil(librosOrdenados.length / PAGE_SIZE);
  const librosPagina = librosOrdenados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  useEffect(() => {
    setPagina(1);
  }, [filtro]);

  if (loading) return <Loader />;

  return (
    <>
      <Header
        right={
          <div className="catalogo-nav">
            <Link to="/turnero" className="catalogo-link">Turnero</Link>
            <Link to="/contacto" className="catalogo-link">Contacto</Link>
            <Link to="/" className="catalogo-link">Atrás</Link>
          </div>
        }
      />
      <main className="catalogo-main">
        <h1 className="catalogo-titulo">Catálogo de Libros</h1>
        <form className="catalogo-busqueda-filtros-minimal" onSubmit={handleBuscarLibro}>
          <div className="catalogo-busqueda-wrapper">
            <input
              className="catalogo-busqueda"
              type="text"
              placeholder="🔍 Buscar libro por título o autor..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {mostrarSugerencias && busquedasRecientes.length > 0 && (
              <ul className="catalogo-busquedas-sugerencias">
                {busquedasRecientes.map(b => (
                  <li
                    key={b.id}
                    onMouseDown={() => {
                      setBusqueda(b.termino);
                      setMostrarSugerencias(false);
                      setTimeout(() => handleBuscarLibro(), 0);
                    }}
                  >
                    {b.termino}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="catalogo-botones-filtros">
            <button
              type="submit"
              className="catalogo-ai-btn"
            >
              Buscar
            </button>
            <button
              type="button"
              className="catalogo-ai-btn catalogo-btn-limpiar"
              onClick={handleLimpiar}
            >
              Limpiar
            </button>
            <select
              className="catalogo-filtro"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            >
              <option value="">Sin orden</option>
              <option value="titulo-az">Título (A-Z)</option>
              <option value="titulo-za">Título (Z-A)</option>
              <option value="anio-asc">Año (ascendente)</option>
              <option value="anio-desc">Año (descendente)</option>
            </select>
          </div>
        </form>
        <div className="catalogo-grid">
          {librosPagina.map(libro => (
            <LibroCard key={libro.id} libro={libro} />
          ))}
        </div>
        <div className="catalogo-paginacion">
          <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              className={pagina === i + 1 ? 'catalogo-pagina-activa' : ''}
              onClick={() => setPagina(i + 1)}
            >{i + 1}</button>
          ))}
          <button disabled={pagina === totalPaginas || totalPaginas === 0} onClick={() => setPagina(pagina + 1)}>Siguiente</button>
        </div>
      </main>
      <footer className="catalogo-footer">
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </>
  );
}
// If you want to export CatalogoPage as default, use the following lines instead of the previous default export:
// export default function CatalogoPage() {
//   return <Catalogo />;
// }

// Or, if you want Catalogo as default:
// export default Catalogo;