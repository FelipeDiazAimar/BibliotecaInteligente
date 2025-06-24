import '../styles/Loader.css';
import { useUser } from '../context/UserContext';

export default function Loader() {
  const { usuario, setUsuario } = useUser();

  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
      <div className="loader-text">Cargando...</div>
    </div>
  );
}