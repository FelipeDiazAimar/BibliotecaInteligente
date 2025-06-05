import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AdminPanel.css';
import AsistenteIA from '../components/AsistenteIA';
import LibroForm from '../components/LibroForm';

const initialUserForm = {
  nombre: '',
  email: '',
  legajo: '',
  carrera: '',
  rol: 'estudiante',
  password: ''
};

const carrerasDisponibles = [
  "Ingeniería en Sistemas de Información",
  "Ingeniería Electromecánica",
  "Ingeniería Electrónica",
  "Ingeniería Química",
  "Licenciatura en Administración Rural",
  "Tecnicatura Universitaria en Programación",
  "Tecnicatura Universitaria en Electrónica",
  "Tecnicatura Universitaria en Mantenimiento Industrial"
];

const AdminPanel = ({ usuario }) => {
  const [libros, setLibros] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [mensajeUsuario, setMensajeUsuario] = useState('');
  const navigate = useNavigate();

  // Recarga libros después de agregar uno nuevo
  const recargarLibros = () => {
    fetch('http://localhost:3000/api/libros')
      .then(res => res.json())
      .then(data => setLibros(data))
      .catch(err => console.error(err));
  };

  // Cargar usuarios
  const recargarUsuarios = () => {
    fetch('http://localhost:3000/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    recargarLibros();
    recargarUsuarios();
  }, []);

  // Manejo de formulario de usuario
  const handleUserChange = e => {
    setUserForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleUserSubmit = async e => {
    e.preventDefault();
    if (editandoUsuario) {
      // Editar usuario existente
      const res = await fetch(`http://localhost:3000/api/usuarios/${editandoUsuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      if (res.ok) {
        setMensajeUsuario('Usuario actualizado correctamente');
        setEditandoUsuario(null);
        setUserForm(initialUserForm);
        recargarUsuarios();
      } else {
        setMensajeUsuario('Error al actualizar usuario');
      }
    } else {
      // Crear usuario nuevo
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      if (res.ok) {
        setMensajeUsuario('Usuario creado correctamente');
        setUserForm(initialUserForm);
        recargarUsuarios();
      } else {
        setMensajeUsuario('Error al crear usuario');
      }
    }
    setTimeout(() => setMensajeUsuario(''), 2500);
  };

  const handleEditarUsuario = usuario => {
    setEditandoUsuario(usuario);
    setUserForm({
      nombre: usuario.nombre,
      email: usuario.email,
      legajo: usuario.legajo,
      carrera: usuario.carrera,
      rol: usuario.rol,
      password: ''
    });
    setMostrarUsuarios(true);
  };

  const handleEliminarUsuario = async id => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setMensajeUsuario('Usuario eliminado');
      recargarUsuarios();
    } else {
      setMensajeUsuario('Error al eliminar usuario');
    }
    setTimeout(() => setMensajeUsuario(''), 2500);
  };

  return (
    <div className="admin-overlay">
      <nav className="admin-navbar">
        <div className="admin-logo">
          BIBLIOTECA<br />INTELIGENTE <span style={{ fontSize: 18, color: "#2196f3", marginLeft: 8 }}>UTN 📚</span>
        </div>
        <div>
          <button className="admin-logout-btn" onClick={() => navigate('/login')}>Cerrar sesión</button>
        </div>
      </nav>
      <main className="admin-main">
        <div className="panel-user-card">
          <div className="panel-user-avatar">
            <svg width="38" height="38" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
          </div>
          <div>
            <div className="panel-user-name">{usuario.nombre}</div>
            <div className="panel-user-carrera">{usuario.carrera}</div>
            <div style={{fontWeight: 700, color: "#2196f3"}}>Administrador</div>
          </div>
        </div>

        <button
          className="admin-form-toggle"
          onClick={() => setMostrarFormulario(f => !f)}
        >
          {mostrarFormulario ? 'Cerrar formulario' : 'Agregar libro'}
        </button>

        {mostrarFormulario && (
          <div className="admin-form-container">
            <LibroForm onLibroAgregado={() => {
              setMostrarFormulario(false);
              recargarLibros();
            }} />
          </div>
        )}

        {/* Gestión de usuarios */}
        <button
          className="admin-form-toggle"
          style={{ background: '#4caf50', marginBottom: 16 }}
          onClick={() => setMostrarUsuarios(f => !f)}
        >
          {mostrarUsuarios ? 'Cerrar gestión de usuarios' : 'Gestión de usuarios'}
        </button>

        {mostrarUsuarios && (
          <div className="admin-user-panel">
            <h2 className="admin-section-title">Gestión de Usuarios</h2>
            <form className="admin-user-form" onSubmit={handleUserSubmit}>
              <input name="nombre" value={userForm.nombre} onChange={handleUserChange} placeholder="Nombre" required />
              <input name="email" value={userForm.email} onChange={handleUserChange} placeholder="Email" type="email" required />
              <input name="legajo" value={userForm.legajo} onChange={handleUserChange} placeholder="Legajo" required />
              <select
                name="carrera"
                value={userForm.carrera}
                onChange={handleUserChange}
                required
              >
                <option value="" disabled>Selecciona una carrera</option>
                {carrerasDisponibles.map(carrera => (
                  <option key={carrera} value={carrera}>{carrera}</option>
                ))}
              </select>
              <select name="rol" value={userForm.rol} onChange={handleUserChange} required>
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="admin">Admin</option>
              </select>
              <input name="password" value={userForm.password} onChange={handleUserChange} placeholder={editandoUsuario ? "Nueva contraseña (opcional)" : "Contraseña"} type="password" required={!editandoUsuario} />
              <button type="submit" className="admin-user-btn">
                {editandoUsuario ? 'Actualizar usuario' : 'Agregar usuario'}
              </button>
              {mensajeUsuario && <div className="admin-user-msg">{mensajeUsuario}</div>}
            </form>
            <ul className="admin-user-list">
              {usuarios.map(u => (
                <li key={u.id} className="admin-user-item">
                  <div>
                    <strong>{u.nombre}</strong> ({u.rol})<br />
                    <span style={{fontSize: 13, color: '#555'}}>Legajo: {u.legajo} | Email: {u.email} | Carrera: {u.carrera}</span>
                  </div>
                  <div className="admin-user-actions">
                    <button onClick={() => handleEditarUsuario(u)}>Editar</button>
                    <button onClick={() => handleEliminarUsuario(u.id)} className="eliminar">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="admin-section-title">Lista de Libros</h2>
        <ul className="book-list">
          {libros.map(libro => (
            <li className="book-item" key={libro.id}>
              <h3>{libro.titulo}</h3>
              <p><strong>Subtítulo:</strong> {libro.subtitulo}</p>
              <p><strong>Autor:</strong> {libro.autor}</p>
              <p><strong>Editorial:</strong> {libro.editorial}</p>
              <p><strong>Edición:</strong> {libro.edicion}</p>
              <p><strong>Lugar:</strong> {libro.lugar}</p>
              <p><strong>Año:</strong> {libro.anioPublicacion}</p>
              <p><strong>Páginas:</strong> {libro.paginas}</p>
              <p><strong>ISBN:</strong> {libro.isbn}</p>
              <p><strong>Serie:</strong> {libro.serie}</p>
              <p><strong>Fecha de Ingreso:</strong> {libro.fechaIngreso}</p>
              <p><strong>Observaciones:</strong> {libro.observaciones}</p>
              <p><strong>Idioma:</strong> {libro.idioma}</p>
              <p><strong>Días Préstamo:</strong> {libro.diasPrestamo}</p>
              <p><strong>Nro Inventario:</strong> {libro.nroInventario}</p>
              <p><strong>Biblioteca:</strong> {libro.biblioteca}</p>
              <p><strong>Signatura Topográfica:</strong> {libro.signaturaTopografica}</p>
              <p><strong>Disponible:</strong> {libro.disponible ? 'Sí' : 'No'}</p>
              {libro.portada && (
                <img
                  src={`http://localhost:3000/api/libros/${libro.id}/portada`}
                  alt="Portada"
                  style={{maxWidth: '120px', maxHeight: '160px', borderRadius: 8, marginTop: 8}}
                />
              )}
            </li>
          ))}
        </ul>

        <AsistenteIA />
      </main>
      <footer className="admin-footer">
        © 2025 Biblioteca Inteligente. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default AdminPanel;