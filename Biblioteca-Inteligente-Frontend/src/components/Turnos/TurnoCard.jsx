import React, { useState } from 'react';
import EditTurnoForm from './EditTurnoForm';
import '../../styles/Turnos/TurnoCard.css';

export default function TurnoCard({ turno, usuario, recargarTurnos, esInvitado, puedeEditar, esAdmin }) {
  const [cancelando, setCancelando] = useState(false);
  const [editando, setEditando] = useState(false);

  // Obtiene el nombre del creador si está disponible
  const creador = turno.Usuario ? turno.Usuario.nombre : (usuario ? usuario.nombre : '');

  // Corrige la visualización de la fecha para evitar desfase por zona horaria
  function formatFecha(fechaStr) {
    if (!fechaStr) return '';
    // Mostrar la fecha como está (YYYY-MM-DD) para evitar desfase
    const [year, month, day] = fechaStr.split('-');
    return `${day}/${month}/${year}`;
  }

  // El creador o el admin pueden editar el área
  const puedeEditarArea = esAdmin || (usuario && turno.id_usuario === usuario.id);

  // Usa el nombre del área para el título
  const area = turno.Sala.nombre || (turno.Sala && turno.Sala.nombre) || 'Área';

  return (
    <div
      className={`turno-card turno-card-${turno.estado}`}
    >
      <h2 className="turno-card-title">
        Turno para {area}
      </h2>
      {turno.tematica && (
        <div style={{
          fontSize: '1.08rem',
          color: '#1976d2',
          fontWeight: 600,
          marginBottom: 8,
          marginTop: -2
        }}>
          {turno.tematica}
        </div>
      )}
      <div className="turno-card-info">
        <strong>Fecha:</strong> {formatFecha(turno.fecha)}
      </div>
      <div className="turno-card-info">
        <strong>Hora:</strong> {turno.hora_inicio} - {turno.hora_fin}
      </div>
      <div className="turno-card-info">
        <strong>Creador:</strong> {creador}
      </div>
      <div className="turno-card-info">
        <strong>Integrantes:</strong> {turno.cantidad_integrantes}
      </div>
      {turno.InvitadosTurnos && Array.isArray(turno.InvitadosTurnos) && turno.InvitadosTurnos.length > 0 && (
        <div className="turno-card-info" style={{ marginTop: 8 }}>
          <strong>Invitados:</strong>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {turno.InvitadosTurnos.map((inv, idx) => (
              <li key={inv.Usuario?.id || idx}>
                {inv.Usuario?.nombre || inv.Usuario?.email || 'Invitado'}
                {inv.estado_invitacion && (
                  <span style={{ color: '#888', marginLeft: 8, fontSize: '0.95em' }}>
                    ({inv.estado_invitacion})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={`turno-card-estado turno-card-estado-${turno.estado}`}>
        Estado: {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
      </div>
      {esInvitado && (
        <div className="turno-card-info" style={{ color: '#1976d2', fontWeight: 600, marginBottom: 8 }}>
          Invitado
        </div>
      )}
      <div className="turno-card-observaciones">
        {turno.observaciones ? (
          <>📝 {turno.observaciones}</>
        ) : (
          <>Sin observaciones</>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {!esInvitado && usuario && (
          <button
            className="turno-card-cancelar"
            onClick={async () => {
              if (window.confirm('¿Seguro que deseas cancelar este turno?')) {
                setCancelando(true);
                await fetch(`http://localhost:3000/api/turnos/${turno.id}`, {
                  method: 'DELETE'
                });
                setCancelando(false);
                recargarTurnos();
              }
            }}
            disabled={cancelando}
          >
            {cancelando ? 'Cancelando...' : 'Cancelar turno'}
          </button>
        )}
        {puedeEditar && !editando && (
          <button
            className="turno-card-cancelar"
            style={{ background: 'linear-gradient(90deg, #ffd600 60%, #fffde7 100%)', color: '#222' }}
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
        )}
      </div>
      {puedeEditar && editando && (
        <EditTurnoForm
          turno={turno}
          onCancel={() => setEditando(false)}
          onSave={() => {
            setEditando(false);
            recargarTurnos();
          }}
          esAdmin={!!esAdmin}
          puedeEditarArea={puedeEditarArea}
        />
      )}
    </div>
  );
}
