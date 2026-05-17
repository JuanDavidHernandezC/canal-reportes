import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lr {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    background: #07111d;
    overflow: hidden;
  }

  /* ════════════════════════════════
     PANEL IZQUIERDO
  ════════════════════════════════ */
  .lr-left {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 44px 52px;
    overflow: hidden;
  }

  /* Fondo con gradiente atmosférico */
  .lr-left::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 15% 55%, rgba(29,158,117,0.18) 0%, transparent 65%),
      radial-gradient(ellipse 55% 60% at 85% 15%, rgba(46,117,182,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 45% 35% at 60% 90%, rgba(29,158,117,0.08) 0%, transparent 55%);
    pointer-events: none;
  }

  /* Grilla */
  .lr-left::after {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }

  /* Separador derecho luminoso */
  .lr-sep {
    position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(29,158,117,0.5) 35%,
      rgba(46,117,182,0.5) 65%,
      transparent 100%
    );
    z-index: 2;
  }

  /* Marca */
  .lr-logo {
    position: relative; z-index: 3;
    display: flex; align-items: center; gap: 10px;
  }

  .lr-logo-dot {
    width: 9px; height: 9px; border-radius: 50%;
    background: #1D9E75;
    box-shadow: 0 0 0 3px rgba(29,158,117,0.2), 0 0 16px rgba(29,158,117,0.5);
    animation: glow 2.8s ease-in-out infinite;
  }

  @keyframes glow {
    0%,100% { box-shadow: 0 0 0 3px rgba(29,158,117,0.2), 0 0 16px rgba(29,158,117,0.5); }
    50%      { box-shadow: 0 0 0 5px rgba(29,158,117,0.1), 0 0 8px rgba(29,158,117,0.3); }
  }

  .lr-logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.03em;
  }

  /* Bloque central hero */
  .lr-hero { position: relative; z-index: 3; }

  .lr-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(29,158,117,0.09);
    border: 1px solid rgba(29,158,117,0.22);
    color: #1D9E75; font-size: 10.5px; font-weight: 600;
    padding: 5px 13px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 30px;
  }

  .lr-badge-blink {
    width: 5px; height: 5px; border-radius: 50%;
    background: #1D9E75;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.15} }

  .lr-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(38px, 4.5vw, 58px);
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -2.5px;
    color: white;
    margin-bottom: 22px;
  }

  .lr-headline .outline {
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(29,158,117,0.65);
  }

  .lr-headline .accent { color: #1D9E75; }

  .lr-desc {
    font-size: 14.5px;
    font-weight: 300;
    color: rgba(255,255,255,0.32);
    line-height: 1.75;
    max-width: 340px;
  }

  /* Stats */
  .lr-stats {
    position: relative; z-index: 3;
    display: grid; grid-template-columns: repeat(3,1fr); gap: 10px;
  }

  .lr-stat {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.065);
    border-radius: 14px; padding: 16px 14px;
    transition: border-color 0.2s;
  }

  .lr-stat:hover { border-color: rgba(29,158,117,0.25); }

  .lr-stat-n {
    font-family: 'Syne', sans-serif;
    font-size: 24px; font-weight: 800;
    line-height: 1; margin-bottom: 5px;
  }

  .lr-stat-l {
    font-size: 9.5px; font-weight: 600;
    color: rgba(255,255,255,0.22);
    text-transform: uppercase; letter-spacing: 0.1em;
  }

  /* ════════════════════════════════
     PANEL DERECHO
  ════════════════════════════════ */
  .lr-right {
    width: 460px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b1825;
    padding: 48px 44px;
    position: relative;
  }

  /* Brillo sutil arriba */
  .lr-right::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(29,158,117,0.3), rgba(46,117,182,0.3), transparent);
  }

  .lr-form-wrap {
    width: 100%;
    animation: fadeUp 0.45s ease both;
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Encabezado del form */
  .lr-form-top { margin-bottom: 28px; }

  .lr-form-eyebrow {
    font-size: 10.5px; font-weight: 600;
    color: #1D9E75;
    text-transform: uppercase; letter-spacing: 0.14em;
    margin-bottom: 8px;
  }

  .lr-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800;
    color: white; letter-spacing: -0.8px;
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .lr-form-sub {
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.28);
  }

  /* Toggle */
  .lr-toggle {
    display: flex;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 4px; gap: 4px;
    margin-bottom: 28px;
  }

  .lr-tab {
    flex: 1; padding: 10px;
    border: none; border-radius: 9px;
    font-size: 13.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lr-tab-on {
    background: #1D9E75;
    color: white;
    box-shadow: 0 3px 14px rgba(29,158,117,0.4);
  }

  .lr-tab-off {
    background: transparent;
    color: rgba(255,255,255,0.28);
  }
  .lr-tab-off:hover { color: rgba(255,255,255,0.55); }

  /* Campos */
  .lr-fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 22px; }

  .lr-field { display: flex; flex-direction: column; gap: 6px; }

  .lr-label {
    font-size: 10.5px; font-weight: 600;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase; letter-spacing: 0.1em;
    padding-left: 1px;
  }

  /* Wrapper que contiene icono + input */
  .lr-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .lr-icon {
    position: absolute;
    left: 14px;
    display: flex; align-items: center; justify-content: center;
    width: 18px; height: 18px;
    font-size: 14px;
    pointer-events: none;
    z-index: 1;
    /* SVG icons */
  }

  .lr-input {
    width: 100%;
    padding: 13px 14px 13px 44px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 11px;
    color: white;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }

  .lr-input::placeholder {
    color: rgba(255,255,255,0.18);
    font-weight: 300;
  }

  .lr-input:focus {
    border-color: rgba(29,158,117,0.55);
    background: rgba(29,158,117,0.06);
    box-shadow: 0 0 0 3px rgba(29,158,117,0.08);
  }

  .lr-input option {
    background: #0b1825;
    color: white;
  }

  /* Autocompletar — forzar tema oscuro */
  .lr-input:-webkit-autofill,
  .lr-input:-webkit-autofill:hover,
  .lr-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #111f2e inset !important;
    -webkit-text-fill-color: white !important;
    border-color: rgba(29,158,117,0.4) !important;
    transition: background-color 9999s ease-in-out 0s;
  }

  /* Error */
  .lr-error {
    display: flex; align-items: center; gap: 9px;
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.18);
    color: #fca5a5;
    padding: 11px 14px; border-radius: 10px;
    font-size: 13px; margin-bottom: 18px;
    line-height: 1.4;
  }

  /* Botón */
  .lr-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #1D9E75 0%, #178c65 100%);
    color: white; border: none;
    border-radius: 12px;
    font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.22s ease;
    box-shadow: 0 4px 20px rgba(29,158,117,0.38), 0 1px 0 rgba(255,255,255,0.08) inset;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    letter-spacing: 0.02em;
  }

  .lr-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #22b585 0%, #1a9d73 100%);
    box-shadow: 0 6px 28px rgba(29,158,117,0.52);
    transform: translateY(-1px);
  }

  .lr-btn:active:not(:disabled) { transform: translateY(0); }

  .lr-btn:disabled {
    background: rgba(29,158,117,0.25);
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Divisor */
  .lr-div {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0;
  }

  .lr-div-line { flex:1; height:1px; background: rgba(255,255,255,0.06); }

  .lr-div-txt {
    font-size: 11px; color: rgba(255,255,255,0.15);
    text-transform: uppercase; letter-spacing: 0.1em;
  }

  /* Footer */
  .lr-footer {
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.22);
  }

  .lr-footer-link {
    color: #1D9E75; cursor: pointer; font-weight: 600;
    transition: color 0.2s;
    background: none; border: none;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    cursor: pointer;
  }

  .lr-footer-link:hover { color: #22b585; }

  /* Responsive */
  @media (max-width: 780px) {
    .lr-left  { display: none; }
    .lr-right { width: 100%; padding: 36px 28px; }
  }
`;

/* SVG icons como componentes simples */
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l10 10 10-10L12 2z"/>
      <circle cx="7" cy="7" r="1.5" fill="rgba(255,255,255,0.35)" stroke="none"/>
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

  function switchMode(m) {
    setMode(m);
    setError('');
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
    <>
      <style>{styles}</style>
      <div className="lr">

        {/* ── IZQUIERDA ── */}
        <div className="lr-left">
          <div className="lr-sep" />

          <div className="lr-logo">
            <span className="lr-logo-dot" />
            <span className="lr-logo-text">Canal Reportes</span>
          </div>

          <div className="lr-hero">
            <div className="lr-badge">
              <span className="lr-badge-blink" />
              Sabana Centro · Cundinamarca
            </div>
            <h1 className="lr-headline">
              Tu voz<br />
              en el<br />
              <span className="outline">municipio</span>
            </h1>
            <p className="lr-desc">
              Reporta incidencias del espacio público y haz seguimiento en tiempo real.
              Transparencia y gestión para toda la comunidad.
            </p>
          </div>

          <div className="lr-stats">
            <div className="lr-stat">
              <div className="lr-stat-n" style={{ color:'#1D9E75' }}>24/7</div>
              <div className="lr-stat-l">Disponible</div>
            </div>
            <div className="lr-stat">
              <div className="lr-stat-n">100%</div>
              <div className="lr-stat-l">Transparente</div>
            </div>
            <div className="lr-stat">
              <div className="lr-stat-n" style={{ color:'#2E75B6' }}>Live</div>
              <div className="lr-stat-l">Tiempo real</div>
            </div>
          </div>
        </div>

        {/* ── DERECHA ── */}
        <div className="lr-right">
          <div className="lr-form-wrap">

            <div className="lr-form-top">
              <p className="lr-form-eyebrow">
                {mode === 'login' ? 'Acceso ciudadano' : 'Nueva cuenta'}
              </p>
              <h2 className="lr-form-title">
                {mode === 'login' ? 'Bienvenido\nde nuevo' : 'Únete a\nCanal Reportes'}
              </h2>
              <p className="lr-form-sub">
                {mode === 'login'
                  ? 'Ingresa tus credenciales para continuar'
                  : 'Crea tu cuenta y comienza a reportar'}
              </p>
            </div>

            {/* Toggle */}
            <div className="lr-toggle">
              <button
                type="button"
                className={`lr-tab ${mode === 'login' ? 'lr-tab-on' : 'lr-tab-off'}`}
                onClick={() => switchMode('login')}
              >
                Ingresar
              </button>
              <button
                type="button"
                className={`lr-tab ${mode === 'register' ? 'lr-tab-on' : 'lr-tab-off'}`}
                onClick={() => switchMode('register')}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="lr-fields">

                {mode === 'register' && (
                  <div className="lr-field">
                    <label className="lr-label">Nombre completo</label>
                    <div className="lr-input-wrap">
                      <span className="lr-icon"><IconUser /></span>
                      <input
                        className="lr-input"
                        name="nombre"
                        placeholder="Tu nombre completo"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                <div className="lr-field">
                  <label className="lr-label">Correo electrónico</label>
                  <div className="lr-input-wrap">
                    <span className="lr-icon"><IconMail /></span>
                    <input
                      className="lr-input"
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

                <div className="lr-field">
                  <label className="lr-label">Contraseña</label>
                  <div className="lr-input-wrap">
                    <span className="lr-icon"><IconLock /></span>
                    <input
                      className="lr-input"
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
                  <div className="lr-field">
                    <label className="lr-label">Tipo de cuenta</label>
                    <div className="lr-input-wrap">
                      <span className="lr-icon"><IconTag /></span>
                      <select
                        className="lr-input"
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
                <div className="lr-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#fca5a5"/>
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className="lr-btn" disabled={loading}>
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation:'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Cargando...
                  </>
                ) : mode === 'login' ? (
                  <>
                    Ingresar
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                ) : (
                  <>
                    Crear cuenta
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="lr-div">
              <div className="lr-div-line" />
              <span className="lr-div-txt">o</span>
              <div className="lr-div-line" />
            </div>

            <p className="lr-footer">
              {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <button
                type="button"
                className="lr-footer-link"
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
