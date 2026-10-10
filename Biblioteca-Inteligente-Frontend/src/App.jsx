import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { DEMO_MODE, DEMO_USER, fetchConFallback } from './lib/demo.js'
import Portada from './pages/portada.jsx'
import LoginAlumno from './pages/LoginAlumno'
import RegistroUsuario from './pages/RegistroUsuario'
import AsistenteIA from './components/AsistenteIA'
import PanelUsuario from './pages/PanelUsuario'
import VozIA from './pages/VozIA'
import AdminPanel from './pages/AdminPanel';
import AdminPanelTurno from './pages/AdminPanelTurno'; // Asegúrate de importar el componente
import ContactPage from './pages/Contacto'
import CatalogoPage from './pages/CatalogoPage'
import Turno from './pages/Turno';
import BookDetail from './pages/BookDetail'; // Asegúrate de que la ruta sea correcta
import AcercaDe from './pages/AcercaDe';
import ScrollTop from './components/ScrollTop';
import { useUser } from './context/UserContext';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function App() {
  const { usuario, setUsuario } = useUser();
  const [libros, setLibros] = useState([])

  useEffect(() => {
    let vivo = true;
    fetchConFallback(`${API_BASE}/api/libros`, undefined, [])
      .then(data => { if (vivo) setLibros(Array.isArray(data) ? data : []); });
    return () => { vivo = false; };
  }, [])

  // Componente para proteger rutas que requieren autenticación.
  // Siempre se pasa primero por /login: sin sesión se redirige,
  // en modo demo y en modo real por igual.
  function RequireAuth({ usuario, children, adminOnly = false }) {
    if (!usuario) return <Navigate to="/login" replace />;
    if (adminOnly && usuario.rol !== 'admin') return <Navigate to="/login" replace />;
    return children;
  }

  // Función para login (puedes mejorarla si quieres)
  // Contrato R3 (key 'biblio_demo_closed'): no revivir demo tras un logout.
  function demoPermitido() {
    try {
      return localStorage.getItem('biblio_demo_closed') !== '1';
    } catch {
      return true;
    }
  }
  async function handleLogin() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      try {
        const data = await fetchConFallback(`${API_BASE}/api/usuarios/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }, null);
        if (data) {
          try { localStorage.removeItem('biblio_demo_closed'); } catch {}
          setUsuario(data); // data debe ser el usuario autenticado
        }
        else if (DEMO_MODE && demoPermitido()) setUsuario(DEMO_USER);
      } catch {
        if (DEMO_MODE && demoPermitido()) setUsuario(DEMO_USER);
      }
    } else if (DEMO_MODE && demoPermitido()) {
      setUsuario(DEMO_USER);
    }
  }

  async function logout() {
    try { localStorage.setItem('biblio_demo_closed', '1'); } catch {}
    try { localStorage.removeItem('biblio_demo_session'); } catch {}
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // Puedes mostrar un mensaje de error si quieres
      }
    }

    // Conserva solo las últimas 3 búsquedas en el historial del catálogo
    let ultimas3 = [];
    try {
      const busquedas = JSON.parse(localStorage.getItem('busquedasCatalogo') || '[]');
      ultimas3 = Array.isArray(busquedas) ? busquedas.slice(-3) : [];
    } catch {
      ultimas3 = [];
    }

    // Borra solo los datos de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('usuario');

    // Borra el historial completo del catálogo y restaura solo las últimas 3 búsquedas
    localStorage.removeItem('busquedasCatalogo');
    if (ultimas3.length > 0) {
      localStorage.setItem('busquedasCatalogo', JSON.stringify(ultimas3));
    }

    window.location.href = '/login';
  }

  useEffect(() => {
    // Contrato R3 (key 'biblio_demo_closed'): la sesión demo solo existe si
    // el usuario entró explícitamente (el contexto la restaura); aquí nunca
    // se crea ni se revive tras un logout.
    // Sin sesión previa no se crea ninguna: siempre se pasa por /login.
    // (La sesión explícita guardada en localStorage ya la restauró el
    // contexto en su init; aquí no se pisa para no borrarla.)
    if (DEMO_MODE && !localStorage.getItem('token') && !localStorage.getItem('userId')) {
      return;
    }
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      fetchConFallback(`${API_BASE}/api/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }, null)
        .then(data => setUsuario(data ?? (DEMO_MODE && demoPermitido() ? DEMO_USER : null)));
    } else if (!DEMO_MODE) {
      setUsuario(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portada />} />
        <Route path="/login" element={
          <LoginAlumno
            onLogin={handleLogin}
          />
        } />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="/contacto" element={<ContactPage usuario={usuario} />} />
        <Route path="/acerca" element={<AcercaDe />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route
          path="/turnos"
          element={
            <RequireAuth usuario={usuario}>
              <Turno usuario={usuario} logout={logout} />
            </RequireAuth>
          }
        />
        <Route
          path="/panel"
          element={
            <RequireAuth usuario={usuario}>
              <PanelUsuario usuario={usuario} logout={logout} />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth usuario={usuario} adminOnly={true}>
              <AdminPanel usuario={usuario} logout={logout} />
            </RequireAuth>
          }
        />
        <Route
          path="/admin-turnos"
          element={
            <RequireAuth usuario={usuario} adminOnly={true}>
              <AdminPanelTurno usuario={usuario} logout={logout} />
            </RequireAuth>
          }
        />
        <Route
          path="/voz-ia"
          element={<VozIA usuario={usuario} />}
        />
        {/* Página de libros pública (opcional, puedes quitarla si no la usas) */}
        <Route path="/libros" element={
          <div>
            <div style={{ margin: '2rem 0' }}>
              <button onClick={() => {}}>Agregar libro</button>
            </div>
            <AsistenteIA libros={libros} />
            <div>
              <h1>Lista de Libros</h1>
              <ul>
                {libros.map((libro, i) => (
                  <li key={libro.id ?? i} style={{marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem'}}>
                    <strong>Título:</strong> {libro.titulo}<br />
                    <strong>Subtítulo:</strong> {libro.subtitulo}<br />
                    <strong>Autor:</strong> {libro.autor}<br />
                    <strong>Editorial:</strong> {libro.editorial}<br />
                    <strong>Edición:</strong> {libro.edicion}<br />
                    <strong>Lugar:</strong> {libro.lugar}<br />
                    <strong>Año:</strong> {libro.anioPublicacion}<br />
                    <strong>Páginas:</strong> {libro.paginas}<br />
                    <strong>ISBN:</strong> {libro.isbn}<br />
                    <strong>Serie:</strong> {libro.serie}<br />
                    <strong>Fecha de Ingreso:</strong> {libro.fechaIngreso}<br />
                    <strong>Observaciones:</strong> {libro.observaciones}<br />
                    <strong>Idioma:</strong> {libro.idioma}<br />
                    <strong>Días Préstamo:</strong> {libro.diasPrestamo}<br />
                    <strong>Nro Inventario:</strong> {libro.nroInventario}<br />
                    <strong>Biblioteca:</strong> {libro.biblioteca}<br />
                    <strong>Signatura Topográfica:</strong> {libro.signaturaTopografica}<br />
                    <strong>Disponible:</strong> {libro.disponible ? 'Sí' : 'No'}<br />
                    {libro.portada && (
                      <div>
                        <strong>Portada:</strong><br />
                        <img
                          src={`${API_BASE}/api/libros/${libro.id}/portada`}
                          alt="Portada"
                          style={{maxWidth: '150px', maxHeight: '200px', border: '1px solid #888'}}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <footer className="catalogo-footer">
              © 2025 BiblioTech. Todos los derechos reservados.
            </footer>
          </div>
        } />
        <Route path="/libros/:id" element={<BookDetail />} />
      </Routes>
      <ScrollTop />
    </BrowserRouter>
  )
}

export default App
