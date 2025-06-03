import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegistroUsuario.css';

function Toast({ show, message, type, onClose }) {
  if (!show) return null;
  return (
    <div
      className={`registro-toast ${type}`}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        minWidth: 320,
        maxWidth: 400,
        padding: '1em 2em',
        borderRadius: 10,
        color: '#fff',
        fontWeight: 600,
        fontSize: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        cursor: 'pointer',
        background:
          type === 'success'
            ? 'linear-gradient(90deg,#43e97b 0,#38f9d7 100%)'
            : 'linear-gradient(90deg,#ff5858 0,#f857a6 100%)',
        animation: 'fadeInDown 0.5s'
      }}
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
    legajo: '',
    carrera: '',
    password: '',
    confirmar: '',
    rol: 'estudiante'
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
          legajo: form.legajo,
          carrera: form.carrera,
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
      <nav>
        <ul>
          <li><a href="#">Acerca de</a></li>
          <li><a href="#">Contacto</a></li>
          <li>
            <button className="nav-btn" onClick={() => navigate('/login')}>Atrás</button>
          </li>
        </ul>
      </nav>
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
            name="legajo"
            type="text"
            placeholder="Legajo"
            value={form.legajo}
            onChange={handleChange}
            required
          />
          <select
            name="carrera"
            value={form.carrera}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecciona tu carrera</option>
            <option value="Ingeniería en Sistemas de Información">Ingeniería en Sistemas de Información</option>
            <option value="Ingeniería Electromecánica">Ingeniería Electromecánica</option>
            <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
            <option value="Ingeniería Química">Ingeniería Química</option>
            <option value="Licenciatura en Administración Rural">Licenciatura en Administración Rural</option>
            <option value="Tecnicatura Universitaria en Programación">Tecnicatura Universitaria en Programación</option>
            <option value="Tecnicatura Universitaria en Electrónica">Tecnicatura Universitaria en Electrónica</option>
            <option value="Tecnicatura Universitaria en Mantenimiento Industrial">Tecnicatura Universitaria en Mantenimiento Industrial</option>
          </select>
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            required
          >
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
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
