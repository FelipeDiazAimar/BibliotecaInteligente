import { Link } from 'react-router-dom';
import '../styles/Header.css';

export default function Header({ right }) {
  return (
    <header className="panel-navbar">
      <div className="panel-logo">
        <span>
          BIBLIOTECA INTELIGENTE 📚
        </span>
      </div>
      <div className="panel-navbar-right">
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