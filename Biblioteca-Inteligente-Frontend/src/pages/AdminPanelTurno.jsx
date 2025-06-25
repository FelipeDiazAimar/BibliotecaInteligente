import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import TurnoCard from '../components/Turnos/TurnoCard';
import Footer from '../components/Footer';
import '../styles/Turnos/TurnosBiblioteca.css';

// Helper para saber si un turno ya pasó
function turnoYaPaso(turno) {
  if (!turno.fecha || !turno.hora_fin) return false;
  const fechaHoraFin = new Date(`${turno.fecha}T${turno.hora_fin}`);
  return fechaHoraFin < new Date();
}

export default function TurnosBiblioteca({ logout }) {
  const { usuario } = useUser();
  const [turnos, setTurnos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUsuario } = useUser();

  useEffect(() => {
    recargarTurnos();
    // eslint-disable-next-line
  }, []);

  const recargarTurnos = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/turnos/full/all')
      .then(res => res.json())
      .then(data => setTurnos(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    navigate('/login');
  };

  // Filtro y búsqueda
  const turnosFiltrados = turnos.filter(t => {
    const coincideEstado = !filtroEstado || t.estado === filtroEstado;
    const coincideBusqueda =
      !busqueda ||
      (t.tematica && t.tematica.toLowerCase().includes(busqueda.toLowerCase())) ||
      (t.area && t.area.toLowerCase().includes(busqueda.toLowerCase())) ||
      (t.Usuario && t.Usuario.nombre && t.Usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    return coincideEstado && coincideBusqueda;
  });

  if (!usuario) return <div>Cargando usuario...</div>;
  if (loading) return <div className="turnos-biblio-msg">Cargando turnos...</div>;

  return (
    <>
      <Header onLogout={logout} />
      <div style={{ height: 110 }} />
      <div className="turnos-biblio-bg">
        {/* Elimino la barra de tabs secundaria para evitar duplicidad visual */}
        <div className="turnos-biblio-filtros">
          <input
            className="turnos-biblio-busqueda"
            type="text"
            placeholder="Buscar por usuario, temática o área..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <select
            className="turnos-biblio-select"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aceptado">Aceptado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div className="turnos-biblio-lista">
          {turnosFiltrados.length === 0 ? (
            <div className="turnos-biblio-msg">
              <span role="img" aria-label="info" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>📅</span>
              No hay turnos para mostrar.
            </div>
          ) : (
            turnosFiltrados.map(turno => (
              <div key={turno.id} className="turnos-biblio-cardwrap">
                <TurnoCard
                  turno={turno}
                  usuario={turno.Usuario || {}} // para mostrar datos del usuario creador
                  recargarTurnos={recargarTurnos}
                  esInvitado={false}
                  puedeEditar={true}
                  esAdmin={true}
                />
                <div className="turnos-biblio-usuario">
                  <b>Usuario:</b> {turno.Usuario?.nombre || 'Desconocido'}<br />
                  <b>DNI:</b> {turno.Usuario?.dni || '-'}
                  {turnoYaPaso(turno) && (
                    <span style={{ color: '#e53935', marginLeft: 8 }}>(Finalizado)</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
