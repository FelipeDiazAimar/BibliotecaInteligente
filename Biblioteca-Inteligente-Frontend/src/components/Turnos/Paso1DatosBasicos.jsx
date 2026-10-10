import React, { useState, useEffect } from 'react';
import Paso2Invitacion from './Paso2Invitacion';
import '../../styles/Turnos/Paso1DatosBasicos.css';
import { DEMO_MODE, demoDelay } from '../../lib/demo.js';
import {
  DEMO_SALAS,
  hoyISO,
  validarPaso1,
} from '../../data/demoTurnos';

async function cargarSalas() {
  if (DEMO_MODE) {
    await demoDelay(250);
    return DEMO_SALAS;
  }
  try {
    const res = await fetch('http://localhost:3000/api/salas');
    if (!res.ok) throw new Error('No se pudieron cargar las salas');
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : DEMO_SALAS;
  } catch {
    // Fallback demo: la reserva sigue funcionando sin backend
    return DEMO_SALAS;
  }
}

export default function TurnoFormVista ({ usuario, onSolicitarExito }) {
  const [form, setForm] = useState({
    id_sala: '',
    tematica: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    observaciones: ''
  });
  const [errores, setErrores] = useState({});
  const [paso2, setPaso2] = useState(false);
  const [desplegado, setDesplegado] = useState(false);
  const [salas, setSalas] = useState([]);
  const [cargandoSalas, setCargandoSalas] = useState(true);

  useEffect(() => {
    let vivo = true;
    cargarSalas().then(lista => {
      if (vivo) {
        setSalas(lista);
        setCargandoSalas(false);
      }
    });
    return () => { vivo = false; };
  }, []);

  const salaElegida = salas.find(s => String(s.id) === String(form.id_sala)) || null;
  const ofertaHoraria = Array.isArray(salaElegida?.horarios) ? salaElegida.horarios : [];
  const hoy = hoyISO();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => {
      const next = { ...f, [name]: value };
      // Cada sala tiene su propia oferta: al cambiarla se reinician los horarios
      if (name === 'id_sala') {
        next.hora_inicio = '';
        next.hora_fin = '';
      }
      return next;
    });
    setErrores(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const fallos = validarPaso1(form, salas);
    setErrores(fallos);
    if (Object.keys(fallos).length > 0) return;
    setPaso2(true);
  };

  if (paso2) {
    const datosTurno = {
      id_sala: form.id_sala,
      area: salaElegida ? salaElegida.nombre : '',
      fecha: form.fecha,
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin,
      tematica: form.tematica.trim(),
      observaciones: form.observaciones.trim()
    };
    const creador = usuario
      ? { id: usuario.id, nombre: usuario.nombre || usuario.nombres || 'Usuario', email: usuario.email || '', dni: usuario.dni || '' }
      : { id: null, nombre: 'Usuario demo', email: '', dni: '' };
    return (
      <Paso2Invitacion
        creador={creador}
        datosTurno={datosTurno}
        onSolicitarExito={onSolicitarExito}
        onVolver={() => setPaso2(false)}
      />
    );
  }

  const nombreUsuario = (usuario && (usuario.nombre || usuario.nombres)) || 'Usuario demo';

  const inputConError = campo => (errores[campo] ? 'turno-form-input input-error' : 'turno-form-input');
  const selectConError = campo => (errores[campo] ? 'turno-form-select input-error' : 'turno-form-select');

  return (
    <div className="turno-wizard">
      <div className="wizard-steps" aria-label="Progreso de la reserva">
        <span className="wizard-step active">1 · Datos</span>
        <span className="wizard-step-sep" aria-hidden="true">→</span>
        <span className="wizard-step">2 · Invitados</span>
        <span className="wizard-step-sep" aria-hidden="true">→</span>
        <span className="wizard-step">3 · Confirmación</span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="turno-form"
        noValidate
      >
        <div className="turno-form-row">
          {/* Panel usuario */}
          <div className="turno-form-panel-usuario">
            <div className="turno-user-head">
              <span className="turno-user-icon" aria-hidden="true">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" strokeWidth="2"/><path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" strokeWidth="2"/></svg>
              </span>
              <span className="turno-user-name">
                {nombreUsuario}
              </span>
              <button
                type="button"
                className="turno-user-toggle"
                aria-label={desplegado ? "Ocultar datos" : "Mostrar datos"}
                onClick={() => setDesplegado(d => !d)}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d={desplegado
                      ? "M7 14l5-5 5 5"
                      : "M7 10l5 5 5-5"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="turno-user-warning" style={{ marginBottom: desplegado ? 12 : 0 }}>
              Revisa que la información sea correcta y esté actualizada.
            </div>
            {desplegado && usuario && (
              <div className="turno-user-detail">
                {(usuario.nombres || usuario.nombre) && <div><b>Nombre/s:</b> {usuario.nombres || usuario.nombre}</div>}
                {usuario.dni && <div><b>Nro. Documento:</b> {usuario.dni}</div>}
                {usuario.email && <div><b>Correo electrónico:</b> {usuario.email}</div>}
              </div>
            )}
          </div>
          {/* Formulario */}
          <div className="turno-form-panel-formulario">
            <div className="turno-form-row-inputs">
              <div className="turno-form-campo">
                <select
                  name="id_sala"
                  value={form.id_sala}
                  onChange={handleChange}
                  required
                  className={selectConError('id_sala')}
                  disabled={cargandoSalas}
                  aria-label="Sala"
                >
                  <option value="">{cargandoSalas ? 'Cargando salas…' : 'Sala'}</option>
                  {salas.map(sala => (
                    <option key={sala.id} value={sala.id}>
                      {sala.nombre}{sala.capacidad ? ` (cap. ${sala.capacidad})` : ''}
                    </option>
                  ))}
                </select>
                {errores.id_sala && <div className="campo-error">{errores.id_sala}</div>}
              </div>
              <div className="turno-form-campo">
                <input
                  name="tematica"
                  value={form.tematica}
                  onChange={handleChange}
                  placeholder="Temática"
                  required
                  aria-label="Temática"
                  className={inputConError('tematica')}
                />
                {errores.tematica && <div className="campo-error">{errores.tematica}</div>}
              </div>
            </div>
            <div className="turno-form-row-horario">
              <span className="turno-form-label">
                Fechas y horarios disponibles:
              </span>
              <span>
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" stroke="#1976d2" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#1976d2" strokeWidth="2"/><path d="M3 10h18" stroke="#1976d2" strokeWidth="2"/></svg>
              </span>
              <div className="turno-form-campo">
                <input
                  name="fecha"
                  type="date"
                  value={form.fecha}
                  onChange={handleChange}
                  required
                  min={hoy}
                  aria-label="Fecha del turno"
                  className={inputConError('fecha')}
                />
                {errores.fecha && <div className="campo-error">{errores.fecha}</div>}
              </div>
              {ofertaHoraria.length > 0 ? (
                <>
                  <div className="turno-form-campo">
                    <select
                      name="hora_inicio"
                      value={form.hora_inicio}
                      onChange={handleChange}
                      required
                      aria-label="Hora de inicio"
                      className={selectConError('hora_inicio')}
                    >
                      <option value="">Inicio</option>
                      {ofertaHoraria.map(h => (
                        <option key={`ini-${h}`} value={h}>{h}</option>
                      ))}
                    </select>
                    {errores.hora_inicio && <div className="campo-error">{errores.hora_inicio}</div>}
                  </div>
                  <div className="turno-form-campo">
                    <select
                      name="hora_fin"
                      value={form.hora_fin}
                      onChange={handleChange}
                      required
                      aria-label="Hora de fin"
                      className={selectConError('hora_fin')}
                    >
                      <option value="">Fin</option>
                      {ofertaHoraria.map(h => (
                        <option key={`fin-${h}`} value={h}>{h}</option>
                      ))}
                    </select>
                    {errores.hora_fin && <div className="campo-error">{errores.hora_fin}</div>}
                  </div>
                </>
              ) : (
                <>
                  <div className="turno-form-campo">
                    <input
                      name="hora_inicio"
                      type="time"
                      value={form.hora_inicio}
                      onChange={handleChange}
                      required
                      aria-label="Hora de inicio"
                      className={inputConError('hora_inicio')}
                    />
                    {errores.hora_inicio && <div className="campo-error">{errores.hora_inicio}</div>}
                  </div>
                  <div className="turno-form-campo">
                    <input
                      name="hora_fin"
                      type="time"
                      value={form.hora_fin}
                      onChange={handleChange}
                      required
                      aria-label="Hora de fin"
                      className={inputConError('hora_fin')}
                    />
                    {errores.hora_fin && <div className="campo-error">{errores.hora_fin}</div>}
                  </div>
                </>
              )}
            </div>
            {salaElegida?.descripcion && (
              <div className="turno-form-hint">{salaElegida.descripcion}</div>
            )}
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Observaciones (opcional)"
              aria-label="Observaciones"
              className="turno-form-textarea"
            />
            <div className="turno-form-boton-row">
              <button
                type="submit"
                className="turno-form-boton"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
