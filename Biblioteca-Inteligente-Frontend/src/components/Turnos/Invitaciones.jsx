import React, { useEffect, useState } from 'react';

export default function Invitaciones({ usuario }) {
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarInvitaciones = () => {
    setLoading(true);
    fetch(`http://localhost:3000/api/invitados/usuario/${usuario.id}/pendientes`)
      .then(res => res.json())
      .then(data => setInvitaciones(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (usuario?.id) cargarInvitaciones();
  }, [usuario]);

  const responderInvitacion = async (idInvitado, estado) => {
    await fetch(`http://localhost:3000/api/invitados/${idInvitado}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado_invitacion: estado })
    });
    cargarInvitaciones();
  };

  if (loading) return <div>Cargando invitaciones...</div>;
  if (invitaciones.length === 0) return <div style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>No tienes invitaciones pendientes.</div>;

  return (
    <div style={{ marginTop: 24 }}>
      {invitaciones.map(inv => (
        <div key={inv.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px #b3c6e022',
          padding: '1.5rem 2rem',
          marginBottom: 24
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ fontSize: 38, color: '#888' }}>👤</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{inv.Turno.Usuario?.nombre || 'Usuario'}</div>
              <div style={{ fontSize: '1rem', color: '#222' }}>{inv.Turno.tematica}</div>
              <div style={{ fontSize: '0.98rem', color: '#444' }}>DNI: {inv.Turno.Usuario?.dni}</div>
            </div>
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ fontWeight: 500, marginBottom: 10 }}>
              Invitación recibida de {inv.Turno.Usuario?.nombre || 'Usuario'}.
            </div>
            <button
              style={{
                background: '#e8f5e9',
                color: '#388e3c',
                border: '1.5px solid #43a047',
                borderRadius: 8,
                padding: '0.6rem 1.5rem',
                fontWeight: 600,
                fontSize: '1.05rem',
                marginRight: 12,
                cursor: 'pointer'
              }}
              onClick={() => responderInvitacion(inv.id, 'aceptado')}
            >
              Aceptar
            </button>
            <button
              style={{
                background: '#ffebee',
                color: '#e53935',
                border: '1.5px solid #e57373',
                borderRadius: 8,
                padding: '0.6rem 1.5rem',
                fontWeight: 600,
                fontSize: '1.05rem',
                cursor: 'pointer'
              }}
              onClick={() => responderInvitacion(inv.id, 'rechazado')}
            >
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
