import React, { useEffect, useState } from 'react';
import LibroCard from './LibroCard';
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
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [busquedasRecientes, setBusquedasRecientes] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/libros')
      .then(res => res.json())
      .then(data => {
        setLibros(data); // No filtrar por disponible
        setLibrosFiltrados(data);
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

  return (
    <div className="catalogo-overlay">
      <header className="catalogo-header-glass catalogo-header-fixed">
        <div className="catalogo-logo-glass">
          <span>BIBLIOTECA</span>
          <span>INTELIGENTE</span>
        </div>
        <nav className="catalogo-nav-glass">
          <Link to="/voz" className="catalogo-link-glass">Ask AI</Link>
          <Link to="/turnero" className="catalogo-link-glass">Turnero</Link>
          <Link to="/contacto" className="catalogo-link-glass">Contacto</Link>
          <Link to="/" className="catalogo-link-glass">Atrás</Link>
          <span className="catalogo-user-icon-glass" title="Usuario">👤</span>
        </nav>
      </header>
      <main className="catalogo-main-glass">
        <form className="catalogo-busqueda-filtros-glass" onSubmit={handleBuscarLibro} autoComplete="off">
          <div className="catalogo-busqueda-wrapper-glass">
            <input
              className="catalogo-busqueda-glass"
              type="text"
              placeholder="🔍 Buscar libro por título o autor..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onFocus={() => setMostrarSugerencias(true)}
              onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
              autoComplete="off"
            />
            {mostrarSugerencias && busquedasRecientes.length > 0 && (
              <ul className="catalogo-busquedas-sugerencias-glass">
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
          <button type="submit" className="catalogo-ai-btn-glass buscar">Buscar</button>
          <button type="button" className="catalogo-ai-btn-glass limpiar" onClick={handleLimpiar}>Limpiar</button>
          <select
            className="catalogo-filtro-glass"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          >
            <option value="">Sin orden</option>
            <option value="titulo-az">Título (A-Z)</option>
            <option value="titulo-za">Título (Z-A)</option>
            <option value="anio-asc">Año (ascendente)</option>
            <option value="anio-desc">Año (descendente)</option>
          </select>
        </form>
        <div className="catalogo-grid-glass">
          {librosPagina.map(libro => (
            <LibroCard key={libro.id} libro={libro} />
          ))}
        </div>
        <div className="catalogo-paginacion-glass">
          <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>&lt; Prev</button>
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              className={pagina === i + 1 ? 'catalogo-pagina-activa-glass' : ''}
              onClick={() => setPagina(i + 1)}
            >{i + 1}</button>
          ))}
          <button disabled={pagina === totalPaginas || totalPaginas === 0} onClick={() => setPagina(pagina + 1)}>Next &gt;</button>
        </div>
      </main>
      <footer className="catalogo-footer-glass">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}