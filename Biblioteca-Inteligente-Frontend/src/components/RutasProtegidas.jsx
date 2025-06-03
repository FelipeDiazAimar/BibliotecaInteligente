import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import PanelUsuario from '../pages/PanelUsuario';
import VozIA from '../pages/VozIA';
import AdminPanel from '../pages/AdminPanel';

export default function RutasProtegidas({ usuario, logout }) {
  const navigate = useNavigate();

  if (!usuario) return <Navigate to="/login" replace />;

  if (usuario.rol === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPanel usuario={usuario} />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/panel" element={
        <PanelUsuario
          usuario={usuario}
          onVozIA={() => navigate('/voz')}
          onLogout={logout}
        />
      } />
      <Route path="/voz" element={<VozIA />} />
      <Route path="*" element={<Navigate to="/panel" replace />} />
    </Routes>
  );
}