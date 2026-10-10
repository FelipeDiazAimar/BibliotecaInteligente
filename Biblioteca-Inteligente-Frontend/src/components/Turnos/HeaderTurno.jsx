import React from 'react';

/**
 * HeaderTurno — Encabezado presentacional del módulo Turnos.
 * No depende de datos: siempre renderiza aunque falten props.
 */
export default function HeaderTurno({ titulo = 'Turnos', subtitulo, extra }) {
  return (
    <div className="turno-header-modulo">
      <h1 className="turno-titulo">{titulo || 'Turnos'}</h1>
      {subtitulo ? <p className="turno-subtitulo">{subtitulo}</p> : null}
      {extra ? <div className="turno-header-extra">{extra}</div> : null}
    </div>
  );
}
