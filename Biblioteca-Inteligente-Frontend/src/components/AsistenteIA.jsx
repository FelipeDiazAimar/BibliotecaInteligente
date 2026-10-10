import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_MODE, demoDelay, mensajeErrorAmable } from '../lib/demo';
import { buscarRespuestaDemo } from '../data/demoAsistente';
import { librosDemo } from '../data/demoLibros';
import '../styles/VozIA.css';

const API_URL = 'http://localhost:3000/api/asistente';

/* ---------- Helpers de modo demo (defensivos ante el contrato) ---------- */

function estaEnDemo() {
  try {
    if (typeof DEMO_MODE === 'function') return !!DEMO_MODE();
    if (typeof DEMO_MODE === 'undefined') return true;
    return !!DEMO_MODE;
  } catch {
    return true;
  }
}

async function esperar(ms = 900) {
  try {
    if (typeof demoDelay === 'function') {
      await demoDelay(ms);
      return;
    }
    if (typeof demoDelay === 'number') {
      await new Promise((r) => setTimeout(r, demoDelay));
      return;
    }
  } catch {
    /* cae al delay local */
  }
  await new Promise((r) => setTimeout(r, ms));
}

/** Convierte ids sugeridos (1..12) en { id, titulo } usando el dataset demo. */
function resolverSugeridos(ids) {
  const catalogo = Array.isArray(librosDemo) ? librosDemo : [];
  return (ids || []).map((id) => {
    const libro = catalogo.find((l) => l && l.id === id);
    return { id, titulo: libro?.titulo || String(id) };
  });
}

const SUGERENCIAS_RAPIDAS = [
  '¿Qué libros de física me recomendás?',
  'Recomendame una novela de literatura',
  '¿Cómo pido un préstamo?',
];

let proximoId = 1;
const nuevoId = () => `msg-${Date.now()}-${proximoId++}`;

/* ------------------------------- Estilos base (burbujas/historial) ------------------------------- */

const estilos = {
  contenedor: { margin: '2rem 0', padding: 16, border: '1px solid var(--biblio-link, #2196f3)', borderRadius: 10, background: 'var(--biblio-card-bg, #f5faff)' },
  banner: {
    background: '#fff8e1', border: '1px dashed #f9a825', color: '#7a5c00',
    borderRadius: 6, padding: '6px 12px', fontSize: 13, marginBottom: 12,
  },
  chat: { display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 'min(50vh, 420px)', overflowY: 'auto', marginBottom: 12 },
  burbuja: { maxWidth: '85%', padding: '8px 12px', borderRadius: 12, fontSize: 14, lineHeight: 1.45, color: 'var(--biblio-ink, #222)' },
  usuario: { alignSelf: 'flex-end', background: 'var(--biblio-link, #2196f3)', color: '#fff', borderBottomRightRadius: 4 },
  asistente: { alignSelf: 'flex-start', background: 'var(--biblio-card-bg, #fff)', border: '1px solid var(--border, #ddd)', borderBottomLeftRadius: 4 },
  typing: { alignSelf: 'flex-start', background: 'var(--biblio-card-bg, #fff)', border: '1px solid var(--border, #ddd)', borderRadius: 12, padding: '8px 12px', fontSize: 14, color: 'var(--muted, #888)' },
  vacio: { color: 'var(--muted, #888)', fontSize: 14, textAlign: 'center', padding: 12 },
};

/* ------------------------------- Iconos SVG inline ------------------------------- */

const svgBase = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function IconSparkle({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    </svg>
  );
}

function IconLibro({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function IconAvion() {
  return (
    <svg {...svgBase}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

function IconPapelera() {
  return (
    <svg {...svgBase}>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

/* ------------------------------ Componente ------------------------------ */

export default function AsistenteIA() {
  const [enDemo] = useState(estaEnDemo);
  const [mensajes, setMensajes] = useState([]);
  const [pregunta, setPregunta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const finRef = useRef(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  // Historial real: solo en modo real y con token (solo lectura).
  useEffect(() => {
    if (enDemo) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_URL}/historial`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setHistorial(Array.isArray(data) ? data : []))
      .catch(() => setHistorial([]));
  }, [enDemo]);

  const recargarHistorial = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_URL}/historial`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setHistorial(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  const responderDemo = async (texto) => {
    await esperar(900);
    const { respuesta, sugeridos } = buscarRespuestaDemo(texto);
    return { texto: respuesta, sugeridos: resolverSugeridos(sugeridos) };
  };

  const preguntarBackend = async (texto) => {
    const res = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ prompt: texto }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(mensajeErrorAmable(data?.error, 'El asistente no pudo responder. Intentá de nuevo.'));
    return { texto: data.respuesta || 'Sin respuesta, intentá de nuevo.', sugeridos: [] };
  };

  const handleAsk = async (e, textoDirecto) => {
    if (e) e.preventDefault();
    const texto = (typeof textoDirecto === 'string' ? textoDirecto : pregunta).trim();
    if (!texto || cargando) return;
    setCargando(true);
    setPregunta('');
    setMensajes((prev) => [...prev, { id: nuevoId(), rol: 'usuario', texto, sugeridos: [] }]);
    try {
      let respuesta;
      if (enDemo) {
        respuesta = await responderDemo(texto);
      } else {
        try {
          respuesta = await preguntarBackend(texto);
          recargarHistorial();
        } catch {
          respuesta = await responderDemo(texto); // cae a demo si el backend falla
        }
      }
      setMensajes((prev) => [...prev, { id: nuevoId(), rol: 'asistente', ...respuesta }]);
    } finally {
      setCargando(false);
    }
  };

  const limpiar = () => setMensajes([]);

  return (
    <div style={estilos.contenedor} className="asist-contenedor">
      <h2>Asistente IA Biblioteca</h2>

      <div className="asist-rapidas">
        {SUGERENCIAS_RAPIDAS.map((s) => (
          <button
            key={s}
            type="button"
            className="asist-rapida-btn"
            disabled={cargando}
            onClick={() => handleAsk(null, s)}
            title={`Preguntar: ${s}`}
            aria-label={`Pregunta rápida: ${s}`}
          >
            <IconSparkle />
            <span>{s}</span>
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {mensajes.length === 0 && !cargando && (
          <div style={estilos.vacio}>Hacé tu primera pregunta para empezar la conversación.</div>
        )}
        <div style={estilos.chat}>
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...estilos.burbuja,
                ...(msg.rol === 'usuario' ? estilos.usuario : estilos.asistente),
              }}
            >
              <div>{msg.texto}</div>
              {msg.rol === 'asistente' && msg.sugeridos?.length > 0 && (
                <div className="asist-sugeridos">
                  {msg.sugeridos.map((s) => (
                    <Link key={s.id} to={`/libros/${s.id}`} className="asist-chip" title={`Ver detalle de ${s.titulo}`}>
                      <IconLibro />
                      <span>{s.titulo}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {cargando && <div style={estilos.typing}>Escribiendo… ● ● ●</div>}
          <div ref={finRef} />
        </div>
      </div>

      <form onSubmit={handleAsk} className="asist-barra">
        <button
          type="button"
          onClick={limpiar}
          disabled={cargando || mensajes.length === 0}
          className="asist-icon-btn"
          title="Limpiar conversación"
          aria-label="Limpiar conversación"
        >
          <IconPapelera />
          <span className="asist-icon-btn-texto">Limpiar</span>
        </button>
        <input
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Pregúntale a la IA sobre los libros..."
          className="asist-input"
          disabled={cargando}
          aria-label="Pregunta al asistente"
        />
        <button
          type="submit"
          disabled={cargando || !pregunta.trim()}
          className="asist-enviar-btn"
          title="Enviar pregunta"
          aria-label="Enviar pregunta"
        >
          <IconAvion />
          <span className="asist-enviar-texto">{cargando ? 'Consultando...' : 'Preguntar'}</span>
        </button>
      </form>

      {/* Historial de consultas (solo modo real) */}
      {!enDemo && (
        <div style={{ marginTop: 24 }}>
          <h3>Historial de consultas</h3>
          <div className="asist-historial" style={{ maxHeight: 250, overflowY: 'auto', background: 'var(--biblio-card-bg, #fff)', borderRadius: 6, border: '1px solid var(--border, #ddd)', padding: 12 }}>
            {Array.isArray(historial) && historial.length === 0 && <div style={{ color: 'var(--muted, #888)' }}>No hay historial.</div>}
            {Array.isArray(historial) &&
              historial.map((item) => (
                <div key={item.id} style={{ marginBottom: 16, borderBottom: '1px solid var(--border, #eee)', paddingBottom: 8 }}>
                  <div style={{ color: 'var(--biblio-ink, #222)' }}>
                    <strong>Consulta:</strong> {item.texto}
                  </div>
                  <div style={{ marginLeft: 12, color: 'var(--biblio-link, #1769aa)' }}>
                    <strong>Respuesta:</strong>{' '}
                    {item.Respuesta?.texto || <span style={{ color: 'var(--muted, #888)' }}>Sin respuesta</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted, #888)', marginTop: 2 }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
