import React, { useState, useEffect } from 'react';

export default function EditTurnoForm({ turno, onCancel, onSave, esAdmin, puedeEditarArea }) {
  const [form, setForm] = useState({
    tematica: turno.tematica || '',
    fecha: turno.fecha || '',
    hora_inicio: turno.hora_inicio || '',
    hora_fin: turno.hora_fin || '',
    observaciones: turno.observaciones || '',
    id_sala: turno.id_sala || '',
    estado: turno.estado || 'pendiente'
  });
  const [salas, setSalas] = useState([]);
  const [loadingSala, setLoadingSala] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Cargar salas para el select
  useEffect(() => {
    if (puedeEditarArea) {
      fetch('http://localhost:3000/api/salas')
        .then(res => res.json())
        .then(data => setSalas(Array.isArray(data) ? data : []))
        .catch(() => setSalas([]));
    }
  }, [puedeEditarArea]);

  // Cargar turno con sala para setear correctamente el área (id_sala)
  useEffect(() => {
    if (puedeEditarArea && turno.id) {
      setLoadingSala(true);
      fetch(`http://localhost:3000/api/turnos/conSala/${turno.id}`)
        .then(res => res.json())
        .then(data => {
          setForm(f => ({
            ...f,
            id_sala: data.Sala ? data.Sala.id : '',
          }));
        })
        .finally(() => setLoadingSala(false));
    }
  }, [puedeEditarArea, turno.id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3000/api/turnos/${turno.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al guardar');
      } else {
        onSave();
      }
    } catch {
      setError('Error de red');
    }
    setSaving(false);
  };

  return (
    <form className="turno-edit-form" onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 500, minWidth: 80 }}>Área:</label>
        {puedeEditarArea && (
          <select
            name="id_sala"
            value={form.id_sala}
            onChange={handleChange}
            required
            style={{ minWidth: 180 }}
            disabled={loadingSala}
          >
            <option value="">Seleccione área</option>
            {salas.map(sala => (
              <option key={sala.id} value={sala.id}>{sala.nombre}</option>
            ))}
          </select>
        )}
        <input name="tematica" value={form.tematica} onChange={handleChange} required placeholder="Temática" />
        <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required />
        <input name="hora_inicio" type="time" value={form.hora_inicio} onChange={handleChange} required />
        <input name="hora_fin" type="time" value={form.hora_fin} onChange={handleChange} required />
        {esAdmin && (
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
            style={{ minWidth: 120 }}
          >
            <option value="pendiente">Pendiente</option>
            <option value="aceptado">Aceptado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        )}
      </div>
      <textarea
        name="observaciones"
        value={form.observaciones}
        onChange={handleChange}
        placeholder="Observaciones"
        style={{ width: '100%', marginTop: 8 }}
      />
      {error && <div style={{ color: '#e53935', marginTop: 6 }}>{error}</div>}
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <button type="submit" className="turno-card-cancelar" style={{ background: '#43a047', color: '#fff' }} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className="turno-card-cancelar" style={{ background: '#bbb', color: '#222' }} onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
