import { useState } from 'react';

export default function LibroForm({ onLibroAgregado }) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anioPublicacion, setAnioPublicacion] = useState('');
  const [materia, setMateria] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Guarda el token JWT aquí después de login
    const res = await fetch('http://localhost:3000/api/libros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({
        titulo,
        autor,
        anioPublicacion: parseInt(anioPublicacion),
        materia
      })
    });
    if (!res.ok) {
      const error = await res.json();
      alert('Error al agregar libro: ' + (error.error || res.statusText));
      return;
    }
    setTitulo('');
    setAutor('');
    setAnioPublicacion('');
    setMateria('');
    if (onLibroAgregado) onLibroAgregado();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" required />
      <input value={autor} onChange={e => setAutor(e.target.value)} placeholder="Autor" required />
      <input value={anioPublicacion} onChange={e => setAnioPublicacion(e.target.value)} placeholder="Año de publicación" type="number" required />
      <input value={materia} onChange={e => setMateria(e.target.value)} placeholder="Materia" />
      <button type="submit">Agregar libro</button>
    </form>
  );
}
