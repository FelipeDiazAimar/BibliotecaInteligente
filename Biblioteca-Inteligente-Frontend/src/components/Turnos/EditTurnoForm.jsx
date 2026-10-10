import React, { useState, useEffect } from 'react';
import { DEMO_MODE, demoDelay, mensajeErrorAmable } from '../../lib/demo.js';
import {
  DEMO_SALAS,
  hoyISO,
  updateTurnoDemo,
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
    return DEMO_SALAS;
  }
}

export default function EditTurnoForm({ turno, onCancel, onSave, esAdmin, puedeEditarArea }) {
  const inicial = turno || {};
  const [form, setForm] = useState({
    tematica: inicial.tematica || '',
    fecha: inicial.fecha || '',
    hora_inicio: inicial.hora_inicio || '',
    hora_fin: inicial.hora_fin || '',
    observaciones: inicial.observaciones || '',
    id_sala: inicial.id_sala ?? inicial.Sala?.id ?? '',
    estado: inicial.estado || 'pendiente'
  });
  const [salas, setSalas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Cargar salas para el select
  useEffect(() => {
    let vivo = true;
    cargarSalas().then(lista => {
      if (vivo) setSalas(lista);
    });
    return () => { vivo = false; };
  }, []);

  // Si el turno trae la sala por nombre (forma de la API), resolver su id
  useEffect(() => {
    if (!form.id_sala && inicial.Sala?.nombre && salas.length > 0) {
      const match = salas.find(s => s.nombre === inicial.Sala.nombre);
      if (match) setForm(f => ({ ...f, id_sala: match.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salas]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validar = () => {
    if (!form.fecha) return 'Elegí una fecha.';
    if (form.fecha < hoyISO()) return 'La fecha debe ser hoy o una fecha futura.';
    if (!form.hora_inicio || !form.hora_fin) return 'Completá la hora de inicio y de fin.';
    if (form.hora_fin <= form.hora_inicio) return 'La hora de fin debe ser posterior a la de inicio.';
    if (!String(form.tematica || '').trim()) return 'La temática es obligatoria.';
    if (puedeEditarArea && !form.id_sala) return 'Elegí una sala de la lista.';
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fallo = validar();
    if (fallo) {
      setError(fallo);
      return;
    }
    setSaving(true);
    setError('');
    const limpio = {
      ...form,
      tematica: String(form.tematica || '').trim(),
      observaciones: String(form.observaciones || '').trim(),
    };
    try {
      if (DEMO_MODE) {
        await demoDelay(400);
        updateTurnoDemo(inicial.id, limpio);
      } else {
        try {
          const res = await fetch(`http://localhost:3000/api/turnos/${inicial.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(limpio)
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(mensajeErrorAmable(data.error, 'No se pudo guardar el turno. Intentá de nuevo.'));
          }
        } catch (err) {
          // Fallback local (solo sirve si el turno existe en demo)
          const ok = updateTurnoDemo(inicial.id, limpio);
          if (!ok) throw err;
        }
      }
      if (typeof onSave === 'function') onSave();
    } catch (err) {
      setError(err?.message || 'Error al guardar');
    }
    setSaving(false);
  };

  return (
    <form className="turno-edit-form" onSubmit={handleSubmit} noValidate>
      <div className="turno-edit-grid">
        {puedeEditarArea && (
          <label className="turno-edit-campo">
            <span>Área</span>
            <select
              name="id_sala"
              value={form.id_sala}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione área</option>
              {salas.map(sala => (
                <option key={sala.id} value={sala.id}>{sala.nombre}</option>
              ))}
            </select>
          </label>
        )}
        <label className="turno-edit-campo">
          <span>Temática</span>
          <input name="tematica" value={form.tematica} onChange={handleChange} required placeholder="Temática" />
        </label>
        <label className="turno-edit-campo">
          <span>Fecha</span>
          <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required min={hoyISO()} />
        </label>
        <label className="turno-edit-campo">
          <span>Inicio</span>
          <input name="hora_inicio" type="time" value={form.hora_inicio} onChange={handleChange} required />
        </label>
        <label className="turno-edit-campo">
          <span>Fin</span>
          <input name="hora_fin" type="time" value={form.hora_fin} onChange={handleChange} required />
        </label>
        {esAdmin && (
          <label className="turno-edit-campo">
            <span>Estado</span>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="aceptado">Aceptado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </label>
        )}
      </div>
      <textarea
        name="observaciones"
        value={form.observaciones}
        onChange={handleChange}
        placeholder="Observaciones"
        aria-label="Observaciones"
      />
      {error && <div className="turno-edit-error">{error}</div>}
      <div className="turno-edit-actions">
        <button type="submit" className="turno-card-cancelar turno-card-guardar" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className="turno-card-cancelar turno-card-volver" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
