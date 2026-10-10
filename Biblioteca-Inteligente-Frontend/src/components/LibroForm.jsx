import { useEffect, useState } from 'react';
import { DEMO_MODE, mensajeErrorAmable } from '../lib/demo.js';

export const MATERIAS = [
  'Matemática',
  'Lengua',
  'Historia',
  'Biología',
  'Física',
  'Química',
  'Programación',
  'Inglés',
];

const VACIO = {
  titulo: '',
  autor: '',
  anio: '',
  materia: '',
  descripcion: '',
  portada: '',
  disponible: true,
};

function esUrlValida(valor) {
  if (!valor) return true;
  try {
    const url = new URL(valor);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validarLibro({ titulo, autor, anio, materia, descripcion, portada }) {
  const errores = {};
  if (!titulo || titulo.trim().length < 2) {
    errores.titulo = 'El título es obligatorio (mínimo 2 caracteres).';
  }
  if (!autor || autor.trim().length < 2) {
    errores.autor = 'El autor es obligatorio (mínimo 2 caracteres).';
  }
  if (!materia) {
    errores.materia = 'Elegí una materia.';
  } else if (!MATERIAS.includes(materia)) {
    errores.materia = 'Materia inválida.';
  }
  if (anio !== '' && anio !== null && anio !== undefined) {
    const n = Number(anio);
    const actual = new Date().getFullYear();
    if (!Number.isInteger(n) || n < 1000 || n > actual) {
      errores.anio = `El año debe ser un número entre 1000 y ${actual}.`;
    }
  }
  if (descripcion && descripcion.length > 1000) {
    errores.descripcion = 'La descripción no puede superar los 1000 caracteres.';
  }
  if (portada && !esUrlValida(portada.trim())) {
    errores.portada = 'La portada debe ser una URL válida (http/https) o estar vacía.';
  }
  return errores;
}

// Formulario crear/editar con el esquema demo:
// { id, titulo, autor, anio, materia, descripcion, portada, disponible }
// - En DEMO_MODE: valida y devuelve el objeto por `onSubmit` (sin fetch).
// - En modo real: si recibe `onSubmit`, delega el guardado a la página;
//   si no hay handler, conserva el POST legacy al backend.
export default function LibroForm({
  initialValue = null,
  onSubmit = null,
  onLibroAgregado = null,
  onCancel = null,
  submitLabel = null,
}) {
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');

  const esEdicion = Boolean(initialValue?.id);

  useEffect(() => {
    if (initialValue) {
      setForm({
        titulo: initialValue.titulo ?? '',
        autor: initialValue.autor ?? '',
        anio: initialValue.anio ?? initialValue.anioPublicacion ?? '',
        materia: initialValue.materia ?? '',
        descripcion: initialValue.descripcion ?? '',
        portada: typeof initialValue.portada === 'string' ? initialValue.portada : '',
        disponible: initialValue.disponible ?? true,
      });
    } else {
      setForm(VACIO);
    }
    setErrores({});
    setErrorEnvio('');
  }, [initialValue?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const construirObjeto = () => ({
    id: initialValue?.id ?? Date.now(),
    titulo: form.titulo.trim(),
    autor: form.autor.trim(),
    anio: form.anio === '' ? '' : Number(form.anio),
    materia: form.materia,
    descripcion: form.descripcion.trim(),
    portada: form.portada.trim(),
    disponible: Boolean(form.disponible),
  });

  const guardarLegacy = async (libro) => {
    // POST legacy al backend (modo real sin handler): mapea esquema demo → API.
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('titulo', libro.titulo);
    data.append('autor', libro.autor);
    if (libro.anio !== '') data.append('anioPublicacion', String(libro.anio));
    data.append('disponible', String(libro.disponible));
    const res = await fetch('http://localhost:3000/api/libros', {
      method: 'POST',
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: data,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || res.statusText);
    }
    return res.json().catch(() => libro);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorEnvio('');
    const fallos = validarLibro(form);
    setErrores(fallos);
    if (Object.keys(fallos).length > 0) return;

    const libro = construirObjeto();
    const delegar = typeof onSubmit === 'function' || typeof onLibroAgregado === 'function';

    if (DEMO_MODE || delegar) {
      // En demo (o con página que guarda): solo devolver el objeto validado.
      if (typeof onSubmit === 'function') await onSubmit(libro);
      if (typeof onLibroAgregado === 'function') await onLibroAgregado(libro);
      if (!esEdicion) {
        setForm(VACIO);
        setErrores({});
      }
      return;
    }

    // Sin handler y en modo real: POST legacy para no romper el flujo anterior.
    setGuardando(true);
    try {
      const creado = await guardarLegacy(libro);
      setForm(VACIO);
      setErrores({});
      void creado;
    } catch (err) {
      setErrorEnvio(mensajeErrorAmable(err.message, 'No se pudo agregar el libro. Revisá los datos.'));
    } finally {
      setGuardando(false);
    }
  };

  // Sugerencias de materias presentes en la demo (solo lectura, sin editar el módulo).
  const materiasDisponibles = MATERIAS;

  return (
    <form className="libro-form" onSubmit={handleSubmit} noValidate aria-label={esEdicion ? 'Editar libro' : 'Agregar libro'}>
      <div className="libro-form-campo">
        <label htmlFor="lf-titulo">Título *</label>
        <input
          id="lf-titulo"
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          placeholder="Título del libro"
          aria-invalid={Boolean(errores.titulo)}
          aria-describedby={errores.titulo ? 'lf-titulo-error' : undefined}
          className={errores.titulo ? 'is-invalido' : ''}
          autoComplete="off"
        />
        {errores.titulo && <span id="lf-titulo-error" className="libro-form-error" role="alert">⚠ {errores.titulo}</span>}
      </div>

      <div className="libro-form-campo">
        <label htmlFor="lf-autor">Autor *</label>
        <input
          id="lf-autor"
          name="autor"
          value={form.autor}
          onChange={handleChange}
          placeholder="Autor del libro"
          aria-invalid={Boolean(errores.autor)}
          aria-describedby={errores.autor ? 'lf-autor-error' : undefined}
          className={errores.autor ? 'is-invalido' : ''}
          autoComplete="off"
        />
        {errores.autor && <span id="lf-autor-error" className="libro-form-error" role="alert">⚠ {errores.autor}</span>}
      </div>

      <div className="libro-form-fila">
        <div className="libro-form-campo">
          <label htmlFor="lf-anio">Año</label>
          <input
            id="lf-anio"
            name="anio"
            type="number"
            value={form.anio}
            onChange={handleChange}
            placeholder="Ej: 2021"
            aria-invalid={Boolean(errores.anio)}
            aria-describedby={errores.anio ? 'lf-anio-error' : undefined}
            className={errores.anio ? 'is-invalido' : ''}
          />
          {errores.anio && <span id="lf-anio-error" className="libro-form-error" role="alert">⚠ {errores.anio}</span>}
        </div>

        <div className="libro-form-campo">
          <label htmlFor="lf-materia">Materia *</label>
          <select
            id="lf-materia"
            name="materia"
            value={form.materia}
            onChange={handleChange}
            aria-invalid={Boolean(errores.materia)}
            aria-describedby={errores.materia ? 'lf-materia-error' : undefined}
            className={errores.materia ? 'is-invalido' : ''}
          >
            <option value="">Seleccionar…</option>
            {materiasDisponibles.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errores.materia && <span id="lf-materia-error" className="libro-form-error" role="alert">⚠ {errores.materia}</span>}
        </div>
      </div>

      <div className="libro-form-campo">
        <label htmlFor="lf-descripcion">Descripción</label>
        <textarea
          id="lf-descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Breve descripción del libro"
          rows={3}
          maxLength={1000}
          aria-invalid={Boolean(errores.descripcion)}
          aria-describedby={errores.descripcion ? 'lf-descripcion-error' : 'lf-descripcion-ayuda'}
          className={errores.descripcion ? 'is-invalido' : ''}
        />
        <span id="lf-descripcion-ayuda" className="libro-form-ayuda">
          {(form.descripcion || '').length}/1000 caracteres
        </span>
        {errores.descripcion && <span id="lf-descripcion-error" className="libro-form-error" role="alert">⚠ {errores.descripcion}</span>}
      </div>

      <div className="libro-form-campo">
        <label htmlFor="lf-portada">Portada (URL)</label>
        <input
          id="lf-portada"
          name="portada"
          value={form.portada}
          onChange={handleChange}
          placeholder="https://… (vacío = sin portada)"
          inputMode="url"
          autoComplete="off"
          aria-invalid={Boolean(errores.portada)}
          aria-describedby={errores.portada ? 'lf-portada-error' : undefined}
          className={errores.portada ? 'is-invalido' : ''}
        />
        {errores.portada && <span id="lf-portada-error" className="libro-form-error" role="alert">⚠ {errores.portada}</span>}
      </div>

      <label className="libro-form-check">
        <input
          name="disponible"
          type="checkbox"
          checked={form.disponible}
          onChange={handleChange}
        />
        Disponible para préstamo
      </label>

      {errorEnvio && <p className="libro-form-error libro-form-error-envio" role="alert">⚠ {errorEnvio}</p>}

      <div className="libro-form-acciones">
        <button type="submit" disabled={guardando} className="libro-form-btn-primario">
          {guardando ? 'Guardando…' : (submitLabel ?? (esEdicion ? 'Guardar cambios' : 'Agregar libro'))}
        </button>
        {typeof onCancel === 'function' && (
          <button type="button" onClick={onCancel} className="libro-form-btn-secundario">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
