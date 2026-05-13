import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const rolColor = {
    ciudadano:  '#1D9E75',
    operario:   '#185FA5',
    admin:      '#7B241C',
    planeacion: '#6C3483',
  };

  return (
    <nav style={{
      background:'#1A3A5C', padding:'0 24px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      height:'56px', position:'sticky', top:0, zIndex:100,
      boxShadow:'0 2px 8px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:24 }}>
        <Link to="/" style={{ color:'white', fontWeight:600, fontSize:18, textDecoration:'none' }}>
          📍 Canal Reportes
        </Link>
        {user && ['operario','admin'].includes(user.rol) && (
          <Link to="/operario" style={{ color:'#AED6F1', fontSize:14, textDecoration:'none' }}>
            Panel operario
          </Link>
        )}
        {user && user.rol === 'admin' && (
          <Link to="/admin" style={{ color:'#AED6F1', fontSize:14, textDecoration:'none' }}>
            Panel admin
          </Link>
        )}
        <Link to="/inicio" style={{ color:'#AED6F1', fontSize:14, textDecoration:'none' }}>
          Ver mapa público
        </Link>
      </div>

      {user && (
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{
            background: rolColor[user.rol] || '#555',
            color:'white', padding:'3px 12px',
            borderRadius:20, fontSize:12, fontWeight:500
          }}>
            {user.rol}
          </span>
          <span style={{ color:'#AED6F1', fontSize:14 }}>{user.nombre}</span>
          <button onClick={handleLogout} style={{
            background:'transparent', border:'1px solid #AED6F1',
            color:'#AED6F1', padding:'5px 14px', borderRadius:8,
            cursor:'pointer', fontSize:13
          }}>
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}