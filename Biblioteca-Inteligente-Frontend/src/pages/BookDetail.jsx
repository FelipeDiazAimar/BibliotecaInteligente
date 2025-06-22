// BookDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import '../styles/BookDetail.css';

export default function BookDetail() {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/libros/${id}`)
      .then(res => res.json())
      .then(data => {
        setLibro(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader />;

  if (!libro) {
    return (
      <div className="bookdetail-bg">
        <Header
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginRight: '80px' }}>
              <Link to="/catalogo" className="panel-link">Catálogo</Link>
              <Link to="/turnos" className="panel-link">Turnero</Link>
            </div>
          }
        />
        <div className="bookdetail-loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="bookdetail-bg">
      <Header
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginRight: '80px' }}>
            <Link to="/catalogo" className="panel-link">Catálogo</Link>
            <Link to="/turnos" className="panel-link">Turnero</Link>
          </div>
        }
      />
      <main className="bookdetail-main">
        <h1 className="bookdetail-title">Descripción: {libro.titulo}</h1>
        <div className="bookdetail-content">
          <div className="bookdetail-img-wrap">
            {libro.portada ? (
              <img
                src={`http://localhost:3000/api/libros/${libro.id}/portada`}
                alt="Portada"
                className="bookdetail-img"
              />
            ) : (
              <div className="bookdetail-img-placeholder">Sin portada</div>
            )}
          </div>
          <ul className="bookdetail-specs">
            <li><strong>Título:</strong> {libro.titulo}</li>
            <li><strong>Subtítulo:</strong> {libro.subtitulo || '-'}</li>
            <li><strong>Autor:</strong> {libro.autor}</li>
            <li><strong>Editorial:</strong> {libro.editorial || '-'}</li>
            <li><strong>Edición:</strong> {libro.edicion || '-'}</li>
            <li><strong>Lugar:</strong> {libro.lugar || '-'}</li>
            <li><strong>Año de Publicación:</strong> {libro.anioPublicacion || '-'}</li>
            <li><strong>Páginas:</strong> {libro.paginas || '-'}</li>
            <li><strong>ISBN:</strong> {libro.isbn || '-'}</li>
            <li><strong>Serie:</strong> {libro.serie || '-'}</li>
            <li><strong>Fecha de Ingreso:</strong> {libro.fechaIngreso || '-'}</li>
            <li><strong>Observaciones:</strong> {libro.observaciones || '-'}</li>
            <li><strong>Idioma:</strong> {libro.idioma || '-'}</li>
            <li><strong>Días Préstamo:</strong> {libro.diasPrestamo || '-'}</li>
            <li><strong>Nro Inventario:</strong> {libro.nroInventario || '-'}</li>
            <li><strong>Biblioteca:</strong> {libro.biblioteca || '-'}</li>
            <li><strong>Signatura Topográfica:</strong> {libro.signaturaTopografica || '-'}</li>
            <li><strong>Disponible:</strong> {libro.disponible ? 'Sí' : 'No'}</li>
          </ul>
        </div>
        <div className="bookdetail-actions">
          <button
            className="bookdetail-btn"
            onClick={() => navigate('/contacto')}
          >
            Reservar
          </button>
          <button
            className="bookdetail-btn bookdetail-btn-back"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </main>
    </div>
  );
}
// No hay footer aquí, así que no es necesario cambiar nada.