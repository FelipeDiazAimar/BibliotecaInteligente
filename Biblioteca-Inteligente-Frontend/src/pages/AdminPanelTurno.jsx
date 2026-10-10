import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/AdminPanel.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminTabs from '../components/AdminTabs';
import { useUser } from '../context/UserContext';
import { DEMO_MODE, demoDelay } from '../lib/demo.js';

const STORAGE_KEY = 'biblio_demo_turnos';

const TURNOS_SEMILLA = [
  {
    id: 'turno-demo-1',
    fecha: '2026-10-13',
    horaInicio: '10:00',
    horaFin: '11:00',
    tematica: 'Club de lectura: ciencia ficción',
    area: 'Sala Silenciosa A',
    usuarioNombre: 'Lucía Fernández',
    dni: '40123456',
    estado: 'pendiente',
    observaciones: 'Traer credencial de biblioteca.',
  },
  {
    id: 'turno-demo-2',
    fecha: '2026-10-14',
    horaInicio: '15:00',
    horaFin: '16:30',
    tematica: 'Taller de escritura académica',
    area: 'Sala de Estudio 2',
    usuarioNombre: 'Martín Gómez',
    dni: '38987654',
    estado: 'confirmada',
    observaciones: 'Grupo de 4 integrantes.',
  },
  {
    id: 'turno-demo-3',
    fecha: '2026-10-15',
    horaInicio: '09:00',
    horaFin: '10:00',
    tematica: 'Préstamo interbibliotecario',
    area: 'Mostrador Central',
    usuarioNombre: 'Sofía Ramírez',
    dni: '41234567',
    estado: 'pendiente',
    observaciones: '',
  },
  {
    id: 'turno-demo-4',
    fecha: '2026-10-16',
    horaInicio: '18:00',
    horaFin: '19:00',
    tematica: 'Visita guiada para ingresantes',
    area: 'Hall Principal',
    usuarioNombre: 'Diego Torres',
    dni: '37654321',
    estado: 'cancelada',
    observaciones: 'Se reprograma por feriado.',
  },
  {
    id: 'turno-demo-5',
    fecha: '2026-10-17',
    horaInicio: '11:00',
    horaFin: '12:00',
    tematica: 'Uso de sala multimedia',
    area: 'Sala Multimedia',
    usuarioNombre: 'Camila Duarte',
    dni: '42345678',
    estado: 'confirmada',
    observaciones: 'Necesitan proyector.',
  },
];

const ESTADOS = ['pendiente', 'confirmada', 'cancelada'];

/* ---------- Iconos SVG inline (solo presentación) ---------- */
function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="M20 6 9 17l-5-5" />
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

function IconReopen(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true" focusable="false" {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
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

function IconWarn(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="30" height="30" aria-hidden="true" focusable="false" {...props}>
      <path d="m12 3 10 18H2Z" />
      <path d="M12 9v5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

function normalizarTurno(raw, indice = 0) {
  const r = raw || {};
  const estado = ESTADOS.includes(r.estado) ? r.estado : 'pendiente';
  return {
    id: r.id ?? `turno-demo-${indice + 1}`,
    fecha: r.fecha || '',
    horaInicio: r.horaInicio || r.hora_inicio || '',
    horaFin: r.horaFin || r.hora_fin || '',
    tematica: r.tematica || '',
    area: r.area || r.Sala?.nombre || '',
    usuarioNombre: r.usuarioNombre || r.Usuario?.nombre || 'Invitado',
    dni: r.dni || r.Usuario?.dni || '-',
    estado,
    observaciones: r.observaciones || '',
  };
}

function cargarInicial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((t, i) => normalizarTurno(t, i));
      }
    }
  } catch {
    /* storage ilegible: se usa la semilla */
  }
  return TURNOS_SEMILLA.map((t, i) => normalizarTurno(t, i));
}

function formatoFecha(fechaStr) {
  if (!fechaStr) return '—';
  const partes = fechaStr.split('-');
  if (partes.length !== 3) return fechaStr;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function AdminPanelTurno({ logout }) {
  const { usuario } = useUser();
  const esAdmin = usuario?.rol === 'admin';

  const [turnos, setTurnos] = useState(cargarInicial);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const timeoutRef = useRef(null);

  const avisar = (tipo, texto) => {
    setMensaje({ tipo, texto });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMensaje(null), 3000);
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(turnos));
    } catch {
      /* el estado en memoria sigue valiendo */
    }
  }, [turnos]);

  // Guard: en demo se permite entrar igual; en real solo admin (redirige a login).
  // NOTA: se evalúa después de todos los hooks para no romper las reglas de React.
  const bloqueado = !DEMO_MODE && !esAdmin;

  const resumen = useMemo(() => {
    const r = { pendiente: 0, confirmada: 0, cancelada: 0 };
    turnos.forEach((t) => {
      if (r[t.estado] !== undefined) r[t.estado] += 1;
    });
    return r;
  }, [turnos]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return turnos.filter((t) => {
      const coincideEstado = !filtroEstado || t.estado === filtroEstado;
      if (!coincideEstado) return false;
      if (!q) return true;
      return [t.tematica, t.area, t.usuarioNombre, t.dni]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [turnos, busqueda, filtroEstado]);

  if (bloqueado) {
    return <Navigate to="/login" replace />;
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    setProcesando(true);
    try {
      await demoDelay();
      setTurnos((prev) => prev.map((t) => (String(t.id) === String(id) ? { ...t, estado: nuevoEstado } : t)));
      avisar('ok', `Turno ${nuevoEstado === 'confirmada' ? 'confirmado' : nuevoEstado === 'cancelada' ? 'cancelado' : 'reabierto'} (demo local).`);
    } catch {
      avisar('error', 'No se pudo cambiar el estado del turno.');
    } finally {
      setProcesando(false);
    }
  };

  const eliminarTurno = async () => {
    if (!confirmarEliminar) return;
    const id = confirmarEliminar.id;
    setProcesando(true);
    try {
      await demoDelay();
      setTurnos((prev) => prev.filter((t) => String(t.id) !== String(id)));
      avisar('ok', 'Turno eliminado (demo local).');
    } catch {
      avisar('error', 'No se pudo eliminar el turno.');
    } finally {
      setProcesando(false);
      setConfirmarEliminar(null);
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
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M8 3v4M16 3v4M3 10h18" />
              </svg>
            </div>
            <div>
              <div className="panel-user-name">{usuario?.nombre || 'Demo Admin'}</div>
              <div className="admin-rol-label">Turnos · Administrador</div>
            </div>
          </div>

          <AdminTabs />

          <div className="admin-resumen" role="status" aria-label="Resumen de turnos">
            <span className="admin-badge admin-badge-warn">{resumen.pendiente} pendientes</span>
            <span className="admin-badge admin-badge-ok">{resumen.confirmada} confirmadas</span>
            <span className="admin-badge admin-badge-danger">{resumen.cancelada} canceladas</span>
          </div>

          <div className="admin-toolbar">
            <form className="admin-busqueda-form" role="search" onSubmit={(e) => e.preventDefault()}>
              <span className="admin-search-icon" aria-hidden="true">
                <IconSearch />
              </span>
              <input
                type="search"
                className="admin-busqueda-input"
                placeholder="Buscar por usuario, temática, área o DNI…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar turnos"
              />
              <select
                className="admin-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                aria-label="Filtrar por estado"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
              {(busqueda || filtroEstado) && (
                <button
                  type="button"
                  className="admin-busqueda-btn limpiar"
                  onClick={() => {
                    setBusqueda('');
                    setFiltroEstado('');
                  }}
                  title="Limpiar filtros"
                  aria-label="Limpiar filtros de turnos"
                >
                  <IconX /> Limpiar
                </button>
              )}
            </form>
          </div>

          {mensaje && (
            <p className={`admin-msg admin-msg-${mensaje.tipo}`} role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
              {mensaje.texto}
            </p>
          )}

          <h2 className="admin-section-title">
            Gestión de Turnos <span className="admin-count">({filtrados.length})</span>
          </h2>

          {filtrados.length === 0 ? (
            <p className="admin-empty" role="status">
              {turnos.length === 0
                ? 'No hay turnos cargados.'
                : 'Sin turnos para ese filtro.'}
            </p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Hora</th>
                    <th scope="col">Temática</th>
                    <th scope="col">Área</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Estado</th>
                    <th scope="col">
                      <span className="admin-th-acciones">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((t) => (
                    <tr key={t.id}>
                      <td data-label="Fecha">{formatoFecha(t.fecha)}</td>
                      <td data-label="Hora">
                        {t.horaInicio || '—'}{t.horaFin ? ` – ${t.horaFin}` : ''}
                      </td>
                      <td data-label="Temática" className="admin-cell-titulo">{t.tematica || '—'}</td>
                      <td data-label="Área">{t.area || '—'}</td>
                      <td data-label="Usuario">
                        {t.usuarioNombre}
                        <br />
                        <span className="admin-cell-sub">DNI: {t.dni}</span>
                      </td>
                      <td data-label="Estado">
                        <span className={`admin-badge admin-badge-${t.estado}`}>
                          {t.estado === 'pendiente'
                            ? 'Pendiente'
                            : t.estado === 'confirmada'
                              ? 'Confirmada'
                              : 'Cancelada'}
                        </span>
                      </td>
                      <td data-label="Acciones">
                        <div className="admin-actions">
                          {t.estado === 'pendiente' && (
                            <button
                              type="button"
                              className="admin-icon-btn admin-icon-btn-ok"
                              disabled={procesando}
                              onClick={() => cambiarEstado(t.id, 'confirmada')}
                              title={`Confirmar turno de ${t.usuarioNombre}`}
                              aria-label={`Confirmar turno de ${t.usuarioNombre} del ${formatoFecha(t.fecha)}`}
                            >
                              <IconCheck />
                              <span className="admin-icon-btn-text">Confirmar</span>
                            </button>
                          )}
                          {t.estado !== 'cancelada' && (
                            <button
                              type="button"
                              className="admin-icon-btn admin-icon-btn-warn"
                              disabled={procesando}
                              onClick={() => cambiarEstado(t.id, 'cancelada')}
                              title={`Cancelar turno de ${t.usuarioNombre}`}
                              aria-label={`Cancelar turno de ${t.usuarioNombre} del ${formatoFecha(t.fecha)}`}
                            >
                              <IconX />
                              <span className="admin-icon-btn-text">Cancelar</span>
                            </button>
                          )}
                          {t.estado === 'cancelada' && (
                            <button
                              type="button"
                              className="admin-icon-btn admin-icon-btn-edit"
                              disabled={procesando}
                              onClick={() => cambiarEstado(t.id, 'pendiente')}
                              title={`Reabrir turno de ${t.usuarioNombre}`}
                              aria-label={`Reabrir turno de ${t.usuarioNombre} del ${formatoFecha(t.fecha)}`}
                            >
                              <IconReopen />
                              <span className="admin-icon-btn-text">Reabrir</span>
                            </button>
                          )}
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn-danger"
                            disabled={procesando}
                            onClick={() => setConfirmarEliminar(t)}
                            title={`Eliminar turno de ${t.usuarioNombre}`}
                            aria-label={`Eliminar turno de ${t.usuarioNombre} del ${formatoFecha(t.fecha)}`}
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

          <p className="admin-back-link">
            <Link to="/admin">← Volver a gestión de libros</Link>
          </p>
        </main>
        <Footer />
      </div>

      {confirmarEliminar && (
        <div
          className="admin-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar eliminación de turno"
          onClick={() => setConfirmarEliminar(null)}
        >
          <div className="admin-confirm-box" onClick={(e) => e.stopPropagation()}>
            <span className="admin-confirm-icon" aria-hidden="true">
              <IconWarn />
            </span>
            <h3>Eliminar turno</h3>
            <p>
              ¿Seguro que deseas eliminar el turno de{' '}
              <strong>{confirmarEliminar.usuarioNombre}</strong> del{' '}
              <strong>{formatoFecha(confirmarEliminar.fecha)}</strong>? (solo demo local)
            </p>
            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn-danger admin-confirm-btn"
                onClick={eliminarTurno}
                disabled={procesando}
                title="Confirmar eliminación del turno"
                aria-label={`Confirmar eliminación del turno de ${confirmarEliminar.usuarioNombre}`}
              >
                <IconTrash />
                {procesando ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
              <button
                type="button"
                className="admin-btn-secondary admin-confirm-btn"
                onClick={() => setConfirmarEliminar(null)}
                disabled={procesando}
                title="Cancelar y volver"
                aria-label="Cancelar eliminación del turno"
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
