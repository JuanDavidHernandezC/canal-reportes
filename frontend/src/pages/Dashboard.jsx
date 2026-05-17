import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReportForm from '../components/ReportForm';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ══════════════════════════════════
     FONDO ESPACIAL INMERSIVO
  ══════════════════════════════════ */
  .dash-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #050008;
    padding: 48px 24px;
    position: relative;
    overflow: hidden;
  }

  /* Nebulosas de fondo */
  .dash-root::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 10% 20%, rgba(29,220,130,0.12) 0%, transparent 50%),
      radial-gradient(ellipse 70% 60% at 90% 80%, rgba(140,0,220,0.15) 0%, transparent 55%),
      radial-gradient(circle at 50% 50%, rgba(46,117,182,0.06) 0%, transparent 60%);
    z-index: 1;
  }

  .dash-container { 
    max-width: 860px; 
    margin: 0 auto; 
    position: relative; 
    z-index: 2; 
  }

  /* ══════════════════════════════════
     HEADER ENTRADA DE IMPACTO
  ══════════════════════════════════ */
  .dash-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 40px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 24px 32px;
    border-radius: 20px;
    backdrop-filter: blur(12px);
  }

  .dash-greeting {
    font-size: 11px; font-weight: 600;
    color: #1DDC82;
    text-transform: uppercase; letter-spacing: 0.16em;
    margin: 0 0 6px;
    text-shadow: 0 0 10px rgba(29,220,130,0.3);
  }

  .dash-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px; font-weight: 800;
    color: #ffffff; margin: 0;
    letter-spacing: -0.5px;
  }

  .dash-title span { 
    color: transparent;
    -webkit-text-stroke: 1px #1DDC82;
    text-shadow: 0 0 20px rgba(29,220,130,0.4);
  }

  /* Botón de Acción Estilo Neón */
  .btn-new {
    display: flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, #1DDC82 0%, #14b86c 100%);
    color: #040010; border: none;
    padding: 14px 24px; border-radius: 14px;
    font-weight: 700; font-size: 14px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(29,220,130,0.35);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    white-space: nowrap;
    position: relative; overflow: hidden;
  }

  .btn-new::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transform: skewX(-20deg);
    animation: shine 3.5s ease-in-out infinite;
  }

  @keyframes shine {
    0%, 100% { left: -100%; }
    50%      { left: 160%; }
  }

  .btn-new:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(29,220,130,0.55);
  }

  .btn-new:active { transform: translateY(0); }

  .btn-new-icon {
    width: 20px; height: 20px; border-radius: 6px;
    background: rgba(4, 0, 16, 0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 800; line-height: 1;
  }

  /* ══════════════════════════════════
     CONTENEDORES PANEL HOLOGRÁFICO
  ══════════════════════════════════ */
  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    margin-bottom: 36px;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(8px);
    border-radius: 18px; padding: 20px 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    position: relative;
  }

  /* Línea decorativa superior en los stats */
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  }

  .stat-label {
    font-size: 10.5px; font-weight: 600;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase; letter-spacing: 0.12em;
    margin: 0 0 8px;
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 32px; font-weight: 800;
    color: #ffffff; margin: 0;
  }

  /* ══════════════════════════════════
     TARJETAS DE REPORTE (HISTORIAL)
  ══════════════════════════════════ */
  .section-label {
    font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.14em;
    color: rgba(255,255,255,0.4);
    margin: 0 0 16px;
    padding-left: 4px;
  }

  .report-list { display: flex; flex-direction: column; gap: 12px; }

  .report-card {
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(15, 8, 25, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 18px; padding: 20px 26px;
    text-decoration: none; cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    animation: slide-in 0.4s ease both;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }

  @keyframes slide-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .report-card:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(29,220,130,0.3);
    transform: translateX(4px);
    box-shadow: 
      0 12px 30px rgba(0,0,0,0.3),
      0 0 20px rgba(29,220,130,0.08);
  }

  .report-tipo {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.14em;
    margin: 0 0 6px;
  }

  .report-titulo {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 700;
    color: #ffffff; margin: 0 0 6px;
    letter-spacing: -0.2px;
  }

  .report-fecha {
    font-size: 12.5px; color: rgba(255,255,255,0.35);
    margin: 0;
    font-weight: 300;
  }

  /* Badges de Estado Fluorescentes */
  .estado-badge {
    font-size: 11px; font-weight: 700;
    padding: 6px 16px; border-radius: 20px;
    flex-shrink: 0; white-space: nowrap;
    text-transform: uppercase; letter-spacing: 0.06em;
    box-shadow: inset 0 0 8px rgba(255,255,255,0.05);
  }

  /* ══════════════════════════════════
     ESTADOS COMPLEMENTARIOS
  ══════════════════════════════════ */
  .empty-state {
    text-align: center; 
    padding: 80px 24px;
    background: rgba(255,255,255,0.01);
    border: 1px dashed rgba(255,255,255,0.08);
    border-radius: 24px;
  }

  .empty-icon { 
    font-size: 48px; margin-bottom: 16px; 
    filter: drop-shadow(0 0 15px rgba(255,255,255,0.1));
  }
  
  .empty-text { font-size: 14.5px; color: rgba(255,255,255,0.35); margin: 0; font-weight: 300; }

  /* Loader Avanzado */
  .loader-container {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 0; gap: 16px;
  }

  .loading-spinner {
    width: 28px; height: 28px;
    border: 2.5px solid rgba(29,220,130,0.1);
    border-top-color: #1DDC82;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    color: rgba(255,255,255,0.35);
    font-size: 13.5px; letter-spacing: 0.05em;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 650px) {
    .stats-row { grid-template-columns: 1fr; gap: 12px; }
    .dash-header { flex-direction: column; align-items: flex-start; gap: 20px; padding: 24px; }
    .btn-new { width: 100%; justify-content: center; }
  }
`;

const estadoConfig = {
  recibido:   { bg: 'rgba(29,220,130,0.08)', color: '#1DDC82', label: 'Recibido' },
  en_proceso: { bg: 'rgba(234,179,8,0.1)',   color: '#f59e0b', label: 'En proceso' },
  resuelto:   { bg: 'rgba(0,180,255,0.08)',  color: '#00b4ff', label: 'Resuelto' },
};

const tipoColor = {
  infraestructura: '#00b4ff',
  basuras:        '#1DDC82',
  alumbrado:       '#f59e0b',
  otro:            '#a855f7',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(true);

  async function loadReportes() {
    try {
      const { data } = await api.get('/reports');
      setReportes(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadReportes(); }, []);

  const counts = {
    total:     reportes.length,
    proceso:   reportes.filter(r => r.estado === 'en_proceso').length,
    resueltos: reportes.filter(r => r.estado === 'resuelto').length,
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">
        <div className="dash-container">

          {/* Header */}
          <div className="dash-header">
            <div>
              <p className="dash-greeting">Bienvenido, {user?.nombre}</p>
              <h2 className="dash-title">Mis <span>reportes</span></h2>
            </div>
            <button className="btn-new" onClick={() => setShowForm(true)}>
              <span className="btn-new-icon">+</span>
              Nuevo reporte
            </button>
          </div>

          {/* Stats */}
          {!loading && reportes.length > 0 && (
            <div className="stats-row">
              <div className="stat-card">
                <p className="stat-label">Total</p>
                <p className="stat-value">{counts.total}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">En proceso</p>
                <p className="stat-value" style={{ color: '#f59e0b', textShadow: '0 0 15px rgba(245,158,11,0.2)' }}>{counts.proceso}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Resueltos</p>
                <p className="stat-value" style={{ color: '#00b4ff', textShadow: '0 0 15px rgba(0,180,255,0.2)' }}>{counts.resueltos}</p>
              </div>
            </div>
          )}

          {/* Form modal */}
          {showForm && (
            <ReportForm
              onClose={() => setShowForm(false)}
              onCreated={() => { setShowForm(false); loadReportes(); }}
            />
          )}

          {/* List o Estados Alternos */}
          {loading ? (
            <div className="loader-container">
              <div className="loading-spinner" />
              <p className="loading-text">Sincronizando reportes...</p>
            </div>
          ) : reportes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <p className="empty-text">El espacio público está impecable. ¡No tienes reportes aún!</p>
            </div>
          ) : (
            <>
              <p className="section-label">Historial — {counts.total} reporte{counts.total !== 1 ? 's' : ''}</p>
              <div className="report-list">
                {reportes.map((r, i) => {
                  const est = estadoConfig[r.estado] || { bg: 'rgba(255,255,255,0.05)', color: '#ffffff', label: r.estado };
                  const tc  = tipoColor[r.tipo] || '#ffffff';
                  return (
                    <Link to={`/reporte/${r.id}`} key={r.id} className="report-card" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div>
                        <p className="report-tipo" style={{ color: tc }}>{r.tipo}</p>
                        <h3 className="report-titulo">{r.titulo}</h3>
                        <p className="report-fecha">
                          {new Date(r.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <span className="estado-badge" style={{ background: est.bg, color: est.color, border: `1px solid ${est.color}25` }}>
                        {est.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}