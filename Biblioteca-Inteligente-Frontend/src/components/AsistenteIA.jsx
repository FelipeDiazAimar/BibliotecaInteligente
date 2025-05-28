import { useState } from 'react';

export default function AsistenteIA({ libros }) {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    setCargando(true);
    setRespuesta('');
    try {
      const res = await fetch('http://localhost:3000/api/asistente/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          prompt: `Lista de libros:\n${libros.map(l => `- ${l.titulo} (${l.autor})`).join('\n')}\n\nPregunta: ${pregunta}`
        })
      });
      const data = await res.json();
      setRespuesta(data.respuesta || data.error || 'Sin respuesta');
    } catch {
      setRespuesta('Error de red');
    }
    setCargando(false);
  };

  return (
    <div style={{margin: '2rem 0', padding: 16, border: '1px solid #2196f3', borderRadius: 10, background: '#f5faff'}}>
      <h2>Asistente IA Biblioteca</h2>
      <form onSubmit={handleAsk} style={{display: 'flex', gap: 8, marginBottom: 12}}>
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
    </div>
  );
}