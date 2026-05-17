import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #060d16;
    display: flex;
    position: relative;
    overflow: hidden;
  }

  /* ── PANEL IZQUIERDO (decorativo) ── */
  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }

  .login-left-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 20% 50%, rgba(29,158,117,0.13) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 80% 20%, rgba(46,117,182,0.1) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 60% 80%, rgba(29,158,117,0.07) 0%, transparent 50%);
  }

  /* Grilla sutil */
  .login-left-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* Línea vertical brillante */
  .login-left-line {
    position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(29,158,117,0.4) 30%,
      rgba(46,117,182,0.4) 60%,
      transparent 100%
    );
  }

  .login-brand {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 12px;
  }

  .login-brand-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #1D9E75;
    box-shadow: 0 0 12px #1D9E75, 0 0 24px rgba(29,158,117,0.4);
    animation: pulse 2.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 12px #1D9E75, 0 0 24px rgba(29,158,117,0.4); }
    50%       { box-shadow: 0 0 6px #1D9E75, 0 0 12px rgba(29,158,117,0.2); }
  }

  .login-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 700;
    color: white; letter-spacing: 0.02em;
  }

  .login-hero {
    position: relative; z-index: 1;
  }

  .login-hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(29,158,117,0.08);
    border: 1px solid rgba(29,158,117,0.2);
    color: #1D9E75; font-size: 11px; font-weight: 600;
    padding: 5px 12px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.1em;
    margin-bottom: 28px;
  }

  .login-hero-tag-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #1D9E75;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0.2; }
  }

  .login-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 800; line-height: 1.05;
    letter-spacing: -2px;
    color: white;
    margin-bottom: 20px;
  }

  .login-hero-title em {
    font-style: normal;
    color: transparent;
    -webkit-text-stroke: 1px rgba(29,158,117,0.7);
  }

  .login-hero-desc {
    font-size: 15px; font-weight: 300;
    color: rgba(255,255,255,0.35);
    line-height: 1.7; max-width: 360px;
  }

  /* Tarjetas de stats decorativas */
  .login-stats {
    position: relative; z-index: 1;
    display: flex; gap: 12px;
  }

  .login-stat-chip {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 14px 18px;
    flex: 1;
  }

  .login-stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 700;
    color: white; line-height: 1;
    margin-bottom: 4px;
  }

  .login-stat-label {
    font-size: 10px; font-weight: 500;
    color: rgba(255,255,255,0.25);
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  /* ── PANEL DERECHO (formulario) ── */
  .login-right {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    background: #0a1420;
    border-left: 1px solid rgba(255,255,255,0.05);
    position: relative;
  }

  .login-right-inner {
    width: 100%;
    max-width: 360px;
    animation: form-in 0.5s ease both;
  }

  @keyframes form-in {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-form-header { margin-bottom: 32px; }

  .login-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px; font-weight: 800;
    color: white; letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .login-form-sub {
    font-size: 13.5px; color: rgba(255,255,255,0.3);
    font-weight: 300;
  }

  /* Toggle */
  .login-toggle {
    display: flex;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 4px;
    margin-bottom: 28px;
    gap: 4px;
  }

  .login-toggle-btn {
    flex: 1; padding: 9px 0;
    border: none; border-radius: 8px;
    font-size: 13.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .login-toggle-btn.active {
    background: #1D9E75;
    color: white;
    box-shadow: 0 4px 16px rgba(29,158,117,0.35);
  }

  .login-toggle-btn.inactive {
    background: transparent;
    color: rgba(255,255,255,0.3);
  }

  .login-toggle-btn.inactive:hover {
    color: rgba(255,255,255,0.6);
  }

  /* Campos */
  .login-fields {
    display: flex; flex-direction: column; gap: 12px;
    margin-bottom: 20px;
  }

  .login-field {
    position: relative;
  }

  .login-field-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    font-size: 15px; pointer-events: none;
    opacity: 0.5;
  }

  .login-field-label {
    display: block;
    font-size: 11px; font-weight: 600;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 6px;
    padding-left: 2px;
  }

  .login-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: white;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;
  }

  .login-input::placeholder { color: rgba(255,255,255,0.2); }

  .login-input:focus {
    border-color: rgba(29,158,117,0.5);
    background: rgba(29,158,117,0.05);
  }

  .login-input option {
    background: #0a1420;
    color: white;
  }

  /* Error */
  .login-error {
    display: flex; align-items: center; gap: 8px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #fca5a5;
    padding: 10px 14px; border-radius: 10px;
    font-size: 13px; margin-bottom: 16px;
  }

  /* Botón submit */
  .login-btn {
    width: 100%;
    padding: 14px;
    background: #1D9E75;
    color: white; border: none;
    border-radius: 12px;
    font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 24px rgba(29,158,117,0.35);
    letter-spacing: 0.02em;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .login-btn:hover:not(:disabled) {
    background: #22b585;
    box-shadow: 0 6px 32px rgba(29,158,117,0.5);
    transform: translateY(-1px);
  }

  .login-btn:active:not(:disabled) { transform: translateY(0); }

  .login-btn:disabled {
    background: rgba(29,158,117,0.3);
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Footer del form */
  .login-form-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: rgba(255,255,255,0.2);
  }

  .login-form-footer span {
    color: #1D9E75;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.2s;
  }

  .login-form-footer span:hover { color: #22b585; }

  /* Divisor */
  .login-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0;
  }

  .login-divider-line {
    flex: 1; height: 1px;
    background: rgba(255,255,255,0.06);
  }

  .login-divider-text {
    font-size: 11px; color: rgba(255,255,255,0.15);
    text-transform: uppercase; letter-spacing: 0.1em;
  }

  /* Responsive: ocultar panel izquierdo en móvil */
  @media (max-width: 768px) {
    .login-left { display: none; }
    .login-right { width: 100%; border-left: none; }
  }
`;

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
      <div className="login-root">

        {/* ── PANEL IZQUIERDO ── */}
        <div className="login-left">
          <div className="login-left-bg" />
          <div className="login-left-grid" />
          <div className="login-left-line" />

          <div className="login-brand">
            <span className="login-brand-dot" />
            <span className="login-brand-name">Canal Reportes</span>
          </div>

          <div className="login-hero">
            <div className="login-hero-tag">
              <span className="login-hero-tag-dot" />
              Sabana Centro · Cundinamarca
            </div>
            <h1 className="login-hero-title">
              Tu voz<br />en el<br /><em>municipio</em>
            </h1>
            <p className="login-hero-desc">
              Reporta y haz seguimiento a problemas del espacio público.
              Transparencia y gestión en tiempo real para todos los ciudadanos.
            </p>
          </div>

          <div className="login-stats">
            <div className="login-stat-chip">
              <div className="login-stat-num" style={{ color: '#1D9E75' }}>24/7</div>
              <div className="login-stat-label">Disponible</div>
            </div>
            <div className="login-stat-chip">
              <div className="login-stat-num">100%</div>
              <div className="login-stat-label">Transparente</div>
            </div>
            <div className="login-stat-chip">
              <div className="login-stat-num" style={{ color: '#2E75B6' }}>Real</div>
              <div className="login-stat-label">Tiempo real</div>
            </div>
          </div>
        </div>

        {/* ── PANEL DERECHO ── */}
        <div className="login-right">
          <div className="login-right-inner">

            <div className="login-form-header">
              <h2 className="login-form-title">
                {mode === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
              </h2>
              <p className="login-form-sub">
                {mode === 'login'
                  ? 'Ingresa tus credenciales para continuar'
                  : 'Regístrate para reportar incidencias'}
              </p>
            </div>

            {/* Toggle */}
            <div className="login-toggle">
              <button
                className={`login-toggle-btn ${mode === 'login' ? 'active' : 'inactive'}`}
                onClick={() => { setMode('login'); setError(''); }}
              >
                Ingresar
              </button>
              <button
                className={`login-toggle-btn ${mode === 'register' ? 'active' : 'inactive'}`}
                onClick={() => { setMode('register'); setError(''); }}
              >
                Registrarse
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div className="login-fields">

                {mode === 'register' && (
                  <div className="login-field">
                    <label className="login-field-label">Nombre completo</label>
                    <span className="login-field-icon">👤</span>
                    <input
                      className="login-input"
                      name="nombre" placeholder="Tu nombre"
                      value={form.nombre} onChange={handleChange} required
                    />
                  </div>
                )}

                <div className="login-field">
                  <label className="login-field-label">Correo electrónico</label>
                  <span className="login-field-icon">✉️</span>
                  <input
                    className="login-input"
                    name="email" type="email" placeholder="tu@correo.com"
                    value={form.email} onChange={handleChange} required
                  />
                </div>

                <div className="login-field">
                  <label className="login-field-label">Contraseña</label>
                  <span className="login-field-icon">🔒</span>
                  <input
                    className="login-input"
                    name="password" type="password" placeholder="••••••••"
                    value={form.password} onChange={handleChange} required
                  />
                </div>

                {mode === 'register' && (
                  <div className="login-field">
                    <label className="login-field-label">Tipo de cuenta</label>
                    <span className="login-field-icon">🏷️</span>
                    <select
                      className="login-input"
                      name="rol" value={form.rol} onChange={handleChange}
                    >
                      <option value="ciudadano">Ciudadano</option>
                      <option value="operario">Operario municipal</option>
                    </select>
                  </div>
                )}
              </div>

              {error && (
                <div className="login-error">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading
                  ? <><span>⏳</span> Cargando...</>
                  : mode === 'login'
                    ? <><span>→</span> Ingresar</>
                    : <><span>✓</span> Crear cuenta</>
                }
              </button>
            </form>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">o</span>
              <div className="login-divider-line" />
            </div>

            <p className="login-form-footer">
              {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
                {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
              </span>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}