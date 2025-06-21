import vozImg from '../assets/ondas-sonoras.png';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

export default function Header({ right, hideVozIA }) {
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
        <div className="panel-logo">
          <span>
            BIBLIOTECA INTELIGENTE 📚
          </span>
        </div>
      </div>
      <div className="panel-navbar-right">
        {/* Ask AI SIEMPRE PRIMERO */}
        {!hideVozIA && (
          <Link to="/voz-ia" className="header-voz-btn" title="Ir a VozIA">
            <img src={vozImg} alt="VozIA" className="header-voz-icon" />
            <span className="header-voz-text">Ask AI</span>
          </Link>
        )}
        {right}
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