import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';
import AsistenteIA from '../components/AsistenteIA';
import LibroForm from '../components/LibroForm';

const AdminPanel = ({ usuario }) => { // Elimina onLogout, onAtras
  const [libros, setLibros] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  // Recarga libros después de agregar uno nuevo
  const recargarLibros = () => {
    fetch('http://localhost:3000/api/libros')
      .then(res => res.json())
      .then(data => setLibros(data))
      .catch(err => console.error(err));
  };

  React.useEffect(() => {
    recargarLibros();
  }, []);

  return (
    <div className="admin-overlay">
      <nav className="admin-navbar">
        <div className="admin-logo">
          BIBLIOTECA<br />INTELIGENTE
          <span style={{ fontSize: 18, color: "#2196f3", marginLeft: 8 }}>UTN 📚</span>
        </div>
        <div>
          {/* Elimina el botón que usa onAtras si ya no lo necesitas */}
          {/* <button className="admin-back-btn" onClick={onAtras}>Atrás</button> */}
          <button className="admin-logout-btn" onClick={() => navigate('/login')}>Cerrar sesión</button>
        </div>
      </nav>
      <main className="admin-main">
        <div className="panel-user-card">
          <div className="panel-user-avatar">
            <svg width="38" height="38" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
          </div>
          <div>
            <div className="panel-user-name">{usuario.nombre}</div>
            <div className="panel-user-carrera">{usuario.carrera}</div>
            <div style={{fontWeight: 700, color: "#2196f3"}}>Administrador</div>
          </div>
        </div> {/* <-- CIERRA AQUÍ el div de panel-user-card */}

        <button
          className="admin-form-toggle"
          onClick={() => setMostrarFormulario(f => !f)}
        >
          {mostrarFormulario ? 'Cerrar formulario' : 'Agregar libro'}
        </button>

        {mostrarFormulario && (
          <div className="admin-form-container">
            <LibroForm onLibroAgregado={() => {
              setMostrarFormulario(false);
              recargarLibros();
            }} />
          </div>
        )}

        <h2 className="admin-section-title">Lista de Libros</h2>
        <ul className="book-list">
          {libros.map(libro => (
            <li className="book-item" key={libro.id}>
              <h3>{libro.titulo}</h3>
              <p><strong>Subtítulo:</strong> {libro.subtitulo}</p>
              <p><strong>Autor:</strong> {libro.autor}</p>
              <p><strong>Editorial:</strong> {libro.editorial}</p>
              <p><strong>Edición:</strong> {libro.edicion}</p>
              <p><strong>Lugar:</strong> {libro.lugar}</p>
              <p><strong>Año:</strong> {libro.anioPublicacion}</p>
              <p><strong>Páginas:</strong> {libro.paginas}</p>
              <p><strong>ISBN:</strong> {libro.isbn}</p>
              <p><strong>Serie:</strong> {libro.serie}</p>
              <p><strong>Fecha de Ingreso:</strong> {libro.fechaIngreso}</p>
              <p><strong>Observaciones:</strong> {libro.observaciones}</p>
              <p><strong>Idioma:</strong> {libro.idioma}</p>
              <p><strong>Días Préstamo:</strong> {libro.diasPrestamo}</p>
              <p><strong>Nro Inventario:</strong> {libro.nroInventario}</p>
              <p><strong>Biblioteca:</strong> {libro.biblioteca}</p>
              <p><strong>Signatura Topográfica:</strong> {libro.signaturaTopografica}</p>
              <p><strong>Disponible:</strong> {libro.disponible ? 'Sí' : 'No'}</p>
              {libro.portada && (
                <img
                  src={`http://localhost:3000/api/libros/${libro.id}/portada`}
                  alt="Portada"
                  style={{maxWidth: '120px', maxHeight: '160px', borderRadius: 8, marginTop: 8}}
                />
              )}
            </li>
          ))}
        </ul>

        <AsistenteIA />
      </main>
      <footer className="admin-footer">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default AdminPanel;