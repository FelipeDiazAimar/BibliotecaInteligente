import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

export default function AsistenteIA() {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const { usuario, setUsuario } = useUser();

  // Cargar historial al montar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:3000/api/asistente/historial', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setHistorial(Array.isArray(data) ? data : []))
      .catch(() => setHistorial([])); // Si hay error, historial vacío
  }, []);

  const handleAsk = async (e) => {
    e.preventDefault();
    setCargando(true);
    setRespuesta('');
    try {
      const res = await fetch('http://localhost:3000/api/asistente/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          prompt: pregunta // Solo envía la pregunta, no la lista de libros
        })
      });
      const data = await res.json();
      setRespuesta(data.respuesta || data.error || 'Sin respuesta');
      // Recargar historial después de preguntar
      fetch('http://localhost:3000/api/asistente/historial', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setHistorial(Array.isArray(data) ? data : []));
    } catch {
      setRespuesta('Error de red');
    }
    setCargando(false);
  };

  return (
    <div style={{margin: '2rem 0', padding: 16, border: '1px solid #2196f3', borderRadius: 10, background: '#f5faff'}}>
      <h2>Asistente IA Biblioteca</h2>
      <form onSubmit={handleAsk} style={{display: 'flex', gap: 8, marginBottom: 12 , color:'black'}}>
        <input
          type="text"
          value={pregunta}
          onChange={e => setPregunta(e.target.value)}
          placeholder="Pregúntale a la IA sobre los libros..."
          style={{flex: 1, padding: 8, borderRadius: 6, border: '1px solid #bbb'}}
          required
        />
        <button type="submit" disabled={cargando} style={{padding: '8px 16px', borderRadius: 6, background: '#2196f3', color: '#fff', border: 'none'}}>
          {cargando ? 'Consultando...' : 'Preguntar'}
        </button>
      </form>
      {respuesta && (
        <div style={{background: '#fff', borderRadius: 6, padding: 12, border: '1px solid #ddd'}}>
          <strong>Respuesta IA:</strong>
          <div>{respuesta}</div>
        </div>
      )}
      {/* Historial de consultas */}
      <div style={{marginTop: 24}}>
        <h3>Historial de consultas</h3>
        <div style={{maxHeight: 250, overflowY: 'auto', background: '#fff', borderRadius: 6, border: '1px solid #ddd', padding: 12}}>
          {Array.isArray(historial) && historial.length === 0 && (
            <div>No hay historial.</div>
          )}
          {Array.isArray(historial) && historial.map(item => (
            <div key={item.id} style={{marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8}}>
              <div><strong>Consulta:</strong> {item.texto}</div>
              <div style={{marginLeft: 12, color: '#1769aa'}}>
                <strong>Respuesta:</strong> {item.Respuesta?.texto || <span style={{color: '#888'}}>Sin respuesta</span>}
              </div>
              <div style={{fontSize: 12, color: '#888', marginTop: 2}}>
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}