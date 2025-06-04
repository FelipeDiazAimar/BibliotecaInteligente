import '../styles/portada.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/acerca">Acerca de</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/login">Iniciar sesión</Link></li>
      </ul>
    </nav>
  );
}