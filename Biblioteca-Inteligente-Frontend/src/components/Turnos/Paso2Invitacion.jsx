import React, { useState, useEffect } from 'react';
import IntegrantesList from './IntegrantesList';
import '../../styles/Turnos/Paso2Invitacion.css';

function Paso2Invitacion({ creador = { nombre: '', dni: '', id: '' }, datosTurno, onSolicitarExito }) {
  const [dni, setDni] = useState('');
  const [integrantes, setIntegrantes] = useState([creador]);
  const [mensaje, setMensaje] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [salas, setSalas] = useState([]);
  const [salaId, setSalaId] = useState('');
  // const navigate = useNavigate(); // Elimina esta línea si no usas navigate

  useEffect(() => {
    // Obtener todas las salas al montar el componente
    fetch('http://localhost:3000/api/salas')
      .then(res => res.json())
      .then(data => setSalas(data))
      .catch(() => setSalas([]));
  }, []);

  useEffect(() => {
    // Si el área seleccionada en datosTurno.area coincide con una sala, setear el id
    if (salas.length && datosTurno.area) {
      const sala = salas.find(s => s.nombre === datosTurno.area);
      setSalaId(sala ? sala.id : '');
    }
  }, [salas, datosTurno.area]);

  const handleAddIntegrante = async () => {
    if (!dni.trim()) return;
    if (integrantes.some(i => i.dni === dni)) {
      setMensaje('El integrante ya fue añadido.');
      return;
    }
    setBuscando(true);
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/dni/${dni}`);
      if (!res.ok) {
        setMensaje('No se encontró un usuario con ese DNI.');
        setBuscando(false);
        return;
      }
      const usuario = await res.json();
      setIntegrantes([...integrantes, usuario]);
      setMensaje('');
    } catch {
      setMensaje('Error al buscar el usuario.');
    }
    setBuscando(false);
    setDni('');
  };

  const handleSolicitar = async () => {
    setEnviando(true);
    setMensaje('');
    try {
      // Validar que los campos de hora estén completos antes de enviar
      if (!datosTurno.hora_inicio || !datosTurno.hora_fin) {
        setMensaje('Debe completar la hora de inicio y fin.');
        setEnviando(false);
        return;
      }
      if (!salaId) {
        setMensaje('Debe seleccionar un área válida.');
        setEnviando(false);
        return;
      }
      const body = {
        fecha: datosTurno.fecha,
        hora_inicio: datosTurno.hora_inicio,
        hora_fin: datosTurno.hora_fin,
        tematica: datosTurno.tematica,
        cantidad_integrantes: integrantes.length,
        observaciones: datosTurno.observaciones,
        id_usuario: creador.id,
        id_sala: salaId
      };
      // Evitar enviar strings vacíos para hora_inicio y hora_fin
      if (!body.hora_inicio.trim() || !body.hora_fin.trim()) {
        setMensaje('Debe completar la hora de inicio y fin.');
        setEnviando(false);
        return;
      }
      const res = await fetch('http://localhost:3000/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const error = await res.json();
        setMensaje(error.error || 'No se pudo crear el turno.');
      } else {
        const turnoCreado = await res.json();
        // Guardar los integrantes invitados en la base de datos
        for (const invitado of integrantes) {
          if (invitado.id !== creador.id) {
            await fetch('http://localhost:3000/api/invitados', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id_turno: turnoCreado.id,
                id_usuario: invitado.id,
                estado_invitacion: 'pendiente'
              })
            });
          }
        }
        setMensaje('El turno fue solicitado correctamente.');
        setEnviado(true);
        if (onSolicitarExito) {
          setTimeout(() => {
            onSolicitarExito();
          }, 1200);
        }
      }
    } catch {
      setMensaje('No se pudo crear el turno.');
    }
    setEnviando(false);
  };

  return (
    <div className="paso2-container">
      <div className="paso2-row">
        <IntegrantesList integrantes={integrantes} />
        <div className="paso2-dni-input" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 12 }}>
          <label>
            Ingrese el DNI de los integrantes:
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="text"
              value={dni}
              onChange={e => setDni(e.target.value)}
              disabled={buscando}
              style={{ color: 'black' }}
            />
            <button
              type="button"
              onClick={handleAddIntegrante}
              disabled={buscando}
            >
              {buscando ? 'Buscando...' : '+'}
            </button>
          </div>
        </div>
      </div>
      {mensaje && (
        <div className={`paso2-mensaje${mensaje.includes('correctamente') ? ' success' : ' error'}`}>
          {mensaje}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <button
          className="paso2-solicitar-btn"
          onClick={handleSolicitar}
          disabled={enviando || enviado}
        >
          {enviando ? 'Enviando...' : enviado ? 'Redirigiendo...' : 'Solicitar turno'}
        </button>
      </div>
    </div>
  );
}

export default Paso2Invitacion;
