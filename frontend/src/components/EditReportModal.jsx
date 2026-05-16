import { useState } from 'react';
import api from '../services/api';

export default function EditReportModal({ reporte, onClose, onUpdated }) {
  const [form, setForm] = useState({
    titulo:      reporte.titulo,
    descripcion: reporte.descripcion,
    tipo:        reporte.tipo,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.patch(`/reports/${reporte.id}/editar`, form);
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar');
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      position:'fixed', inset:0,
      background:'rgba(0,0,0,0.7)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:300, padding:20
    }}>
      <div style={{
        background:'var(--color-background-primary)',
        borderRadius:18, padding:32, width:'100%', maxWidth:480,
        boxShadow:'0 24px 80px rgba(0,0,0,0.5)',
        border:'1px solid rgba(46,117,182,0.2)'
      }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <h3 style={{ margin:0, color:'var(--color-text-primary)', fontSize:18, fontWeight:700 }}>
              ✏️ Editar reporte
            </h3>
            <p style={{ margin:'4px 0 0', color:'var(--color-text-tertiary)', fontSize:12 }}>
              Solo puedes editar reportes en estado Recibido
            </p>
          </div>
          <button onClick={onClose} style={{
            background:'var(--color-background-secondary)', border:'none',
            borderRadius:'50%', width:32, height:32, cursor:'pointer',
            fontSize:16, color:'var(--color-text-tertiary)',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Título */}
          <div>
            <label style={{ fontSize:12, fontWeight:500, color:'var(--color-text-secondary)', display:'block', marginBottom:6 }}>
              Título del reporte
            </label>
            <input
              value={form.titulo}
              onChange={e => setForm({...form, titulo: e.target.value})}
              required style={inp}
            />
          </div>

          {/* Tipo */}
          <div>
            <label style={{ fontSize:12, fontWeight:500, color:'var(--color-text-secondary)', display:'block', marginBottom:6 }}>
              Tipo de incidencia
            </label>
            <select
              value={form.tipo}
              onChange={e => setForm({...form, tipo: e.target.value})}
              style={inp}
            >
              <option value="infraestructura">Daño en infraestructura</option>
              <option value="basuras">Acumulación de basuras</option>
              <option value="alumbrado">Falla en alumbrado</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label style={{ fontSize:12, fontWeight:500, color:'var(--color-text-secondary)', display:'block', marginBottom:6 }}>
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={e => setForm({...form, descripcion: e.target.value})}
              rows={4} required
              style={{ ...inp, resize:'vertical' }}
            />
          </div>

          {error && (
            <div style={{
              background:'rgba(123,36,28,0.3)', border:'1px solid rgba(192,57,43,0.4)',
              color:'#F1948A', padding:'10px 14px', borderRadius:10, fontSize:13,
              display:'flex', alignItems:'center', gap:8
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="button" onClick={onClose} style={{
              flex:1, padding:'11px 0', borderRadius:10,
              border:'1px solid var(--color-border-tertiary)',
              background:'transparent', color:'var(--color-text-secondary)',
              cursor:'pointer', fontSize:15, fontWeight:500
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{
              flex:2, padding:'11px 0', borderRadius:10, border:'none',
              background: loading
                ? 'rgba(46,117,182,0.4)'
                : 'linear-gradient(135deg, #2E75B6, #1D9E75)',
              color:'white', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
              fontSize:15, boxShadow: loading ? 'none' : '0 4px 12px rgba(46,117,182,0.3)'
            }}>
              {loading ? '⏳ Guardando...' : '✓ Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inp = {
  padding:'11px 14px', borderRadius:10,
  border:'1px solid var(--color-border-tertiary)',
  background:'var(--color-background-secondary)',
  color:'var(--color-text-primary)', fontSize:15,
  outline:'none', width:'100%', boxSizing:'border-box',
  fontFamily:'inherit', transition:'border-color .2s'
};