import vozImg from '../assets/ondas-sonoras.png';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { useState, useEffect } from 'react';

export default function Header({ right, hideVozIA, onLogout }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('header-theme') === 'dark'
  );
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute('data-header-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('header-theme', darkMode ? 'dark' : 'light');
    return () => {
      document.body.removeAttribute('data-header-theme');
    };
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Mantiene los estilos del Link, pero controla el acceso
  const handleAskAIClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/voz-ia');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="panel-navbar">
      <div className="panel-navbar-left">
        <button
          className="panel-back-btn"
          onClick={() => window.history.back()}
          aria-label="Atrás"
        >
          <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="panel-logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>
            BiblioTech
          </span>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 6 4 14"></path>
              <path d="M12 6v14"></path>
              <path d="M8 8v12"></path>
              <path d="M4 4v16"></path>
            </svg>
          </span>
        </div>
      </div>
      <div className="panel-navbar-right" style={{ alignItems: 'center', display: 'flex', gap: '2.5rem', marginRight: '80px' }}>
        {/* Ask AI SIEMPRE PRIMERO */}
        {!hideVozIA && (
          <Link
            to="/voz-ia"
            className="header-voz-btn"
            title="Ir a VozIA"
            onClick={handleAskAIClick}
          >
            <img src={vozImg} alt="VozIA" className="header-voz-icon" />
            <span className="header-voz-text">Ask AI</span>
          </Link>
        )}
        {right}
        {/* Botón de cerrar sesión */}
        <button
          type="button"
          className="panel-link-cs"
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
        {/* Botón de modo claro/oscuro */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Luna */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#11487c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
          </svg>
          <button
            aria-label="Cambiar modo claro/oscuro"
            onClick={toggleDarkMode}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 1px 6px #1769aa22',
              transition: 'background 0.2s'
            }}
          >
            <div
              style={{
                width: 36,
                height: 18,
                borderRadius: 12,
                background: darkMode
                  ? 'linear-gradient(90deg, #11487c 60%, #2196f3 100%)'
                  : 'linear-gradient(90deg, #e3e8f7 0%, #b3c6e0 100%)',
                position: 'relative',
                transition: 'background 0.2s'
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: darkMode ? '#fff' : '#11487c',
                  position: 'absolute',
                  top: 1,
                  left: darkMode ? 18 : 2,
                  transition: 'left 0.22s cubic-bezier(.4,0,.2,1), background 0.22s'
                }}
              />
            </div>
          </button>
          {/* Sol */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#11487c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        </div>
        <Link to="/panel" title="Usuario">
          <span className="panel-user-icon">
            <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
          </span>
        </Link>
      </div>
    </header>
  );
}