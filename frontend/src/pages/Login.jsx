import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ══════════════════════════════════
     FONDO AURORA ANIMADO
  ══════════════════════════════════ */
  .lp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
    background: #030c14;
  }

  /* Orbe 1 — verde, flota lento */
  .lp-orb1 {
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(29,158,117,0.28) 0%, transparent 65%);
    top: -200px; left: -150px;
    animation: float1 14s ease-in-out infinite;
    pointer-events: none;
  }

  /* Orbe 2 — azul, flota diferente */
  .lp-orb2 {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(46,117,182,0.22) 0%, transparent 65%);
    bottom: -180px; right: -120px;
    animation: float2 18s ease-in-out infinite;
    pointer-events: none;
  }

  /* Orbe 3 — verde más pequeño, movimiento rápido */
  .lp-orb3 {
    position: absolute;
    width: 350px; height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(29,158,117,0.16) 0%, transparent 65%);
    top: 50%; right: 10%;
    animation: float3 10s ease-in-out infinite;
    pointer-events: none;
  }

  /* Orbe 4 — teal, fondo inferior izq */
  .lp-orb4 {
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20,120,100,0.15) 0%, transparent 65%);
    bottom: 5%; left: 15%;
    animation: float4 16s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes float1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(60px, 80px) scale(1.08); }
    66%      { transform: translate(-40px, 50px) scale(0.95); }
  }

  @keyframes float2 {
    0%,100% { transform: translate(0,0) scale(1); }
    40%      { transform: translate(-70px,-60px) scale(1.1); }
    70%      { transform: translate(40px,-30px) scale(0.92); }
  }

  @keyframes float3 {
    0%,100% { transform: translate(0,0); }
    50%      { transform: translate(-30px, 60px); }
  }

  @keyframes float4 {
    0%,100% { transform: translate(0,0); }
    50%      { transform: translate(50px,-40px); }
  }

  /* Partículas flotantes */
  .lp-particles {
    position: absolute; inset: 0; pointer-events: none; overflow: hidden;
  }

  .lp-p {
    position: absolute;
    width: 2px; height: 2px;
    border-radius: 50%;
    background: rgba(29,158,117,0.6);
    animation: particle-rise linear infinite;
  }

  @keyframes particle-rise {
    0%   { opacity: 0; transform: translateY(0) translateX(0); }
    10%  { opacity: 1; }
    90%  { opacity: 0.3; }
    100% { opacity: 0; transform: translateY(-100vh) translateX(20px); }
  }

  /* ══════════════════════════════════
     TARJETA
  ══════════════════════════════════ */
  .lp-card {
    position: relative; z-index: 10;
    display: flex;
    width: 100%; max-width: 880px;
    min-height: 560px;
    border-radius: 28px;
    overflow: hidden;
    box-shadow:
      0 40px 100px rgba(0,0,0,0.7),
      0 0 0 1px rgba(255,255,255,0.07),
      0 0 60px rgba(29,158,117,0.08);
    animation: card-in 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes card-in {
    from { opacity:0; transform:translateY(30px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  /* ══════════════════════════════════
     PANEL IZQUIERDO
  ══════════════════════════════════ */
  .lp-visual {
    width: 44%;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 38px 36px;
    background: linear-gradient(160deg, #071a12 0%, #04121e 60%, #030c14 100%);
  }

  /* Resplandor interno del panel */
  .lp-visual-glow {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 90% 60% at 30% 20%, rgba(29,158,117,0.22) 0%, transparent 60%),
      radial-gradient(ellipse 60% 70% at 80% 85%, rgba(46,117,182,0.14) 0%, transparent 55%);
    animation: glow-shift 8s ease-in-out infinite alternate;
  }

  @keyframes glow-shift {
    0%   { opacity: 0.8; transform: scale(1); }
    100% { opacity: 1;   transform: scale(1.05); }
  }

  /* Líneas diagonales decorativas */
  .lp-lines {
    position: absolute; inset: 0; pointer-events: none; overflow: hidden;
  }

  .lp-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(29,158,117,0.25), transparent);
    animation: line-slide linear infinite;
  }

  @keyframes line-slide {
    0%   { transform: translateX(-100%) rotate(-25deg); opacity: 0; }
    20%  { opacity: 1; }
    80%  { opacity: 0.5; }
    100% { transform: translateX(200%) rotate(-25deg); opacity: 0; }
  }

  /* Separador derecho */
  .lp-sep {
    position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(29,158,117,0.5) 30%,
      rgba(29,158,117,0.3) 60%,
      transparent 100%
    );
    z-index: 2;
  }

  .lp-visual-top {
    position: relative; z-index: 3;
    display: flex; align-items: center; gap: 10px;
  }

  .lp-dot {
    width: 9px; height: 9px; border-radius: 50%;
    background: #1D9E75;
    box-shadow: 0 0 0 3px rgba(29,158,117,0.2), 0 0 16px rgba(29,158,117,0.6);
    animation: pulse-dot 2.5s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%,100% { box-shadow: 0 0 0 3px rgba(29,158,117,0.2), 0 0 16px rgba(29,158,117,0.6); }
    50%      { box-shadow: 0 0 0 6px rgba(29,158,117,0.08), 0 0 8px rgba(29,158,117,0.3); }
  }

  .lp-brand {
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700;
    color: rgba(255,255,255,0.8);
  }

  /* NAVE ESPACIAL / ORBE TECNOLÓGICO CSS GENERATIVO */
  .lp-tech-graphic {
    position: relative;
    width: 100%;
    height: 140px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 3;
  }

  .lp-tech-core {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(29,158,117,0.6) 0%, rgba(3,12,20,0.8) 80%);
    box-shadow: 0 0 35px rgba(29,158,117,0.5), inset 0 0 15px rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: core-pulse 4s ease-in-out infinite;
  }

  .lp-tech-ring {
    position: absolute;
    border: 1.5px dashed rgba(29,158,117,0.4);
    border-radius: 50%;
    animation: tech-spin 25s linear infinite;
  }

  .lp-tech-ring.r1 { width: 130px; height: 130px; animation-duration: 20s; border-style: dotted; }
  .lp-tech-ring.r2 { width: 170px; height: 170px; animation-direction: reverse; animation-duration: 35s; border-color: rgba(46,117,182,0.3); }
  .lp-tech-ring.r3 { width: 210px; height: 210px; border: 1px solid rgba(29,158,117,0.15); }

  .lp-tech-nodes {
    position: absolute;
    width: 100%; height: 100%;
    background: 
      radial-gradient(circle at 15% 50%, #1D9E75 3px, transparent 4px),
      radial-gradient(circle at 85% 30%, #2e75b6 2px, transparent 3px),
      radial-gradient(circle at 50% 12%, #4dd4a0 3px, transparent 4px);
    opacity: 0.7;
    animation: tech-spin 40s linear infinite;
  }

  @keyframes core-pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 35px rgba(29,158,117,0.5); }
    50% { transform: scale(1.06); box-shadow: 0 0 50px rgba(47,214,162,0.7); }
  }

  @keyframes tech-spin {
    100% { transform: rotate(360deg); }
  }

  .lp-visual-bottom { position: relative; z-index: 3; }

  .lp-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(29,158,117,0.12);
    border: 1px solid rgba(29,158,117,0.28);
    color: #4dd4a0; font-size: 10px; font-weight: 600;
    padding: 4px 12px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 16px;
  }

  .lp-tag-blink {
    width: 4px; height: 4px; border-radius: 50%;
    background: #1D9E75;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.1} }

  .lp-visual-title {
    font-family: 'Syne', sans-serif;
    font-size: 40px; font-weight: 800;
    line-height: 1.0; letter-spacing: -2px;
    color: white;
    margin-bottom: 16px;
  }

  .lp-visual-title .hi {
    color: transparent;
    -webkit-text-stroke: 1.5px #1D9E75;
    text-shadow: 0 0 30px rgba(29,158,117,0.4);
  }

  .lp-visual-desc {
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.38);
    line-height: 1.7; max-width: 260px;
  }

  /* ══════════════════════════════════
     PANEL DERECHO
  ══════════════════════════════════ */
  .lp-form-panel {
    flex: 1;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 44px;
    border-radius: 0 28px 28px 0;
  }

  .lp-form-inner {
    width: 100%;
    max-width: 300px;
    animation: form-in 0.5s 0.15s ease both;
  }

  @keyframes form-in {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .lp-form-eyebrow {
    font-size: 10.5px; font-weight: 600;
    color: #1D9E75;
    text-transform: uppercase; letter-spacing: 0.14em;
    margin-bottom: 6px;
  }

  .lp-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800;
    color: #0d1f2d; letter-spacing: -0.8px; line-height: 1.1;
    margin-bottom: 5px;
  }

  .lp-form-sub {
    font-size: 13px; color: #94a3b8; font-weight: 300;
    margin-bottom: 26px; line-height: 1.5;
  }

  /* Toggle */
  .lp-toggle {
    display: flex;
    background: #f1f5f9;
    border-radius: 12px; padding: 4px; gap: 4px;
    margin-bottom: 24px;
  }

  .lp-tab {
    flex: 1; padding: 9px;
    border: none; border-radius: 9px;
    font-size: 13.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.2s;
  }

  .lp-tab-on  { background: #1D9E75; color: white; box-shadow: 0 3px 12px rgba(29,158,117,0.35); }
  .lp-tab-off { background: transparent; color: #94a3b8; }
  .lp-tab-off:hover { color: #475569; }

  /* Campos */
  .lp-fields { display: flex; flex-direction: column; gap: 13px; margin-bottom: 18px; }

  .lp-field { display: flex; flex-direction: column; gap: 5px; }

  .lp-label {
    font-size: 10.5px; font-weight: 600;
    color: #64748b;
    text-transform: uppercase; letter-spacing: 0.09em;
  }

  .lp-input-wrap { position: relative; display: flex; align-items: center; }

  .lp-icon {
    position: absolute; left: 13px;
    display: flex; align-items: center;
    pointer-events: none; z-index: 1;
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
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .lp-input::placeholder { color: #c0ccda; font-weight: 300; }

  .lp-input:focus {
    border-color: #1D9E75;
    background: #f0fdf8;
    box-shadow: 0 0 0 3px rgba(29,158,117,0.1);
  }

  .lp-input:-webkit-autofill,
  .lp-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #f0fdf8 inset !important;
    -webkit-text-fill-color: #0d1f2d !important;
  }

  .lp-input option { background: white; color: #0d1f2d; }

  /* Error */
  .lp-error {
    display: flex; align-items: flex-start; gap: 8px;
    background: #fef2f2; border: 1px solid #fecaca;
    color: #dc2626; padding: 10px 13px;
    border-radius: 10px; font-size: 13px;
    margin-bottom: 14px; line-height: 1.4;
  }

  /* Botón */
  .lp-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #1D9E75 0%, #168c65 100%);
    color: white; border: none; border-radius: 12px;
    font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.22s;
    box-shadow: 0 4px 18px rgba(29,158,117,0.4);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    letter-spacing: 0.02em;
    position: relative; overflow: hidden;
  }

  /* Shimmer en el botón */
  .lp-btn::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transform: skewX(-20deg);
    animation: btn-shine 3s ease-in-out infinite;
  }

  @keyframes btn-shine {
    0%,100% { left: -100%; }
    50%      { left: 150%; }
  }

  .lp-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(29,158,117,0.55);
  }

  .lp-btn:active:not(:disabled) { transform: translateY(0); }

  .lp-btn:disabled { background: #a7d9c6; cursor: not-allowed; box-shadow: none; }
  .lp-btn:disabled::after { display: none; }

  /* Divisor */
  .lp-div { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
  .lp-div-line { flex:1; height:1px; background: #e2e8f0; }
  .lp-div-txt  { font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.1em; }

  /* Footer */
  .lp-footer { text-align: center; font-size: 13px; color: #94a3b8; }

  .lp-footer-btn {
    color: #1D9E75; font-weight: 600; cursor: pointer;
    background: none; border: none;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    transition: color 0.2s;
  }
  .lp-footer-btn:hover { color: #147a59; }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 700px) {
    .lp-visual { display: none; }
    .lp-form-panel { border-radius: 28px; padding: 40px 28px; }
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

// Partículas generadas dinámicamente
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left:  `${5 + (i * 5.5) % 92}%`,
  delay: `${(i * 1.3) % 12}s`,
  dur:   `${8 + (i * 1.7) % 10}s`,
  size:  i % 3 === 0 ? 3 : 2,
  opacity: i % 4 === 0 ? 0.8 : 0.5,
}));

export default function Login() {
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ nombre:'', email:'', password:'', rol:'ciudadano' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function switchMode(m)   { setMode(m); setError(''); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      
      // Enviamos solo las propiedades requeridas según el modo
      const payload = mode === 'login' 
        ? { email: form.email, password: form.password }
        : form;

      const { data } = await api.post(endpoint, payload);
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

        {/* Orbes animados de fondo */}
        <div className="lp-orb1" />
        <div className="lp-orb2" />
        <div className="lp-orb3" />
        <div className="lp-orb4" />

        {/* Partículas flotantes */}
        <div className="lp-particles">
          {PARTICLES.map(p => (
            <div key={p.id} className="lp-p" style={{
              left: p.left,
              bottom: '-10px',
              width: p.size, height: p.size,
              opacity: p.opacity,
              animationDelay: p.delay,
              animationDuration: p.dur,
            }} />
          ))}
        </div>

        {/* Tarjeta */}
        <div className="lp-card">

          {/* PANEL IZQUIERDO */}
          <div className="lp-visual">
            <div className="lp-visual-glow" />
            <div className="lp-sep" />

            {/* Líneas de luz en movimiento */}
            <div className="lp-lines">
              {[0,1,2,3].map(i => (
                <div key={i} className="lp-line" style={{
                  width: `${200 + i * 60}px`,
                  top: `${15 + i * 22}%`,
                  animationDelay: `${i * 3}s`,
                  animationDuration: `${7 + i * 2}s`,
                }} />
              ))}
            </div>

            <div className="lp-visual-top">
              <span className="lp-dot" />
              <span className="lp-brand">Canal Reportes</span>
            </div>

            {/* GRÁFICO TECNOLÓGICO CENTRAL (ORBE DINÁMICO) */}
            <div className="lp-tech-graphic">
              <div className="lp-tech-ring r3" />
              <div className="lp-tech-ring r2" />
              <div className="lp-tech-ring r1" />
              <div className="lp-tech-core">
                <div className="lp-tech-nodes" />
                {/* SVG de Escudo/Check en el núcleo para denotar auditoría y reportes */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4dd4a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 11 2 2 4-4"/>
                </svg>
              </div>
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

          {/* PANEL DERECHO */}
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

              <div className="lp-toggle">
                <button type="button" className={`lp-tab ${mode==='login' ? 'lp-tab-on':'lp-tab-off'}`} onClick={() => switchMode('login')}>
                  Ingresar
                </button>
                <button type="button" className={`lp-tab ${mode==='register' ? 'lp-tab-on':'lp-tab-off'}`} onClick={() => switchMode('register')}>
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
                        <input className="lp-input" name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required autoComplete="name" />
                      </div>
                    </div>
                  )}

                  <div className="lp-field">
                    <label className="lp-label">Correo electrónico</label>
                    <div className="lp-input-wrap">
                      <span className="lp-icon"><IconMail /></span>
                      <input className="lp-input" name="email" type="email" placeholder="tu@correo.com" value={form.email} onChange={handleChange} required autoComplete="email" />
                    </div>
                  </div>

                  <div className="lp-field">
                    <label className="lp-label">Contraseña</label>
                    <div className="lp-input-wrap">
                      <span className="lp-icon"><IconLock /></span>
                      <input className="lp-input" name="password" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} required autoComplete={mode==='login' ? 'current-password':'new-password'} />
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div className="lp-field">
                      <label className="lp-label">Tipo de cuenta</label>
                      <div className="lp-input-wrap">
                        <span className="lp-icon"><IconTag /></span>
                        <select className="lp-input" name="rol" value={form.rol} onChange={handleChange}>
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
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Cargando...</>
                  ) : mode === 'login' ? (
                    <>Ingresar <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                  ) : (
                    <>Crear cuenta <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></>
                  )}
                </button>
              </form>

              <div className="lp-div">
                <div className="lp-div-line"/>
                <span className="lp-div-txt">o</span>
                <div className="lp-div-line"/>
              </div>

              <p className="lp-footer">
                {mode==='login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                <button type="button" className="lp-footer-btn" onClick={() => switchMode(mode==='login' ? 'register':'login')}>
                  {mode==='login' ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}