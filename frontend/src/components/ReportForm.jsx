import { useState } from 'react';
import api from '../services/api';

export default function ReportForm({ onClose, onCreated }) {
  const [form, setForm] = useState({ titulo:'', descripcion:'', tipo:'infraestructura' });
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      if (foto) fd.append('foto', foto);
      if (navigator.geolocation) {
        await new Promise(resolve => navigator.geolocation.getCurrentPosition(
          pos => {
            fd.append('latitud', pos.coords.latitude);
            fd.append('longitud', pos.coords.longitude);
            resolve();
          },
          () => resolve()
        ));
      }
      await api.post('/reports', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear reporte');
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:200
    }}>
      <div style={{
        background:'var(--color-background-primary)', borderRadius:16,
        padding:32, width:'100%', maxWidth:480,
        boxShadow:'0 8px 40px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
          <h3 style={{ margin:0, color:'var(--color-text-primary)' }}>Nuevo reporte</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'var(--color-text-tertiary)' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <input placeholder="Título del reporte" value={form.titulo}
            onChange={e=>setForm({...form,titulo:e.target.value})} required style={inp} />
          <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})} style={inp}>
            <option value="infraestructura">Daño en infraestructura</option>
            <option value="basuras">Acumulación de basuras</option>
            <option value="alumbrado">Falla en alumbrado</option>
            <option value="otro">Otro</option>
          </select>
          <textarea placeholder="Descripción detallada del problema..." rows={4}
            value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})}
            required style={{...inp, resize:'vertical'}} />
          <div>
            <label style={{ color:'var(--color-text-secondary)', fontSize:13, marginBottom:6, display:'block' }}>
              Foto del problema (opcional)
            </label>
            <input type="file" accept="image/*" onChange={e=>setFoto(e.target.files[0])}
              style={{ color:'var(--color-text-secondary)', fontSize:13 }} />
          </div>
          {error && <div style={{ background:'#FADBD8', color:'#922B21', padding:'10px 14px', borderRadius:8, fontSize:13 }}>{error}</div>}
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:'11px 0', borderRadius:9, border:'1px solid var(--color-border-tertiary)', background:'transparent', color:'var(--color-text-secondary)', cursor:'pointer', fontSize:15 }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{ flex:2, padding:'11px 0', borderRadius:9, border:'none', background:'#1D9E75', color:'white', fontWeight:600, cursor:'pointer', fontSize:15 }}>
              {loading ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inp = {
  padding:'11px 14px', borderRadius:9,
  border:'1px solid var(--color-border-tertiary)',
  background:'var(--color-background-secondary)',
  color:'var(--color-text-primary)', fontSize:15,
  outline:'none', width:'100%', boxSizing:'border-box', fontFamily:'inherit'
};