import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReportForm from '../components/ReportForm';

const estadoColor = {
  recibido:   { bg:'#1D9E75', label:'Recibido' },
  en_proceso: { bg:'#BA7517', label:'En proceso' },
  resuelto:   { bg:'#2E75B6', label:'Resuelto' },
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

  return (
    <div style={{ padding:24, maxWidth:900, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ margin:0, color:'var(--color-text-primary)', fontSize:22 }}>
            Mis reportes
          </h2>
          <p style={{ margin:'4px 0 0', color:'var(--color-text-tertiary)', fontSize:14 }}>
            Bienvenido, {user?.nombre}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          background:'#1D9E75', color:'white', border:'none',
          padding:'10px 20px', borderRadius:10, fontWeight:600,
          cursor:'pointer', fontSize:15
        }}>
          + Nuevo reporte
        </button>
      </div>

      {showForm && (
        <ReportForm onClose={() => setShowForm(false)} onCreated={() => { setShowForm(false); loadReportes(); }} />
      )}

      {loading ? (
        <p style={{ color:'var(--color-text-tertiary)' }}>Cargando reportes...</p>
      ) : reportes.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--color-text-tertiary)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
          <p>No tienes reportes aún. ¡Crea el primero!</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {reportes.map(r => {
            const est = estadoColor[r.estado] || { bg:'#555', label: r.estado };
            return (
              <Link to={`/reporte/${r.id}`} key={r.id} style={{ textDecoration:'none' }}>
                <div style={{
                  background:'var(--color-background-secondary)', borderRadius:12,
                  padding:18, border:'0.5px solid var(--color-border-tertiary)',
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  transition:'box-shadow .2s', cursor:'pointer'
                }}>
                  <div>
                    <span style={{
                      fontSize:11, fontWeight:600, color:est.bg,
                      textTransform:'uppercase', letterSpacing:'.06em'
                    }}>{r.tipo}</span>
                    <h3 style={{ margin:'4px 0 6px', color:'var(--color-text-primary)', fontSize:16 }}>
                      {r.titulo}
                    </h3>
                    <p style={{ margin:0, color:'var(--color-text-tertiary)', fontSize:13 }}>
                      {new Date(r.created_at).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' })}
                    </p>
                  </div>
                  <span style={{
                    background: est.bg, color:'white', padding:'5px 14px',
                    borderRadius:20, fontSize:12, fontWeight:600, flexShrink:0
                  }}>
                    {est.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}