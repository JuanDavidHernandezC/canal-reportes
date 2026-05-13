import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';

const ESTADO_COLORS = { recibido:'#1D9E75', en_proceso:'#BA7517', resuelto:'#2E75B6' };
const TIPO_COLORS   = ['#7F77DD','#1D9E75','#E24B4A','#BA7517'];

export default function AdminPanel() {
  const [reportes, setReportes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reports'),
      api.get('/users'),
    ]).then(([r, u]) => {
      setReportes(r.data);
      setUsuarios(u.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding:40, textAlign:'center', color:'var(--color-text-tertiary)' }}>Cargando panel...</div>;

  // Data para gráficas
  const porEstado = ['recibido','en_proceso','resuelto'].map(e => ({
    name: e === 'en_proceso' ? 'En proceso' : e.charAt(0).toUpperCase() + e.slice(1),
    value: reportes.filter(r => r.estado === e).length,
    color: ESTADO_COLORS[e]
  })).filter(d => d.value > 0);

  const porTipo = ['infraestructura','basuras','alumbrado','otro'].map(t => ({
    name: t.charAt(0).toUpperCase() + t.slice(1),
    cantidad: reportes.filter(r => r.tipo === t).length,
  })).filter(d => d.cantidad > 0);

  const porRol = ['ciudadano','operario','admin','planeacion'].map(r => ({
    name: r.charAt(0).toUpperCase() + r.slice(1),
    value: usuarios.filter(u => u.rol === r).length,
  })).filter(d => d.value > 0);

  return (
    <div style={{ padding:24, maxWidth:1000, margin:'0 auto' }}>
      <h2 style={{ margin:'0 0 6px', color:'var(--color-text-primary)' }}>Panel de Administrador</h2>
      <p style={{ margin:'0 0 24px', color:'var(--color-text-tertiary)', fontSize:14 }}>
        Estadísticas y gestión del sistema
      </p>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
        {[
          { label:'Total reportes',  value: reportes.length,                                       color:'#2E75B6' },
          { label:'Recibidos',       value: reportes.filter(r=>r.estado==='recibido').length,      color:'#1D9E75' },
          { label:'En proceso',      value: reportes.filter(r=>r.estado==='en_proceso').length,    color:'#BA7517' },
          { label:'Resueltos',       value: reportes.filter(r=>r.estado==='resuelto').length,      color:'#7F77DD' },
        ].map(k => (
          <div key={k.label} style={{
            background:'var(--color-background-secondary)', borderRadius:12,
            padding:18, textAlign:'center', border:`1px solid ${k.color}44`
          }}>
            <div style={{ fontSize:36, fontWeight:700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize:12, color:'var(--color-text-tertiary)', marginTop:4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
        {/* Pie — por estado */}
        <div style={{
          background:'var(--color-background-secondary)', borderRadius:14,
          padding:20, border:'0.5px solid var(--color-border-tertiary)'
        }}>
          <h4 style={{ margin:'0 0 16px', color:'var(--color-text-primary)', fontSize:14 }}>
            Reportes por estado
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={porEstado} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name,value})=>`${name}: ${value}`} labelLine={false} fontSize={11}>
                {porEstado.map((e,i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar — por tipo */}
        <div style={{
          background:'var(--color-background-secondary)', borderRadius:14,
          padding:20, border:'0.5px solid var(--color-border-tertiary)'
        }}>
          <h4 style={{ margin:'0 0 16px', color:'var(--color-text-primary)', fontSize:14 }}>
            Reportes por tipo
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={porTipo} margin={{ top:0, right:0, bottom:0, left:-20 }}>
              <XAxis dataKey="name" tick={{ fontSize:11, fill:'var(--color-text-tertiary)' }} />
              <YAxis tick={{ fontSize:11, fill:'var(--color-text-tertiary)' }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" radius={[6,6,0,0]}>
                {porTipo.map((e,i) => <Cell key={i} fill={TIPO_COLORS[i % TIPO_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Usuarios por rol */}
      <div style={{
        background:'var(--color-background-secondary)', borderRadius:14,
        padding:20, border:'0.5px solid var(--color-border-tertiary)', marginBottom:28
      }}>
        <h4 style={{ margin:'0 0 16px', color:'var(--color-text-primary)', fontSize:14 }}>
          Usuarios registrados — {usuarios.length} total
        </h4>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {porRol.map(r => (
            <div key={r.name} style={{
              background:'var(--color-background-primary)', borderRadius:10,
              padding:'12px 20px', border:'0.5px solid var(--color-border-tertiary)',
              textAlign:'center', minWidth:100
            }}>
              <div style={{ fontSize:24, fontWeight:700, color:'#2E75B6' }}>{r.value}</div>
              <div style={{ fontSize:12, color:'var(--color-text-tertiary)', marginTop:3 }}>{r.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Últimos reportes */}
      <div style={{
        background:'var(--color-background-secondary)', borderRadius:14,
        padding:20, border:'0.5px solid var(--color-border-tertiary)'
      }}>
        <h4 style={{ margin:'0 0 16px', color:'var(--color-text-primary)', fontSize:14 }}>
          Últimos 5 reportes
        </h4>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {reportes.slice(0,5).map(r => {
            const est = { recibido:{bg:'#1D9E75',label:'Recibido'}, en_proceso:{bg:'#BA7517',label:'En proceso'}, resuelto:{bg:'#2E75B6',label:'Resuelto'} }[r.estado] || {bg:'#555',label:r.estado};
            return (
              <Link to={`/reporte/${r.id}`} key={r.id} style={{ textDecoration:'none' }}>
                <div style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'10px 14px', background:'var(--color-background-primary)',
                  borderRadius:8, border:'0.5px solid var(--color-border-tertiary)'
                }}>
                  <div>
                    <span style={{ fontSize:13, fontWeight:500, color:'var(--color-text-primary)' }}>{r.titulo}</span>
                    <span style={{ fontSize:11, color:'var(--color-text-tertiary)', marginLeft:8 }}>· {r.ciudadano_nombre}</span>
                  </div>
                  <span style={{ background:est.bg, color:'white', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>
                    {est.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}