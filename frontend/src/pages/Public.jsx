import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  * { box-sizing: border-box; }

  .pub-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #08101c;
    color: white;
  }

  /* ── TOP BAR (botón volver) ── */
  .pub-topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center;
    padding: 14px 24px;
    background: rgba(8,16,28,0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .btn-back {
    display: inline-flex; align-items: center; gap: 9px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.65);
    padding: 8px 16px 8px 12px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 500; font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.01em;
  }

  .btn-back:hover {
    background: rgba(29,158,117,0.12);
    border-color: rgba(29,158,117,0.35);
    color: #1D9E75;
    transform: translateX(-2px);
  }

  .btn-back-arrow {
    display: flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 6px;
    background: rgba(255,255,255,0.06);
    font-size: 13px;
    transition: background 0.2s;
  }

  .btn-back:hover .btn-back-arrow {
    background: rgba(29,158,117,0.2);
  }

  /* ── HERO ── */
  .pub-hero {
    position: relative;
    overflow: hidden;
    padding: 120px 24px 72px; /* extra top por el topbar fixed */
    text-align: center;
  }

  .pub-hero-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 50% -10%, rgba(29,158,117,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 80% 60%, rgba(46,117,182,0.12) 0%, transparent 70%);
  }

  .pub-hero-grid {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
    background-image:
      linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .pub-hero-content { position: relative; z-index: 1; }

  .pub-hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(29,158,117,0.12);
    border: 1px solid rgba(29,158,117,0.3);
    color: #1D9E75; font-size: 12px; font-weight: 600;
    padding: 5px 14px; border-radius: 20px;
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 24px;
  }

  .pub-hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #1D9E75;
    box-shadow: 0 0 8px #1D9E75;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  .pub-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 800; margin: 0 0 14px;
    letter-spacing: -1px; line-height: 1.1;
    color: white;
  }

  .pub-hero-title span { color: #1D9E75; }

  .pub-hero-sub {
    font-size: 16px; color: rgba(255,255,255,0.45);
    margin: 0 auto 36px; max-width: 440px;
    line-height: 1.6; font-weight: 300;
  }

  .pub-hero-ctas {
    display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: #1D9E75; color: white;
    padding: 13px 28px; border-radius: 12px;
    text-decoration: none; font-weight: 600; font-size: 14px;
    box-shadow: 0 4px 24px rgba(29,158,117,0.4);
    transition: all 0.2s ease;
  }

  .btn-primary:hover {
    background: #22b585;
    transform: translateY(-1px);
    box-shadow: 0 6px 32px rgba(29,158,117,0.55);
  }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.7);
    padding: 13px 28px; border-radius: 12px;
    text-decoration: none; font-weight: 500; font-size: 14px;
    transition: all 0.2s ease;
  }

  .btn-ghost:hover {
    background: rgba(255,255,255,0.09);
    border-color: rgba(255,255,255,0.2);
    color: white;
  }

  /* ── STATS ── */
  .pub-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 10px; max-width: 640px;
    margin: 0 auto; padding: 0 24px 48px;
  }

  .pub-stat {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px; padding: 20px 16px;
    text-align: center; transition: border-color 0.2s;
  }

  .pub-stat:hover { border-color: rgba(255,255,255,0.12); }

  .pub-stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 32px; font-weight: 800;
    margin: 0 0 4px; line-height: 1;
  }

  .pub-stat-label {
    font-size: 11px; font-weight: 500;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase; letter-spacing: 0.08em;
    margin: 0;
  }

  /* ── FILTERS ── */
  .pub-section {
    max-width: 860px; margin: 0 auto;
    padding: 0 24px 60px;
  }

  .pub-section-header {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 16px;
  }

  .pub-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 600;
    color: rgba(255,255,255,0.25);
    text-transform: uppercase; letter-spacing: 0.1em;
    margin: 0;
  }

  .pub-filters {
    display: flex; gap: 6px; flex-wrap: wrap;
  }

  .pub-filter-btn {
    padding: 6px 14px; border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: rgba(255,255,255,0.4);
    cursor: pointer; font-size: 12.5px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .pub-filter-btn:hover {
    border-color: rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.7);
  }

  .pub-filter-btn.active {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.2);
    color: white;
    font-weight: 600;
  }

  .pub-filter-btn.active-recibido   { background: rgba(29,158,117,0.15); border-color: rgba(29,158,117,0.35); color: #1D9E75; }
  .pub-filter-btn.active-en_proceso { background: rgba(234,179,8,0.12);  border-color: rgba(234,179,8,0.3);  color: #eab308; }
  .pub-filter-btn.active-resuelto   { background: rgba(46,117,182,0.15); border-color: rgba(46,117,182,0.35); color: #2E75B6; }

  /* ── CARDS ── */
  .pub-list { display: flex; flex-direction: column; gap: 8px; }

  .pub-card {
    display: flex; justify-content: space-between; align-items: center; gap: 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px; padding: 18px 22px;
    transition: all 0.2s ease;
    animation: card-in 0.3s ease both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pub-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
    transform: translateX(3px);
  }

  .pub-card-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }

  .pub-card-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .pub-card-tipo {
    font-size: 10.5px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.09em;
    margin: 0 0 4px;
  }

  .pub-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 600;
    color: white; margin: 0 0 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .pub-card-meta {
    font-size: 12px; color: rgba(255,255,255,0.28);
    margin: 0; display: flex; align-items: center; gap: 8px;
  }

  .pub-card-geo {
    display: inline-flex; align-items: center; gap: 3px;
    color: rgba(29,158,117,0.6); font-size: 11px;
  }

  .estado-pill {
    font-size: 11.5px; font-weight: 600;
    padding: 6px 14px; border-radius: 20px;
    flex-shrink: 0; white-space: nowrap;
  }

  .estado-recibido   { background: rgba(29,158,117,0.15); color: #1D9E75; }
  .estado-en_proceso { background: rgba(234,179,8,0.12);  color: #eab308; }
  .estado-resuelto   { background: rgba(46,117,182,0.15); color: #2E75B6; }
  .estado-default    { background: rgba(136,136,136,0.15); color: #888; }

  /* ── EMPTY ── */
  .pub-empty {
    text-align: center; padding: 80px 20px;
    color: rgba(255,255,255,0.2);
  }

  .pub-empty-icon { font-size: 52px; opacity: 0.5; margin-bottom: 14px; }
  .pub-empty-text { font-size: 15px; margin: 0; }

  /* ── DIVIDER ── */
  .pub-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    margin: 0 0 40px;
  }
`;

const estadoConfig = {
  recibido:   { label: 'Recibido',    cls: 'estado-recibido',   tipoColor: '#1D9E75' },
  en_proceso: { label: 'En proceso',  cls: 'estado-en_proceso', tipoColor: '#eab308' },
  resuelto:   { label: 'Resuelto',    cls: 'estado-resuelto',   tipoColor: '#2E75B6' },
};

const tipoIcon  = { infraestructura: '🏗️', basuras: '🗑️', alumbrado: '💡', otro: '📌' };
const tipoColor = { infraestructura: '#2E75B6', basuras: '#1D9E75', alumbrado: '#eab308', otro: '#a78bfa' };

const filtros = [
  { key: 'todos',      label: 'Todos' },
  { key: 'recibido',   label: 'Recibidos' },
  { key: 'en_proceso', label: 'En proceso' },
  { key: 'resuelto',   label: 'Resueltos' },
];

export default function Public() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtro, setFiltro]     = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reports/public')
      .then(res => setReportes(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = filtro === 'todos' ? reportes : reportes.filter(r => r.estado === filtro);

  const counts = {
    total:     reportes.length,
    en_proceso: reportes.filter(r => r.estado === 'en_proceso').length,
    resuelto:   reportes.filter(r => r.estado === 'resuelto').length,
  };

  function filterClass(key) {
    if (filtro !== key) return 'pub-filter-btn';
    if (key === 'todos') return 'pub-filter-btn active';
    return `pub-filter-btn active-${key}`;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="pub-root">

        {/* Top bar con botón volver */}
        <div className="pub-topbar">
          <Link to="/dashboard" className="btn-back">
            <span className="btn-back-arrow">←</span>
            Volver al Dashboard
          </Link>
        </div>

        {/* Hero */}
        <div className="pub-hero">
          <div className="pub-hero-bg" />
          <div className="pub-hero-grid" />
          <div className="pub-hero-content">
            <div className="pub-hero-badge">
              <span className="pub-hero-badge-dot" />
              Plataforma ciudadana activa
            </div>
            <h1 className="pub-hero-title">
              Canal Reportes<br /><span>Sabana Centro</span>
            </h1>
            <p className="pub-hero-sub">
              Reporta y haz seguimiento a problemas del espacio público de tu municipio
            </p>
            <div className="pub-hero-ctas">
              <Link to="/login" className="btn-primary">✏️ Crear reporte</Link>
              <Link to="/login" className="btn-ghost">Iniciar sesión</Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="pub-stats">
          <div className="pub-stat">
            <p className="pub-stat-value" style={{ color: 'white' }}>{counts.total}</p>
            <p className="pub-stat-label">Total</p>
          </div>
          <div className="pub-stat">
            <p className="pub-stat-value" style={{ color: '#eab308' }}>{counts.en_proceso}</p>
            <p className="pub-stat-label">En proceso</p>
          </div>
          <div className="pub-stat">
            <p className="pub-stat-value" style={{ color: '#2E75B6' }}>{counts.resuelto}</p>
            <p className="pub-stat-label">Resueltos</p>
          </div>
        </div>

        <div className="pub-divider" />

        {/* Lista */}
        <div className="pub-section">
          <div className="pub-section-header">
            <p className="pub-section-title">
              {filtrados.length} reporte{filtrados.length !== 1 ? 's' : ''}
            </p>
            <div className="pub-filters">
              {filtros.map(f => (
                <button key={f.key} className={filterClass(f.key)} onClick={() => setFiltro(f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '40px 0', fontSize: 14 }}>
              Cargando reportes...
            </p>
          ) : filtrados.length === 0 ? (
            <div className="pub-empty">
              <div className="pub-empty-icon">📭</div>
              <p className="pub-empty-text">No hay reportes en esta categoría</p>
            </div>
          ) : (
            <div className="pub-list">
              {filtrados.map((r, i) => {
                const est = estadoConfig[r.estado] || { label: r.estado, cls: 'estado-default', tipoColor: '#888' };
                const tc  = tipoColor[r.tipo] || '#888';
                return (
                  <div key={r.id} className="pub-card" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="pub-card-left">
                      <div className="pub-card-icon">{tipoIcon[r.tipo] || '📌'}</div>
                      <div style={{ minWidth: 0 }}>
                        <p className="pub-card-tipo" style={{ color: tc }}>{r.tipo}</p>
                        <h3 className="pub-card-title">{r.titulo}</h3>
                        <p className="pub-card-meta">
                          {new Date(r.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {r.latitud && <span className="pub-card-geo">· 📍 Con ubicación</span>}
                        </p>
                      </div>
                    </div>
                    <span className={`estado-pill ${est.cls}`}>{est.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
