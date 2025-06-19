import React from 'react';

export default function IntegrantesList({ integrantes }) {
  return (
    <div style={{ flex: 1.5, padding: '1.5rem 1.5rem 1.5rem 0', minWidth: 260 }}>
      <div style={{
        fontWeight: 700,
        fontSize: '1.45rem',
        marginBottom: 18,
        color: '#1976d2',
        letterSpacing: 0.5
      }}>
        Integrantes
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {integrantes.map((user, idx) => (
          <div
            key={user.dni || user.nombre}
            style={{
              background: 'linear-gradient(90deg, #e3f2fd 0%, #f8fafc 100%)',
              border: '1.5px solid #dbeafe',
              borderRadius: 16,
              padding: '1.1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              boxShadow: '0 2px 10px #b3c6e022',
              minHeight: 72
            }}
          >
            <span style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#fff',
              border: '2.5px solid #90caf9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 4px #b3c6e033'
            }}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" stroke="#1976d2" strokeWidth="2"/>
                <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" stroke="#1976d2" strokeWidth="2"/>
              </svg>
            </span>
            <div>
              <div style={{
                fontWeight: 700,
                fontSize: '1.13rem',
                color: '#222',
                marginBottom: 2,
                letterSpacing: 0.2
              }}>
                {user.nombre}
              </div>
              <div style={{
                color: '#607d8b',
                fontSize: '0.97rem',
                fontWeight: 500,
                letterSpacing: 0.1
              }}>
                {user.email || user.carrera || ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
