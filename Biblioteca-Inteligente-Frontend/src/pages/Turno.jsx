import React, { useState, useEffect, useCallback } from 'react';
import Paso1DatosBasicos from '../components/Turnos/Paso1DatosBasicos';
import Header from '../components/Header';
import HeaderTurno from '../components/Turnos/HeaderTurno';
import { useNavigate, Link } from 'react-router-dom';
import TurnoCard from '../components/Turnos/TurnoCard';
import Invitaciones from '../components/Turnos/Invitaciones';
import '../styles/Turnos/TurnoPage.css';
import { useUser } from '../context/UserContext';
import { DEMO_MODE, DEMO_USER, demoDelay } from '../lib/demo.js';
import {
  getTurnosDemo,
  normalizarTurno,
  invitacionPerteneceA,
} from '../data/demoTurnos';

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

async function fetchTurnosApi() {
  // Solo un fetch, trae todos los turnos con invitados y salas
  const res = await fetch(`http://localhost:3000/api/turnos/full/all`);
  if (!res.ok) throw new Error('No se pudieron cargar los turnos');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
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

    let todos = [];
    if (DEMO_MODE) {
      await demoDelay(300);
      todos = getTurnosDemo();
    } else {
      try {
        todos = await fetchTurnosApi();
      } catch {
        // Fallback demo si el backend no responde
        todos = getTurnosDemo();
      }
    }

    const lista = todos.map(normalizarTurno);

    // Turnos creados por el usuario
    const creados = lista.filter(turno =>
      turno.id_usuario != null &&
      usuario.id != null &&
      String(turno.id_usuario) === String(usuario.id)
    );

    // Turnos donde el usuario es invitado y aceptó
    const invitado = lista.filter(turno =>
      Array.isArray(turno.InvitadosTurnos) &&
      turno.InvitadosTurnos.some(
        inv => invitacionPerteneceA(inv, usuario) && inv.estado_invitacion === 'aceptado'
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

  return { turnosCreados, turnosInvitado, loading, recargarTurnos: cargarTurnos, esAdmin };
}

function TurnosList({ turnos, usuario, recargarTurnos, esInvitado, esAdmin }) {
  const lista = Array.isArray(turnos) ? turnos : [];
  // Solo muestra turnos futuros para usuarios normales, admin ve todos
  const mostrarTurno = t =>
    esAdmin ||
    (!esInvitado && usuario && t.id_usuario != null && String(t.id_usuario) === String(usuario.id) && !turnoYaPaso(t)) ||
    (esInvitado && !turnoYaPaso(t));

  return lista.filter(mostrarTurno).map((turno, idx) => (
    <div
      key={(esInvitado ? 'invitado-' : 'creador-') + (turno.id ?? idx)}
      className="turno-card-wrapper"
    >
      <TurnoCard
        turno={turno}
        usuario={usuario}
        recargarTurnos={recargarTurnos}
        esInvitado={esInvitado}
        puedeEditar={
          esAdmin ||
          (!esInvitado && usuario && turno.id_usuario != null && String(turno.id_usuario) === String(usuario.id) && !turnoYaPaso(turno))
        }
        esAdmin={esAdmin}
      />
    </div>
  ));
}

export default function Turno({ usuario }) {
  const [tab, setTab] = useState('ver');
  const navigate = useNavigate();
  const { setUsuario } = useUser();

  // En demo se trabaja con el usuario demo aunque no haya sesión iniciada
  const usuarioEfectivo = usuario || (DEMO_MODE ? DEMO_USER : null);

  // Un solo fetch para todos los turnos
  const { turnosCreados, turnosInvitado, loading, recargarTurnos, esAdmin } = useTurnosFull(usuarioEfectivo, tab);

  useEffect(() => {
    if (!usuarioEfectivo) {
      navigate('/login', { replace: true });
    }
  }, [usuarioEfectivo, navigate]);

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('biblio_demo_session');
    try { localStorage.setItem('biblio_demo_closed', '1'); } catch {}
    setUsuario(null);
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
            <svg className="turno-back-icon" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        }
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginRight: '80px' }}>
            <Link to="/catalogo" className="panel-link">Catálogo</Link>
            <Link to="/contacto" className="panel-link">Contacto</Link>
          </div>
        }
        onLogout={onLogout}
      />
      <div style={{ height: 110 }} />
      <div className="turno-content">
        <HeaderTurno
          titulo="Turnos"
          subtitulo="Reservá salas, invitá por email y gestioná tus turnos."
        />
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
                <span role="img" aria-label="sin turnos" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>📅</span>
                <p style={{ margin: 0, fontWeight: 600 }}>No tenés turnos todavía.</p>
                <p className="turno-empty-sub">Reservá una sala en minutos e invitá a quien quieras por email.</p>
                <button type="button" className="turno-empty-cta" onClick={() => setTab('crear')}>
                  Reservar un turno
                </button>
              </div>
            ) : (
              <div className="turno-cards-list">
                <TurnosList
                  turnos={turnosCreados}
                  usuario={usuarioEfectivo}
                  recargarTurnos={recargarTurnos}
                  esInvitado={false}
                  esAdmin={esAdmin}
                />
                <TurnosList
                  turnos={turnosInvitado}
                  usuario={usuarioEfectivo}
                  recargarTurnos={recargarTurnos}
                  esInvitado={true}
                  esAdmin={esAdmin}
                />
              </div>
            )}
          </div>
        ) : tab === 'crear' ? (
          <Paso1DatosBasicos usuario={usuarioEfectivo} logout={onLogout} onSolicitarExito={() => setTab('ver')} />
        ) : (
          <Invitaciones usuario={usuarioEfectivo} />
        )}
      </div>
      <footer className="panel-footer">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}
