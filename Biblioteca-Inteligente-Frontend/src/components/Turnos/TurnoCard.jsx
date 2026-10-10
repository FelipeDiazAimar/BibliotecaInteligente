import React, { useState } from 'react';
import EditTurnoForm from './EditTurnoForm';
import '../../styles/Turnos/TurnoCard.css';
import { DEMO_MODE } from '../../lib/demo.js';
import {
  removeTurnoDemo,
  normalizarTurno,
  nombreSalaDe,
  formatearFechaCorta,
} from '../../data/demoTurnos';

const ETIQUETAS_ESTADO = {
  pendiente: 'Pendiente',
  aceptado: 'Aceptado',
  cancelado: 'Cancelado',
};

export default function TurnoCard({ turno, usuario, recargarTurnos, esInvitado, puedeEditar, esAdmin }) {
  const [cancelando, setCancelando] = useState(false);
  const [editando, setEditando] = useState(false);

  if (!turno || typeof turno !== 'object') {
    return (
      <div className="turno-card">
        <div className="turno-card-info">Datos del turno no disponibles.</div>
      </div>
    );
  }

  const t = normalizarTurno(turno);
  const estado = t.estado || 'pendiente';

  const creador = t.Usuario?.nombre || t.Usuario?.email || usuario?.nombre || 'Usuario';
  const salaNombre = nombreSalaDe(t);
  const horario = t.hora_inicio || t.hora_fin
    ? `${t.hora_inicio || '—'} - ${t.hora_fin || '—'}`
    : 'Horario a convenir';

  // El creador o el admin pueden editar el área
  const puedeEditarArea = esAdmin || (usuario && t.id_usuario != null && usuario.id != null && String(t.id_usuario) === String(usuario.id));

  const nombreInvitado = inv => {
    if (!inv || typeof inv !== 'object') return 'Invitado';
    return inv.Usuario?.nombre || inv.Usuario?.email || inv.email || 'Invitado';
  };

  const claveInvitado = (inv, idx) => inv?.id ?? inv?.Usuario?.id ?? inv?.email ?? `inv-${idx}`;

  const handleCancelar = async () => {
    if (!window.confirm('¿Seguro que deseas cancelar este turno?')) return;
    setCancelando(true);
    try {
      if (DEMO_MODE) {
        removeTurnoDemo(t.id);
      } else {
        try {
          await fetch(`http://localhost:3000/api/turnos/${t.id}`, {
            method: 'DELETE'
          });
        } catch {
          // Fallback demo si el backend no responde
          removeTurnoDemo(t.id);
        }
      }
    } finally {
      setCancelando(false);
      if (typeof recargarTurnos === 'function') recargarTurnos();
    }
  };

  return (
    <div
      className={`turno-card turno-card-${estado}`}
    >
      <h2 className="turno-card-title">
        Turno para {salaNombre}
      </h2>
      {t.tematica && (
        <div className="turno-card-tematica">
          {t.tematica}
        </div>
      )}
      <div className="turno-card-info">
        <strong>Fecha:</strong> {formatearFechaCorta(t.fecha)}
      </div>
      <div className="turno-card-info">
        <strong>Hora:</strong> {horario}
      </div>
      <div className="turno-card-info">
        <strong>Creador:</strong> {creador}
      </div>
      <div className="turno-card-info">
        <strong>Integrantes:</strong> {t.cantidad_integrantes}
      </div>
      {t.InvitadosTurnos.length > 0 && (
        <div className="turno-card-info turno-card-invitados">
          <strong>Invitados:</strong>
          <ul>
            {t.InvitadosTurnos.map((inv, idx) => (
              <li key={claveInvitado(inv, idx)}>
                {nombreInvitado(inv)}
                {inv.estado_invitacion && (
                  <span className="turno-card-invitado-estado">
                    ({inv.estado_invitacion})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={`turno-card-estado turno-card-estado-${estado}`}>
        Estado: {ETIQUETAS_ESTADO[estado] || estado}
      </div>
      {esInvitado && (
        <div className="turno-card-info turno-card-invitado-tag">
          Invitado
        </div>
      )}
      <div className="turno-card-observaciones">
        {t.observaciones ? (
          <>📝 {t.observaciones}</>
        ) : (
          <>Sin observaciones</>
        )}
      </div>
      <div className="turno-card-actions">
        {!esInvitado && usuario && (
          <button
            className="turno-card-cancelar"
            onClick={handleCancelar}
            disabled={cancelando}
          >
            {cancelando ? 'Cancelando...' : 'Cancelar turno'}
          </button>
        )}
        {puedeEditar && !editando && (
          <button
            className="turno-card-cancelar turno-card-editar"
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
        )}
      </div>
      {puedeEditar && editando && (
        <EditTurnoForm
          turno={t}
          onCancel={() => setEditando(false)}
          onSave={() => {
            setEditando(false);
            if (typeof recargarTurnos === 'function') recargarTurnos();
          }}
          esAdmin={!!esAdmin}
          puedeEditarArea={puedeEditarArea}
        />
      )}
    </div>
  );
}
