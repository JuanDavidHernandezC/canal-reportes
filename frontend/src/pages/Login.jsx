import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [mode, setMode]   = useState('login'); // 'login' | 'register'
  const [form, setForm]   = useState({ nombre:'', email:'', password:'', rol:'ciudadano' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión');
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      minHeight:'100vh', background:'#0F1F35',
      display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div style={{
        background:'#1A3A5C', borderRadius:16, padding:40,
        width:'100%', maxWidth:420, boxShadow:'0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>📍</div>
          <h1 style={{ color:'white', fontSize:24, fontWeight:700, margin:0 }}>Canal Reportes</h1>
          <p style={{ color:'#AED6F1', fontSize:14, margin:'8px 0 0' }}>Sabana Centro · Cundinamarca</p>
        </div>

        <div style={{ display:'flex', marginBottom:24, background:'#0F2A45', borderRadius:10, padding:4 }}>
          {['login','register'].map(m => (
            <button key={m} onClick={()=>setMode(m)} style={{
              flex:1, padding:'8px 0', border:'none', borderRadius:8, cursor:'pointer',
              background: mode===m ? '#2E75B6' : 'transparent',
              color: mode===m ? 'white' : '#AED6F1',
              fontWeight: mode===m ? 600 : 400, fontSize:14, transition:'all .2s'
            }}>
              {m === 'login' ? 'Ingresar' : 'Registrarse'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {mode === 'register' && (
            <input name="nombre" placeholder="Nombre completo" value={form.nombre}
              onChange={handleChange} required style={inputStyle} />
          )}
          <input name="email" type="email" placeholder="Correo electrónico"
            value={form.email} onChange={handleChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Contraseña"
            value={form.password} onChange={handleChange} required style={inputStyle} />
          {mode === 'register' && (
            <select name="rol" value={form.rol} onChange={handleChange} style={inputStyle}>
              <option value="ciudadano">Ciudadano</option>
              <option value="operario">Operario municipal</option>
              <option value="planeacion">Funcionario de planeación</option>
            </select>
          )}
          {error && (
            <div style={{ background:'#7B241C', color:'#F1948A', padding:'10px 14px',
              borderRadius:8, fontSize:13 }}>{error}</div>
          )}
          <button type="submit" disabled={loading} style={{
            background: loading ? '#555' : '#2E75B6', color:'white', border:'none',
            padding:'12px 0', borderRadius:10, fontSize:16, fontWeight:600,
            cursor: loading ? 'not-allowed' : 'pointer', marginTop:4
          }}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding:'11px 14px', borderRadius:9, border:'1px solid #2E75B6',
  background:'#0F2A45', color:'white', fontSize:15, outline:'none', width:'100%',
  boxSizing:'border-box'
};