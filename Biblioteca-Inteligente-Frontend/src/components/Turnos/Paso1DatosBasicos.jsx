import React, { useState, useEffect } from 'react';
import Paso2Invitacion from './Paso2Invitacion';
import '../../styles/Turnos/Paso1DatosBasicos.css';

export default function TurnoFormVista ({ usuario, onSolicitarExito }) {
  const [form, setForm] = useState({
    area: '',
    tematica: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    observaciones: ''
  });

  const [paso2, setPaso2] = useState(false);
  const [desplegado, setDesplegado] = useState(false);
  const [salas, setSalas] = useState([]);

  useEffect(() => {
    // Trae las salas desde la API al montar el componente
    fetch('http://localhost:3000/api/salas')
      .then(res => res.json())
      .then(data => setSalas(Array.isArray(data) ? data : []))
      .catch(() => setSalas([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Validar que las horas no estén vacías
    if (!form.hora_inicio || !form.hora_fin) {
      alert(`Debe completar la hora de inicio y fin. hora_inicio: ${form.hora_inicio} hora_fin: ${form.hora_fin}`);
      return;
    }
    setPaso2(true);
    // Aquí podrías pasar form como prop a Paso2Invitacion si lo necesitas
  };

  if (paso2) return <Paso2Invitacion creador={usuario ? { id: usuario.id, nombre: usuario.nombre, email: usuario.email, dni: usuario.dni } : {}} datosTurno={form} onSolicitarExito={onSolicitarExito} />;

  return (
    <form
      onSubmit={handleSubmit}
      className="turno-form"
    >
      <div className="turno-form-row">
        {/* Panel usuario */}
        <div className="turno-form-panel-usuario">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <span style={{
              fontSize: 36,
              color: '#888'
            }}>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#888" strokeWidth="2"/><path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" stroke="#888" strokeWidth="2"/></svg>
            </span>
            <span style={{ fontWeight: 600, fontSize: '1.15rem' }}>
              {usuario ? usuario.nombre : 'Cargando...'}
            </span>
            <button
              type="button"
              aria-label={desplegado ? "Ocultar datos" : "Mostrar datos"}
              onClick={() => setDesplegado(d => !d)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path
                  d={desplegado
                    ? "M7 14l5-5 5 5"
                    : "M7 10l5 5 5-5"}
                  stroke="#222"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div style={{ color: '#e53935', fontWeight: 500, fontSize: '1rem', marginTop: 4, marginBottom: desplegado ? 12 : 0, textAlign: 'left' }}>
            Revisa que la información sea correcta y esté actualizada.
          </div>
          {desplegado && usuario && (
            <div style={{ fontSize: '1rem', color: '#222', marginTop: 8, lineHeight: 1.7 , textAlign: 'left'}}>
              {usuario.nombres && <div><b>Nombre/s:</b> {usuario.nombres}</div>}
              {usuario.dni && <div><b>Nro. Documento:</b> {usuario.dni}</div>}
              {usuario.email && <div><b>Correo electrónico:</b> {usuario.email}</div>}
            </div>
          )}
        </div>
        {/* Formulario */}
        <div className="turno-form-panel-formulario">
          <div className="turno-form-row-inputs">
            <select
              name="area"
              value={form.area}
              onChange={handleChange}
              required
              className="turno-form-select"
            >
              <option value="">Área</option>
              {salas.map(sala => (
                <option key={sala.id} value={sala.nombre}>
                  {sala.nombre}
                </option>
              ))}
            </select>
            <input
              name="tematica"
              value={form.tematica}
              onChange={handleChange}
              placeholder="Tematica"
              required
              className="turno-form-input"
            />
          </div>
          <div className="turno-form-row-horario">
            <span className="turno-form-label">
              Fechas y horarios disponibles:
            </span>
            <span>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" stroke="#1976d2" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#1976d2" strokeWidth="2"/><path d="M3 10h18" stroke="#1976d2" strokeWidth="2"/></svg>
            </span>
            <input
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              required
              className="turno-form-input"
            />
            <input
              name="hora_inicio"
              type="time"
              value={form.hora_inicio}
              onChange={handleChange}
              required
              placeholder="Hora inicio"
              className="turno-form-input"
            />
            <input
              name="hora_fin"
              type="time"
              value={form.hora_fin}
              onChange={handleChange}
              required
              placeholder="Hora fin"
              className="turno-form-input"
            />
          </div>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Observaciones"
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
  );
}