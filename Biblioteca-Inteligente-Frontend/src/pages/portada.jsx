import '../styles/portada.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Portada() {
  const navigate = useNavigate();

  return (
    <div className="overlay">
      <Navbar />
      <main className="portada-main">
        <h1>BIBLIOTECA<br />INTELIGENTE</h1>
        <h2> </h2>
        <button onClick={() => navigate('/login')}>Acceder</button>
      </main>
      <footer>
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}