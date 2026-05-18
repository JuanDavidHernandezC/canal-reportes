import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const ESTADO_COLORS = { recibido:'#1D9E75', en_proceso:'#BA7517', resuelto:'#2E75B6' };
const TIPO_COLORS   = ['#7F77DD','#1D9E75','#E24B4A','#BA7517'];
const ROL_COLORS    = { ciudadano:'#1D9E75', operario:'#2E75B6', admin:'#7B241C', planeacion:'#6C3483' };

export default function AdminPanel() {
  const [reportes,  setReportes]  = useState([]);
  const [usuarios,  setUsuarios]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [rolChange, setRolChange] = useState({});
  const [saving,    setSaving]    = useState(null);
  const [msg,       setMsg]       = useState('');

  async function load() {
    try {
      const [r, u] = await Promise.all([
        api.get('/reports'),
        api.get('/users'),
      ]);
      setReportes(r.data);
      setUsuarios(u.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function cambiarRol(userId, nuevoRol) {
    setSaving(userId);
    try {
      await api.patch(`/users/${userId}/rol`, { rol: nuevoRol });
      setMsg(`✅ Rol actualizado correctamente`);
      setTimeout(() => setMsg(''), 3000);
      load();
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.error || 'Error al cambiar rol'}`);
      setTimeout(() => setMsg(''), 3000);
    } finally { setSaving(null); }
  }

  if (loading) return (
    <div style={{ padding:60, textAlign:'center', color:'var(--color-text-tertiary)', fontSize:14 }}>
      Cargando panel...
    </div>
  );

  const porEstado = ['recibido','en_proceso','resuelto'].map(e => ({
    name: e === 'en_proceso' ? 'En proceso' : e.charAt(0).toUpperCase() + e.slice(1),
    value: reportes.filter(r => r.estado === e).length,
    color: ESTADO_COLORS[e]
  })).filter(d => d.value > 0);

  const porTipo = ['infraestructura','basuras','alumbrado','otro'].map(t => ({
    name: t.charAt(0).toUpperCase() + t.slice(1),
    cantidad: reportes.filter(r => r.tipo === t).length,
  })).filter(d => d.cantidad > 0);

  const card = (label, value, color) => (
    <div key={label} style={{
      background:'var(--color-background-secondary)', borderRadius:12,
      padding:18, textAlign:'center', border:`1px solid ${color}44`
    }}>
      <div style={{ fontSize:36, fontWeight:700, color }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--color-text-tertiary)', marginTop:4 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ padding:24, maxWidth:1000, margin:'0 auto' }}>
      <h2 style={{ margin:'0 0 4px', color:'var(--color-text-primary)', fontSize:22 }}>
        Panel de Administrador
      </h2>
      <p style={{ margin:'0 0 24px', color:'var(--color-text-tertiary)', fontSize:14 }}>
        Estadísticas y gestión del sistema · {reportes.length} reportes · {usuarios.length} usuarios
      </p>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {card('Total reportes',  reportes.length,                                    '#2E75B6')}
        {card('Recibidos',       reportes.filter(r=>r.estado==='recibido').length,   '#1D9E75')}
        {card('En proceso',      reportes.filter(r=>r.estado==='en_proceso').length, '#BA7517')}
        {card('Resueltos',       reportes.filter(r=>r.estado==='resuelto').length,   '#7F77DD')}
      </div>

      {/* Gráficas */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
        <div style={{ background:'var(--color-background-secondary)', borderRadius:14, padding:20, border:'0.5px solid var(--color-border-tertiary)' }}>
          <h4 style={{ margin:'0 0 12px', color:'var(--color-text-primary)', fontSize:14 }}>Reportes por estado</h4>
          {porEstado.length === 0
            ? <p style={{ color:'var(--color-text-tertiary)', fontSize:13, textAlign:'center', padding:'40px 0' }}>Sin datos aún</p>
            : <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={porEstado} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}
                    label={({name,value}) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                    {porEstado.map((e,i) => <Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip/>
                </PieChart>
              </ResponsiveContainer>
          }
        </div>

        <div style={{ background:'var(--color-background-secondary)', borderRadius:14, padding:20, border:'0.5px solid var(--color-border-tertiary)' }}>
          <h4 style={{ margin:'0 0 12px', color:'var(--color-text-primary)', fontSize:14 }}>Reportes por tipo</h4>
          {porTipo.length === 0
            ? <p style={{ color:'var(--color-text-tertiary)', fontSize:13, textAlign:'center', padding:'40px 0' }}>Sin datos aún</p>
            : <ResponsiveContainer width="100%" height={200}>
                <BarChart data={porTipo} margin={{ top:0, right:0, bottom:0, left:-20 }}>
                  <XAxis dataKey="name" tick={{ fontSize:11, fill:'var(--color-text-tertiary)' }}/>
                  <YAxis tick={{ fontSize:11, fill:'var(--color-text-tertiary)' }} allowDecimals={false}/>
                  <Tooltip/>
                  <Bar dataKey="cantidad" radius={[6,6,0,0]}>
                    {porTipo.map((e,i) => <Cell key={i} fill={TIPO_COLORS[i % TIPO_COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          }
        </div>
      </div>

      {/* GESTIÓN DE USUARIOS + CAMBIO DE ROL */}
      <div style={{ background:'var(--color-background-secondary)', borderRadius:14, padding:20, border:'0.5px solid var(--color-border-tertiary)', marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h4 style={{ margin:0, color:'var(--color-text-primary)', fontSize:14 }}>
            Gestión de usuarios — {usuarios.length} registrados
          </h4>
          {msg && (
            <span style={{
              fontSize:12, fontWeight:500,
              color: msg.startsWith('✅') ? '#1D9E75' : '#E24B4A',
              background: msg.startsWith('✅') ? '#E1F5EE' : '#FCEBEB',
              padding:'4px 12px', borderRadius:20
            }}>
              {msg}
            </span>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {usuarios.map(u => (
            <div key={u.id} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'10px 14px', background:'var(--color-background-primary)',
              borderRadius:10, border:'0.5px solid var(--color-border-tertiary)',
              flexWrap:'wrap', gap:10
            }}>
              <div>
                <span style={{ fontSize:13, fontWeight:500, color:'var(--color-text-primary)' }}>
                  {u.nombre}
                </span>
                <span style={{ fontSize:11, color:'var(--color-text-tertiary)', marginLeft:8 }}>
                  {u.email}
                </span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {/* Badge rol actual */}
                <span style={{
                  background: ROL_COLORS[u.rol] || '#555',
                  color:'white', padding:'3px 10px',
                  borderRadius:20, fontSize:11, fontWeight:600
                }}>
                  {u.rol}
                </span>
                {/* Selector cambio de rol */}
                <select
                  value={rolChange[u.id] || u.rol}
                  onChange={e => setRolChange(prev => ({ ...prev, [u.id]: e.target.value }))}
                  style={{
                    padding:'5px 10px', borderRadius:8, fontSize:12,
                    border:'1px solid var(--color-border-tertiary)',
                    background:'var(--color-background-secondary)',
                    color:'var(--color-text-primary)', cursor:'pointer', outline:'none'
                  }}
                >
                  <option value="ciudadano">Ciudadano</option>
                  <option value="operario">Operario</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={() => cambiarRol(u.id, rolChange[u.id] || u.rol)}
                  disabled={saving === u.id || (rolChange[u.id] || u.rol) === u.rol}
                  style={{
                    padding:'5px 14px', borderRadius:8, border:'none', fontSize:12,
                    fontWeight:600, cursor: saving===u.id ? 'not-allowed' : 'pointer',
                    background: (rolChange[u.id] || u.rol) === u.rol ? 'var(--color-background-tertiary)' : '#1D9E75',
                    color: (rolChange[u.id] || u.rol) === u.rol ? 'var(--color-text-tertiary)' : 'white',
                    transition:'all .2s'
                  }}
                >
                  {saving === u.id ? '...' : 'Aplicar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Últimos reportes */}
      <div style={{ background:'var(--color-background-secondary)', borderRadius:14, padding:20, border:'0.5px solid var(--color-border-tertiary)' }}>
        <h4 style={{ margin:'0 0 14px', color:'var(--color-text-primary)', fontSize:14 }}>
          Últimos reportes
        </h4>
        {reportes.length === 0
          ? <p style={{ color:'var(--color-text-tertiary)', fontSize:13, textAlign:'center', padding:'20px 0' }}>No hay reportes aún</p>
          : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {reportes.slice(0,5).map(r => {
                const est = {
                  recibido:   { bg:'#1D9E75', label:'Recibido' },
                  en_proceso: { bg:'#BA7517', label:'En proceso' },
                  resuelto:   { bg:'#2E75B6', label:'Resuelto' }
                }[r.estado] || { bg:'#555', label: r.estado };
                return (
                  <Link to={`/reporte/${r.id}`} key={r.id} style={{ textDecoration:'none' }}>
                    <div style={{
                      display:'flex', justifyContent:'space-between', alignItems:'center',
                      padding:'10px 14px', background:'var(--color-background-primary)',
                      borderRadius:8, border:'0.5px solid var(--color-border-tertiary)'
                    }}>
                      <div>
                        <span style={{ fontSize:13, fontWeight:500, color:'var(--color-text-primary)' }}>
                          {r.titulo}
                        </span>
                        <span style={{ fontSize:11, color:'var(--color-text-tertiary)', marginLeft:8 }}>
                          · {r.ciudadano_nombre}
                        </span>
                      </div>
                      <span style={{
                        background:est.bg, color:'white',
                        padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600
                      }}>
                        {est.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
        }
      </div>
    </div>
  );
}