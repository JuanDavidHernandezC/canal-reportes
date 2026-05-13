import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Notifications from './components/Notifications';
import Login from './pages/Login';
import Public from './pages/Public';
import Dashboard from './pages/Dashboard';
import ReporteDetalle from './pages/ReporteDetalle';
import OperatorPanel from './pages/OperatorPanel';
import AdminPanel from './pages/AdminPanel';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding:40, textAlign:'center', color:'var(--color-text-tertiary)' }}>Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
}

function RoleRoute({ children, roles }) {
  const { user } = useAuth();
  if (!roles.includes(user?.rol)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Notifications />
        <Routes>
          <Route path="/inicio" element={<Public />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/*" element={
            <PrivateRoute>
              <Navbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/reporte/:id" element={<ReporteDetalle />} />
                <Route path="/operario" element={
                  <RoleRoute roles={['operario','admin']}>
                    <OperatorPanel />
                  </RoleRoute>
                } />
                <Route path="/admin" element={
                  <RoleRoute roles={['admin']}>
                    <AdminPanel />
                  </RoleRoute>
                } />
              </Routes>
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}