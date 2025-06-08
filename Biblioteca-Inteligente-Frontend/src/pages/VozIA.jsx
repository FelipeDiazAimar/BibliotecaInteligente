import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/VozIA.css';

export default function VozIA() { // Elimina onAtras
  const [pregunta, setPregunta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const formRef = useRef(null);
  const navigate = useNavigate();
  // Handlers for navigation and logout
    const onAtras = () => navigate(-1);
    const onLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };

  // Cargar historial al montar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:3000/api/asistente/historial', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setHistorial(Array.isArray(data) ? data.reverse() : []))
      .catch(() => setHistorial([]));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!pregunta.trim()) return;
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/api/asistente/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: pregunta })
      });
      // Recargar historial después de preguntar
      fetch('http://localhost:3000/api/asistente/historial', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setHistorial(Array.isArray(data) ? data.reverse() : []));
      setPregunta('');
      setTimeout(() => {
        if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch {
      // Manejo de error opcional
    }
    setCargando(false);
  };

  return (
    <div className="vozia-overlay">
      <Header
        left={
          <div className="panel-logo">
            <span>BIBLIOTECA<br />INTELIGENTE</span>
            <span className="panel-utn">UTN <span role="img" aria-label="libro">📚</span></span>
          </div>
        }
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' , marginRight: '80px'}}>
            <Link to="/catalogo" className="panel-link">Catalogo</Link>
            <Link to="/turnero" className="panel-link">Turnero</Link>
            <Link to="/contacto" className="panel-link">Contacto</Link>
            <Link to="#" className="panel-link" onClick={onAtras}>Atrás</Link>
            <Link to="#" className="panel-link" onClick={onLogout}>Cerrar sesión</Link>
            <span className="panel-user-icon" title="Usuario">
              <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
              </svg>
            </span>
          </div>
        }
      />
      <main className="vozia-main" style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
        <div className="vozia-content">
          <div className="vozia-wave">
            <svg width="80" height="50" viewBox="0 0 80 50">
              <g>
                <rect x="10" y="25" width="4" height="15" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="15;35;15" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="y" values="25;5;25" dur="1s" repeatCount="indefinite" />
                </rect>
                <rect x="20" y="20" width="4" height="25" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="25;10;25" dur="1s" repeatCount="indefinite" begin="0.1s"/>
                  <animate attributeName="y" values="20;35;20" dur="1s" repeatCount="indefinite" begin="0.1s"/>
                </rect>
                <rect x="30" y="15" width="4" height="35" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="35;15;35" dur="1s" repeatCount="indefinite" begin="0.2s"/>
                  <animate attributeName="y" values="15;35;15" dur="1s" repeatCount="indefinite" begin="0.2s"/>
                </rect>
                <rect x="40" y="10" width="4" height="45" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="45;20;45" dur="1s" repeatCount="indefinite" begin="0.3s"/>
                  <animate attributeName="y" values="10;30;10" dur="1s" repeatCount="indefinite" begin="0.3s"/>
                </rect>
                <rect x="50" y="15" width="4" height="35" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="35;15;35" dur="1s" repeatCount="indefinite" begin="0.4s"/>
                  <animate attributeName="y" values="15;35;15" dur="1s" repeatCount="indefinite" begin="0.4s"/>
                </rect>
                <rect x="60" y="20" width="4" height="25" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="25;10;25" dur="1s" repeatCount="indefinite" begin="0.5s"/>
                  <animate attributeName="y" values="20;35;20" dur="1s" repeatCount="indefinite" begin="0.5s"/>
                </rect>
                <rect x="70" y="25" width="4" height="15" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="15;35;15" dur="1s" repeatCount="indefinite" begin="0.6s"/>
                  <animate attributeName="y" values="25;5;25" dur="1s" repeatCount="indefinite" begin="0.6s"/>
                </rect>
              </g>
            </svg>
          </div>
          <div className="vozia-historial">
            {historial.length === 0 && (
              <div style={{ color: '#888', textAlign: 'center', marginBottom: '1.5rem' }}>
                No hay consultas previas.
              </div>
            )}
            {historial.map((item, idx) => (
              <React.Fragment key={item.id || idx}>
                <div style={{ margin: '0.5em 0 0.1em 0', color: '#222', fontWeight: 500 }}>
                  Pregunta: {item.texto}
                </div>
                <div style={{ margin: '0 0 1.2em 1.2em', color: '#333' }}>
                  Respuesta: {item.Respuesta?.texto || <span style={{ color: '#888' }}>Sin respuesta</span>}
                </div>
              </React.Fragment>
            ))}
          </div>
          <form className="vozia-form" onSubmit={handleSubmit} ref={formRef}>
            <input
              className="vozia-input"
              type="text"
              placeholder="Que libros me recomiendas para estudiar física 2?"
              value={pregunta}
              onChange={e => setPregunta(e.target.value)}
              disabled={cargando}
              style={{ color: "#222" }}
            />
            <button
              className="vozia-btn"
              type="submit"
              disabled={cargando || !pregunta.trim()}
            >
              {cargando ? 'Cargando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </main>
      <footer className="vozia-footer">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}