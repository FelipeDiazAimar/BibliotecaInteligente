import React from 'react';
import '../styles/Catalogo.css';

export default function LibroCard({ libro }) {
  return (
    <div className="libro-card-glass">
      <div className="libro-card-img-glass">
        {libro.portada ? (
          <img
            src={`http://localhost:3000/api/libros/${libro.id}/portada`}
            alt="Portada"
          />
        ) : (
          <div className="libro-card-placeholder-glass" />
        )}
      </div>
      <div className="libro-card-info-glass">
        <div className="libro-card-titulo-glass">{libro.titulo}</div>
        <div className="libro-card-autor-glass">{libro.autor}</div>
        <div className="libro-card-anio-glass">{libro.anioPublicacion}</div>
        <div className="libro-card-editorial-glass">{libro.editorial}</div>
        <div className={`libro-card-disponible-glass ${libro.disponible ? 'disponible' : 'nodisponible'}`}>
          {libro.disponible ? 'Disponible' : 'No disponible'}
        </div>
      </div>
    </div>
  );
}