import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const estadoColor = {
  recibido:   { bg:'#1D9E75', label:'Recibido' },
  en_proceso: { bg:'#BA7517', label:'En proceso' },
  resuelto:   { bg:'#2E75B6', label:'Resuelto' },
};

export default function OperatorPanel() {
  const [reportes, setReportes] = useState([]);
  const [filtro, setFiltro]     = useState('todos');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/reports')
      .then(res => setReportes(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = filtro === 'todos'
    ? reportes
    : reportes.filter(r => r.estado === filtro);

  const counts = {
    recibido:   reportes.filter(r => r.estado === 'recibido').length,
    en_proceso: reportes.filter(r => r.estado === 'en_proceso').length,
    resuelto:   reportes.filter(r => r.estado === 'resuelto').length,
  };

  return (
    <div style={{ padding:24, maxWidth:960, margin:'0 auto' }}>
      <h2 style={{ margin:'0 0 6px', color:'var(--color-text-primary)' }}>Panel del operario</h2>
      <p style={{ margin:'0 0 24px', color:'var(--color-text-tertiary)', fontSize:14 }}>
        Gestiona los reportes asignados a tu área
      </p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {[
          { key:'recibido',   label:'Recibidos',   bg:'#1D9E75', count: counts.recibido },
          { key:'en_proceso', label:'En proceso',  bg:'#BA7517', count: counts.en_proceso },
          { key:'resuelto',   label:'Resueltos',   bg:'#2E75B6', count: counts.resuelto },
        ].map(s => (
          <div key={s.key} style={{
            background: s.bg + '22', border: `1px solid ${s.bg}44`,
            borderRadius:12, padding:16, textAlign:'center', cursor:'pointer',
            outline: filtro===s.key ? `2px solid ${s.bg}` : 'none',
            transition:'all .2s'
          }} onClick={() => setFiltro(filtro===s.key ? 'todos' : s.key)}>
            <div style={{ fontSize:32, fontWeight:700, color: s.bg }}>{s.count}</div>
            <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
        {['todos','recibido','en_proceso','resuelto'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding:'6px 16px', borderRadius:20, border:'1px solid var(--color-border-tertiary)',
            background: filtro===f ? '#1A3A5C' : 'transparent',
            color: filtro===f ? 'white' : 'var(--color-text-secondary)',
            cursor:'pointer', fontSize:13, fontWeight: filtro===f ? 600 : 400
          }}>
            {f === 'todos' ? 'Todos' : estadoColor[f]?.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <p style={{ color:'var(--color-text-tertiary)' }}>Cargando reportes...</p>
      ) : filtrados.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--color-text-tertiary)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
          <p>No hay reportes con este filtro</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtrados.map(r => {
            const est = estadoColor[r.estado] || { bg:'#555', label: r.estado };
            return (
              <Link to={`/reporte/${r.id}`} key={r.id} style={{ textDecoration:'none' }}>
                <div style={{
                  background:'var(--color-background-secondary)', borderRadius:12, padding:18,
                  border:'0.5px solid var(--color-border-tertiary)',
                  display:'grid', gridTemplateColumns:'1fr auto', gap:12, alignItems:'center'
                }}>
                  <div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:5 }}>
                      <span style={{ fontSize:11, fontWeight:600, color: est.bg, textTransform:'uppercase', letterSpacing:'.06em' }}>
                        {r.tipo}
                      </span>
                      <span style={{ color:'var(--color-text-tertiary)', fontSize:11 }}>·</span>
                      <span style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>
                        {r.ciudadano_nombre}
                      </span>
                    </div>
                    <h3 style={{ margin:'0 0 5px', color:'var(--color-text-primary)', fontSize:15 }}>
                      {r.titulo}
                    </h3>
                    <p style={{ margin:0, color:'var(--color-text-tertiary)', fontSize:12 }}>
                      {new Date(r.created_at).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' })}
                      {r.latitud && ' · 📍 Con ubicación'}
                      {r.foto_url && ' · 📷 Con foto'}
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
