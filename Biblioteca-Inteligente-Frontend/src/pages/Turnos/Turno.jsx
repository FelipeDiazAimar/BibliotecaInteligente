import React, { useState, useEffect, useCallback } from 'react';
import Paso1DatosBasicos from '../../components/Turnos/Paso1DatosBasicos';
import Header from '../../components/Header';
import { useNavigate, Link } from 'react-router-dom';
import TurnoCard from '../../components/Turnos/TurnoCard';
import Invitaciones from '../../components/Turnos/Invitaciones';
import '../../styles/Turnos/TurnoPage.css';

function TabButton({ active, onClick, children, borderRadius }) {
  return (
    <button
      className={`turno-tab-btn${active ? ' active' : ''}`}
      onClick={onClick}
      style={{
        borderTopLeftRadius: borderRadius?.left || 0,
        borderTopRightRadius: borderRadius?.right || 0
      }}
    >
      {children}
    </button>
  );
}

function turnoYaPaso(turno) {
  if (!turno.fecha || !turno.hora_fin) return false;
  const fechaHoraFin = new Date(`${turno.fecha}T${turno.hora_fin}`);
  return fechaHoraFin < new Date();
}

// Hook para obtener y clasificar todos los turnos en uno solo fetch
function useTurnosFull(usuario, tab) {
  const [turnosCreados, setTurnosCreados] = useState([]);
  const [turnosInvitado, setTurnosInvitado] = useState([]);
  const [loading, setLoading] = useState(false);

  const esAdmin = usuario?.rol === 'admin';

  const cargarTurnos = useCallback(async () => {
    if (!usuario) return;
    setLoading(true);

    // Solo un fetch, trae todos los turnos con invitados y salas
    const todos = await fetch(`http://localhost:3000/api/turnos/full/all`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? data : [])
      .catch(() => []);

    // Turnos creados por el usuario
    const creados = todos.filter(turno => turno.id_usuario === usuario.id);

    // Turnos donde el usuario es invitado y aceptó
    const invitado = todos.filter(turno =>
      Array.isArray(turno.InvitadosTurnos) &&
      turno.InvitadosTurnos.some(
        inv => inv.Usuario && inv.Usuario.id === usuario.id && inv.estado_invitacion === 'aceptado'
      )
    );

    setTurnosCreados(creados);
    setTurnosInvitado(invitado);
    setLoading(false);
  }, [usuario]);

  useEffect(() => {
    if (tab === 'ver' && usuario) {
      cargarTurnos();
    }
  }, [tab, usuario, cargarTurnos]);

  return { turnosCreados, turnosInvitado, loading, esAdmin };
}

function TurnosList({ turnos, usuario, recargarTurnos, esInvitado, esAdmin }) {
  // Solo muestra turnos futuros para usuarios normales, admin ve todos
  const mostrarTurno = t =>
    esAdmin ||
    (!esInvitado && usuario && t.id_usuario === usuario.id && !turnoYaPaso(t)) ||
    (esInvitado && !turnoYaPaso(t));

  return turnos.filter(mostrarTurno).map(turno => (
    <div
      key={(esInvitado ? 'invitado-' : 'creador-') + turno.id}
      className="turno-card-wrapper"
    >
      <TurnoCard
        turno={turno}
        usuario={usuario}
        recargarTurnos={recargarTurnos}
        esInvitado={esInvitado}
        puedeEditar={
          esAdmin ||
          (!esInvitado && usuario && turno.id_usuario === usuario.id && !turnoYaPaso(turno))
        }
        esAdmin={esAdmin}
      />
    </div>
  ));
}

export default function Turno({ usuario }) {
  const [tab, setTab] = useState('ver');
  const navigate = useNavigate();

  // Un solo fetch para todos los turnos
  const { turnosCreados, turnosInvitado, loading, esAdmin } = useTurnosFull(usuario, tab);

  useEffect(() => {
    if (!usuario) {
      navigate('/login', { replace: true });
    }
  }, [usuario, navigate]);

  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const noTurnos =
    (!Array.isArray(turnosCreados) || turnosCreados.length === 0) &&
    (!Array.isArray(turnosInvitado) || turnosInvitado.length === 0);

  return (
    <div className="turno-main-bg">
      <Header
        left={
          <button
            className="panel-back-btn"
            onClick={() => window.history.back()}
            aria-label="Atrás"
          >
            <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        }
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginRight: '80px' }}>
            <Link to="/catalogo" className="panel-link">Catálogo</Link>
            <Link to="/contacto" className="panel-link">Contacto</Link>
            <button
              type="button"
              className="panel-link"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}
              onClick={onLogout}
            >
              Cerrar sesión
            </button>
          </div>
        }
      />
      <div style={{ height: 110 }} />
      <div className="turno-content">
        <div className="turno-titulo">Turnos</div>
        <div className="turno-tabs-row">
          <TabButton
            active={tab === 'ver'}
            onClick={() => setTab('ver')}
            borderRadius={{ left: 14, right: 0 }}
          >
            Ver turnos
          </TabButton>
          <TabButton
            active={tab === 'crear'}
            onClick={() => setTab('crear')}
            borderRadius={{ left: 0, right: 0 }}
          >
            Crear turno
          </TabButton>
          <TabButton
            active={tab === 'invitaciones'}
            onClick={() => setTab('invitaciones')}
            borderRadius={{ left: 0, right: 14 }}
          >
            Invitaciones
          </TabButton>
        </div>
        {tab === 'ver' ? (
          <div className="turno-list-container">
            {loading ? (
              <div className="turno-empty-msg">Cargando turnos...</div>
            ) : noTurnos ? (
              <div className="turno-empty-msg">
                <span role="img" aria-label="info" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>📅</span>
                No hay turnos para mostrar.
              </div>
            ) : (
              <div className="turno-cards-list">
                <TurnosList
                  turnos={turnosCreados}
                  usuario={usuario}
                  recargarTurnos={() => {}}
                  esInvitado={false}
                  esAdmin={esAdmin}
                />
                <TurnosList
                  turnos={turnosInvitado}
                  usuario={usuario}
                  recargarTurnos={() => {}}
                  esInvitado={true}
                  esAdmin={esAdmin}
                />
              </div>
            )}
          </div>
        ) : tab === 'crear' ? (
          <Paso1DatosBasicos usuario={usuario} logout={onLogout} onSolicitarExito={() => setTab('ver')} />
        ) : (
          <Invitaciones usuario={usuario} />
        )}
      </div>
      <footer className="panel-footer">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}