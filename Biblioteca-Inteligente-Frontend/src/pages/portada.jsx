import '../styles/portada.css';
import Navbar from '../components/Navbar';

export default function Portada({ onAcceder }) {
  return (
    <div className="overlay">
      <Navbar />
      <main>
        <h1>BIBLIOTECA<br />INTELIGENTE</h1>
        <h2>UTN</h2>
        <button onClick={onAcceder}>Acceder</button>
      </main>
      <footer>
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}