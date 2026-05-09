import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReporteDetalle from './pages/ReporteDetalle';
import OperatorPanel from './pages/OperatorPanel';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ padding:40, textAlign:'center', color:'var(--color-text-tertiary)' }}>
      Cargando...
    </div>
  );
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
        <Routes>
          <Route path="/login" element={<Login />} />
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
              </Routes>
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}