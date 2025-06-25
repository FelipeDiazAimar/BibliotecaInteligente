import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

export default function AdminTabs() {
  const location = useLocation();

  return (
      <div
        className="panel-admin-tabs"
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          margin: 0
        }}
      >
        <Link
          to="/admin"
          className={`panel-admin-tab-link${location.pathname === '/admin' ? ' active' : ''}`}
        >
          Libros
        </Link>
        <Link
          to="/admin-turnos"
          className={`panel-admin-tab-link${location.pathname === '/admin-turnos' ? ' active' : ''}`}
        >
          Turnos
        </Link>
      </div>
  );
}