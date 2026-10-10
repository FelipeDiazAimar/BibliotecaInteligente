import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/VozIA.css';
import { DEMO_MODE, demoDelay, mensajeErrorAmable } from '../lib/demo';
import { buscarRespuestaDemo } from '../data/demoAsistente';
import { librosDemo } from '../data/demoLibros';

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

let proximoId = 1;
const nuevoId = () => `voz-${Date.now()}-${proximoId++}`;

/* ---------- Iconos SVG inline (sin emojis) ---------- */

const svgBase = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function IconMic() {
  return (
    <svg {...svgBase}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function IconStop() {
  return (
    <svg {...svgBase} fill="currentColor" stroke="none">
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
    </svg>
  );
}

function IconVolumen() {
  return (
    <svg {...svgBase}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9.4 9.4 0 0 1 0 13" />
    </svg>
  );
}

function IconMute() {
  return (
    <svg {...svgBase}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
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

function IconAvion() {
  return (
    <svg {...svgBase}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="vozia-chip-icon"
    >
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    </svg>
  );
}

const PREGUNTAS_RAPIDAS = [
  '¿Qué libros de física me recomendás?',
  'Recomendame una novela para leer',
  '¿Cómo pido un préstamo?',
];

export default function VozIA() {
  const [enDemo] = useState(estaEnDemo);
  const [mensajes, setMensajes] = useState([]);
  const [pregunta, setPregunta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [muteado, setMuteado] = useState(false);
  const [soporteVoz, setSoporteVoz] = useState(false);
  const [vozDisponible] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);

  const formRef = useRef(null);
  const finRef = useRef(null);
  const recRef = useRef(null);
  const cargandoRef = useRef(false);
  const muteadoRef = useRef(false);
  const enviarRef = useRef(null);
  const navigate = useNavigate();

  cargandoRef.current = cargando;
  muteadoRef.current = muteado;

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('biblio_demo_session');
    try { localStorage.setItem('biblio_demo_closed', '1'); } catch {}
    navigate('/login');
  };

  /* ---------- Síntesis de voz (opcional, con mute) ---------- */

  const hablar = (texto) => {
    try {
      if (muteadoRef.current) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(texto);
      utter.lang = 'es-ES';
      window.speechSynthesis.speak(utter);
    } catch {
      /* síntesis no disponible: degradación silenciosa */
    }
  };

  const alternarMute = () => {
    setMuteado((prev) => {
      if (prev === false) {
        // Se está silenciando: cortar la lectura en curso.
        try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
      }
      return !prev;
    });
  };

  /* ---------- Núcleo: misma lógica demo/real que AsistenteIA ---------- */

  const responderDemo = async (texto) => {
    await esperar(900);
    const { respuesta, sugeridos } = buscarRespuestaDemo(texto);
    return { texto: respuesta, sugeridos: resolverSugeridos(sugeridos) };
  };

  const preguntarBackend = async (texto) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ prompt: texto }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(mensajeErrorAmable(data?.error, 'El asistente no pudo responder. Intentá de nuevo.'));
    return { texto: data.respuesta || 'Sin respuesta, intentá de nuevo.', sugeridos: [] };
  };

  const enviarPregunta = async (textoBruto) => {
    const texto = (textoBruto ?? '').trim();
    if (!texto || cargandoRef.current) return;
    cargandoRef.current = true;
    setCargando(true);
    setPregunta('');
    setMensajes((prev) => [...prev, { id: nuevoId(), rol: 'usuario', texto, sugeridos: [] }]);
    try {
      let respuesta;
      if (estaEnDemo()) {
        respuesta = await responderDemo(texto);
      } else {
        try {
          respuesta = await preguntarBackend(texto);
        } catch {
          respuesta = await responderDemo(texto); // cae a demo si el backend falla
        }
      }
      setMensajes((prev) => [...prev, { id: nuevoId(), rol: 'asistente', ...respuesta }]);
      hablar(respuesta.texto);
      setTimeout(() => {
        if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } finally {
      cargandoRef.current = false;
      setCargando(false);
    }
  };

  // Ref estable para invocar el envío desde los callbacks del reconocedor.
  useEffect(() => {
    enviarRef.current = enviarPregunta;
  });

  /* ---------- Reconocimiento de voz (con fallback a texto) ---------- */

  useEffect(() => {
    const SR = typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;
    if (!SR) {
      setSoporteVoz(false);
      return;
    }
    setSoporteVoz(true);
    const rec = new SR();
    rec.lang = 'es-ES';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const texto = e.results?.[0]?.[0]?.transcript ?? '';
      setPregunta(texto);
      if (texto.trim() && enviarRef.current) enviarRef.current(texto);
    };
    rec.onerror = () => setEscuchando(false);
    rec.onend = () => setEscuchando(false);
    recRef.current = rec;
    return () => {
      try { rec.abort(); } catch { /* noop */ }
      try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alternarEscucha = () => {
    const rec = recRef.current;
    if (!rec) return;
    try {
      if (escuchando) {
        rec.stop();
      } else {
        rec.start();
        setEscuchando(true);
      }
    } catch {
      setEscuchando(false);
    }
  };

  /* ---------- Historial real (solo lectura, solo modo real) ---------- */

  useEffect(() => {
    if (!estaEnDemo()) {
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch(`${API_URL}/historial`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          const items = Array.isArray(data) ? data : [];
          const seed = [];
          for (const item of items) {
            seed.push({ id: nuevoId(), rol: 'usuario', texto: item.texto, sugeridos: [] });
            seed.push({
              id: nuevoId(),
              rol: 'asistente',
              texto: item.Respuesta?.texto || 'Sin respuesta',
              sugeridos: [],
            });
          }
          setMensajes(seed);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Solo scrollear cuando hay conversación: en el montaje inicial no mover
    // la página (si no, el título y la onda quedan fuera de vista).
    if (mensajes.length === 0 && !cargando) return;
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [mensajes, cargando]);

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarPregunta(pregunta);
  };

  const limpiar = () => {
    setMensajes([]);
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
  };

  return (
    <>
      <Header
        hideVozIA
        onLogout={onLogout}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' , marginRight: '80px'}}>
            <Link to="/catalogo" className="panel-link">Catalogo</Link>
            <Link to="/turnos" className="panel-link">Turnero</Link>
            <Link to="/contacto" className="panel-link">Contacto</Link>
          </div>
        }
      />
      <main className="vozia-main" style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
        <div className="vozia-content">
          <div className="vozia-wave">
            <svg width="80" height="50" viewBox="0 0 80 50" aria-hidden="true">
              <g>
                <rect x="10" y="25" width="4" height="15" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="15;35;15" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="y" values="25;5;25" dur="1s" repeatCount="indefinite" />
                </rect>
                <rect x="20" y="20" width="4" height="25" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="25;10;25" dur="1s" repeatCount="indefinite" begin="0.1s"/>
                  <animate attributeName="y" values="20;35;20" dur="1s" repeatCount="indefinite" begin="0.1s"/>
                </rect>
                <rect x="30" y="15" width="4" height="35" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="35;15;35" dur="1s" repeatCount="indefinite" begin="0.2s"/>
                  <animate attributeName="y" values="15;35;15" dur="1s" repeatCount="indefinite" begin="0.2s"/>
                </rect>
                <rect x="40" y="10" width="4" height="45" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="45;20;45" dur="1s" repeatCount="indefinite" begin="0.3s"/>
                  <animate attributeName="y" values="10;30;10" dur="1s" repeatCount="indefinite" begin="0.3s"/>
                </rect>
                <rect x="50" y="15" width="4" height="35" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="35;15;35" dur="1s" repeatCount="indefinite" begin="0.4s"/>
                  <animate attributeName="y" values="15;35;15" dur="1s" repeatCount="indefinite" begin="0.4s"/>
                </rect>
                <rect x="60" y="20" width="4" height="25" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="25;10;25" dur="1s" repeatCount="indefinite" begin="0.5s"/>
                  <animate attributeName="y" values="20;35;20" dur="1s" repeatCount="indefinite" begin="0.5s"/>
                </rect>
                <rect x="70" y="25" width="4" height="15" rx="2" fill="#3f51ff">
                  <animate attributeName="height" values="15;35;15" dur="1s" repeatCount="indefinite" begin="0.6s"/>
                  <animate attributeName="y" values="25;5;25" dur="1s" repeatCount="indefinite" begin="0.6s"/>
                </rect>
              </g>
            </svg>
          </div>

          {escuchando && (
            <div className="vozia-aviso-voz" role="status">Escuchando… hablá ahora</div>
          )}
          {!soporteVoz && (
            <div className="vozia-aviso-voz" role="status">
              Reconocimiento de voz no disponible en este navegador: podés escribir tu pregunta.
            </div>
          )}

          <div className="vozia-encabezado">
            <h1 className="vozia-titulo">Asistente IA</h1>
            <p className="vozia-subtitulo">Preguntame por libros, materias o préstamos</p>
          </div>

          <div className="vozia-chat" aria-live="polite">
            {mensajes.length === 0 && !cargando && (
              <div className="vozia-vacio">
                <div className="vozia-vacio-texto">
                  {soporteVoz
                    ? 'Tocá el micrófono o elegí una pregunta para empezar.'
                    : 'Elegí una pregunta o escribila abajo.'}
                </div>
                <div className="vozia-rapidas" role="group" aria-label="Preguntas sugeridas">
                  {PREGUNTAS_RAPIDAS.map((rapida) => (
                    <button
                      key={rapida}
                      type="button"
                      className="vozia-rapida-btn"
                      onClick={() => enviarPregunta(rapida)}
                    >
                      <IconSparkle />
                      <span>{rapida}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {mensajes.map((msg) => (
              <div
                key={msg.id}
                className={`vozia-burbuja ${msg.rol === 'usuario' ? 'vozia-burbuja-usuario' : 'vozia-burbuja-asistente'}`}
              >
                <div>{msg.texto}</div>
                {msg.rol === 'asistente' && msg.sugeridos?.length > 0 && (
                  <div className="vozia-sugerencias">
                    {msg.sugeridos.map((s) => (
                      <Link key={s.id} to={`/libros/${s.id}`} className="vozia-chip" title={`Ver detalle de ${s.titulo}`}>
                        <IconSparkle />
                        <span>{s.titulo}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {cargando && (
              <div className="vozia-burbuja vozia-burbuja-asistente vozia-typing" aria-label="Escribiendo respuesta">
                <span className="vozia-punto" />
                <span className="vozia-punto" />
                <span className="vozia-punto" />
              </div>
            )}
            <div ref={finRef} />
          </div>

          <form className="vozia-form vozia-barra" onSubmit={handleSubmit} ref={formRef}>
            <div className="vozia-barra-grupo vozia-barra-grupo--izq" role="group" aria-label="Controles de voz y limpieza">
              <button
                type="button"
                className={`vozia-icon-btn vozia-mic-btn${escuchando ? ' escuchando' : ''}`}
                onClick={alternarEscucha}
                disabled={!soporteVoz || cargando}
                aria-label={escuchando ? 'Detener escucha' : 'Dictar por voz'}
                title={soporteVoz ? (escuchando ? 'Detener escucha' : 'Dictar por voz') : 'Reconocimiento de voz no disponible'}
              >
                {escuchando ? <IconStop /> : <IconMic />}
              </button>
              <button
                type="button"
                className={`vozia-icon-btn vozia-mute-btn${muteado ? ' is-off' : ''}`}
                onClick={alternarMute}
                disabled={!vozDisponible}
                aria-label={muteado ? 'Activar lectura en voz alta' : 'Silenciar lectura en voz alta'}
                title={vozDisponible ? (muteado ? 'Activar lectura en voz alta' : 'Silenciar lectura en voz alta') : 'Síntesis de voz no disponible'}
                aria-pressed={muteado}
              >
                {muteado ? <IconMute /> : <IconVolumen />}
              </button>
              <button
                type="button"
                className="vozia-icon-btn vozia-limpiar-btn"
                onClick={limpiar}
                disabled={cargando || mensajes.length === 0}
                aria-label="Limpiar conversación"
                title="Limpiar conversación"
              >
                <IconPapelera />
              </button>
            </div>
            <input
              className="vozia-input"
              type="text"
              placeholder="Preguntá por un libro, una materia…"
              value={pregunta}
              onChange={e => setPregunta(e.target.value)}
              disabled={cargando}
              aria-label="Pregunta al asistente"
            />
            <button
              className="vozia-enviar-btn"
              type="submit"
              disabled={cargando || !pregunta.trim()}
              aria-label="Enviar pregunta"
              title="Enviar pregunta"
            >
              <IconAvion />
              <span className="vozia-enviar-texto">Enviar</span>
            </button>
          </form>
        </div>
      </main>
      <footer className="vozia-footer">
        © 2025 BiblioTech. Todos los derechos reservados.
      </footer>
    </>
  );
}
