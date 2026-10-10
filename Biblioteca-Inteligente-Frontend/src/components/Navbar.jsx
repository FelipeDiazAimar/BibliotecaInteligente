import { Link } from 'react-router-dom';
import Header from './Header';

/**
 * Navbar (compatibilidad).
 *
 * Decisión de unificación: antes existían dos barras distintas — `Header`
 * (páginas internas) y `Navbar` (portada/login/registro) — con links
 * diferentes y sin estado activo. Para evitar la doble barra, `Navbar` ya
 * no renderiza su propio <nav>: delega en `Header`, que es el único nav
 * principal responsive. Se conserva la firma de props para no romper a
 * los llamadores actuales (portada.jsx, LoginAlumno.jsx,
 * RegistroUsuario.jsx).
 */
export default function Navbar({ extraLinks = [], hideLinks = [] }) {
  const visibleExtras = extraLinks.filter(({ to }) => !hideLinks.includes(to));

  return (
    <Header
      hideLinks={hideLinks}
      hideLoginLink={hideLinks.includes('login')}
      right={
        visibleExtras.length > 0 ? (
          <div className="bi-navbar-extras">
            {visibleExtras.map(({ to, label }, i) => (
              <Link key={to ?? i} className="bi-nav-link" to={to}>
                {label}
              </Link>
            ))}
          </div>
        ) : undefined
      }
    />
  );
}
