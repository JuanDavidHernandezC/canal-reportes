import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .nav-root {
    font-family: 'DM Sans', sans-serif;
    position: sticky; top: 0; z-index: 100;
    background: rgba(8, 16, 28, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    height: 60px;
    display: flex; align-items: center;
    padding: 0 28px;
    justify-content: space-between;
  }

  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 17px;
    color: white; text-decoration: none;
    display: flex; align-items: center; gap: 9px;
    letter-spacing: -0.3px;
  }

  .nav-logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #1D9E75;
    box-shadow: 0 0 10px #1D9E75, 0 0 20px rgba(29,158,117,0.4);
    animation: pulse-dot 2.5s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 8px #1D9E75, 0 0 16px rgba(29,158,117,0.4); }
    50% { box-shadow: 0 0 14px #1D9E75, 0 0 28px rgba(29,158,117,0.6); }
  }

  .nav-links {
    display: flex; align-items: center; gap: 4px;
    margin-left: 28px;
  }

  .nav-link {
    color: rgba(255,255,255,0.5);
    text-decoration: none; font-size: 13.5px; font-weight: 400;
    padding: 6px 12px; border-radius: 8px;
    transition: all 0.2s ease;
    position: relative;
  }

  .nav-link:hover { color: white; background: rgba(255,255,255,0.07); }
  .nav-link.active { color: white; background: rgba(29,158,117,0.15); }
  .nav-link.active::after {
    content: '';
    position: absolute; bottom: -1px; left: 12px; right: 12px;
    height: 1px; background: #1D9E75; border-radius: 1px;
  }

  .nav-right { display: flex; align-items: center; gap: 12px; }

  .rol-badge {
    font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
    letter-spacing: 0.05em; text-transform: uppercase;
    border: 1px solid currentColor;
  }

  .nav-user {
    font-size: 13px; color: rgba(255,255,255,0.7);
    font-weight: 400;
  }

  .nav-logout {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.6);
    padding: 6px 16px; border-radius: 8px;
    cursor: pointer; font-size: 13px; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
  }

  .nav-logout:hover {
    background: rgba(239,68,68,0.12);
    border-color: rgba(239,68,68,0.3);
    color: #f87171;
  }

  .nav-divider {
    width: 1px; height: 20px;
    background: rgba(255,255,255,0.08);
  }
`;

const rolConfig = {
  ciudadano:  { color: '#1D9E75', bg: 'rgba(29,158,117,0.12)' },
  operario:   { color: '#2E75B6', bg: 'rgba(46,117,182,0.12)' },
  admin:      { color: '#e05252', bg: 'rgba(224,82,82,0.12)' },
  planeacion: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() { logout(); navigate('/login'); }

  const rc = rolConfig[user?.rol] || { color: '#888', bg: 'rgba(136,136,136,0.12)' };
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <>
      <style>{styles}</style>
      <nav className="nav-root">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" className="nav-logo">
            <div className="nav-logo-dot" />
            Canal Reportes
          </Link>
          {user && (
            <div className="nav-links">
              <Link to="/inicio" className={isActive('/inicio')}>Mapa público</Link>
              {['operario','admin'].includes(user.rol) && (
                <Link to="/operario" className={isActive('/operario')}>Panel operario</Link>
              )}
              {user.rol === 'admin' && (
                <Link to="/admin" className={isActive('/admin')}>Admin</Link>
              )}
            </div>
          )}
        </div>

        {user && (
          <div className="nav-right">
            <span className="rol-badge" style={{ color: rc.color, background: rc.bg, borderColor: `${rc.color}33` }}>
              {user.rol}
            </span>
            <div className="nav-divider" />
            <span className="nav-user">{user.nombre}</span>
            <button onClick={handleLogout} className="nav-logout">Salir</button>
          </div>
        )}
      </nav>
    </>
  );
}