import '../styles/AcercaDe.css';
import Navbar from '../components/Navbar';

export default function AcercaDe() {
  return (
    <div className="acercade-overlay">
      <Navbar />
      <main className="acercade-main">
        <h1 className="acercade-titulo">Acerca de BiblioTech</h1>
        <p className="acercade-texto">
          BiblioTech es una plataforma inteligente para la gestión y acceso a recursos de biblioteca, desarrollada para facilitar la experiencia de estudiantes, docentes y administradores.
        </p>
        <section className="acercade-section">
          <h2>¿Qué ofrece?</h2>
          <ul>
            <li>Catálogo digital de libros y recursos.</li>
            <li>Reserva y gestión de turnos para la biblioteca.</li>
            <li>Asistente virtual con IA para consultas rápidas.</li>
            <li>Paneles personalizados para usuarios y administradores.</li>
          </ul>
        </section>
        <section className="acercade-section">
          <h2>Equipo de desarrollo</h2>
          <p>
            Proyecto realizado por estudiantes de la Facultad Regional Rosario - UTN.<br />
            Año: 2025
          </p>
        </section>
      </main>
      <footer className="acercade-footer">
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}