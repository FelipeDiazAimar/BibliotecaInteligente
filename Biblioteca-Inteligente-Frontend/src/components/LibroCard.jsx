import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LibroCard.css';

const API_BASE = 'http://localhost:3000';

// Año compatible con ambos esquemas: demo (`anio`) y backend real (`anioPublicacion`).
export function getAnio(libro) {
  return libro?.anio ?? libro?.anioPublicacion ?? '';
}

// Resuelve la portada: URL directa (demo) o endpoint del backend (modo real).
export function getPortadaUrl(libro) {
  if (!libro) return '';
  const { portada, id } = libro;
  if (typeof portada === 'string' && portada.startsWith('http')) return portada;
  if (portada) return `${API_BASE}/api/libros/${id}/portada`;
  return '';
}

export default function LibroCard({ libro }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  if (!libro) return null;

  const portadaUrl = getPortadaUrl(libro);
  const mostrarImg = portadaUrl && !imgError;
  const anio = getAnio(libro);
  const inicial = (libro.titulo || '?').trim().charAt(0).toUpperCase();
  const detallePath = `/libros/${libro.id}`; // Ruta de detalle existente en App.jsx (BookDetail)

  const irAlDetalle = () => navigate(detallePath);

  return (
    <article
      className="libro-card"
      onClick={irAlDetalle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          irAlDetalle();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`Ver detalle de ${libro.titulo || 'libro'} — ${libro.autor || 'autor desconocido'}`}
    >
      <div className="libro-card-img">
        {mostrarImg ? (
          <>
            {!imgLoaded && <div className="libro-card-shimmer" aria-hidden="true" />}
            <img
              src={portadaUrl}
              alt={`Portada de ${libro.titulo}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={imgLoaded ? 'is-loaded' : 'is-loading'}
            />
          </>
        ) : (
          <div className="libro-card-fallback" aria-hidden="true">
            <span className="libro-card-fallback-letra">{inicial}</span>
            <span className="libro-card-fallback-texto">Sin portada</span>
          </div>
        )}
        <span
          className={`libro-card-badge-disponibilidad ${libro.disponible ? 'disponible' : 'no-disponible'}`}
        >
          <span className="libro-card-badge-dot" aria-hidden="true" />
          {libro.disponible ? 'Disponible' : 'Prestado'}
        </span>
      </div>
      <div className="libro-card-info">
        {libro.materia && (
          <span className="libro-card-badge-materia">{libro.materia}</span>
        )}
        <h3 className="libro-card-titulo">{libro.titulo}</h3>
        <p className="libro-card-autor">{libro.autor}</p>
        {anio !== '' && <p className="libro-card-anio">{anio}</p>}
        <Link
          className="libro-card-link"
          to={detallePath}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
          aria-hidden="true"
        >
          Ver detalle →
        </Link>
      </div>
    </article>
  );
}
