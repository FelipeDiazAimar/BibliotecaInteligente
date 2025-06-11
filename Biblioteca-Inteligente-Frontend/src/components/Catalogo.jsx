import React, { useEffect, useState } from 'react';
import LibroCard from './LibroCard';
import Header from './Header';
import { Link } from 'react-router-dom';
import '../styles/Catalogo.css';

const PAGE_SIZE = 8;

export default function Catalogo() {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [editoriales, setEditoriales] = useState([]);

  // Trae todas las editoriales para el filtro (solo una vez)
  useEffect(() => {
    fetch('http://localhost:3000/api/libros')
      .then(res => res.json())
      .then(data => {
        const eds = Array.from(new Set(data.filter(l => l.disponible).map(l => l.editorial).filter(Boolean)));
        setEditoriales(eds);
      });
  }, []);

  // Trae los libros según búsqueda
  useEffect(() => {
    let url = 'http://localhost:3000/api/libros';
    if (busqueda.trim()) {
      url = `http://localhost:3000/api/libros/buscar?termino=${encodeURIComponent(busqueda.trim())}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Solo disponibles
        let disponibles = data.filter(l => l.disponible);
        setLibros(disponibles);
        setPagina(1); // Resetea a la primera página al buscar
      });
  }, [busqueda]);

  // Filtra por editorial en el frontend
  const librosFiltrados = filtro
    ? libros.filter(l => l.editorial === filtro)
    : libros;

  const totalPaginas = Math.ceil(librosFiltrados.length / PAGE_SIZE);
  const librosPagina = librosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

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
        <div className="catalogo-busqueda-filtros">
          <input
            className="catalogo-busqueda"
            type="text"
            placeholder="🔍 Buscar"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <select
            className="catalogo-filtro"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          >
            <option value="">Filtrar</option>
            {editoriales.map(ed => (
              <option key={ed} value={ed}>{ed}</option>
            ))}
          </select>
        </div>
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