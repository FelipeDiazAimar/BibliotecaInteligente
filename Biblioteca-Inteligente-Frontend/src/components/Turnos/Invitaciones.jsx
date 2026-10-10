import React, { useEffect, useState, useCallback } from 'react';
import { DEMO_MODE, DEMO_USER, demoDelay } from '../../lib/demo.js';
import {
  getInvitacionesPendientesDemo,
  responderInvitacionDemo,
  nombreSalaDe,
  formatearFechaCorta,
} from '../../data/demoTurnos';

export default function Invitaciones({ usuario }) {
  const perfil = usuario || (DEMO_MODE ? DEMO_USER : null);
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondiendo, setRespondiendo] = useState(null);

  const cargarInvitaciones = useCallback(async () => {
    if (!perfil) {
      setInvitaciones([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (DEMO_MODE) {
      await demoDelay(250);
      setInvitaciones(getInvitacionesPendientesDemo(perfil));
    } else {
      try {
        const res = await fetch(`http://localhost:3000/api/invitados/usuario/${perfil.id}/pendientes`);
        if (!res.ok) throw new Error('No se pudieron cargar las invitaciones');
        const data = await res.json();
        setInvitaciones(Array.isArray(data) ? data : []);
      } catch {
        setInvitaciones(getInvitacionesPendientesDemo(perfil));
      }
    }
    setLoading(false);
  }, [perfil?.id, perfil?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    cargarInvitaciones();
  }, [cargarInvitaciones]);

  const responderInvitacion = async (idInvitado, estado) => {
    setRespondiendo(idInvitado);
    if (DEMO_MODE) {
      await demoDelay(200);
      responderInvitacionDemo(idInvitado, estado);
    } else {
      try {
        const res = await fetch(`http://localhost:3000/api/invitados/${idInvitado}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado_invitacion: estado })
        });
        if (!res.ok) throw new Error('api');
      } catch {
        responderInvitacionDemo(idInvitado, estado);
      }
    }
    setRespondiendo(null);
    cargarInvitaciones();
  };

  if (loading) return <div className="turno-empty-msg">Cargando invitaciones...</div>;
  if (!Array.isArray(invitaciones) || invitaciones.length === 0) {
    return (
      <div className="turno-empty-msg">
        <span role="img" aria-label="sin invitaciones" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>✉️</span>
        <p style={{ margin: 0, fontWeight: 600 }}>No tenés invitaciones pendientes.</p>
        <p className="turno-empty-sub">Cuando alguien te invite a un turno, va a aparecer acá.</p>
      </div>
    );
  }

  return (
    <div className="invitaciones-lista">
      {invitaciones.map(inv => {
        const turno = inv?.Turno || {};
        const anfitrion = turno.Usuario?.nombre || turno.Usuario?.email || 'Usuario';
        const ocupado = respondiendo === inv.id;
        return (
          <div key={inv.id ?? `${turno.id}-${anfitrion}`} className="invitacion-card">
            <div className="invitacion-quien">
              <span className="invitacion-avatar" aria-hidden="true">👤</span>
              <div>
                <div className="invitacion-nombre">{anfitrion}</div>
                <div className="invitacion-tematica">{turno.tematica || 'Turno en biblioteca'}</div>
                <div className="invitacion-detalle">
                  {nombreSalaDe(turno)} · {formatearFechaCorta(turno.fecha)}
                  {(turno.hora_inicio || turno.hora_fin) && (
                    <> · {turno.hora_inicio || '—'} - {turno.hora_fin || '—'}</>
                  )}
                </div>
                {turno.Usuario?.dni && (
                  <div className="invitacion-detalle">DNI: {turno.Usuario.dni}</div>
                )}
              </div>
            </div>
            <div className="invitacion-accion">
              <div className="invitacion-texto">
                Invitación recibida de {anfitrion}.
              </div>
              <div className="invitacion-botones">
                <button
                  className="invitacion-aceptar"
                  onClick={() => responderInvitacion(inv.id, 'aceptado')}
                  disabled={ocupado}
                >
                  {ocupado ? 'Respondiendo...' : 'Aceptar'}
                </button>
                <button
                  className="invitacion-rechazar"
                  onClick={() => responderInvitacion(inv.id, 'rechazado')}
                  disabled={ocupado}
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
