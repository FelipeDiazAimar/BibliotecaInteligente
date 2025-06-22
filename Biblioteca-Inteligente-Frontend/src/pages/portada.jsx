import '../styles/portada.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Portada() {
  const navigate = useNavigate();

  return (
    <div className="overlay">
      <Navbar />
      <main className="portada-main">
        <div className="portada-header-wrap" style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div className="portada-logo-row" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            width: "100%",
            maxWidth: 700,
            margin: "0 auto"
          }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2196f3"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: 0, display: "block" }}
              >
                <path d="m16 6 4 14"></path>
                <path d="M12 6v14"></path>
                <path d="M8 8v12"></path>
                <path d="M4 4v16"></path>
              </svg>
            </span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <h1 style={{
                margin: 0,
                fontSize: "6.5rem",
                display: "block",
                textAlign: "left",
                minWidth: 0,
                lineHeight: 1.05
              }}>
                BiblioTech
              </h1>
            </div>
          </div>
          <div className="portada-subtitle-row" style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "0.5rem"
          }}>
            <h2 style={{
              margin: 0,
              fontWeight: 400,
              fontSize: "1.3rem",
              color: "#fff",
              letterSpacing: "0.2em",
              textAlign: "center"
            }}>
              {/* Puedes poner aquí un subtítulo si lo deseas */}
            </h2>
          </div>
        </div>
        <div className="portada-btn-row" style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "2.5rem"
        }}>
          <button className="portada-acceder-btn" onClick={() => navigate('/login')}>
            Acceder a la biblioteca
          </button>
        </div>
      </main>
      <footer>
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </div>
  );
}