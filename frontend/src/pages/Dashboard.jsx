import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReportForm from '../components/ReportForm';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  .dash-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--color-background-primary);
    padding: 36px 24px;
  }

  .dash-container { max-width: 860px; margin: 0 auto; }

  .dash-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 36px;
  }

  .dash-greeting {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase; letter-spacing: 0.1em;
    margin: 0 0 6px;
  }

  .dash-title {
    font-family: 'Syne', sans-serif;
    font-size: 30px; font-weight: 800;
    color: white; margin: 0;
    letter-spacing: -0.5px;
  }

  .dash-title span { color: #1D9E75; }

  .btn-new {
    display: flex; align-items: center; gap: 8px;
    background: #1D9E75;
    color: white; border: none;
    padding: 12px 22px; border-radius: 12px;
    font-weight: 600; font-size: 14px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(29,158,117,0.35);
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .btn-new:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(29,158,117,0.5);
    background: #22b585;
  }

  .btn-new:active { transform: translateY(0); }

  .btn-new-icon {
    width: 20px; height: 20px; border-radius: 6px;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; line-height: 1;
  }

  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px; padding: 18px 20px;
  }

  .stat-label {
    font-size: 11px; font-weight: 500;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase; letter-spacing: 0.08em;
    margin: 0 0 6px;
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 700;
    color: white; margin: 0;
  }

  .report-list { display: flex; flex-direction: column; gap: 8px; }

  .report-card {
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px; padding: 18px 22px;
    text-decoration: none; cursor: pointer;
    transition: all 0.2s ease;
    animation: slide-in 0.3s ease both;
  }

  @keyframes slide-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .report-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.12);
    transform: translateX(3px);
  }

  .report-tipo {
    font-size: 10.5px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    margin: 0 0 5px;
  }

  .report-titulo {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 600;
    color: white; margin: 0 0 5px;
  }

  .report-fecha {
    font-size: 12px; color: rgba(255,255,255,0.3);
    margin: 0;
  }

  .estado-badge {
    font-size: 11.5px; font-weight: 600;
    padding: 6px 14px; border-radius: 20px;
    flex-shrink: 0; white-space: nowrap;
  }

  .empty-state {
    text-align: center; padding: 80px 20px;
    color: rgba(255,255,255,0.25);
  }

  .empty-icon { font-size: 52px; margin-bottom: 14px; opacity: 0.6; }
  .empty-text { font-size: 15px; margin: 0; }

  .section-label {
    font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: rgba(255,255,255,0.25);
    margin: 0 0 14px;
    padding-left: 2px;
  }
`;

const estadoConfig = {
  recibido:   { bg: 'rgba(29,158,117,0.15)', color: '#1D9E75', label: 'Recibido' },
  en_proceso: { bg: 'rgba(234,179,8,0.12)',  color: '#eab308', label: 'En proceso' },
  resuelto:   { bg: 'rgba(46,117,182,0.15)', color: '#2E75B6', label: 'Resuelto' },
};

const tipoColor = {
  infraestructura: '#2E75B6',
  basuras:         '#1D9E75',
  alumbrado:       '#eab308',
  otro:            '#a78bfa',
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
                <p className="stat-value" style={{ color: '#eab308' }}>{counts.proceso}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Resueltos</p>
                <p className="stat-value" style={{ color: '#2E75B6' }}>{counts.resueltos}</p>
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

          {/* List */}
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Cargando reportes...</p>
          ) : reportes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-text">No tienes reportes aún. ¡Crea el primero!</p>
            </div>
          ) : (
            <>
              <p className="section-label">Historial — {counts.total} reporte{counts.total !== 1 ? 's' : ''}</p>
              <div className="report-list">
                {reportes.map((r, i) => {
                  const est = estadoConfig[r.estado] || { bg: 'rgba(136,136,136,0.15)', color: '#888', label: r.estado };
                  const tc  = tipoColor[r.tipo] || '#888';
                  return (
                    <Link to={`/reporte/${r.id}`} key={r.id} className="report-card" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div>
                        <p className="report-tipo" style={{ color: tc }}>{r.tipo}</p>
                        <h3 className="report-titulo">{r.titulo}</h3>
                        <p className="report-fecha">
                          {new Date(r.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <span className="estado-badge" style={{ background: est.bg, color: est.color }}>
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