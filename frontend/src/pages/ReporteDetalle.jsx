import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ChatBox from '../components/ChatBox';
import socket from '../services/socket';

const estadoColor = {
  recibido:   { bg:'#1D9E75', label:'Recibido' },
  en_proceso: { bg:'#BA7517', label:'En proceso' },
  resuelto:   { bg:'#2E75B6', label:'Resuelto' },
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

  async function loadReporte() {
    try {
      const { data } = await api.get(`/reports/${id}`);
      setReporte(data);
    } catch { navigate('/'); }
    finally { setLoading(false); }
  }

  async function cambiarEstado(nuevoEstado) {
    try {
      await api.patch(`/reports/${id}/estado`, {
        estado: nuevoEstado,
        operario_id: user.id
      });
      socket.emit('status_change', { reporteId: id, estado: nuevoEstado });
      loadReporte();
    } catch (err) { console.error(err); }
  }

  useEffect(() => {
    loadReporte();
    // Escuchar cambios de estado en tiempo real
    socket.emit('join_report', id);
    socket.on('report_updated', ({ estado }) => {
      setReporte(prev => prev ? { ...prev, estado } : prev);
    });
    return () => socket.off('report_updated');
  }, [id]);

  if (loading) return <div style={{ padding:40, textAlign:'center', color:'var(--color-text-tertiary)' }}>Cargando...</div>;
  if (!reporte) return null;

  const est = estadoColor[reporte.estado] || { bg:'#555', label: reporte.estado };
  const canChangeStatus = ['operario','admin'].includes(user?.rol);

  return (
    <div style={{ padding:24, maxWidth:800, margin:'0 auto' }}>
      {/* Botón volver */}
      <button onClick={() => navigate('/')} style={{
        background:'none', border:'none', color:'var(--color-text-tertiary)',
        cursor:'pointer', fontSize:14, marginBottom:20, padding:0,
        display:'flex', alignItems:'center', gap:6
      }}>
        ← Volver a mis reportes
      </button>

      {/* Cabecera */}
      <div style={{
        background:'var(--color-background-secondary)', borderRadius:14,
        padding:24, marginBottom:16,
        border:'0.5px solid var(--color-border-tertiary)'
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:28 }}>{tipoIcon[reporte.tipo] || '📌'}</span>
              <span style={{
                fontSize:11, fontWeight:600, color: est.bg,
                textTransform:'uppercase', letterSpacing:'.08em'
              }}>
                {reporte.tipo}
              </span>
            </div>
            <h2 style={{ margin:'0 0 8px', color:'var(--color-text-primary)', fontSize:22 }}>
              {reporte.titulo}
            </h2>
            <p style={{ margin:'0 0 4px', color:'var(--color-text-secondary)', fontSize:14 }}>
              {reporte.descripcion}
            </p>
            <p style={{ margin:0, color:'var(--color-text-tertiary)', fontSize:13 }}>
              Reportado por <strong>{reporte.ciudadano_nombre}</strong> · {new Date(reporte.created_at).toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' })}
            </p>
          </div>
          <span style={{
            background: est.bg, color:'white', padding:'8px 20px',
            borderRadius:20, fontSize:13, fontWeight:600, flexShrink:0
          }}>
            {est.label}
          </span>
        </div>

        {/* Foto si existe */}
        {reporte.foto_url && (
          <img src={`http://localhost:3001${reporte.foto_url}`} alt="foto reporte"
            style={{ width:'100%', borderRadius:10, marginTop:16, maxHeight:300, objectFit:'cover' }} />
        )}

        {/* Ubicación si existe */}
        {reporte.latitud && reporte.longitud && (
          <a href={`https://maps.google.com/?q=${reporte.latitud},${reporte.longitud}`}
            target="_blank" rel="noreferrer" style={{
              display:'inline-flex', alignItems:'center', gap:6, marginTop:12,
              color:'#2E75B6', fontSize:13, textDecoration:'none'
            }}>
            📍 Ver ubicación en Google Maps
          </a>
        )}
      </div>

      {/* Cambiar estado — solo operario/admin */}
      {canChangeStatus && (
        <div style={{
          background:'var(--color-background-secondary)', borderRadius:14,
          padding:20, marginBottom:16, border:'0.5px solid var(--color-border-tertiary)'
        }}>
          <h4 style={{ margin:'0 0 12px', color:'var(--color-text-primary)', fontSize:14 }}>
            Actualizar estado del reporte
          </h4>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {[
              { key:'recibido',   label:'Recibido',    bg:'#1D9E75' },
              { key:'en_proceso', label:'En proceso',  bg:'#BA7517' },
              { key:'resuelto',   label:'Resuelto',    bg:'#2E75B6' },
            ].map(s => (
              <button key={s.key} onClick={() => cambiarEstado(s.key)}
                disabled={reporte.estado === s.key}
                style={{
                  background: reporte.estado === s.key ? s.bg : 'transparent',
                  color: reporte.estado === s.key ? 'white' : s.bg,
                  border: `1.5px solid ${s.bg}`,
                  padding:'8px 18px', borderRadius:20, cursor: reporte.estado === s.key ? 'default' : 'pointer',
                  fontWeight:600, fontSize:13, transition:'all .2s'
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat */}
      <ChatBox reporteId={id} />
    </div>
  );
}