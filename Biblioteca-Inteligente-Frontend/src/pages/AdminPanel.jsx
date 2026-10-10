import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/AdminPanel.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminTabs from '../components/AdminTabs';
import AdminBookForm from '../components/AdminBookForm';
import { useUser } from '../context/UserContext';
import { DEMO_MODE, demoDelay } from '../lib/demo.js';
import { librosDemo } from '../data/demoLibros.js';

const STORAGE_KEY = 'biblio_demo_admin_libros';
const PAGE_SIZE = 8;
const API_BASE = 'http://localhost:3000/api/libros';

/* ---------- Iconos SVG inline (solo presentación) ---------- */
function IconPencil(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function IconEye(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="M9.9 4.24A9.5 9.5 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A16.8 16.8 0 0 0 2 12s3.5 8 10 8a9.9 9.9 0 0 0 5.39-1.61" />
      <path d="m2 2 20 20" />
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    </svg>
  );
}

function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" width="16" height="16" aria-hidden="true" focusable="false" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16" aria-hidden="true" focusable="false" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconWarn(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="30" height="30" aria-hidden="true" focusable="false" {...props}>
      <path d="m12 3 10 18H2Z" />
      <path d="M12 9v5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

function IconChevronLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* ---------- Normalización modelo demo ---------- */
function normalizarLibro(raw, indice = 0) {
  const r = raw || {};
  return {
    id: r.id ?? `demo-${indice + 1}`,
    titulo: r.titulo || 'Sin título',
    autor: r.autor || 'Anónimo',
    anio: r.anio ?? r.anioPublicacion ?? '',
    materia: r.materia || r.serie || '',
    descripcion: r.descripcion || r.observaciones || '',
    portada: typeof r.portada === 'string' ? r.portada : '',
    disponible: r.disponible !== false,
  };
}

function desdeBackend(b, indice = 0) {
  return normalizarLibro(
    {
      id: b.id,
      titulo: b.titulo,
      autor: b.autor,
      anio: b.anioPublicacion ?? b.anio,
      materia: b.serie || b.materia,
      descripcion: b.observaciones || b.descripcion,
      portada: b.portada,
      disponible: b.disponible,
    },
    indice,
  );
}

function haciaBackend(l) {
  return {
    titulo: l.titulo,
    autor: l.autor,
    anioPublicacion: l.anio === '' ? null : Number(l.anio),
    serie: l.materia || '',
    observaciones: l.descripcion || '',
    disponible: !!l.disponible,
    // Defaults para campos obligatorios del backend que el modelo demo no edita
    biblioteca: 'Demo',
    idioma: 'es',
    diasPrestamo: 7,
    nroInventario: `DEMO-${String(l.id).slice(-6)}`,
  };
}

function cargarInicial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((b, i) => normalizarLibro(b, i));
      }
    }
  } catch {
    /* localStorage ilegible: se usa la semilla */
  }
  const semilla = Array.isArray(librosDemo) ? librosDemo : [];
  return semilla.map((b, i) => normalizarLibro(b, i));
}

export default function AdminPanel({ usuario: usuarioProp, logout }) {
  const { usuario: usuarioCtx } = useUser();
  const usuario = usuarioProp || usuarioCtx || null;
  const esAdmin = usuario?.rol === 'admin';

  const [libros, setLibros] = useState(cargarInicial);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoLibro, setEditandoLibro] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'ok' | 'error', texto }
  const [saving, setSaving] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const timeoutRef = useRef(null);

  const avisar = (tipo, texto) => {
    setMensaje({ tipo, texto });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMensaje(null), 3000);
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  // Persistencia demo en localStorage
  useEffect(() => {
    if (!DEMO_MODE) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
    } catch {
      /* cuota llena o storage bloqueado: el estado en memoria sigue valiendo */
    }
  }, [libros]);

  // Modo real: carga inicial desde backend
  useEffect(() => {
    if (DEMO_MODE) return;
    let vivo = true;
    setCargando(true);
    fetch(API_BASE)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!vivo) return;
        setLibros((Array.isArray(data) ? data : []).map((b, i) => desdeBackend(b, i)));
      })
      .catch(() => {
        if (vivo) avisar('error', 'No se pudo cargar el catálogo del servidor.');
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard: en demo se permite entrar igual; en real solo admin (redirige a login).
  // NOTA: se evalúa después de todos los hooks para no romper las reglas de React.
  const bloqueado = !DEMO_MODE && !esAdmin;

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return libros;
    return libros.filter((l) =>
      [l.titulo, l.autor, l.materia]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [libros, busqueda]);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, libros.length]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const librosPagina = filtrados.slice((paginaSegura - 1) * PAGE_SIZE, paginaSegura * PAGE_SIZE);

  if (bloqueado) {
    return <Navigate to="/login" replace />;
  }

  const abrirCrear = () => {
    setEditandoLibro(null);
    setMostrarFormulario(true);
  };

  const abrirEditar = (libro) => {
    setEditandoLibro(libro);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditandoLibro(null);
  };

  const guardarLibro = async (valores) => {
    setSaving(true);
    try {
      if (DEMO_MODE) {
        await demoDelay();
        if (editandoLibro) {
          setLibros((prev) =>
            prev.map((l) => (String(l.id) === String(editandoLibro.id) ? { ...l, ...valores, id: l.id } : l)),
          );
          avisar('ok', 'Libro actualizado correctamente (demo local).');
        } else {
          const nuevo = { ...valores, id: `demo-${Date.now()}` };
          setLibros((prev) => [nuevo, ...prev]);
          avisar('ok', 'Libro agregado correctamente (demo local).');
        }
        cerrarFormulario();
        return;
      }
      // Modo real: persiste contra el backend
      const token = localStorage.getItem('token');
      const esEdicion = !!editandoLibro;
      const url = esEdicion ? `${API_BASE}/${editandoLibro.id}` : API_BASE;
      const res = await fetch(url, {
        method: esEdicion ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(haciaBackend({ ...valores, id: editandoLibro?.id || 'tmp' })),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const guardado = await res.json().catch(() => null);
      if (esEdicion) {
        setLibros((prev) =>
          prev.map((l) =>
            String(l.id) === String(editandoLibro.id)
              ? guardado ? desdeBackend(guardado, 0) : { ...l, ...valores }
              : l,
          ),
        );
        avisar('ok', 'Libro actualizado correctamente.');
      } else {
        setLibros((prev) => [
          guardado ? desdeBackend(guardado, 0) : { ...valores, id: `srv-${Date.now()}` },
          ...prev,
        ]);
        avisar('ok', 'Libro agregado correctamente.');
      }
      cerrarFormulario();
    } catch {
      avisar('error', 'Error al guardar el libro. Revisá los datos e intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const pedirEliminar = (libro) => setConfirmarEliminar(libro);
  const cancelarEliminar = () => setConfirmarEliminar(null);

  const confirmarEliminarLibro = async () => {
    if (!confirmarEliminar) return;
    const id = confirmarEliminar.id;
    setSaving(true);
    try {
      if (DEMO_MODE) {
        await demoDelay();
        setLibros((prev) => prev.filter((l) => String(l.id) !== String(id)));
        avisar('ok', 'Libro eliminado (demo local).');
      } else {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE',
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setLibros((prev) => prev.filter((l) => String(l.id) !== String(id)));
        avisar('ok', 'Libro eliminado.');
      }
    } catch {
      avisar('error', 'Error al eliminar el libro.');
    } finally {
      setSaving(false);
      setConfirmarEliminar(null);
    }
  };

  const alternarDisponible = async (libro) => {
    const next = !libro.disponible;
    try {
      if (DEMO_MODE) {
        await demoDelay(150);
        setLibros((prev) =>
          prev.map((l) => (String(l.id) === String(libro.id) ? { ...l, disponible: next } : l)),
        );
        avisar('ok', next ? 'Libro marcado como disponible.' : 'Libro marcado como no disponible.');
        return;
      }
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/${libro.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(haciaBackend({ ...libro, disponible: next })),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLibros((prev) =>
        prev.map((l) => (String(l.id) === String(libro.id) ? { ...l, disponible: next } : l)),
      );
      avisar('ok', 'Disponibilidad actualizada.');
    } catch {
      avisar('error', 'No se pudo cambiar la disponibilidad.');
    }
  };

  return (
    <>
      <Header onLogout={logout} />
      <div style={{ height: 110 }} />
      <div className="admin-panel-container">
        <main className="admin-main">
          {DEMO_MODE && (
            <p className="admin-demo-banner" role="status">
              Modo demo — cambios locales, no se guardan en servidor
            </p>
          )}

          <div className="panel-user-card">
            <div className="panel-user-avatar" aria-hidden="true">
              <svg width="38" height="38" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </div>
            <div>
              <div className="panel-user-name">{usuario?.nombre || 'Demo Admin'}</div>
              <div className="admin-rol-label">Administrador</div>
            </div>
          </div>

          <AdminTabs />

          <div className="admin-toolbar">
            <form
              className="admin-busqueda-form"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <span className="admin-search-icon" aria-hidden="true">
                <IconSearch />
              </span>
              <input
                type="search"
                className="admin-busqueda-input"
                placeholder="Buscar por título, autor o materia…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar libros"
              />
              {busqueda && (
                <button
                  type="button"
                  className="admin-busqueda-btn limpiar"
                  onClick={() => setBusqueda('')}
                  title="Limpiar búsqueda"
                  aria-label="Limpiar búsqueda"
                >
                  <IconX /> Limpiar
                </button>
              )}
            </form>
            <button type="button" className="admin-form-toggle" onClick={abrirCrear} title="Agregar un libro nuevo">
              <IconPlus /> Agregar libro
            </button>
          </div>

          {mensaje && (
            <p className={`admin-msg admin-msg-${mensaje.tipo}`} role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
              {mensaje.texto}
            </p>
          )}

          {mostrarFormulario && (
            <section className="admin-form-container" aria-label={editandoLibro ? 'Editar libro' : 'Nuevo libro'}>
              <h2 className="admin-section-title">
                {editandoLibro ? `Editar: ${editandoLibro.titulo}` : 'Nuevo libro'}
              </h2>
              <AdminBookForm
                initialValue={editandoLibro}
                onSubmit={guardarLibro}
                onCancel={cerrarFormulario}
                saving={saving}
              />
            </section>
          )}

          <h2 className="admin-section-title">
            Lista de Libros{' '}
            <span className="admin-count" aria-label={`${filtrados.length} libros`}>
              ({filtrados.length})
            </span>
          </h2>

          {cargando ? (
            <p className="admin-msg" role="status">Cargando libros…</p>
          ) : filtrados.length === 0 ? (
            <p className="admin-empty" role="status">
              {libros.length === 0
                ? 'No hay libros cargados. Agregá el primero con “Agregar libro”.'
                : 'Sin resultados para esa búsqueda.'}
            </p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Portada</th>
                    <th scope="col">Título</th>
                    <th scope="col">Autor</th>
                    <th scope="col">Año</th>
                    <th scope="col">Materia</th>
                    <th scope="col">Estado</th>
                    <th scope="col">
                      <span className="admin-th-acciones">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {librosPagina.map((libro) => (
                    <tr key={libro.id}>
                      <td data-label="Portada">
                        {libro.portada && /^https?:\/\//i.test(libro.portada) ? (
                          <img
                            className="admin-table-thumb"
                            src={libro.portada}
                            alt={`Portada de ${libro.titulo}`}
                            loading="lazy"
                          />
                        ) : (
                          <span className="admin-table-sinportada" aria-label="Sin portada">—</span>
                        )}
                      </td>
                      <td data-label="Título" className="admin-cell-titulo">{libro.titulo}</td>
                      <td data-label="Autor">{libro.autor}</td>
                      <td data-label="Año">{libro.anio === '' ? '—' : libro.anio}</td>
                      <td data-label="Materia">{libro.materia || '—'}</td>
                      <td data-label="Estado">
                        <span className={`admin-badge ${libro.disponible ? 'admin-badge-ok' : 'admin-badge-muted'}`}>
                          {libro.disponible ? 'Disponible' : 'No disponible'}
                        </span>
                      </td>
                      <td data-label="Acciones">
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn-edit"
                            onClick={() => abrirEditar(libro)}
                            title={`Editar “${libro.titulo}”`}
                            aria-label={`Editar ${libro.titulo}`}
                          >
                            <IconPencil />
                            <span className="admin-icon-btn-text">Editar</span>
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn-toggle"
                            onClick={() => alternarDisponible(libro)}
                            aria-pressed={!!libro.disponible}
                            title={libro.disponible ? `Ocultar “${libro.titulo}”` : `Publicar “${libro.titulo}”`}
                            aria-label={libro.disponible ? `Marcar no disponible: ${libro.titulo}` : `Marcar disponible: ${libro.titulo}`}
                          >
                            {libro.disponible ? <IconEyeOff /> : <IconEye />}
                            <span className="admin-icon-btn-text">{libro.disponible ? 'Ocultar' : 'Publicar'}</span>
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn-danger"
                            onClick={() => pedirEliminar(libro)}
                            title={`Eliminar “${libro.titulo}”`}
                            aria-label={`Eliminar ${libro.titulo}`}
                          >
                            <IconTrash />
                            <span className="admin-icon-btn-text">Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPaginas > 1 && (
            <div className="admin-pagination" role="navigation" aria-label="Paginación de libros">
              <button
                type="button"
                disabled={paginaSegura === 1}
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                title="Página anterior"
                aria-label="Página anterior"
              >
                <IconChevronLeft /> Anterior
              </button>
              <span aria-live="polite">
                Página {paginaSegura} de {totalPaginas}
              </span>
              <button
                type="button"
                disabled={paginaSegura === totalPaginas}
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                title="Página siguiente"
                aria-label="Página siguiente"
              >
                Siguiente <IconChevronRight />
              </button>
            </div>
          )}

          <p className="admin-back-link">
            <Link to="/admin-turnos">Ir a gestión de turnos →</Link>
          </p>
        </main>
        <Footer />
      </div>

      {confirmarEliminar && (
        <div
          className="admin-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar eliminación"
          onClick={cancelarEliminar}
        >
          <div className="admin-confirm-box" onClick={(e) => e.stopPropagation()}>
            <span className="admin-confirm-icon" aria-hidden="true">
              <IconWarn />
            </span>
            <h3>Eliminar libro</h3>
            <p>
              ¿Seguro que deseas eliminar <strong>“{confirmarEliminar.titulo}”</strong>?
              {DEMO_MODE && ' (solo demo local)'}
            </p>
            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn-danger admin-confirm-btn"
                onClick={confirmarEliminarLibro}
                disabled={saving}
                title="Confirmar eliminación"
                aria-label={`Confirmar eliminación de ${confirmarEliminar.titulo}`}
              >
                <IconTrash />
                {saving ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
              <button
                type="button"
                className="admin-btn-secondary admin-confirm-btn"
                onClick={cancelarEliminar}
                disabled={saving}
                title="Cancelar y volver"
                aria-label="Cancelar eliminación"
              >
                <IconX /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
