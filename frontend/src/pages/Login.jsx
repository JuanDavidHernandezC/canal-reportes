import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
    background: #06101a;
  }

  /* Fondo con gradiente atmosférico */
  .lp-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 20% 30%, rgba(29,158,117,0.22) 0%, transparent 55%),
      radial-gradient(ellipse 50% 55% at 80% 70%, rgba(46,117,182,0.18) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 50% 100%, rgba(29,158,117,0.1) 0%, transparent 50%);
  }

  /* Grilla de fondo */
  .lp-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  /* ── TARJETA PRINCIPAL ── */
  .lp-card {
    position: relative; z-index: 10;
    display: flex;
    width: 100%; max-width: 900px;
    min-height: 560px;
    border-radius: 28px;
    overflow: hidden;
    box-shadow:
      0 32px 80px rgba(0,0,0,0.6),
      0 0 0 1px rgba(255,255,255,0.06);
    animation: card-in 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── PANEL IZQUIERDO (imagen + overlay) ── */
  .lp-visual {
    width: 42%;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 36px 32px;
    /* Imagen de ciudad colombiana (Zipaquirá / Sabana) */
    background:
      linear-gradient(160deg, rgba(7,20,35,0.3) 0%, rgba(7,20,35,0.7) 100%),
      linear-gradient(135deg, #0d2a1e 0%, #0a1f35 50%, #061018 100%);
  }

  /* Patrón de puntos decorativo sobre la imagen */
  .lp-visual::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(rgba(29,158,117,0.25) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.4;
  }

  /* Gradiente inferior sobre la imagen */
  .lp-visual::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 65%;
    background: linear-gradient(to top, rgba(6,16,26,0.95) 0%, transparent 100%);
    pointer-events: none;
  }

  /* Blob decorativo */
  .lp-blob {
    position: absolute;
    top: -60px; right: -60px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(29,158,117,0.3) 0%, transparent 70%);
    pointer-events: none;
  }

  .lp-visual-top {
    position: relative; z-index: 2;
    display: flex; align-items: center; gap: 9px;
  }

  .lp-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #1D9E75;
    box-shadow: 0 0 10px rgba(29,158,117,0.7);
    animation: pulse-dot 2.5s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%,100% { box-shadow: 0 0 10px rgba(29,158,117,0.7); }
    50%      { box-shadow: 0 0 5px rgba(29,158,117,0.3); }
  }

  .lp-brand {
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700;
    color: rgba(255,255,255,0.8);
    letter-spacing: 0.02em;
  }

  .lp-visual-bottom { position: relative; z-index: 2; }

  .lp-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(29,158,117,0.15);
    border: 1px solid rgba(29,158,117,0.3);
    color: #4dd4a0; font-size: 10px; font-weight: 600;
    padding: 4px 11px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 14px;
  }

  .lp-tag-blink {
    width: 4px; height: 4px; border-radius: 50%;
    background: #1D9E75;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.1} }

  .lp-visual-title {
    font-family: 'Syne', sans-serif;
    font-size: 36px; font-weight: 800;
    line-height: 1.05;
    letter-spacing: -1.5px;
    color: white;
    margin-bottom: 14px;
  }

  .lp-visual-title .hi { color: #1D9E75; }

  .lp-visual-desc {
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.45);
    line-height: 1.65;
  }

  /* ── PANEL DERECHO (formulario) ── */
  .lp-form-panel {
    flex: 1;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 44px;
  }

  .lp-form-inner { width: 100%; max-width: 320px; }

  .lp-form-eyebrow {
    font-size: 10.5px; font-weight: 600;
    color: #1D9E75;
    text-transform: uppercase; letter-spacing: 0.14em;
    margin-bottom: 6px;
  }

  .lp-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800;
    color: #0d1f2d;
    letter-spacing: -0.8px; line-height: 1.1;
    margin-bottom: 6px;
  }

  .lp-form-sub {
    font-size: 13px; color: #94a3b8; font-weight: 300;
    margin-bottom: 28px;
  }

  /* Toggle */
  .lp-toggle {
    display: flex;
    background: #f1f5f9;
    border-radius: 12px; padding: 4px; gap: 4px;
    margin-bottom: 28px;
  }

  .lp-tab {
    flex: 1; padding: 9px;
    border: none; border-radius: 9px;
    font-size: 13.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lp-tab-on {
    background: #1D9E75;
    color: white;
    box-shadow: 0 3px 12px rgba(29,158,117,0.35);
  }

  .lp-tab-off {
    background: transparent;
    color: #94a3b8;
  }

  .lp-tab-off:hover { color: #475569; }

  /* Campos */
  .lp-fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }

  .lp-field { display: flex; flex-direction: column; gap: 5px; }

  .lp-label {
    font-size: 11px; font-weight: 600;
    color: #64748b;
    text-transform: uppercase; letter-spacing: 0.09em;
  }

  .lp-input-wrap {
    position: relative;
    display: flex; align-items: center;
  }

  .lp-icon {
    position: absolute; left: 13px;
    display: flex; align-items: center;
    pointer-events: none;
  }

  .lp-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 11px;
    color: #0d1f2d;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .lp-input::placeholder { color: #c0ccda; font-weight: 300; }

  .lp-input:focus {
    border-color: #1D9E75;
    background: #f0fdf8;
    box-shadow: 0 0 0 3px rgba(29,158,117,0.1);
  }

  .lp-input option { background: white; color: #0d1f2d; }

  /* Error */
  .lp-error {
    display: flex; align-items: flex-start; gap: 8px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 11px 13px; border-radius: 10px;
    font-size: 13px; margin-bottom: 16px;
    line-height: 1.4;
  }

  /* Botón */
  .lp-btn {
    width: 100%;
    padding: 14px;
    background: #1D9E75;
    color: white; border: none;
    border-radius: 12px;
    font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 18px rgba(29,158,117,0.35);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    letter-spacing: 0.02em;
  }

  .lp-btn:hover:not(:disabled) {
    background: #179e6e;
    box-shadow: 0 6px 24px rgba(29,158,117,0.5);
    transform: translateY(-1px);
  }

  .lp-btn:active:not(:disabled) { transform: translateY(0); }

  .lp-btn:disabled {
    background: #a7d9c6;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Divisor */
  .lp-div {
    display: flex; align-items: center; gap: 10px;
    margin: 18px 0;
  }

  .lp-div-line { flex:1; height:1px; background: #e2e8f0; }
  .lp-div-txt  { font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.1em; }

  /* Footer */
  .lp-footer {
    text-align: center;
    font-size: 13px; color: #94a3b8;
  }

  .lp-footer-btn {
    color: #1D9E75; font-weight: 600; cursor: pointer;
    background: none; border: none;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    transition: color 0.2s;
  }

  .lp-footer-btn:hover { color: #147a59; }

  /* Responsive */
  @media (max-width: 700px) {
    .lp-visual { display: none; }
    .lp-form-panel { padding: 40px 28px; }
  }
`;

function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}

export default function Login() {
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ nombre:'', email:'', password:'', rol:'ciudadano' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function switchMode(m) { setMode(m); setError(''); }

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
    <>
      <style>{styles}</style>
      <div className="lp-root">
        <div className="lp-bg" />
        <div className="lp-grid" />

        <div className="lp-card">

          {/* ── PANEL IZQUIERDO ── */}
          <div className="lp-visual">
            <div className="lp-blob" />

            <div className="lp-visual-top">
              <span className="lp-dot" />
              <span className="lp-brand">Canal Reportes</span>
            </div>

            <div className="lp-visual-bottom">
              <div className="lp-tag">
                <span className="lp-tag-blink" />
                Sabana Centro
              </div>
              <h2 className="lp-visual-title">
                Reporta.<br />
                Rastrea.<br />
                <span className="hi">Cambia.</span>
              </h2>
              <p className="lp-visual-desc">
                Plataforma ciudadana para gestionar incidencias del espacio público en tu municipio.
              </p>
            </div>
          </div>

          {/* ── PANEL DERECHO ── */}
          <div className="lp-form-panel">
            <div className="lp-form-inner">

              <p className="lp-form-eyebrow">
                {mode === 'login' ? 'Acceso ciudadano' : 'Nueva cuenta'}
              </p>
              <h2 className="lp-form-title">
                {mode === 'login' ? 'Bienvenido' : 'Regístrate'}
              </h2>
              <p className="lp-form-sub">
                {mode === 'login'
                  ? 'Ingresa tus credenciales para continuar'
                  : 'Crea tu cuenta en segundos'}
              </p>

              {/* Toggle */}
              <div className="lp-toggle">
                <button
                  type="button"
                  className={`lp-tab ${mode === 'login' ? 'lp-tab-on' : 'lp-tab-off'}`}
                  onClick={() => switchMode('login')}
                >
                  Ingresar
                </button>
                <button
                  type="button"
                  className={`lp-tab ${mode === 'register' ? 'lp-tab-on' : 'lp-tab-off'}`}
                  onClick={() => switchMode('register')}
                >
                  Registrarse
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="lp-fields">

                  {mode === 'register' && (
                    <div className="lp-field">
                      <label className="lp-label">Nombre completo</label>
                      <div className="lp-input-wrap">
                        <span className="lp-icon"><IconUser /></span>
                        <input
                          className="lp-input"
                          name="nombre"
                          placeholder="Tu nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          required
                          autoComplete="name"
                        />
                      </div>
                    </div>
                  )}

                  <div className="lp-field">
                    <label className="lp-label">Correo electrónico</label>
                    <div className="lp-input-wrap">
                      <span className="lp-icon"><IconMail /></span>
                      <input
                        className="lp-input"
                        name="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="lp-field">
                    <label className="lp-label">Contraseña</label>
                    <div className="lp-input-wrap">
                      <span className="lp-icon"><IconLock /></span>
                      <input
                        className="lp-input"
                        name="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={form.password}
                        onChange={handleChange}
                        required
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      />
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div className="lp-field">
                      <label className="lp-label">Tipo de cuenta</label>
                      <div className="lp-input-wrap">
                        <span className="lp-icon"><IconTag /></span>
                        <select
                          className="lp-input"
                          name="rol"
                          value={form.rol}
                          onChange={handleChange}
                        >
                          <option value="ciudadano">Ciudadano</option>
                          <option value="operario">Operario municipal</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="lp-error">
                    <svg style={{flexShrink:0,marginTop:1}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <circle cx="12" cy="16" r="0.5" fill="#dc2626"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" className="lp-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{animation:'spin 1s linear infinite'}}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Cargando...
                    </>
                  ) : mode === 'login' ? (
                    <>
                      Ingresar
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  ) : (
                    <>
                      Crear cuenta
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="lp-div">
                <div className="lp-div-line"/>
                <span className="lp-div-txt">o</span>
                <div className="lp-div-line"/>
              </div>

              <p className="lp-footer">
                {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                <button
                  type="button"
                  className="lp-footer-btn"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                >
                  {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>

            </div>
          </div>

        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
