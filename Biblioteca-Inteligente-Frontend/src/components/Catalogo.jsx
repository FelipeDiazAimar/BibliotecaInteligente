import React, { useEffect, useState } from 'react';
import LibroCard from './LibroCard';
import Header from './Header';
import { Link } from 'react-router-dom';
import '../styles/Catalogo.css';

const PAGE_SIZE = 8;

function soloLetras(str) {
  return (str || '')
    .normalize('NFD') // Quita tildes
    .replace(/[\u0300-\u036f]/g, '') // Quita tildes
    .replace(/[^a-zA-Z]/g, '') // Solo letras
    .toLowerCase();
}

export default function Catalogo() {
  const [libros, setLibros] = useState([]);
  const [librosFiltrados, setLibrosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [editoriales, setEditoriales] = useState([]);
  const [busquedasRecientes, setBusquedasRecientes] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // Trae todas las editoriales para el filtro (solo una vez)
  useEffect(() => {
    fetch('http://localhost:3000/api/libros')
      .then(res => res.json())
      .then(data => {
        const eds = Array.from(new Set(data.filter(l => l.disponible).map(l => l.editorial).filter(Boolean)));
        setEditoriales(eds);
      });
  }, []);

  // Trae todos los libros al montar
  useEffect(() => {
    fetch('http://localhost:3000/api/libros')
      .then(res => res.json())
      .then(data => {
        setLibros(data);
        setLibrosFiltrados(data);
      });
  }, []);

  // Trae el historial de búsquedas del usuario (solo las 3 más recientes)
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

  // Buscar libros (como en AdminPanel)
  const handleBuscarLibro = async (e) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const filtroBusqueda = busqueda.trim();

    // Buscar en el backend
    if (filtroBusqueda) {
      // Limpiá el término antes de buscar (opcional, si tu backend soporta)
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

    // Registra la búsqueda en el backend
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

  // Sugerencias al enfocar el input
  const handleFocus = () => setMostrarSugerencias(true);
  const handleBlur = () => setTimeout(() => setMostrarSugerencias(false), 200);

  // Limpiar búsqueda
  const handleLimpiar = () => {
    setBusqueda('');
    setLibrosFiltrados(libros);
    setPagina(1);
  };

  // Filtra por editorial en el frontend
  const librosFiltradosPorEditorial = filtro
    ? librosFiltrados.filter(l => l.editorial === filtro)
    : librosFiltrados;

  // Filtra por editorial en el frontend (si querés mantenerlo, si no, podés sacar esta parte)
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

  // Si querés seguir filtrando por editorial, agregá un filtro extra acá
  // librosOrdenados = editorialSeleccionada ? librosOrdenados.filter(l => l.editorial === editorialSeleccionada) : librosOrdenados;

  const totalPaginas = Math.ceil(librosOrdenados.length / PAGE_SIZE);
  const librosPagina = librosOrdenados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  // Si cambias el filtro, resetea la página a 1
  useEffect(() => {
    setPagina(1);
  }, [filtro]);

  return (
    <div className="catalogo-overlay">
      <Header
        left={
          <div>
            <div className="catalogo-logo">BIBLIOTECA<br />INTELIGENTE</div>
            <div className="catalogo-utn">UTN <span role="img" aria-label="libro">📚</span></div>
          </div>
        }
        right={
          <div className="catalogo-nav">
            <Link to="/voz" className="catalogo-link">Ask AI</Link>
            <Link to="/turnero" className="catalogo-link">Turnero</Link>
            <Link to="/contacto" className="catalogo-link">Contacto</Link>
            <Link to="/" className="catalogo-link">Atrás</Link>
            <span className="catalogo-user-icon">👤</span>
          </div>
        }
      />
      <main className="catalogo-main">
        <form className="catalogo-busqueda-filtros" onSubmit={handleBuscarLibro}>
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
                    style={{
                      padding: '0.7em 1em',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee'
                    }}
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
          <button
            type="submit"
            className="catalogo-ai-btn"
            style={{ marginLeft: '0.7rem', padding: '0.7em 1.2em', fontSize: '1rem' }}
          >
            Buscar
          </button>
          <button
            type="button"
            className="catalogo-ai-btn"
            style={{ background: '#e53935', marginLeft: 8, padding: '0.7em 1.2em', fontSize: '1rem' }}
            onClick={handleLimpiar}
          >
            Limpiar
          </button>
          <select
            className="catalogo-filtro"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="">Sin orden</option>
            <option value="titulo-az">Título (A-Z)</option>
            <option value="titulo-za">Título (Z-A)</option>
            <option value="anio-asc">Año (ascendente)</option>
            <option value="anio-desc">Año (descendente)</option>
          </select>
        </form>

        <div className="catalogo-grid">
          {librosPagina.map(libro => (
            <LibroCard key={libro.id} libro={libro} />
          ))}
        </div>
        <div className="catalogo-paginacion">
          <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>&lt; Previous</button>
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              className={pagina === i + 1 ? 'catalogo-pagina-activa' : ''}
              onClick={() => setPagina(i + 1)}
            >{i + 1}</button>
          ))}
          <button disabled={pagina === totalPaginas || totalPaginas === 0} onClick={() => setPagina(pagina + 1)}>Next &gt;</button>
        </div>
      </main>
      <footer className="catalogo-footer">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}