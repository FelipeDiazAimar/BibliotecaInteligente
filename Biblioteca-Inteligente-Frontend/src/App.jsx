import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Portada from './pages/portada.jsx'
import LibroForm from './components/LibroForm' // Importa el formulario

// Componente principal de la aplicación
function App() {
  // Estado para contar clics en el botón (solo de ejemplo)
  const [count, setCount] = useState(0)
  // Estado para guardar la lista de libros que trae el backend
  const [libros, setLibros] = useState([])
  const [mostrarPortada, setMostrarPortada] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // useEffect se ejecuta una vez cuando se carga la página
  useEffect(() => {
    // Hace una petición al backend para traer los libros
    fetch('http://localhost:3000/api/libros')
      .then(res => res.json())      // Convierte la respuesta a JSON
      .then(data => setLibros(data))// Guarda los libros en el estado
      .catch(err => console.error(err)) // Si hay error, lo muestra en consola
  }, [])

  if (mostrarPortada) {
    return <Portada onAcceder={() => setMostrarPortada(false)} />
  }

  // Lo que se muestra en pantalla
  return (
    <>
      {/* Logos de Vite y React, solo decorativo */}
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {/* Botón de ejemplo para aumentar el contador */}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/* Botón para mostrar/ocultar el formulario de agregar libro */}
      <div>
        <button onClick={() => setMostrarFormulario(v => !v)}>
          {mostrarFormulario ? 'Cerrar formulario' : 'Agregar libro'}
        </button>
        {mostrarFormulario && (
          <LibroForm onLibroAgregado={() => {
            setMostrarFormulario(false)
            // Recarga la lista de libros después de agregar uno nuevo
            fetch('http://localhost:3000/api/libros')
              .then(res => res.json())
              .then(data => setLibros(data))
              .catch(err => console.error(err))
          }} />
        )}
      </div>
      {/* Lista de libros traídos del backend */}
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
              {/* Portada */}
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
    </>
  )
}

export default App
