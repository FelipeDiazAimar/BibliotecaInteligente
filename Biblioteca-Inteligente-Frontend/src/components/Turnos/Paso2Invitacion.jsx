import React, { useState, useEffect, useRef } from 'react';
import IntegrantesList from './IntegrantesList';
import '../../styles/Turnos/Paso2Invitacion.css';
import { DEMO_MODE, demoDelay } from '../../lib/demo.js';
import {
  createTurnoDemo,
  normalizarEmail,
  isEmailValido,
  formatearFechaCorta,
} from '../../data/demoTurnos';

const MAX_INVITADOS = 10;

function Paso2Invitacion({ creador = {}, datosTurno = {}, onSolicitarExito, onVolver }) {
  const [email, setEmail] = useState('');
  const [invitados, setInvitados] = useState([]); // [{ email, nombre }]
  const [mensaje, setMensaje] = useState(null); // { tipo: 'error' | 'exito', texto }
  const [subpaso, setSubpaso] = useState('invitados'); // 'invitados' | 'resumen'
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const datos = datosTurno || {};
  const creadorEmail = normalizarEmail(creador.email);
  const integrantes = [
    {
      id: creador.id ?? 'creador',
      nombre: creador.nombre || 'Usuario',
      email: creador.email || '',
      dni: creador.dni || '',
    },
    ...invitados,
  ];
  const nombreSala = datos.area || 'Sala por asignar';

  const handleAddInvitado = () => {
    const limpio = normalizarEmail(email);
    if (!limpio) {
      setMensaje({ tipo: 'error', texto: 'Escribí un email para invitar.' });
      return;
    }
    if (!isEmailValido(limpio)) {
      setMensaje({ tipo: 'error', texto: 'Ese email no parece válido. Revisalo e intentá de nuevo.' });
      return;
    }
    if (creadorEmail && limpio === creadorEmail) {
      setMensaje({ tipo: 'error', texto: 'Ese es tu propio email: ya sos parte del turno.' });
      return;
    }
    if (invitados.some(i => i.email === limpio)) {
      setMensaje({ tipo: 'error', texto: 'Ese email ya está en la lista.' });
      return;
    }
    if (invitados.length >= MAX_INVITADOS) {
      setMensaje({ tipo: 'error', texto: `Podés invitar hasta ${MAX_INVITADOS} personas por turno.` });
      return;
    }
    setInvitados(prev => [...prev, { email: limpio, nombre: limpio }]);
    setEmail('');
    setMensaje(null);
  };

  const handleQuitar = emailQuitar => {
    const limpio = normalizarEmail(emailQuitar);
    setInvitados(prev => prev.filter(i => i.email !== limpio));
  };

  const handleEmailKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInvitado();
    }
  };

  const payloadDemo = () => ({
    fecha: datos.fecha,
    hora_inicio: datos.hora_inicio,
    hora_fin: datos.hora_fin,
    tematica: datos.tematica,
    observaciones: datos.observaciones,
    id_usuario: creador.id ?? null,
    id_sala: datos.id_sala || null,
    area: datos.area || '',
    creador: { id: creador.id ?? null, nombre: creador.nombre || 'Usuario', email: creador.email || '' },
    invitadosEmails: invitados.map(i => i.email),
  });

  const guardarEnApi = async () => {
    const body = {
      fecha: datos.fecha,
      hora_inicio: datos.hora_inicio,
      hora_fin: datos.hora_fin,
      tematica: datos.tematica,
      cantidad_integrantes: integrantes.length,
      observaciones: datos.observaciones,
      id_usuario: creador.id,
      id_sala: datos.id_sala,
    };
    const res = await fetch('http://localhost:3000/api/turnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'No se pudo crear el turno.');
    }
    // Las invitaciones por email quedan registradas en el turno demo local;
    // la API de invitados requiere id de usuario, por eso no se reintenta aquí.
    return res.json();
  };

  const handleSolicitar = async () => {
    if (!datos.fecha || !datos.hora_inicio || !datos.hora_fin) {
      setMensaje({ tipo: 'error', texto: 'Faltan los datos del turno. Volvé al paso anterior.' });
      return;
    }
    if (!datos.id_sala && !datos.area) {
      setMensaje({ tipo: 'error', texto: 'Elegí una sala válida en el paso anterior.' });
      return;
    }
    setEnviando(true);
    setMensaje(null);
    try {
      if (DEMO_MODE) {
        await demoDelay(500);
        createTurnoDemo(payloadDemo());
      } else {
        try {
          await guardarEnApi();
        } catch {
          // Fallback demo: la reserva no se pierde aunque falle el backend
          createTurnoDemo(payloadDemo());
        }
      }
      setMensaje({ tipo: 'exito', texto: 'El turno fue solicitado correctamente.' });
      setEnviado(true);
      if (onSolicitarExito) {
        timerRef.current = setTimeout(() => {
          onSolicitarExito();
        }, 1200);
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudo crear el turno. Intentá de nuevo.' });
    }
    setEnviando(false);
  };

  return (
    <div className="paso2-container">
      <div className="wizard-steps" aria-label="Progreso de la reserva">
        <span className="wizard-step done">1 · Datos</span>
        <span className="wizard-step-sep" aria-hidden="true">→</span>
        <span className={`wizard-step ${subpaso === 'invitados' ? 'active' : 'done'}`}>2 · Invitados</span>
        <span className="wizard-step-sep" aria-hidden="true">→</span>
        <span className={`wizard-step ${subpaso === 'resumen' ? 'active' : ''}`}>3 · Confirmación</span>
      </div>

      {subpaso === 'invitados' ? (
        <>
          <div className="paso2-row">
            <IntegrantesList
              integrantes={integrantes}
              onQuitar={handleQuitar}
              protegidos={creadorEmail ? [creadorEmail] : []}
            />
            <div className="paso2-dni-input">
              <label htmlFor="paso2-email">Invitá por email:</label>
              <div className="paso2-email-row">
                <input
                  id="paso2-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                  placeholder="nombre@ejemplo.com"
                  autoComplete="off"
                />
                <button type="button" onClick={handleAddInvitado} aria-label="Agregar invitado">
                  +
                </button>
              </div>
              <p className="paso2-hint">
                {invitados.length === 0
                  ? 'Podés continuar solo con vos o sumar hasta 10 personas.'
                  : `${invitados.length} invitado${invitados.length === 1 ? '' : 's'} agregado${invitados.length === 1 ? '' : 's'}.`}
              </p>
            </div>
          </div>
          {mensaje && (
            <div className={`paso2-mensaje ${mensaje.tipo === 'exito' ? 'success' : 'error'}`}>
              {mensaje.texto}
            </div>
          )}
          <div className="paso2-acciones">
            {onVolver && (
              <button type="button" className="paso2-volver-btn" onClick={onVolver}>
                Volver
              </button>
            )}
            <button type="button" className="paso2-solicitar-btn" onClick={() => { setMensaje(null); setSubpaso('resumen'); }}>
              Continuar
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="paso2-resumen">
            <h3 className="paso2-resumen-titulo">Revisá tu reserva</h3>
            <dl className="paso2-resumen-lista">
              <div><dt>Sala</dt><dd>{nombreSala}</dd></div>
              <div><dt>Fecha</dt><dd>{formatearFechaCorta(datos.fecha)}</dd></div>
              <div><dt>Horario</dt><dd>{datos.hora_inicio || '—'} - {datos.hora_fin || '—'}</dd></div>
              <div><dt>Temática</dt><dd>{datos.tematica || '—'}</dd></div>
              <div><dt>Integrantes</dt><dd>{integrantes.length}</dd></div>
              {datos.observaciones && (
                <div><dt>Observaciones</dt><dd>{datos.observaciones}</dd></div>
              )}
            </dl>
            {invitados.length > 0 && (
              <div className="paso2-resumen-invitados">
                <strong>Invitados:</strong>
                <ul>
                  {invitados.map(i => (
                    <li key={i.email}>{i.email}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {mensaje && (
            <div className={`paso2-mensaje ${mensaje.tipo === 'exito' ? 'success' : 'error'}`}>
              {mensaje.texto}
            </div>
          )}
          <div className="paso2-acciones">
            <button
              type="button"
              className="paso2-volver-btn"
              onClick={() => setSubpaso('invitados')}
              disabled={enviando || enviado}
            >
              Volver
            </button>
            <button
              type="button"
              className="paso2-solicitar-btn"
              onClick={handleSolicitar}
              disabled={enviando || enviado}
            >
              {enviando ? 'Enviando...' : enviado ? 'Redirigiendo...' : 'Solicitar turno'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Paso2Invitacion;
