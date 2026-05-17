import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ══════════════════════════════════
     ENTORNO GLOBAL DE LA VISTA
  ══════════════════════════════════ */
  .pub-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #04000c;
    color: white;
    position: relative;
    overflow: hidden;
  }

  /* ── HERO HOLOGRÁFICO ── */
  .pub-hero {
    position: relative;
    overflow: hidden;
    padding: 100px 24px 80px;
    text-align: center;
  }

  .pub-back-row {
    position: absolute;
    top: 24px; left: 24px;
    z-index: 10;
  }

  .btn-back {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.5);
    padding: 10px 18px 10px 12px;
    border-radius: 12px;
    font-weight: 600; font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .btn-back:hover {
    background: rgba(29,220,130,0.08);
    border-color: rgba(29,220,130,0.3);
    color: #1DDC82;
    transform: translateX(-3px);
    box-shadow: 0 0 15px rgba(29,220,130,0.15);
  }

  .btn-back-arrow {
    display: flex; align-items: center; justify-content: center;
    width: 24px; height: 24px; border-radius: 6px;
    background: rgba(255,255,255,0.05);
    font-size: 13px;
    transition: all 0.2s;
  }

  .btn-back:hover .btn-back-arrow {
    background: rgba(29,220,130,0.2);
    color: #04000c;
    font-weight: 800;
  }

  .pub-hero-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 50% -10%, rgba(29,220,130,0.15) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 85% 60%, rgba(0,180,255,0.08) 0%, transparent 70%);
  }

  .pub-hero-grid {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.02;
    background-image:
      linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .pub-hero-content { position: relative; z-index: 1; }

  .pub-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(29,220,130,0.08);
    border: 1px solid rgba(29,220,130,0.25);
    color: #1DDC82; font-size: 11px; font-weight: 700;
    padding: 6px 16px; border-radius: 20px;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 28px;
    text-shadow: 0 0 10px rgba(29,220,130,0.2);
  }

  .pub-hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #1DDC82;
    box-shadow: 0 0 8px #1DDC82;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.9); }
  }

  .pub-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 6vw, 52px);
    font-weight: 800; margin: 0 0 16px;
    letter-spacing: -1.5px; line-height: 1.1;
    color: white;
  }

  .pub-hero-title span { 
    color: transparent;
    -webkit-text-stroke: 1px #1DDC82;
    text-shadow: 0 0 30px rgba(29,220,130,0.35);
  }

  .pub-hero-sub {
    font-size: 16px; color: rgba(255,255,255,0.45);
    margin: 0 auto 36px; max-width: 480px;
    line-height: 1.6; font-weight: 300;
  }

  .pub-hero-ctas {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #1DDC82 0%, #14b86c 100%);
    color: #040010;
    padding: 14px 32px; border-radius: 14px;
    text-decoration: none; font-weight: 700; font-size: 14px;
    box-shadow: 0 6px 24px rgba(29,220,130,0.3);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(29,220,130,0.45);
  }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.7);
    padding: 14px 32px; border-radius: 14px;
    text-decoration: none; font-weight: 600; font-size: 14px;
    backdrop-filter: blur(8px);
    transition: all 0.2s ease;
  }

  .btn-ghost:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.15);
    color: white;
  }

  /* ── CUADRO DE ESTADÍSTICAS OPERATIVAS ── */
  .pub-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 16px; max-width: 640px;
    margin: 0 auto; padding: 0 24px 54px;
  }

  .pub-stat {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    backdrop-filter: blur(6px);
    border-radius: 18px; padding: 22px 16px;
    text-align: center; transition: all 0.25s ease;
  }

  .pub-stat:hover { 
    border-color: rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.03);
    transform: translateY(-1px);
  }

  .pub-stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 34px; font-weight: 800;
    margin: 0 0 6px; line-height: 1;
  }

  .pub-stat-label {
    font-size: 10.5px; font-weight: 600;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase; letter-spacing: 0.1em;
    margin: 0;
  }

  /* ── FILTROS DIGITALES ── */
  .pub-section {
    max-width: 860px; margin: 0 auto;
    padding: 0 24px 80px;
  }

  .pub-section-header {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 24px;
    gap: 16px; flex-wrap: wrap;
  }

  .pub-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 12px; font-weight: 700;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase; letter-spacing: 0.14em;
    margin: 0;
  }

  .pub-filters {
    display: flex; gap: 8px; flex-wrap: wrap;
  }

  .pub-filter-btn {
    padding: 8px 16px; border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: rgba(255,255,255,0.45);
    cursor: pointer; font-size: 12.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .pub-filter-btn:hover {
    border-color: rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.8);
  }

  .pub-filter-btn.active {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.25);
    color: white;
  }

  .pub-filter-btn.active-recibido   { background: rgba(29,220,130,0.08); border-color: rgba(29,220,130,0.3); color: #1DDC82; box-shadow: 0 0 15px rgba(29,220,130,0.1); }
  .pub-filter-btn.active-en_proceso { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.3);  color: #f59e0b; box-shadow: 0 0 15px rgba(245,158,11,0.1); }
  .pub-filter-btn.active-resuelto   { background: rgba(0,180,255,0.08); border-color: rgba(0,180,255,0.3);  color: #00b4ff; box-shadow: 0 0 15px rgba(0,180,255,0.1); }

  /* ── LISTADO Y TARJETAS PÚBLICAS ── */
  .pub-list { display: flex; flex-direction: column; gap: 12px; }

  .pub-card {
    display: flex; justify-content: space-between; align-items: center; gap: 16px;
    background: rgba(15, 8, 25, 0.4);
    border: 1px solid rgba(255,255,255,0.04);
    backdrop-filter: blur(10px);
    border-radius: 18px; padding: 20px 24px;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    animation: card-in 0.4s ease both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pub-card:hover {
    background: rgba(255,255,255,0.02);
    border-color: rgba(255,255,255,0.12);
    transform: translateX(4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }

  .pub-card-left { display: flex; align-items: center; gap: 18px; flex: 1; min-width: 0; }

  .pub-card-icon {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: inset 0 0 8px rgba(255,255,255,0.03);
  }

  .pub-card-tipo {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.12em;
    margin: 0 0 5px;
  }

  .pub-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 700;
    color: white; margin: 0 0 5px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    letter-spacing: -0.2px;
  }

  .pub-card-meta {
    font-size: 12.5px; color: rgba(255,255,255,0.35);
    margin: 0; display: flex; align-items: center; gap: 10px;
    font-weight: 300;
  }

  .pub-card-geo {
    display: inline-flex; align-items: center; gap: 4px;
    color: rgba(29,220,130,0.6); font-size: 11.5px;
    font-weight: 500;
  }

  /* Estado Píldoras */
  .estado-pill {
    font-size: 11px; font-weight: 700;
    padding: 6px 16px; border-radius: 20px;
    flex-shrink: 0; white-space: nowrap;
    text-transform: uppercase; letter-spacing: 0.05em;
  }

  .estado-recibido   { background: rgba(29,220,130,0.08); color: #1DDC82; border: 1px solid rgba(29,220,130,0.2); }
  .estado-en_proceso { background: rgba(245,158,11,0.08);  color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
  .estado-resuelto   { background: rgba(0,180,255,0.08);  color: #00b4ff; border: 1px solid rgba(0,180,255,0.2); }
  .estado-default    { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); }

  /* ── SECCIONES VACÍAS Y DIVISOR ── */
  .pub-empty {
    text-align: center; padding: 80px 24px;
    background: rgba(255,255,255,0.01);
    border: 1px dashed rgba(255,255,255,0.06);
    border-radius: 20px;
  }

  .pub-empty-icon { font-size: 48px; opacity: 0.4; margin-bottom: 16px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.05)); }
  .pub-empty-text { font-size: 14.5px; color: rgba(255,255,255,0.35); margin: 0; font-weight: 300; }

  .pub-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
    margin: 0 0 48px;
  }

  /* Loader Sincronización */
  .loader-wrapper {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 0; gap: 16px;
  }
  .spinner-element {
    width: 28px; height: 28px;
    border: 2.5px solid rgba(29,220,130,0.1);
    border-top-color: #1DDC82;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 650px) {
    .pub-stats { grid-template-columns: 1fr; gap: 12px; }
    .pub-section-header { flex-direction: column; align-items: flex-start; }
    .pub-filters { width: 100%; }
    .pub-filter-btn { flex: 1; text-align: center; padding: 8px 10px; font-size: 11.5px; }
    .pub-card { flex-direction: column; align-items: flex-start; gap: 14px; }
    .estado-pill { align-self: flex-end; }
  }
`;

const estadoConfig = {
  recibido:   { label: 'Recibido',   cls: 'estado-recibido',   tipoColor: '#1DDC82' },
  en_proceso: { label: 'En proceso', cls: 'estado-en_proceso', tipoColor: '#f59e0b' },
  resuelto:   { label: 'Resuelto',   cls: 'estado-resuelto',   tipoColor: '#00b4ff' },
};

const tipoIcon  = { infraestructura: '🏗️', basuras: '🗑️', alumbrado: '💡', otro: '📌' };
const tipoColor = { infraestructura: '#00b4ff', basuras: '#1DDC82', alumbrado: '#f59e0b', otro: '#a855f7' };

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
      .then(res => setReportes(Array.isArray(res.data) ? res.data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = filtro === 'todos' ? reportes : reportes.filter(r => r.estado === filtro);

  const counts = {
    total:      reportes.length,
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

        {/* Hero */}
        <div className="pub-hero">
          <div className="pub-hero-bg" />
          <div className="pub-hero-grid" />

          <div className="pub-back-row">
            <button className="btn-back" onClick={() => navigate(-1)}>
              <span className="btn-back-arrow">←</span>
              Volver al Dashboard
            </button>
          </div>

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
            <p className="pub-stat-value" style={{ color: '#f59e0b', textShadow: '0 0 15px rgba(245,158,11,0.2)' }}>{counts.en_proceso}</p>
            <p className="pub-stat-label">En proceso</p>
          </div>
          <div className="pub-stat">
            <p className="pub-stat-value" style={{ color: '#00b4ff', textShadow: '0 0 15px rgba(0,180,255,0.2)' }}>{counts.resuelto}</p>
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
            <div className="loader-wrapper">
              <div className="spinner-element" />
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13.5 }}>Sincronizando reportes...</p>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="pub-empty">
              <div className="pub-empty-icon">📂</div>
              <p className="pub-empty-text">No hay reportes en esta categoría actualmente</p>
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