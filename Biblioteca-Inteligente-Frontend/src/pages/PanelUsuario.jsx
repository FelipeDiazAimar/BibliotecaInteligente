import '../styles/PanelUsuario.css';
import Header from '../components/Header';
import vozImg from '../assets/ondas-sonoras.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function PanelUsuario({ usuario, onLogout }) {
  const [avisos] = useState([
    "Recuerda devolver tus libros antes de la fecha de vencimiento.",
    "Nuevo: ¡Turnero virtual para atención personalizada!",
    "Consulta el catálogo actualizado con nuevos títulos."
  ]);

  return (
    <div className="panel-overlay">
      <Header
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginRight: '80px' }}>
            <Link to="#" className="panel-link" onClick={onLogout}>Cerrar sesión</Link>
          </div>
        }
      />
      <main className="panel-main panel-main-usuario">
        {/* Tarjeta de usuario */}
        <div className="panel-user-card panel-user-card-big">
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
