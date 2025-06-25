import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AdminPanel.css';
import AsistenteIA from '../components/AsistenteIA';
import LibroForm from '../components/LibroForm';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const initialLibroForm = {
  nroInventario: '',
  biblioteca: '',
  signaturaTopografica: '',
  titulo: '',
  subtitulo: '',
  autor: '',
  editorial: '',
  edicion: '',
  lugar: '',
  anioPublicacion: '',
  paginas: '',
  isbn: '',
  serie: '',
  fechaIngreso: '',
  observaciones: '',
  idioma: '',
  diasPrestamo: '',
  disponible: true,
  portada: null
};

const initialUserForm = {
  nombre: '',
  email: '',
  dni: '',
  rol: 'usuario', // Cambia a "usuario" por defecto
  password: ''
};

const PAGE_SIZE = 16; // Puedes ajustar el tamaño de página

const AdminPanel = ({ usuario, logout }) => {
  const [libros, setLibros] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [mensajeUsuario, setMensajeUsuario] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [librosFiltrados, setLibrosFiltrados] = useState([]);
  const [editandoLibro, setEditandoLibro] = useState(null);
  const [libroForm, setLibroForm] = useState(initialLibroForm);
  const [mensajeLibro, setMensajeLibro] = useState('');
  const [busquedasRecientes, setBusquedasRecientes] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [editandoBusqueda, setEditandoBusqueda] = useState(null);
  const [nuevoTerminoBusqueda, setNuevoTerminoBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  useUser();
  useNavigate();

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

  const recargarBusquedasRecientes = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      fetch(`http://localhost:3000/api/busquedas?usuarioId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setBusquedasRecientes(data))
        .catch(() => setBusquedasRecientes([]));
    }
  };

  useEffect(() => {
    recargarLibros();
    recargarUsuarios();
    recargarBusquedasRecientes();
  }, []);

  useEffect(() => {
    setLibrosFiltrados(libros);
  }, [libros]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      fetch(`http://localhost:3000/api/busquedas?usuarioId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setBusquedasRecientes(data.slice(0, 3)))
        .catch(() => setBusquedasRecientes([]));
    }
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
      dni: usuario.dni,
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

  const handleBuscarLibro = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const filtro = busqueda.trim();

    // Buscar en el backend (más eficiente y preciso)
    if (filtro) {
      const res = await fetch(`http://localhost:3000/api/libros/buscar?termino=${encodeURIComponent(filtro)}`);
      if (res.ok) {
        const data = await res.json();
        setLibrosFiltrados(data);
      } else {
        setLibrosFiltrados([]);
      }
    } else {
      setLibrosFiltrados(libros);
    }

    // Registra la búsqueda en el backend
    if (token && filtro) {
      await fetch('http://localhost:3000/api/busquedas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ termino: filtro, usuarioId: userId })
      });
      recargarBusquedasRecientes();
    }
  };

  // Manejo de formulario de libro
  const handleLibroChange = e => {
    const { name, value, type, checked, files } = e.target;
    setLibroForm(f => ({
      ...f,
      [name]: type === 'checkbox'
        ? checked
        : type === 'file'
        ? files[0]
        : value
    }));
  };

  const handleLibroSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.entries(libroForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined) data.append(key, value);
    });
    data.set('anioPublicacion', libroForm.anioPublicacion || '');
    data.set('paginas', libroForm.paginas || '');

    let url = 'http://localhost:3000/api/libros';
    let method = 'POST';
    if (editandoLibro) {
      url = `http://localhost:3000/api/libros/${editandoLibro.id}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: data
    });

    if (res.ok) {
      setMensajeLibro(editandoLibro ? 'Libro actualizado correctamente' : 'Libro agregado correctamente');
      setLibroForm(initialLibroForm);
      setEditandoLibro(null);
      setMostrarFormulario(false);
      recargarLibros();
    } else {
      setMensajeLibro('Error al guardar libro');
    }
    setTimeout(() => setMensajeLibro(''), 2500);
  };

  const handleEditarLibro = libro => {
    setEditandoLibro(libro);
    setLibroForm({
      nroInventario: libro.nroInventario || '',
      biblioteca: libro.biblioteca || '',
      signaturaTopografica: libro.signaturaTopografica || '',
      titulo: libro.titulo || '',
      subtitulo: libro.subtitulo || '',
      autor: libro.autor || '',
      editorial: libro.editorial || '',
      edicion: libro.edicion || '',
      lugar: libro.lugar || '',
      anioPublicacion: libro.anioPublicacion || '',
      paginas: libro.paginas || '',
      isbn: libro.isbn || '',
      serie: libro.serie || '',
      fechaIngreso: libro.fechaIngreso || '',
      observaciones: libro.observaciones || '',
      idioma: libro.idioma || '',
      diasPrestamo: libro.diasPrestamo || '',
      disponible: libro.disponible,
      portada: null
    });
    setMostrarFormulario(true);
  };

  const handleEliminarLibro = async id => {
    if (!window.confirm('¿Seguro que deseas eliminar este libro?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api/libros/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    if (res.ok) {
      setMensajeLibro('Libro eliminado');
      recargarLibros();
    } else {
      setMensajeLibro('Error al eliminar libro');
    }
    setTimeout(() => setMensajeLibro(''), 2500);
  };

  // Eliminar búsqueda
  const handleEliminarBusqueda = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Seguro que deseas eliminar esta búsqueda?')) return;
    await fetch(`http://localhost:3000/api/busquedas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    recargarBusquedasRecientes();
  };

  // Editar búsqueda
  const handleEditarBusqueda = (busqueda) => {
    setEditandoBusqueda(busqueda.id);
    setNuevoTerminoBusqueda(busqueda.termino);
  };

  const handleGuardarEdicionBusqueda = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:3000/api/busquedas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ termino: nuevoTerminoBusqueda })
    });
    setEditandoBusqueda(null);
    setNuevoTerminoBusqueda('');
    recargarBusquedasRecientes();
  };

  // Libros ordenados y paginados
  const totalPaginas = Math.ceil(librosFiltrados.length / PAGE_SIZE);
  const librosPagina = librosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  useEffect(() => {
    setPagina(1); // Reinicia a la página 1 cuando cambia la búsqueda o los libros
  }, [librosFiltrados]);

  return (
    <>
      <Header onLogout={logout} />
      <div style={{ height: 110 }} />
      <div className="admin-panel-container">
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
              <form className="admin-libro-form" onSubmit={handleLibroSubmit} encType="multipart/form-data">
                <input name="nroInventario" value={libroForm.nroInventario} onChange={handleLibroChange} placeholder="Nro Inventario" required />
                <input name="biblioteca" value={libroForm.biblioteca} onChange={handleLibroChange} placeholder="Biblioteca" required />
                <input name="signaturaTopografica" value={libroForm.signaturaTopografica} onChange={handleLibroChange} placeholder="Signatura Topográfica" required />
                <input name="titulo" value={libroForm.titulo} onChange={handleLibroChange} placeholder="Título" required />
                <input name="subtitulo" value={libroForm.subtitulo} onChange={handleLibroChange} placeholder="SubTítulo" />
                <input name="autor" value={libroForm.autor} onChange={handleLibroChange} placeholder="Autores" required />
                <input name="editorial" value={libroForm.editorial} onChange={handleLibroChange} placeholder="Editorial" />
                <input name="edicion" value={libroForm.edicion} onChange={handleLibroChange} placeholder="Edición" />
                <input name="lugar" value={libroForm.lugar} onChange={handleLibroChange} placeholder="Lugar" />
                <input name="anioPublicacion" value={libroForm.anioPublicacion} onChange={handleLibroChange} placeholder="Año" type="number" />
                <input name="paginas" value={libroForm.paginas} onChange={handleLibroChange} placeholder="Páginas" type="number" />
                <input name="isbn" value={libroForm.isbn} onChange={handleLibroChange} placeholder="ISBN" />
                <input name="serie" value={libroForm.serie} onChange={handleLibroChange} placeholder="Serie" />
                <input name="fechaIngreso" value={libroForm.fechaIngreso} onChange={handleLibroChange} placeholder="Fecha de Ingreso" type="date" />
                <input name="observaciones" value={libroForm.observaciones} onChange={handleLibroChange} placeholder="Observaciones" />
                <input name="idioma" value={libroForm.idioma} onChange={handleLibroChange} placeholder="Idioma" required />
                <input name="diasPrestamo" value={libroForm.diasPrestamo} onChange={handleLibroChange} placeholder="Días Préstamo" required />
                <label>
                  Disponible
                  <input name="disponible" type="checkbox" checked={libroForm.disponible} onChange={handleLibroChange} />
                </label>
                <input
                  name="portada"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleLibroChange}
                />
                <button type="submit" className="admin-libro-btn">
                  {editandoLibro ? 'Actualizar libro' : 'Agregar libro'}
                </button>
                {mensajeLibro && <div className="admin-libro-msg">{mensajeLibro}</div>}
              </form>
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
                <input name="dni" value={userForm.dni} onChange={handleUserChange} placeholder="DNI" required />
                <select name="rol" value={userForm.rol} onChange={handleUserChange} required>
                  <option value="usuario">Usuario</option>
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
                      <span style={{fontSize: 13, color: '#555'}}>dni: {u.dni} | Email: {u.email}</span>
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

          {/* Input de búsqueda de libros */}
          <form className="admin-busqueda-form" onSubmit={handleBuscarLibro}>
            <input
              type="text"
              placeholder="Buscar libro por título o autor..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="admin-busqueda-input"
              onFocus={() => setMostrarSugerencias(true)}
              onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
            />
            <button type="submit" className="admin-busqueda-btn">Buscar</button>
            <button
              type="button"
              className="admin-busqueda-btn limpiar"
              onClick={() => {
                setBusqueda('');
                setLibrosFiltrados(libros);
              }}
            >
              Limpiar
            </button>
            {mostrarSugerencias && busquedasRecientes.length > 0 && (
              <ul className="busquedas-sugerencias">
                {busquedasRecientes.map(b => (
                  <li key={b.id} onClick={() => setBusqueda(b.termino)}>
                    {b.termino}
                  </li>
                ))}
              </ul>
            )}
          </form>

          {/* Sección de Búsquedas Recientes */}
          <div className="admin-busquedas-recientes">
            <h3 className="admin-subtitle">Búsquedas Recientes</h3>
            <ul className="admin-busquedas-list">
              {busquedasRecientes.length === 0 ? (
                <li className="admin-busqueda-item">No hay búsquedas recientes.</li>
              ) : (
                busquedasRecientes.map(b => (
                  <li className="admin-busqueda-item" key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {editandoBusqueda === b.id ? (
                      <>
                        <input
                          value={nuevoTerminoBusqueda}
                          onChange={e => setNuevoTerminoBusqueda(e.target.value)}
                          style={{ marginRight: 8 }}
                        />
                        <button onClick={() => handleGuardarEdicionBusqueda(b.id)} className="admin-busqueda-btn">Guardar</button>
                        <button onClick={() => setEditandoBusqueda(null)} className="admin-busqueda-btn limpiar">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <span>{b.termino}</span>
                        <button onClick={() => handleEditarBusqueda(b)} className="admin-busqueda-btn">Editar</button>
                        <button onClick={() => handleEliminarBusqueda(b.id)} className="admin-busqueda-btn limpiar">Eliminar</button>
                      </>
                    )}
                  </li>
                )))
              }
            </ul>
          </div>

          {/* Nuevo grid de libros */}
          <div className="admin-catalogo-grid">
            {librosPagina.map(libro => (
              <div className="admin-libro-card" key={libro.id}>
                <div className="admin-libro-card-img">
                  {libro.portada ? (
                    <img
                      src={`http://localhost:3000/api/libros/${libro.id}/portada`}
                      alt="Portada"
                    />
                  ) : (
                    <span style={{color:'#aaa'}}>Sin portada</span>
                  )}
                </div>
                <div className="admin-libro-card-titulo">{libro.titulo}</div>
                <div className="admin-libro-card-autor">{libro.autor}</div>
                <div className="admin-libro-card-editorial">{libro.editorial}</div>
                <div className="admin-libro-card-anio">{libro.anioPublicacion}</div>
                <div className="admin-libro-card-info">
                  <div><strong>Disponible:</strong> {libro.disponible ? 'Sí' : 'No'}</div>
                  <div><strong>Idioma:</strong> {libro.idioma}</div>
                  <div><strong>Nro Inventario:</strong> {libro.nroInventario}</div>
                </div>
                <div className="admin-libro-actions" style={{marginTop: 12}}>
                  <button onClick={() => handleEditarLibro(libro)}>Editar</button>
                  <button onClick={() => handleEliminarLibro(libro.id)} className="eliminar">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <Pagination pagina={pagina} totalPaginas={totalPaginas} setPagina={setPagina} />
          <AsistenteIA />
        </main>
        <Footer />
      </div>
    </>
  );
};

// Componente de paginación (puedes copiarlo del catálogo)
function Pagination({ pagina, totalPaginas, setPagina }) {
  if (totalPaginas <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) pages.push(i);
    } else {
      if (pagina <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPaginas);
      } else if (pagina >= totalPaginas - 2) {
        pages.push(1, '...', totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas);
      } else {
        pages.push(1, '...', pagina - 1, pagina, pagina + 1, '...', totalPaginas);
      }
    }
    return pages;
  };

  return (
    <div className="catalogo-paginacion">
      <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
        Anterior
      </button>
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={i} style={{ margin: '0 0.5rem', color: '#888' }}>…</span>
        ) : (
          <button
            key={p}
            className={pagina === p ? 'catalogo-pagina-activa' : ''}
            style={{
              fontWeight: pagina === p ? 700 : 500,
              background: pagina === p ? '#e0e7ff' : 'none',
              color: pagina === p ? '#2563eb' : undefined
            }}
            onClick={() => setPagina(p)}
          >
            {p}
          </button>
        )
      )}
      <button disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>
        Siguiente
      </button>
    </div>
  );
}

export default AdminPanel;