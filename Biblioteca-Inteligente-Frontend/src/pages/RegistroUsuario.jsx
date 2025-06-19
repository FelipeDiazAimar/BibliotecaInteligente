import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegistroUsuario.css';
import Navbar from '../components/Navbar';

function Toast({ show, message, type, onClose }) {
  if (!show) return null;
  return (
    <div
      className={`registro-toast ${type}`}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

function RegistroUsuario({ onRegistrado, onAtras }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    dni: '',
    password: '',
    confirmar: '',
    rol: 'usuario' // Cambia a "usuario" por defecto
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [nextAdminName, setNextAdminName] = useState('admin1');

  // Al montar, consulta cuántos admins existen
  useEffect(() => {
    fetch('http://localhost:3000/api/usuarios')
      .then(res => res.json())
      .then(users => {
        const adminUsers = users.filter(u => u.rol === 'admin');
        setNextAdminName('admin' + (adminUsers.length + 1));
      })
      .catch(() => setNextAdminName('admin1'));
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3500);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Si selecciona admin, solo permite nombre adminN
    if (
      form.rol === 'admin' &&
      form.nombre.trim().toLowerCase() !== nextAdminName
    ) {
      showToast('No es posible crear una cuenta de administrador.', 'error');
      return;
    }
    if (form.password !== form.confirmar) {
      showToast('Las contraseñas no coinciden.', 'error');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          dni: form.dni,
          password: form.password,
          rol: form.rol
        })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Error de registro', 'error');
        return;
      }
      showToast('¡Usuario creado correctamente!', 'success');
      setTimeout(() => {
        if (onRegistrado) onRegistrado();
        navigate('/login');
      }, 1500);
    } catch {
      showToast('Error de red', 'error');
    }
  };

  return (
    <div className="registro-overlay">
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      <Navbar extraLinks={[{ to: '/', label: 'Atrás' }]} hideLinks={['login']} />
      <div className="registro-main">
        <div className="registro-header">
          <div className="registro-logo">
            <span className="registro-titulo">BIBLIOTECA<br />INTELIGENTE</span>
            <span className="registro-utn">UTN <span role="img" aria-label="libro">📚</span></span>
          </div>
        </div>
        <form className="registro-form" onSubmit={handleSubmit}>
          <div className="registro-avatar">
            <svg width="70" height="70" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
          </div>
          <input
            name="nombre"
            type="text"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="dni"
            type="text"
            placeholder="Dni"
            value={form.dni}
            onChange={handleChange}
            required
          />
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            required
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            name="confirmar"
            type="password"
            placeholder="Confirmar contraseña"
            value={form.confirmar}
            onChange={handleChange}
            required
          />
          <button type="submit" className="registro-btn">Registrarse</button>
          <div className="login-link" style={{ marginTop: 16 }}>
            ¿Ya tienes una cuenta?{' '}
            <a href="#" onClick={e => { e.preventDefault(); onAtras(); }}>
              Inicia sesión
            </a>
          </div>
        </form>
      </div>
      <footer>
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default RegistroUsuario;
