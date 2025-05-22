import { useState } from 'react';

export default function LibroForm({ onLibroAgregado }) {
  const [form, setForm] = useState({
    nroInventario: '',
    biblioteca: '',
    signaturaTopografica: '',
    titulo: '',
    subtitulo: '',
    autor: '',
    editorial: '',
    edicion: '',
    lugar: '',
    anioPublicacion: '',
    paginas: '',
    isbn: '',
    serie: '',
    fechaIngreso: '',
    observaciones: '',
    idioma: '',
    diasPrestamo: '',
    disponible: true,
    portada: null
  });

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox'
        ? checked
        : type === 'file'
        ? files[0]
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) data.append(key, value);
    });
    data.set('anioPublicacion', form.anioPublicacion || '');
    data.set('paginas', form.paginas || '');

    const res = await fetch('http://localhost:3000/api/libros', {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: data
    });
    if (!res.ok) {
      const error = await res.json();
      alert('Error al agregar libro: ' + (error.error || res.statusText));
      return;
    }
    setForm({
      nroInventario: '',
      biblioteca: '',
      signaturaTopografica: '',
      titulo: '',
      subtitulo: '',
      autor: '',
      editorial: '',
      edicion: '',
      lugar: '',
      anioPublicacion: '',
      paginas: '',
      isbn: '',
      serie: '',
      fechaIngreso: '',
      observaciones: '',
      idioma: '',
      diasPrestamo: '',
      disponible: true,
      portada: null
    });
    if (onLibroAgregado) onLibroAgregado();
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input name="nroInventario" value={form.nroInventario} onChange={handleChange} placeholder="Nro Inventario" required />
      <input name="biblioteca" value={form.biblioteca} onChange={handleChange} placeholder="Biblioteca" required />
      <input name="signaturaTopografica" value={form.signaturaTopografica} onChange={handleChange} placeholder="Signatura Topográfica" required />
      <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" required />
      <input name="subtitulo" value={form.subtitulo} onChange={handleChange} placeholder="SubTítulo" />
      <input name="autor" value={form.autor} onChange={handleChange} placeholder="Autores" required />
      <input name="editorial" value={form.editorial} onChange={handleChange} placeholder="Editorial" />
      <input name="edicion" value={form.edicion} onChange={handleChange} placeholder="Edición" />
      <input name="lugar" value={form.lugar} onChange={handleChange} placeholder="Lugar" />
      <input name="anioPublicacion" value={form.anioPublicacion} onChange={handleChange} placeholder="Año" type="number" />
      <input name="paginas" value={form.paginas} onChange={handleChange} placeholder="Páginas" type="number" />
      <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN" />
      <input name="serie" value={form.serie} onChange={handleChange} placeholder="Serie" />
      <input name="fechaIngreso" value={form.fechaIngreso} onChange={handleChange} placeholder="Fecha de Ingreso" type="date" />
      <input name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones" />
      <input name="idioma" value={form.idioma} onChange={handleChange} placeholder="Idioma" required />
      <input name="diasPrestamo" value={form.diasPrestamo} onChange={handleChange} placeholder="Días Préstamo" required />
      <label>
        Disponible
        <input name="disponible" type="checkbox" checked={form.disponible} onChange={handleChange} />
      </label>
      <input
        name="portada"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleChange}
      />
      <button type="submit">Agregar libro</button>
    </form>
  );
}
