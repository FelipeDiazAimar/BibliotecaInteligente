import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LibroCard.css';

export default function LibroCard({ libro }) {
  const navigate = useNavigate();

  return (
    <div
      className="libro-card"
      onClick={() => navigate(`/libros/${libro.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="libro-card-img">
        {libro.portada ? (
          <img
            src={`http://localhost:3000/api/libros/${libro.id}/portada`}
            alt="Portada"
          />
        ) : (
          <div className="libro-card-placeholder" />
        )}
      </div>
      <div className="libro-card-info">
        <div className="libro-card-titulo">{libro.titulo}</div>
        <div className="libro-card-autor">{libro.autor}</div>
        <div className="libro-card-anio">{libro.anioPublicacion}</div>
        <div className="libro-card-editorial">{libro.editorial}</div>
      </div>
    </div>
  );
}