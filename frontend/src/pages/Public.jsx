import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const estadoColor = {
  recibido:   { bg:'#1D9E75', label:'Recibido' },
  en_proceso: { bg:'#BA7517', label:'En proceso' },
  resuelto:   { bg:'#2E75B6', label:'Resuelto' },
};
const tipoIcon = {
  infraestructura:'🏗️', basuras:'🗑️', alumbrado:'💡', otro:'📌'
};

export default function Public() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtro, setFiltro]     = useState('todos');

  useEffect(() => {
    api.get('/reports/public')
      .then(res => setReportes(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = filtro === 'todos'
    ? reportes
    : reportes.filter(r => r.estado === filtro);

  return (
    <div style={{ minHeight:'100vh', background:'#0F1F35' }}>
      {/* Hero */}
      <div style={{
        background:'linear-gradient(135deg, #1A3A5C 0%, #0F1F35 100%)',
        padding:'48px 24px 40px', textAlign:'center',
        borderBottom:'1px solid #2E75B6'
      }}>
        <div style={{ fontSize:52, marginBottom:12 }}>📍</div>
        <h1 style={{ color:'white', fontSize:32, fontWeight:700, margin:'0 0 10px' }}>
          Canal Reportes Sabana Centro
        </h1>
        <p style={{ color:'#AED6F1', fontSize:16, margin:'0 0 24px', maxWidth:500, marginLeft:'auto', marginRight:'auto' }}>
          Plataforma ciudadana para reportar y hacer seguimiento a problemas del espacio público
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/login" style={{
            background:'#1D9E75', color:'white', padding:'12px 28px',
            borderRadius:10, textDecoration:'none', fontWeight:600, fontSize:15
          }}>
            Crear reporte
          </Link>
          <Link to="/login" style={{
            background:'transparent', color:'#AED6F1', padding:'12px 28px',
            borderRadius:10, textDecoration:'none', fontWeight:600, fontSize:15,
            border:'1px solid #AED6F1'
          }}>
            Iniciar sesión
          </Link>
        </div>
      </div>

      {/* Stats rápidas */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3,1fr)',
        gap:12, padding:'24px 24px 0', maxWidth:700, margin:'0 auto'
      }}>
        {[
          { label:'Total reportes', value: reportes.length, color:'#2E75B6' },
          { label:'En proceso',     value: reportes.filter(r=>r.estado==='en_proceso').length, color:'#BA7517' },
          { label:'Resueltos',      value: reportes.filter(r=>r.estado==='resuelto').length,   color:'#1D9E75' },
        ].map(s => (
          <div key={s.label} style={{
            background:'#1A3A5C', borderRadius:12, padding:'16px 12px',
            textAlign:'center', border:`1px solid ${s.color}44`
          }}>
            <div style={{ fontSize:28, fontWeight:700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:'#AED6F1', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:8, padding:'20px 24px 12px', maxWidth:900, margin:'0 auto', flexWrap:'wrap' }}>
        {['todos','recibido','en_proceso','resuelto'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding:'6px 16px', borderRadius:20,
            border:'1px solid #2E75B6',
            background: filtro===f ? '#2E75B6' : 'transparent',
            color: filtro===f ? 'white' : '#AED6F1',
            cursor:'pointer', fontSize:13, fontWeight: filtro===f ? 600 : 400
          }}>
            {f==='todos' ? 'Todos' : estadoColor[f]?.label}
          </button>
        ))}
      </div>

      {/* Lista pública */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px 40px' }}>
        {loading ? (
          <p style={{ color:'#AED6F1', textAlign:'center', padding:40 }}>Cargando reportes...</p>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign:'center', padding:60, color:'#AED6F1' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
            <p>No hay reportes aún</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtrados.map(r => {
              const est = estadoColor[r.estado] || { bg:'#555', label: r.estado };
              return (
                <div key={r.id} style={{
                  background:'#1A3A5C', borderRadius:12, padding:18,
                  border:'0.5px solid #2E75B644',
                  display:'flex', justifyContent:'space-between', alignItems:'center', gap:12
                }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                      <span style={{ fontSize:18 }}>{tipoIcon[r.tipo]||'📌'}</span>
                      <span style={{ fontSize:11, fontWeight:600, color: est.bg, textTransform:'uppercase', letterSpacing:'.06em' }}>
                        {r.tipo}
                      </span>
                    </div>
                    <h3 style={{ margin:'0 0 4px', color:'white', fontSize:15 }}>{r.titulo}</h3>
                    <p style={{ margin:0, color:'#AED6F1', fontSize:12 }}>
                      {new Date(r.created_at).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' })}
                      {r.latitud && ' · 📍 Con ubicación'}
                    </p>
                  </div>
                  <span style={{
                    background: est.bg, color:'white', padding:'5px 14px',
                    borderRadius:20, fontSize:12, fontWeight:600, flexShrink:0
                  }}>
                    {est.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}   