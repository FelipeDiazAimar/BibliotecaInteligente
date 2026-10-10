import { Link } from 'react-router-dom';
import '../styles/AcercaDe.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { DEMO_MODE } from '../lib/demo.js';

/* Iconos SVG inline (decorativos, sin cambios de lógica). */
function IconBook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M5 3.5A1.5 1.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v15.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 18.5v-15Zm2 1v14h11.5v-14H7Zm3.2 2.6h5.6a.7.7 0 0 1 0 1.4h-5.6a.7.7 0 0 1 0-1.4Zm0 3h5.6a.7.7 0 0 1 0 1.4h-5.6a.7.7 0 0 1 0-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M7 2.5a.8.8 0 0 1 .8.8v1.2h8.4V3.3a.8.8 0 0 1 1.6 0v1.2h1.4A2.8 2.8 0 0 1 22 7.3v9.9a2.8 2.8 0 0 1-2.8 2.8H4.8A2.8 2.8 0 0 1 2 17.2V7.3a2.8 2.8 0 0 1 2.8-2.8h1.4V3.3a.8.8 0 0 1 .8-.8ZM3.6 10v7.2c0 .7.5 1.2 1.2 1.2h14.4c.7 0 1.2-.5 1.2-1.2V10H3.6Zm3.5-.7a.8.8 0 0 1 .8-.8h.4a.8.8 0 0 1 0 1.6h-.4a.8.8 0 0 1-.8-.8Zm5 0a.8.8 0 0 1 .8-.8h.4a.8.8 0 0 1 0 1.6h-.4a.8.8 0 0 1-.8-.8Zm5 0a.8.8 0 0 1 .8-.8h.4a.8.8 0 0 1 0 1.6h-.4a.8.8 0 0 1-.8-.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconSpark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 2.5c.4 3.9 2.1 6.3 4.3 8.1 2.2 1.7 5 2.6 5.2 2.7-.2.1-3 1-5.2 2.7-2.2 1.8-3.9 4.2-4.3 8.1-.4-3.9-2.1-6.3-4.3-8.1-2.2-1.7-5-2.6-5.2-2.7.2-.1 3-1 5.2-2.7 2.2-1.8 3.9-4.2 4.3-8.1ZM19 2.5c.2 1.9 1 3 2.1 3.9 1 .9 2.4 1.3 2.5 1.3-.1.1-1.5.5-2.5 1.4-1.1.9-1.9 2-2.1 3.9-.2-1.9-1-3-2.1-3.9-1-.9-2.4-1.3-2.5-1.4.1-.1 1.5-.5 2.5-1.3 1.1-.9 1.9-2 2.1-3.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconDashboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M3.5 3.5h7.6a1 1 0 0 1 1 1v7.6a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Zm9.4 0H20a1 1 0 0 1 1 1v4.1a1 1 0 0 1-1 1h-7.1V4.5a1 1 0 0 1 1-1ZM3.5 14.9h7.1V20a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-5.1Zm9.4-.9H20a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-6.1a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconMission(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.2 7.3a.8.8 0 0 1 0 1.1l-4.5 4.8a.8.8 0 0 1-1.1 0l-2.8-3a.8.8 0 0 1 1.1-1.1l2.3 2.4 3.9-4.2a.8.8 0 0 1 1.1 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconTeam(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M8.5 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm7 1a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM1.5 20a.9.9 0 0 1 .9-.9h12.2a.9.9 0 0 1 .9.9v.6a1.9 1.9 0 0 1-1.9 1.9H3.4a1.9 1.9 0 0 1-1.9-1.9v-.6Zm14.9-1.5c2.7.3 5 1 5.6 1.2a.7.7 0 0 1 .5.7v.2a1.9 1.9 0 0 1-1.9 1.9h-2.4a2.9 2.9 0 0 0 .4-1.6v-.6a2.5 2.5 0 0 0-.2-1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <IconBook width="26" height="26" />,
    title: 'Catálogo digital',
    text: 'Explorá, buscá y filtrá libros y recursos con una experiencia simple y rápida.',
  },
  {
    icon: <IconCalendar width="26" height="26" />,
    title: 'Turnero virtual',
    text: 'Reservá turnos de atención personalizada y gestioná tus visitas sin filas.',
  },
  {
    icon: <IconSpark width="26" height="26" />,
    title: 'Asistente con IA',
    text: 'Consultas rápidas por texto o voz para encontrar lo que necesitás.',
  },
  {
    icon: <IconDashboard width="26" height="26" />,
    title: 'Paneles a medida',
    text: 'Vistas personalizadas para usuarios y administradores, con avisos y novedades.',
  },
];

const STACK = [
  'React 19',
  'Vite 6',
  'Material UI',
  'React Router',
  'Node.js + Express',
  'EmailJS',
];

export default function AcercaDe() {
  return (
    <div className="acercade-overlay">
      <Header hideVozIA={true} />
      <main className="acercade-main">
        {/* Hero */}
        <section className="ad-hero" aria-label="Presentación">
          {DEMO_MODE && <span className="ad-badge">Demo interactiva</span>}
          <h1 className="acercade-titulo">
            Acerca de <span className="ad-brand">BiblioTech</span>
          </h1>
          <p className="acercade-texto ad-lead">
            BiblioTech es una plataforma inteligente para la gestión y el acceso
            a los recursos de la biblioteca, pensada para estudiantes, docentes
            y administradores.
          </p>
          <div className="ad-hero-actions">
            <Link to="/catalogo" className="ad-btn ad-btn-primary">
              Explorar catálogo
            </Link>
            <Link to="/contacto" className="ad-btn ad-btn-ghost">
              Contactanos
            </Link>
          </div>
        </section>

        {/* Misión */}
        <section className="acercade-section ad-mision" aria-label="Misión">
          <h2>
            <IconMission width="20" height="20" className="ad-h2-icon" aria-hidden="true" />
            Nuestra misión
          </h2>
          <p>
            Acercar la biblioteca a cada persona: digitalizar el acceso al
            conocimiento, simplificar los trámites presenciales y acompañar la
            lectura con herramientas modernas e inclusivas.
          </p>
        </section>

        {/* Features */}
        <section className="acercade-section" aria-label="Qué ofrece">
          <h2>¿Qué ofrece?</h2>
          <div className="ad-features">
            {FEATURES.map((f) => (
              <article key={f.title} className="ad-feature-card">
                <span className="ad-feature-icon" aria-hidden="true">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Stack */}
        <section className="acercade-section" aria-label="Stack tecnológico">
          <h2>Stack tecnológico</h2>
          <ul className="ad-stack">
            {STACK.map((tech) => (
              <li key={tech} className="ad-chip">
                {tech}
              </li>
            ))}
          </ul>
        </section>

        {/* Equipo + nota demo */}
        <section className="acercade-section ad-equipo" aria-label="Equipo">
          <h2>
            <IconTeam width="20" height="20" className="ad-h2-icon" aria-hidden="true" />
            Equipo de desarrollo
          </h2>
          <p>
            Proyecto realizado por estudiantes de la Facultad Regional San
            Francisco - UTN.
            <br />
            Año: 2025
          </p>
          {DEMO_MODE && (
            <p className="ad-demo-note">
              Estás viendo una versión de demostración: podés navegar el
              catálogo, simular reservas y turnos, y probar el asistente sin
              necesidad de una cuenta real.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
