import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Portada from './pages/portada.jsx'
import LibroForm from './components/LibroForm'
import LoginAlumno from './pages/LoginAlumno'
import RegistroUsuario from './pages/RegistroUsuario'
import AsistenteIA from './components/AsistenteIA'
import PanelUsuario from './pages/PanelUsuario'
import VozIA from './pages/VozIA'
import AdminPanel from './pages/AdminPanel'
import RutasProtegidas from './components/RutasProtegidas'
import Contacto from './pages/Contacto'

function App() {
  const [libros, setLibros] = useState([])
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/libros')
      .then(res => res.json())
      .then(data => setLibros(data))
      .catch(err => console.error(err))
  }, [])

  // Función para login (puedes mejorarla si quieres)
  async function handleLogin() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      const res = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuario(data);
    }
  }

  async function logout() {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    localStorage.removeItem('token');
    setUsuario(null);
  }

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
        <Route path="/contacto" element={<Contacto />} /> {/* <-- Agrega esta línea */}
        {/* Rutas protegidas */}
        <Route path="/*" element={
          <RutasProtegidas usuario={usuario} logout={logout} />
        } />
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
                {libros.map(libro => (
                  <li key={libro.id || Math.random()} style={{marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem'}}>
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
                          src={`http://localhost:3000/api/libros/${libro.id}/portada`}
                          alt="Portada"
                          style={{maxWidth: '150px', maxHeight: '200px', border: '1px solid #888'}}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App