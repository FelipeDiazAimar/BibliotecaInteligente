import React, { useEffect, useState } from 'react';

const ANIO_MAX = new Date().getFullYear();

const VACIO = {
  titulo: '',
  autor: '',
  anio: '',
  materia: '',
  descripcion: '',
  portada: '',
  disponible: true,
};

function esPortadaValida(valor) {
  if (!valor) return true;
  const v = valor.trim();
  if (!v) return true;
  return (
    /^https?:\/\/.+/i.test(v) ||
    v.startsWith('/') ||
    v.startsWith('data:image')
  );
}

function validar(valores) {
  const errores = {};
  const titulo = (valores.titulo || '').trim();
  const autor = (valores.autor || '').trim();
  const materia = (valores.materia || '').trim();
  const descripcion = (valores.descripcion || '').trim();
  const portada = (valores.portada || '').trim();
  const anioRaw = String(valores.anio ?? '').trim();

  if (!titulo) errores.titulo = 'El título es obligatorio.';
  else if (titulo.length < 2) errores.titulo = 'El título debe tener al menos 2 caracteres.';

  if (!autor) errores.autor = 'El autor es obligatorio.';
  else if (autor.length < 2) errores.autor = 'El autor debe tener al menos 2 caracteres.';

  if (anioRaw) {
    const anio = Number(anioRaw);
    if (!Number.isInteger(anio) || anio < 1000 || anio > ANIO_MAX) {
      errores.anio = `El año debe ser un entero entre 1000 y ${ANIO_MAX}.`;
    }
  }

  if (materia && materia.length < 2) errores.materia = 'La materia debe tener al menos 2 caracteres.';
  if (descripcion && descripcion.length > 1000) {
    errores.descripcion = 'La descripción no puede superar los 1000 caracteres.';
  }
  if (!esPortadaValida(portada)) {
    errores.portada = 'La portada debe ser una URL http(s), una ruta /... o un data:image.';
  }

  return errores;
}

function IconCheckBtn(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true" focusable="false" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconPlusBtn(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" width="16" height="16" aria-hidden="true" focusable="false" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconXBtn(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconPencilBtn(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

/**
 * Formulario controlado de alta/edición de libros (modelo demo).
 * Props: { initialValue, onSubmit(values), onCancel, saving }
 * No toca backend ni localStorage: solo valida y devuelve valores.
 */
export default function AdminBookForm({ initialValue, onSubmit, onCancel, saving = false }) {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [intentoEnviar, setIntentoEnviar] = useState(false);

  useEffect(() => {
    setValores({
      titulo: initialValue?.titulo || '',
      autor: initialValue?.autor || '',
      anio: initialValue?.anio ?? '',
      materia: initialValue?.materia || '',
      descripcion: initialValue?.descripcion || '',
      portada: initialValue?.portada || '',
      disponible: initialValue?.disponible !== false,
    });
    setErrores({});
    setIntentoEnviar(false);
  }, [initialValue]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = {
      ...valores,
      [name]: type === 'checkbox' ? checked : value,
    };
    setValores(next);
    if (intentoEnviar) setErrores(validar(next));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar(valores);
    setErrores(errs);
    setIntentoEnviar(true);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      titulo: valores.titulo.trim(),
      autor: valores.autor.trim(),
      anio: String(valores.anio ?? '').trim() === '' ? '' : Number(valores.anio),
      materia: (valores.materia || '').trim(),
      descripcion: (valores.descripcion || '').trim(),
      portada: (valores.portada || '').trim(),
      disponible: !!valores.disponible,
    });
  };

  const descripcionCount = (valores.descripcion || '').length;

  const campo = (nombre, etiqueta, propsInput) => (
    <div className="admin-field" key={nombre}>
      <label className="admin-label" htmlFor={`admin-book-${nombre}`}>
        {etiqueta}
        {['titulo', 'autor'].includes(nombre) && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={`admin-book-${nombre}`}
        name={nombre}
        className={`admin-input${errores[nombre] ? ' admin-input-error' : ''}`}
        aria-invalid={!!errores[nombre]}
        aria-describedby={errores[nombre] ? `admin-book-${nombre}-error` : undefined}
        value={valores[nombre]}
        onChange={handleChange}
        disabled={saving}
        {...propsInput}
      />
      {errores[nombre] && (
        <p className="admin-field-error" id={`admin-book-${nombre}-error`} role="alert">
          {errores[nombre]}
        </p>
      )}
    </div>
  );

  return (
    <form className="admin-libro-form admin-bookform" onSubmit={handleSubmit} noValidate>
      <p className="admin-form-hint">Los campos marcados con * son obligatorios.</p>
      <div className="admin-form-grid">
        {campo('titulo', 'Título', { placeholder: 'Ej. Cien años de soledad', autoFocus: true, maxLength: 200, autoComplete: 'off' })}
        {campo('autor', 'Autor', { placeholder: 'Ej. Gabriel García Márquez', maxLength: 200, autoComplete: 'off' })}
        {campo('anio', 'Año', { placeholder: `Ej. ${ANIO_MAX - 5}`, type: 'number', min: 1000, max: ANIO_MAX, inputMode: 'numeric' })}
        {campo('materia', 'Materia', { placeholder: 'Ej. Literatura', maxLength: 120, autoComplete: 'off' })}
      </div>

      <div className="admin-field">
        <label className="admin-label" htmlFor="admin-book-descripcion">Descripción</label>
        <textarea
          id="admin-book-descripcion"
          name="descripcion"
          className={`admin-input admin-textarea${errores.descripcion ? ' admin-input-error' : ''}`}
          placeholder="Sinopsis breve del libro (máx. 1000 caracteres)"
          rows={3}
          maxLength={1000}
          value={valores.descripcion}
          onChange={handleChange}
          disabled={saving}
          aria-invalid={!!errores.descripcion}
          aria-describedby={errores.descripcion ? 'admin-book-descripcion-error admin-book-descripcion-count' : 'admin-book-descripcion-count'}
        />
        <span className="admin-field-hint" id="admin-book-descripcion-count" aria-live="polite">
          {descripcionCount}/1000 caracteres
        </span>
        {errores.descripcion && (
          <p className="admin-field-error" id="admin-book-descripcion-error" role="alert">
            {errores.descripcion}
          </p>
        )}
      </div>

      {campo('portada', 'Portada (URL)', { placeholder: 'https://... o /portadas/libro.jpg', type: 'url', maxLength: 500, autoComplete: 'off' })}

      <label className="admin-check-row" htmlFor="admin-book-disponible">
        <input
          id="admin-book-disponible"
          name="disponible"
          type="checkbox"
          checked={!!valores.disponible}
          onChange={handleChange}
          disabled={saving}
        />
        <span>Disponible para préstamo</span>
      </label>

      <div className="admin-form-actions">
        <button
          type="submit"
          className="admin-libro-btn admin-submit-btn"
          disabled={saving}
          title={initialValue ? 'Guardar cambios del libro' : 'Agregar libro al catálogo'}
        >
          {saving ? 'Guardando…' : initialValue ? (<><IconPencilBtn /> Actualizar libro</>) : (<><IconPlusBtn /> Agregar libro</>)}
        </button>
        {onCancel && (
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={onCancel}
            disabled={saving}
            title="Cancelar y cerrar el formulario"
            aria-label="Cancelar edición del libro"
          >
            <IconXBtn /> Cancelar
          </button>
        )}
      </div>
      {Object.keys(errores).length > 0 && intentoEnviar && (
        <p className="admin-field-error admin-form-global-error" role="alert">
          Revisá los campos marcados antes de guardar.
        </p>
      )}
    </form>
  );
}
