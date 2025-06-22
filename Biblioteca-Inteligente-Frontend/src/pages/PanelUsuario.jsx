import '../styles/PanelUsuario.css';
import Header from '../components/Header';
import vozImg from '../assets/ondas-sonoras.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function PanelUsuario({ usuario }) {
  const navigate = useNavigate();
  const [avisos] = useState([
    "Recuerda devolver tus libros antes de la fecha de vencimiento.",
    "Nuevo: ¡Turnero virtual para atención personalizada!",
    "Consulta el catálogo actualizado con nuevos títulos."
  ]);
  const [expand, setExpand] = useState(false);

  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="panel-overlay">
      <Header
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginRight: '80px' }}>
            <button
              type="button"
              className="panel-link"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}
              onClick={onLogout}
            >
              Cerrar sesión
            </button>
          </div>
        }
      />
      <main className="panel-main panel-main-usuario">
        {/* Mensaje de bienvenida */}
        <div
          style={{
            marginBottom: "4.2rem",
            fontSize: "2rem",
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: "0.03em",
            background: "linear-gradient(90deg, #2196f3 10%, #a1c4fd 90%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textFillColor: "transparent"
          }}
        >
          ¡Bienvenido/a, {usuario.nombre}!
        </div>
        {/* Tarjeta de usuario expandible */}
        <div
          className={`panel-user-card panel-user-card-big panel-user-card-expandable${expand ? ' expanded' : ''}`}
          onMouseEnter={() => setExpand(true)}
          onMouseLeave={() => setExpand(false)}
          tabIndex={0}
          style={{ transition: 'box-shadow 0.2s, background 0.2s' }}
        >
          <div className="panel-user-avatar panel-user-avatar-big">
            <svg width="54" height="54" fill="none" stroke="#2196f3" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
          </div>
          <div className="panel-user-info">
            <div className="panel-user-name panel-user-name-big">{usuario.nombre}</div>
            <div style={{ color: "#888", fontSize: 16 }}>{usuario.email}</div>
            <div style={{ color: "#2196f3", fontWeight: 600, marginTop: 4 }}>Usuario</div>
            <div className="panel-user-details">
              <div><b>DNI:</b> {usuario.dni}</div>
              {/* Agrega aquí más datos si tienes, por ejemplo: */}
              {usuario.telefono && <div><b>Teléfono:</b> {usuario.telefono}</div>}
              {usuario.direccion && <div><b>Dirección:</b> {usuario.direccion}</div>}
              {/* ...otros campos... */}
            </div>
          </div>
        </div>

        {/* Links de navegación debajo de la tarjeta */}
        <div className="panel-links panel-links-usuario">
          <Link className="panel-link panel-link-turnero" to="/turnos">
            <span className="panel-link-icon">🕒</span>
            Turnero Virtual
          </Link>
          <Link className="panel-link panel-link-catalogo" to="/catalogo">
            <span className="panel-link-icon">📖</span>
            Catalogo Virtual
          </Link>
          <Link className="panel-link panel-link-contacto" to="/contacto">
            <span className="panel-link-icon">📞</span>
            Contacto
          </Link>
        </div>

        {/* Botón destacado para IA */}
        <Link
          to="/voz-ia"
          className="panel-voz-btn panel-voz-btn-big"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="panel-voz-icon">
            <img src={vozImg} alt="Voz" width={36} height={36} style={{ marginRight: 12 }} />
            <span style={{ fontWeight: 600, fontSize: 18 }}>Ask AI</span>
          </span>
        </Link>

        {/* Avisos o novedades */}
        <div className="panel-avisos">
          <div className="panel-avisos-title">Novedades y avisos</div>
          <ul>
            {avisos.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </main>
      <footer className="panel-footer">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}
