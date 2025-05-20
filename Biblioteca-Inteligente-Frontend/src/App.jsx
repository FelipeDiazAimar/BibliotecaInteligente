import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Portada from './pages/portada.jsx'


// Componente principal de la aplicación
function App() {
  // Estado para contar clics en el botón (solo de ejemplo)
  const [count, setCount] = useState(0)
  // Estado para guardar la lista de libros que trae el backend
  const [libros, setLibros] = useState([])
  const [mostrarPortada, setMostrarPortada] = useState(true)

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
      {/* Lista de libros traídos del backend */}
      <div>
        <h1>Lista de Libros</h1>
        <ul>
          {/* Por cada libro, muestra un elemento de la lista */}
          {libros.map(libro => (
            <li key={libro.id}>
              {libro.titulo} - {libro.autor}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
