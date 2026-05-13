import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [mode, setMode]   = useState('login');
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
      minHeight:'100vh',
      background:'linear-gradient(135deg, #0A1628 0%, #0F2A45 50%, #0A1628 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:20, position:'relative', overflow:'hidden'
    }}>
      {/* Círculos decorativos de fondo */}
      <div style={{
        position:'absolute', width:400, height:400,
        borderRadius:'50%', background:'radial-gradient(circle, #2E75B620 0%, transparent 70%)',
        top:-100, left:-100, pointerEvents:'none'
      }}/>
      <div style={{
        position:'absolute', width:300, height:300,
        borderRadius:'50%', background:'radial-gradient(circle, #1D9E7520 0%, transparent 70%)',
        bottom:-80, right:-80, pointerEvents:'none'
      }}/>

      <div style={{
        background:'rgba(26, 58, 92, 0.6)',
        backdropFilter:'blur(20px)',
        border:'1px solid rgba(46, 117, 182, 0.3)',
        borderRadius:24, padding:'48px 40px',
        width:'100%', maxWidth:440,
        boxShadow:'0 24px 80px rgba(0,0,0,0.5)',
        position:'relative'
      }}>
        {/* Logo y título */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{
            width:72, height:72, borderRadius:'50%',
            background:'linear-gradient(135deg, #2E75B6, #1D9E75)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 16px', fontSize:32,
            boxShadow:'0 8px 24px rgba(46,117,182,0.4)'
          }}>
            📍
          </div>
          <h1 style={{
            color:'white', fontSize:26, fontWeight:700,
            margin:'0 0 6px', letterSpacing:'-0.5px'
          }}>
            Canal Reportes
          </h1>
          <p style={{
            color:'#7FB3D3', fontSize:14, margin:0,
            letterSpacing:'0.5px'
          }}>
            Sabana Centro · Cundinamarca
          </p>
        </div>

        {/* Toggle modo */}
        <div style={{
          display:'flex', marginBottom:28,
          background:'rgba(15, 42, 69, 0.8)',
          borderRadius:14, padding:4,
          border:'1px solid rgba(46,117,182,0.2)'
        }}>
          {[
            { key:'login',    label:'Ingresar' },
            { key:'register', label:'Registrarse' }
          ].map(m => (
            <button key={m.key} onClick={() => setMode(m.key)} style={{
              flex:1, padding:'10px 0', border:'none', borderRadius:10,
              cursor:'pointer', fontWeight:600, fontSize:14,
              transition:'all .25s',
              background: mode===m.key
                ? 'linear-gradient(135deg, #2E75B6, #1A5C9E)'
                : 'transparent',
              color: mode===m.key ? 'white' : '#7FB3D3',
              boxShadow: mode===m.key ? '0 4px 12px rgba(46,117,182,0.4)' : 'none',
            }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {mode === 'register' && (
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>👤</span>
              <input
                name="nombre" placeholder="Nombre completo"
                value={form.nombre} onChange={handleChange} required
                style={{ ...inp, paddingLeft:42 }}
              />
            </div>
          )}

          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>✉️</span>
            <input
              name="email" type="email" placeholder="Correo electrónico"
              value={form.email} onChange={handleChange} required
              style={{ ...inp, paddingLeft:42 }}
            />
          </div>

          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>🔒</span>
            <input
              name="password" type="password" placeholder="Contraseña"
              value={form.password} onChange={handleChange} required
              style={{ ...inp, paddingLeft:42 }}
            />
          </div>

          {mode === 'register' && (
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>🏷️</span>
              <select
                name="rol" value={form.rol} onChange={handleChange}
                style={{ ...inp, paddingLeft:42, cursor:'pointer' }}
              >
                <option value="ciudadano">Ciudadano</option>
                <option value="operario">Operario municipal</option>
              </select>
            </div>
          )}

          {error && (
            <div style={{
              background:'rgba(123, 36, 28, 0.4)',
              border:'1px solid rgba(192, 57, 43, 0.5)',
              color:'#F1948A', padding:'10px 14px',
              borderRadius:10, fontSize:13,
              display:'flex', alignItems:'center', gap:8
            }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: loading
              ? 'rgba(46,117,182,0.4)'
              : 'linear-gradient(135deg, #2E75B6 0%, #1D9E75 100%)',
            color:'white', border:'none',
            padding:'14px 0', borderRadius:12,
            fontSize:16, fontWeight:700,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop:4, letterSpacing:'0.3px',
            boxShadow: loading ? 'none' : '0 6px 20px rgba(46,117,182,0.4)',
            transition:'all .25s'
          }}>
            {loading ? '⏳ Cargando...' : mode === 'login' ? '→ Ingresar' : '✓ Crear cuenta'}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign:'center', marginTop:24, marginBottom:0,
          color:'#4A7FA5', fontSize:12
        }}>
          {mode === 'login'
            ? '¿No tienes cuenta? '
            : '¿Ya tienes cuenta? '}
          <span
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ color:'#7FB3D3', cursor:'pointer', fontWeight:600 }}
          >
            {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
          </span>
        </p>
      </div>
    </div>
  );
}

const inp = {
  padding:'12px 14px',
  borderRadius:10,
  border:'1px solid rgba(46,117,182,0.3)',
  background:'rgba(15, 42, 69, 0.8)',
  color:'white',
  fontSize:15,
  outline:'none',
  width:'100%',
  boxSizing:'border-box',
  fontFamily:'inherit',
  transition:'border-color .2s',
};