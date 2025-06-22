import '../styles/AcercaDe.css';
import Header from '../components/Header.jsx';

export default function AcercaDe() {
  return (
    <div className="acercade-overlay">
      <Header hideVozIA={true} />
      <main className="acercade-main" style={{ alignItems: 'center', textAlign: 'center' }}>
        <h1 className="acercade-titulo" style={{ textAlign: 'center', width: '100%' }}>
          Acerca de <span style={{ color: '#2196f3' }}>BiblioTech</span>
        </h1>
        <p className="acercade-texto" style={{ maxWidth: 600, margin: '0 auto 2.5rem auto' }}>
          BiblioTech es una plataforma inteligente para la gestión y acceso a recursos de biblioteca, desarrollada para facilitar la experiencia de estudiantes, docentes y administradores.
        </p>
        <section className="acercade-section" style={{ maxWidth: 500, margin: '0 auto 2.5rem auto' }}>
          <h2 style={{ textAlign: 'center' }}>¿Qué ofrece?</h2>
          <ul style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto' }}>
            <li>Catálogo digital de libros y recursos.</li>
            <li>Reserva y gestión de turnos para la biblioteca.</li>
            <li>Asistente virtual con IA para consultas rápidas.</li>
            <li>Paneles personalizados para usuarios y administradores.</li>
          </ul>
        </section>
        <section className="acercade-section" style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center' }}>Equipo de desarrollo</h2>
          <p>
            Proyecto realizado por estudiantes de la Facultad Regional San Francisco - UTN.<br />
            Año: 2025
          </p>
        </section>
      </main>
      <footer className="acercade-footer" style={{ marginTop: 32 }}>
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}