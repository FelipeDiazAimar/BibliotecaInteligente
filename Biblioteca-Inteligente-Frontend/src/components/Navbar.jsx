import { Link } from 'react-router-dom';
import '../styles/portada.css';

export default function Navbar({ extraLinks = [], hideLinks = [] }) {
  return (
    <nav>
      <ul>
        {!hideLinks.includes('acerca') && (
          <li><Link className="nav-link" to="/acerca">Acerca de</Link></li>
        )}
        {!hideLinks.includes('contacto') && (
          <li><Link className="nav-link" to="/contacto">Contacto</Link></li>
        )}
        {!hideLinks.includes('login') && (
          <li><Link className="nav-link" to="/login">Iniciar sesión</Link></li>
        )}
        {extraLinks.map(({ to, label }, i) => (
          <li key={i}><Link className="nav-link" to={to}>{label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}