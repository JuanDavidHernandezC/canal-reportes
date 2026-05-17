import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ChatBox from '../components/ChatBox';
import socket from '../services/socket';
import EditReportModal from '../components/EditReportModal';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .det-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #050008;
    padding: 40px 24px;
    position: relative;
    overflow: hidden;
  }

  .det-root::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 50% 50% at 80% 10%, rgba(140,0,220,0.12) 0%, transparent 50%),
      radial-gradient(ellipse 60% 60% at 20% 90%, rgba(29,220,130,0.08) 0%, transparent 55%);
    z-index: 1;
  }

  .det-container {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .btn-back {
    background: none;
    border: none;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    font-size: 13.5px;
    font-weight: 500;
    margin-bottom: 24px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
  }

  .btn-back:hover {
    color: #1DDC82;
    transform: translateX(-3px);
  }

  .det-card {
    background: rgba(15, 8, 25, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 20px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
  }

  .det-top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
  }

  .det-info-block {
    flex: 1;
    min-width: 280px;
  }

  .det-meta-type {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .det-icon-wrapper {
    font-size: 26px;
  }

  .det-type-tag {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .det-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 12px;
    line-height: 1.2;
  }

  .det-desc {
    margin: 0 0 18px;
    color: rgba(255,255,255,0.65);
    font-size: 14.5px;
    line-height: 1.6;
  }

  .det-author-date {
    color: rgba(255,255,255,0.35);
    font-size: 13px;
  }

  .det-author-date strong {
    color: rgba(255,255,255,0.7);
  }

  .det-side-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }

  .main-status-badge {
    color: #ffffff;
    padding: 8px 22px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  /* =========================
     BOTÓN EDITAR
  ========================= */

  .btn-edit-trigger {
    background: transparent;
    border: 1.5px solid rgba(255,255,255,0.15);
    color: #ffffff;
    padding: 8px 18px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.22s ease;
  }

  .btn-edit-trigger:hover {
    background: rgba(255,255,255,0.06);
    border-color: #1DDC82;
    color: #1DDC82;
    box-shadow: 0 0 15px rgba(29,220,130,0.15);
  }

  .det-image {
    width: 100%;
    border-radius: 16px;
    margin-top: 24px;
    max-height: 340px;
    object-fit: cover;
  }

  .det-map-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
    color: #00b4ff;
    text-decoration: none;
  }

  .panel-actions {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 20px;
  }

  .panel-actions-title {
    margin-bottom: 14px;
    color: rgba(255,255,255,0.4);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .status-options-grid {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-status-toggle {
    background: transparent;
    padding: 9px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 700;
    font-size: 12.5px;
    transition: all 0.25s ease;
  }

  .btn-status-toggle:disabled {
    color: #ffffff !important;
  }

  .loader-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    gap: 16px;
  }

  .loader-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(29,220,130,0.1);
    border-top-color: #1DDC82;
    border-radius: 50%;
    animation: spin 0.85s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const estadoColor = {
  recibido:   { bg: '#1DDC82', label: 'Recibido' },
  en_proceso: { bg: '#f59e0b', label: 'En proceso' },
  resuelto:   { bg: '#00b4ff', label: 'Resuelto' },
};

const tipoIcon = {
  infraestructura: '🏗️',
  basuras: '🗑️',
  alumbrado: '💡',
  otro: '📌',
};

export default function ReporteDetalle() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // MODAL EDITAR
  // =========================
  const [showEdit, setShowEdit] = useState(false);

  async function loadReporte() {
    try {
      const { data } = await api.get(`/reports/${id}`);
      setReporte(data);
    } catch {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  async function cambiarEstado(nuevoEstado) {
    try {
      await api.patch(`/reports/${id}/estado`, {
        estado: nuevoEstado,
        operario_id: user.id
      });

      socket.emit('status_change', {
        reporteId: id,
        estado: nuevoEstado
      });

      loadReporte();

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadReporte();

    socket.emit('join_report', id);

    socket.on('report_updated', ({ estado }) => {
      setReporte(prev =>
        prev ? { ...prev, estado } : prev
      );
    });

    return () => socket.off('report_updated');
  }, [id]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="det-root">
          <div className="loader-box">
            <div className="loader-spinner" />

            <p style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: 14
            }}>
              Sincronizando consola...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!reporte) return null;

  const apiBase = (
    import.meta.env.VITE_API_URL ||
    'http://localhost:3001/api'
  ).replace(/\/api\/?$/, '');

  const imageUrl = reporte.foto_url?.startsWith('http')
    ? reporte.foto_url
    : `${apiBase}${reporte.foto_url}`;

  const est =
    estadoColor[reporte.estado] || {
      bg: '#555555',
      label: reporte.estado
    };

  const canChangeStatus =
    ['operario', 'admin'].includes(user?.rol);

  // =========================
  // VALIDACIÓN EDITAR
  // =========================
  const canEdit =
    user?.rol === 'ciudadano' &&
    reporte.ciudadano_id === user?.id &&
    reporte.estado === 'recibido';

  return (
    <>
      <style>{styles}</style>

      <div className="det-root">
        <div className="det-container">

          {/* =========================
              MODAL EDITAR
          ========================= */}
          {showEdit && (
            <EditReportModal
              reporte={reporte}
              onClose={() => setShowEdit(false)}
              onUpdated={() => {
                setShowEdit(false);
                loadReporte();
              }}
            />
          )}

          <button
            onClick={() => navigate('/')}
            className="btn-back"
          >
            <span>←</span>
            Volver a mis reportes
          </button>

          <div className="det-card">

            <div className="det-top-row">

              <div className="det-info-block">

                <div className="det-meta-type">
                  <span className="det-icon-wrapper">
                    {tipoIcon[reporte.tipo] || '📌'}
                  </span>

                  <span
                    className="det-type-tag"
                    style={{
                      color: est.bg,
                      textShadow: `0 0 10px ${est.bg}40`
                    }}
                  >
                    {reporte.tipo}
                  </span>
                </div>

                <h2 className="det-title">
                  {reporte.titulo}
                </h2>

                <p className="det-desc">
                  {reporte.descripcion}
                </p>

                <p className="det-author-date">
                  Reportado por
                  <strong>
                    {' '} {reporte.ciudadano_nombre}
                  </strong>

                  {' · '}

                  {new Date(
                    reporte.created_at
                  ).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* =========================
                  BADGE + BOTÓN EDITAR
              ========================= */}
              <div className="det-side-controls">

                <span
                  className="main-status-badge"
                  style={{
                    background: est.bg,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    boxShadow: `0 4px 14px ${est.bg}40`
                  }}
                >
                  {est.label}
                </span>

                {/* BOTÓN EDITAR */}
                {canEdit && (
                  <button
                    onClick={() => setShowEdit(true)}
                    className="btn-edit-trigger"
                  >
                    ✏️ Editar reporte
                  </button>
                )}
              </div>
            </div>

            {reporte.foto_url && (
              <img
                src={imageUrl}
                alt="Foto Reporte"
                className="det-image"
              />
            )}

            {reporte.latitud && reporte.longitud && (
              <a
                href={`https://maps.google.com/?q=${reporte.latitud},${reporte.longitud}`}
                target="_blank"
                rel="noreferrer"
                className="det-map-link"
              >
                📍 Ver localización en Google Maps
              </a>
            )}
          </div>

          {canChangeStatus && (
            <div className="panel-actions">

              <h4 className="panel-actions-title">
                Control de Estado (Uso de Operario)
              </h4>

              <div className="status-options-grid">

                {[
                  {
                    key: 'recibido',
                    label: 'Recibido',
                    bg: '#1DDC82'
                  },
                  {
                    key: 'en_proceso',
                    label: 'En proceso',
                    bg: '#f59e0b'
                  },
                  {
                    key: 'resuelto',
                    label: 'Resuelto',
                    bg: '#00b4ff'
                  },
                ].map(s => {

                  const isActive =
                    reporte.estado === s.key;

                  return (
                    <button
                      key={s.key}
                      onClick={() => cambiarEstado(s.key)}
                      disabled={isActive}
                      className="btn-status-toggle"
                      style={{
                        background:
                          isActive
                            ? s.bg
                            : 'transparent',

                        border: `1.5px solid ${s.bg}`,

                        color: s.bg,

                        boxShadow:
                          isActive
                            ? `0 4px 15px ${s.bg}40`
                            : 'none'
                      }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CHAT */}
          <ChatBox reporteId={id} />

        </div>
      </div>
    </>
  );
}