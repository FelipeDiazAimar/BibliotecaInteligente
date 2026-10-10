/**
 * demoTurnos.js — Datos y utilidades demo del módulo Turnos.
 *
 * CONTRATO DEMO (nombres compatibles con src/lib/demo.js del Agente 1):
 * - DEMO_MODE true  => los turnos viven en localStorage (key 'biblio_demo_turnos').
 * - DEMO_MODE false => se intenta la API y se cae a localStorage si falla.
 *
 * NOTA DE INTEGRACIÓN: DEMO_MODE / DEMO_USER / demoDelay son el contrato
 * compartido del Agente 1 y se importan desde src/lib/demo.js (fuente única).
 * Este módulo los re-exporta para conveniencia interna del módulo Turnos.
 */

import { DEMO_MODE, DEMO_USER, demoDelay } from '../lib/demo.js';

export { DEMO_MODE, DEMO_USER, demoDelay };

export const TURNOS_STORAGE_KEY = 'biblio_demo_turnos';

/* ------------------------------------------------------------------ */
/* Salas + horarios de oferta demo (3 salas)                           */
/* ------------------------------------------------------------------ */

export const DEMO_SALAS = [
  {
    id: 'sala-lectura',
    nombre: 'Sala de Lectura General',
    capacidad: 20,
    descripcion: 'Lectura individual y consulta en sala.',
    horarios: ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'],
  },
  {
    id: 'sala-grupal',
    nombre: 'Sala de Estudio Grupal',
    capacidad: 12,
    descripcion: 'Trabajo en grupo de hasta 12 personas.',
    horarios: ['08:30', '10:00', '11:30', '14:30', '16:00', '17:30'],
  },
  {
    id: 'sala-multimedia',
    nombre: 'Sala Multimedia',
    capacidad: 8,
    descripcion: 'Proyecciones y trabajo con equipos audiovisuales.',
    horarios: ['09:00', '10:30', '12:00', '15:00', '16:30'],
  },
];

export function salaDemoPorId(id) {
  const lista = Array.isArray(DEMO_SALAS) ? DEMO_SALAS : [];
  const sala = lista.find((s) => String(s.id) === String(id));
  return sala ? { id: sala.id, nombre: sala.nombre } : null;
}

export function salaDemoPorNombre(nombre) {
  const lista = Array.isArray(DEMO_SALAS) ? DEMO_SALAS : [];
  return lista.find((s) => s.nombre === nombre) || null;
}

export function nombreSalaDe(turno) {
  if (!turno || typeof turno !== 'object') return 'Sala por asignar';
  if (turno.Sala && turno.Sala.nombre) return turno.Sala.nombre;
  if (turno.area) return turno.area;
  return 'Sala por asignar';
}

/* ------------------------------------------------------------------ */
/* Fechas                                                              */
/* ------------------------------------------------------------------ */

export function addDaysISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function hoyISO() {
  return addDaysISO(0);
}

/** Fecha >= hoy (formato YYYY-MM-DD). */
export function esFechaFutura(fechaStr) {
  if (!fechaStr || typeof fechaStr !== 'string') return false;
  return fechaStr >= hoyISO();
}

/** dd/mm/yyyy tolerante (si no es YYYY-MM-DD devuelve el texto tal cual). */
export function formatearFechaCorta(fechaStr) {
  if (!fechaStr || typeof fechaStr !== 'string') return 'Fecha a convenir';
  const partes = fechaStr.split('-');
  if (partes.length !== 3) return fechaStr;
  const [year, month, day] = partes;
  if (!year || !month || !day) return fechaStr;
  return `${day}/${month}/${year}`;
}

/* ------------------------------------------------------------------ */
/* Emails                                                              */
/* ------------------------------------------------------------------ */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizarEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function isEmailValido(email) {
  return EMAIL_RE.test(normalizarEmail(email));
}

export function nombreDesdeEmail(email) {
  const local = normalizarEmail(email).split('@')[0];
  if (!local) return 'Invitado';
  const palabras = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  return palabras.length > 0 ? palabras.join(' ') : 'Invitado';
}

/* ------------------------------------------------------------------ */
/* Store en localStorage                                               */
/* ------------------------------------------------------------------ */

function buildSeedTurnos() {
  const juan = { id: 9002, nombre: 'Juan Pérez', email: 'juan.perez@biblio.test', dni: '38999888' };
  const maria = { id: 9003, nombre: 'María Gómez', email: 'maria.gomez@biblio.test', dni: '37777666' };
  const demo = {
    id: DEMO_USER.id,
    nombre: DEMO_USER.nombre || 'Usuario Demo',
    email: DEMO_USER.email || '',
    ...(DEMO_USER.dni ? { dni: DEMO_USER.dni } : {}),
  };
  return [
    {
      id: 'demo-turno-1',
      fecha: addDaysISO(5),
      hora_inicio: '09:30',
      hora_fin: '11:00',
      tematica: 'Estudio grupal de algoritmos',
      cantidad_integrantes: 2,
      observaciones: 'Llevar netbooks.',
      estado: 'pendiente',
      id_usuario: DEMO_USER.id,
      id_sala: 'sala-grupal',
      Sala: { id: 'sala-grupal', nombre: 'Sala de Estudio Grupal' },
      Usuario: { ...demo },
      InvitadosTurnos: [
        {
          id: 'demo-inv-1a',
          id_turno: 'demo-turno-1',
          id_usuario: maria.id,
          email: maria.email,
          estado_invitacion: 'pendiente',
          Usuario: { ...maria },
        },
      ],
    },
    {
      id: 'demo-turno-2',
      fecha: addDaysISO(9),
      hora_inicio: '15:00',
      hora_fin: '16:30',
      tematica: 'Proyección de documental',
      cantidad_integrantes: 3,
      observaciones: '',
      estado: 'aceptado',
      id_usuario: juan.id,
      id_sala: 'sala-multimedia',
      Sala: { id: 'sala-multimedia', nombre: 'Sala Multimedia' },
      Usuario: { ...juan },
      InvitadosTurnos: [
        {
          id: 'demo-inv-2a',
          id_turno: 'demo-turno-2',
          id_usuario: DEMO_USER.id,
          email: DEMO_USER.email,
          estado_invitacion: 'aceptado',
          Usuario: { ...demo },
        },
      ],
    },
    {
      id: 'demo-turno-3',
      fecha: addDaysISO(12),
      hora_inicio: '08:00',
      hora_fin: '09:30',
      tematica: 'Club de lectura',
      cantidad_integrantes: 2,
      observaciones: 'Traer el libro del mes.',
      estado: 'pendiente',
      id_usuario: maria.id,
      id_sala: 'sala-lectura',
      Sala: { id: 'sala-lectura', nombre: 'Sala de Lectura General' },
      Usuario: { ...maria },
      InvitadosTurnos: [
        {
          id: 'demo-inv-3a',
          id_turno: 'demo-turno-3',
          id_usuario: DEMO_USER.id,
          email: DEMO_USER.email,
          estado_invitacion: 'pendiente',
          Usuario: { ...demo },
        },
      ],
    },
  ];
}

export function saveTurnosDemo(lista) {
  try {
    localStorage.setItem(TURNOS_STORAGE_KEY, JSON.stringify(Array.isArray(lista) ? lista : []));
  } catch {
    /* almacenamiento no disponible: se sigue en memoria */
  }
}

export function getTurnosDemo() {
  try {
    const raw = localStorage.getItem(TURNOS_STORAGE_KEY);
    if (raw === null) {
      const seed = buildSeedTurnos();
      saveTurnosDemo(seed);
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Forma del objeto turno demo (compatible con la API):
 * {
 *   id, fecha: 'YYYY-MM-DD', hora_inicio: 'HH:MM', hora_fin: 'HH:MM',
 *   tematica, cantidad_integrantes, observaciones,
 *   estado: 'pendiente' | 'aceptado' | 'cancelado',
 *   id_usuario, id_sala,
 *   Sala: { id, nombre } | null,
 *   Usuario: { id, nombre, email } | null,
 *   InvitadosTurnos: [{ id, id_turno, id_usuario | null, email,
 *     estado_invitacion: 'pendiente' | 'aceptado' | 'rechazado',
 *     Usuario: { id | null, nombre, email } }]
 * }
 */
export function createTurnoDemo({
  fecha,
  hora_inicio,
  hora_fin,
  tematica = '',
  observaciones = '',
  id_usuario,
  id_sala,
  area = '',
  creador = {},
  invitadosEmails = [],
}) {
  const lista = getTurnosDemo();
  const sala = id_sala != null && id_sala !== '' ? salaDemoPorId(id_sala) : null;
  const id = `demo-${Date.now()}`;
  const creadorEmail = normalizarEmail(creador.email);
  const emails = [...new Set((invitadosEmails || []).map(normalizarEmail).filter(Boolean))]
    .filter((e) => e !== creadorEmail)
    .slice(0, 10);
  const invitados = emails.map((email, i) => ({
    id: `${id}-inv-${i}`,
    id_turno: id,
    id_usuario: null,
    email,
    estado_invitacion: 'pendiente',
    Usuario: { id: null, nombre: nombreDesdeEmail(email), email },
  }));
  const creado = {
    id,
    fecha: fecha || '',
    hora_inicio: hora_inicio || '',
    hora_fin: hora_fin || '',
    tematica: String(tematica || '').trim(),
    cantidad_integrantes: 1 + invitados.length,
    observaciones: String(observaciones || '').trim(),
    estado: 'pendiente',
    id_usuario: id_usuario ?? null,
    id_sala: sala ? sala.id : id_sala ?? null,
    Sala: sala || { id: id_sala ?? null, nombre: area || 'Sala por asignar' },
    Usuario: {
      id: id_usuario ?? null,
      nombre: creador.nombre || 'Usuario demo',
      email: creador.email || '',
    },
    InvitadosTurnos: invitados,
  };
  lista.unshift(creado);
  saveTurnosDemo(lista);
  return creado;
}

export function updateTurnoDemo(id, patch = {}) {
  const lista = getTurnosDemo();
  let actualizado = null;
  const next = lista.map((t) => {
    if (String(t.id) !== String(id)) return t;
    const merged = { ...t, ...patch, id: t.id };
    if (patch.id_sala !== undefined) {
      const sala = salaDemoPorId(patch.id_sala);
      merged.Sala = sala || { id: patch.id_sala, nombre: (t.Sala && t.Sala.nombre) || 'Sala por asignar' };
    }
    actualizado = merged;
    return merged;
  });
  saveTurnosDemo(next);
  return actualizado;
}

export function removeTurnoDemo(id) {
  const lista = getTurnosDemo();
  const next = lista.filter((t) => String(t.id) !== String(id));
  saveTurnosDemo(next);
  return next;
}

export function responderInvitacionDemo(idInvitacion, estado) {
  const lista = getTurnosDemo();
  const next = lista.map((t) => {
    const invitados = Array.isArray(t.InvitadosTurnos) ? t.InvitadosTurnos : [];
    if (!invitados.some((inv) => String(inv.id) === String(idInvitacion))) return t;
    return {
      ...t,
      InvitadosTurnos: invitados.map((inv) =>
        String(inv.id) === String(idInvitacion) ? { ...inv, estado_invitacion: estado } : inv
      ),
    };
  });
  saveTurnosDemo(next);
  return next;
}

/* ------------------------------------------------------------------ */
/* Lectura normalizada (render robusto)                                 */
/* ------------------------------------------------------------------ */

/** Completa valores por defecto para que ningún componente crashee por undefined. */
export function normalizarTurno(t) {
  const base = t && typeof t === 'object' ? t : {};
  const invitados = Array.isArray(base.InvitadosTurnos) ? base.InvitadosTurnos : [];
  const estadosValidos = ['pendiente', 'aceptado', 'cancelado'];
  const sala =
    base.Sala && typeof base.Sala === 'object'
      ? base.Sala
      : base.id_sala != null && base.id_sala !== ''
        ? salaDemoPorId(base.id_sala)
        : null;
  const cantidad = Number(base.cantidad_integrantes);
  return {
    ...base,
    fecha: base.fecha || '',
    hora_inicio: base.hora_inicio || '',
    hora_fin: base.hora_fin || '',
    tematica: base.tematica || '',
    observaciones: base.observaciones || '',
    estado: estadosValidos.includes(base.estado) ? base.estado : 'pendiente',
    id_usuario: base.id_usuario ?? base.Usuario?.id ?? null,
    id_sala: base.id_sala ?? sala?.id ?? null,
    Sala: sala,
    Usuario: base.Usuario && typeof base.Usuario === 'object' ? base.Usuario : null,
    InvitadosTurnos: invitados,
    cantidad_integrantes:
      Number.isFinite(cantidad) && cantidad > 0 ? cantidad : Math.max(invitados.length, 1),
  };
}

export function invitacionPerteneceA(inv, usuario) {
  if (!inv || !usuario) return false;
  if (
    inv.id_usuario != null &&
    usuario.id != null &&
    String(inv.id_usuario) === String(usuario.id)
  ) {
    return true;
  }
  const a = normalizarEmail(inv.email || inv.Usuario?.email);
  const b = normalizarEmail(usuario.email);
  return Boolean(a) && a === b;
}

/** Invitaciones pendientes del usuario con su Turno adjunto (como la API). */
export function getInvitacionesPendientesDemo(usuario) {
  const lista = getTurnosDemo();
  const out = [];
  for (const t of lista) {
    const invitados = Array.isArray(t.InvitadosTurnos) ? t.InvitadosTurnos : [];
    for (const inv of invitados) {
      if (inv && inv.estado_invitacion === 'pendiente' && invitacionPerteneceA(inv, usuario)) {
        out.push({ ...inv, Turno: t });
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Validaciones compartidas                                            */
/* ------------------------------------------------------------------ */

/** Valida el Paso 1. Devuelve un objeto { campo: mensaje } (vacío = válido). */
export function validarPaso1(valores, salas) {
  const errores = {};
  const v = valores || {};
  const lista = Array.isArray(salas) ? salas : [];
  const sala = lista.find((s) => String(s.id) === String(v.id_sala));

  if (!v.id_sala || !sala) {
    errores.id_sala = 'Elegí una sala de la lista.';
  }
  if (!v.fecha) {
    errores.fecha = 'Elegí una fecha.';
  } else if (!esFechaFutura(v.fecha)) {
    errores.fecha = 'La fecha debe ser hoy o una fecha futura.';
  }
  const oferta = Array.isArray(sala?.horarios) ? sala.horarios : [];
  if (!v.hora_inicio) {
    errores.hora_inicio = 'Elegí la hora de inicio.';
  } else if (oferta.length > 0 && !oferta.includes(v.hora_inicio)) {
    errores.hora_inicio = 'Ese horario no está disponible para esta sala.';
  }
  if (!v.hora_fin) {
    errores.hora_fin = 'Elegí la hora de fin.';
  } else if (oferta.length > 0 && !oferta.includes(v.hora_fin)) {
    errores.hora_fin = 'Ese horario no está disponible para esta sala.';
  }
  if (v.hora_inicio && v.hora_fin && v.hora_fin <= v.hora_inicio) {
    errores.hora_fin = 'La hora de fin debe ser posterior a la de inicio.';
  }
  if (!String(v.tematica || '').trim()) {
    errores.tematica = 'Contanos la temática del turno.';
  }
  return errores;
}
