import React from 'react';

/**
 * IntegrantesList — Lista robusta de integrantes.
 * - Tolera datos incompletos (sin nombre, sin email, etc.).
 * - `onQuitar(email)` opcional: muestra botón para quitar.
 * - `protegidos`: ids o emails que no se pueden quitar (ej. el creador).
 */
export default function IntegrantesList({ integrantes = [], onQuitar, protegidos = [], titulo = 'Integrantes' }) {
  const lista = Array.isArray(integrantes) ? integrantes : [];
  const bloqueados = Array.isArray(protegidos) ? protegidos : [];

  const estaProtegido = user => {
    if (typeof onQuitar !== 'function') return true;
    return bloqueados.some(p => {
      if (p === null || p === undefined || p === '') return false;
      if (user?.id !== null && user?.id !== undefined && String(p) === String(user.id)) return true;
      const mail = String(user?.email || '').toLowerCase();
      return mail !== '' && String(p).toLowerCase() === mail;
    });
  };

  const claveDe = (user, idx) => {
    if (user?.id !== null && user?.id !== undefined && user.id !== '') return `id-${user.id}`;
    if (user?.email) return `mail-${String(user.email).toLowerCase()}`;
    if (user?.dni) return `dni-${user.dni}`;
    return `integrante-${idx}`;
  };

  return (
    <div className="integrantes-wrap">
      <div className="integrantes-title">
        {titulo || 'Integrantes'}
      </div>
      {lista.length === 0 ? (
        <div className="integrantes-empty">
          Todavía no hay integrantes.
        </div>
      ) : (
        <div className="integrantes-list">
          {lista.map((user, idx) => {
            const nombre = user?.nombre || user?.nombres || user?.email || 'Invitado';
            const detalle = user?.email || user?.dni || user?.carrera || '';
            const protegido = estaProtegido(user);
            return (
              <div
                key={claveDe(user, idx)}
                className="integrante-card"
              >
                <span className="integrante-avatar" aria-hidden="true">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#1976d2">
                    <circle cx="12" cy="8" r="4" strokeWidth="2"/>
                    <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" strokeWidth="2"/>
                  </svg>
                </span>
                <div className="integrante-main">
                  <div className="integrante-name">
                    {nombre}
                  </div>
                  {detalle ? (
                    <div className="integrante-detail">
                      {detalle}
                    </div>
                  ) : null}
                </div>
                {typeof onQuitar === 'function' && !protegido && (
                  <button
                    type="button"
                    className="paso2-quitar-btn"
                    onClick={() => onQuitar(user?.email || '')}
                    aria-label={`Quitar a ${nombre}`}
                    title="Quitar"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
