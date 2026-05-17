import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ══════════════════════════════════
     FONDO GALÁCTICO ANIMADO
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
    background: #050008;
  }

  /* Capa base: nebulosa oscura */
  .lp-nebula-base {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 20% 50%, rgba(80,0,120,0.55) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 75% 30%, rgba(0,60,120,0.4) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 50% 80%, rgba(120,0,80,0.3) 0%, transparent 50%);
    animation: nebula-breathe 12s ease-in-out infinite alternate;
  }

  @keyframes nebula-breathe {
    0%   { opacity: 0.8; transform: scale(1); }
    100% { opacity: 1;   transform: scale(1.04); }
  }

  /* Orbe galáctico principal — rosa/violeta */
  .lp-orb1 {
    position: absolute;
    width: 750px; height: 750px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,50,180,0.22) 0%, rgba(120,0,180,0.15) 35%, transparent 65%);
    top: -200px; left: -100px;
    animation: float1 16s ease-in-out infinite;
    pointer-events: none;
  }

  /* Orbe verde esmeralda */
  .lp-orb2 {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(29,220,130,0.18) 0%, rgba(0,150,80,0.1) 40%, transparent 65%);
    bottom: -150px; right: -100px;
    animation: float2 20s ease-in-out infinite;
    pointer-events: none;
  }

  /* Orbe azul cyan */
  .lp-orb3 {
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,180,255,0.14) 0%, transparent 65%);
    top: 40%; right: 5%;
    animation: float3 11s ease-in-out infinite;
    pointer-events: none;
  }

  /* Corazón galáctico — resplandor central como en la imagen */
  .lp-heart-glow {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 380px; height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(220,80,180,0.25) 0%,
      rgba(160,0,220,0.15) 30%,
      rgba(0,200,120,0.08) 55%,
      transparent 70%
    );
    pointer-events: none;
    animation: heart-pulse 6s ease-in-out infinite;
    left: 22%; top: 50%;
  }

  @keyframes heart-pulse {
    0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
    50%      { transform: translate(-50%,-50%) scale(1.12); opacity: 1;   }
  }

  @keyframes float1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(50px, 70px) scale(1.07); }
    66%      { transform: translate(-30px, 40px) scale(0.96); }
  }

  @keyframes float2 {
    0%,100% { transform: translate(0,0) scale(1); }
    40%      { transform: translate(-60px,-50px) scale(1.1); }
    70%      { transform: translate(30px,-25px) scale(0.93); }
  }

  @keyframes float3 {
    0%,100% { transform: translate(0,0); }
    50%      { transform: translate(-25px, 55px); }
  }

  /* Campo de estrellas */
  .lp-stars {
    position: absolute; inset: 0; pointer-events: none; overflow: hidden;
  }

  .lp-star {
    position: absolute;
    border-radius: 50%;
    background: white;
    animation: star-twinkle ease-in-out infinite;
  }

  @keyframes star-twinkle {
    0%,100% { opacity: 0.1; transform: scale(1); }
    50%      { opacity: 1;   transform: scale(1.4); }
  }

  /* Partículas de polvo cósmico */
  .lp-particles {
    position: absolute; inset: 0; pointer-events: none; overflow: hidden;
  }

  .lp-p {
    position: absolute;
    border-radius: 50%;
    animation: particle-rise linear infinite;
  }

  @keyframes particle-rise {
    0%   { opacity: 0; transform: translateY(0) translateX(0); }
    10%  { opacity: 1; }
    90%  { opacity: 0.2; }
    100% { opacity: 0; transform: translateY(-100vh) translateX(15px); }
  }

  /* ══════════════════════════════════
     TARJETA
  ══════════════════════════════════ */
  .lp-card {
    position: relative; z-index: 10;
    display: flex;
    width: 100%; max-width: 900px;
    min-height: 570px;
    border-radius: 30px;
    overflow: hidden;
    box-shadow:
      0 50px 120px rgba(0,0,0,0.8),
      0 0 0 1px rgba(200,100,255,0.12),
      0 0 80px rgba(160,0,220,0.12),
      0 0 40px rgba(29,220,130,0.06);
    animation: card-in 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes card-in {
    from { opacity:0; transform:translateY(35px) scale(0.96); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  /* ══════════════════════════════════
     PANEL IZQUIERDO — GALÁCTICO
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
    background: linear-gradient(155deg,
      rgba(40,0,70,0.95) 0%,
      rgba(15,0,40,0.98) 50%,
      rgba(5,0,20,1) 100%
    );
  }

  /* Fondo de nebulosa interno */
  .lp-visual-nebula {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 100% 70% at 30% 25%, rgba(180,40,200,0.3) 0%, transparent 55%),
      radial-gradient(ellipse 70% 60% at 70% 75%, rgba(0,160,80,0.2) 0%, transparent 50%),
      radial-gradient(ellipse 50% 50% at 80% 20%, rgba(0,120,220,0.15) 0%, transparent 45%);
    animation: nebula-shift 10s ease-in-out infinite alternate;
  }

  @keyframes nebula-shift {
    0%   { opacity: 0.85; }
    100% { opacity: 1; }
  }

  /* Corazón galáctico en el panel */
  .lp-galaxy-heart {
    position: relative; z-index: 3;
    width: 100%; height: 160px;
    display: flex; align-items: center; justify-content: center;
    margin: 10px 0 4px;
  }

  .lp-heart-container {
    position: relative;
    width: 120px; height: 120px;
    display: flex; align-items: center; justify-content: center;
  }

  /* Anillos orbitales */
  .lp-heart-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid;
    animation: ring-spin linear infinite;
  }

  .lp-heart-ring.r1 {
    width: 140px; height: 140px;
    border-color: rgba(200,80,255,0.3);
    border-style: dashed;
    animation-duration: 25s;
  }

  .lp-heart-ring.r2 {
    width: 175px; height: 175px;
    border-color: rgba(29,220,130,0.2);
    animation-duration: 40s;
    animation-direction: reverse;
  }

  .lp-heart-ring.r3 {
    width: 210px; height: 210px;
    border-color: rgba(100,100,255,0.12);
    border-style: dotted;
    animation-duration: 60s;
  }

  @keyframes ring-spin {
    100% { transform: rotate(360deg); }
  }

  /* Corazón SVG con neón */
  .lp-heart-svg {
    position: relative; z-index: 4;
    filter:
      drop-shadow(0 0 12px rgba(220,80,180,0.9))
      drop-shadow(0 0 30px rgba(160,0,220,0.6))
      drop-shadow(0 0 60px rgba(200,50,200,0.3));
    animation: heart-beat 3s ease-in-out infinite;
  }

  @keyframes heart-beat {
    0%,100% { transform: scale(1); filter: drop-shadow(0 0 12px rgba(220,80,180,0.9)) drop-shadow(0 0 30px rgba(160,0,220,0.6)); }
    50%      { transform: scale(1.08); filter: drop-shadow(0 0 20px rgba(255,100,220,1)) drop-shadow(0 0 50px rgba(180,0,255,0.8)) drop-shadow(0 0 80px rgba(200,50,200,0.5)); }
  }

  /* Partículas de estrellas alrededor del corazón */
  .lp-heart-sparks {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(circle at 20% 30%, rgba(255,200,255,0.8) 1.5px, transparent 2px),
      radial-gradient(circle at 80% 20%, rgba(200,255,220,0.8) 1px, transparent 1.5px),
      radial-gradient(circle at 70% 80%, rgba(180,180,255,0.8) 1.5px, transparent 2px),
      radial-gradient(circle at 15% 75%, rgba(255,180,200,0.7) 1px, transparent 1.5px),
      radial-gradient(circle at 90% 60%, rgba(150,255,200,0.8) 1.5px, transparent 2px);
    animation: sparks-twinkle 3s ease-in-out infinite;
    width: 220px; height: 220px;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 50%;
  }

  @keyframes sparks-twinkle {
    0%,100% { opacity: 0.6; transform: translate(-50%,-50%) rotate(0deg); }
    50%      { opacity: 1;   transform: translate(-50%,-50%) rotate(180deg); }
  }

  /* Separador derecho verde */
  .lp-sep {
    position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(29,220,130,0.6) 30%,
      rgba(160,0,220,0.4) 60%,
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
    background: #1DDC82;
    box-shadow: 0 0 0 3px rgba(29,220,130,0.2), 0 0 16px rgba(29,220,130,0.7);
    animation: pulse-dot 2.5s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%,100% { box-shadow: 0 0 0 3px rgba(29,220,130,0.2), 0 0 16px rgba(29,220,130,0.7); }
    50%      { box-shadow: 0 0 0 6px rgba(29,220,130,0.06), 0 0 8px rgba(29,220,130,0.3); }
  }

  .lp-brand {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.04em;
  }

  .lp-visual-bottom { position: relative; z-index: 3; }

  .lp-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(29,220,130,0.1);
    border: 1px solid rgba(29,220,130,0.3);
    color: #4DFFA0; font-size: 10px; font-weight: 600;
    padding: 4px 12px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 14px;
  }

  .lp-tag-blink {
    width: 4px; height: 4px; border-radius: 50%;
    background: #1DDC82;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.1} }

  .lp-visual-title {
    font-family: 'Syne', sans-serif;
    font-size: 42px; font-weight: 800;
    line-height: 1.0; letter-spacing: -2px;
    color: white;
    margin-bottom: 16px;
    text-shadow: 0 0 40px rgba(255,255,255,0.1);
  }

  .lp-visual-title .hi {
    color: transparent;
    -webkit-text-stroke: 1.5px #1DDC82;
    text-shadow:
      0 0 20px rgba(29,220,130,0.6),
      0 0 50px rgba(29,220,130,0.3);
  }

  .lp-visual-desc {
    font-size: 12.5px; font-weight: 300;
    color: rgba(255,255,255,0.35);
    line-height: 1.75; max-width: 255px;
  }

  /* ══════════════════════════════════
     PANEL DERECHO — FORMULARIO
  ══════════════════════════════════ */
  .lp-form-panel {
    flex: 1;
    background: rgba(8,4,18,0.97);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 46px;
    border-radius: 0 30px 30px 0;
    position: relative;
    overflow: hidden;
  }

  /* Fondo sutil del panel derecho */
  .lp-form-panel::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 70% 50% at 80% 10%, rgba(100,0,180,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 50% 60% at 10% 90%, rgba(0,160,80,0.08) 0%, transparent 50%);
  }

  .lp-form-inner {
    position: relative; z-index: 2;
    width: 100%;
    max-width: 300px;
    animation: form-in 0.5s 0.2s ease both;
  }

  @keyframes form-in {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .lp-form-eyebrow {
    font-size: 10.5px; font-weight: 600;
    color: #1DDC82;
    text-transform: uppercase; letter-spacing: 0.16em;
    margin-bottom: 6px;
  }

  .lp-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 30px; font-weight: 800;
    color: #ffffff; letter-spacing: -0.8px; line-height: 1.1;
    margin-bottom: 5px;
  }

  .lp-form-sub {
    font-size: 12.5px; color: rgba(255,255,255,0.35); font-weight: 300;
    margin-bottom: 26px; line-height: 1.6;
  }

  /* Toggle */
  .lp-toggle {
    display: flex;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 13px; padding: 4px; gap: 4px;
    margin-bottom: 24px;
  }

  .lp-tab {
    flex: 1; padding: 9px;
    border: none; border-radius: 10px;
    font-size: 13.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.2s;
  }

  .lp-tab-on  {
    background: linear-gradient(135deg, #1DDC82, #14b86c);
    color: #040010;
    box-shadow: 0 3px 14px rgba(29,220,130,0.4);
  }
  .lp-tab-off { background: transparent; color: rgba(255,255,255,0.35); }
  .lp-tab-off:hover { color: rgba(255,255,255,0.65); }

  /* Campos */
  .lp-fields { display: flex; flex-direction: column; gap: 13px; margin-bottom: 18px; }

  .lp-field { display: flex; flex-direction: column; gap: 5px; }

  .lp-label {
    font-size: 10px; font-weight: 600;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase; letter-spacing: 0.1em;
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
    background: rgba(255,255,255,0.05);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: #ffffff;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .lp-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 300; }

  .lp-input:focus {
    border-color: #1DDC82;
    background: rgba(29,220,130,0.06);
    box-shadow: 0 0 0 3px rgba(29,220,130,0.12);
  }

  .lp-input:-webkit-autofill,
  .lp-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px rgba(10,5,25,1) inset !important;
    -webkit-text-fill-color: #ffffff !important;
  }

  .lp-input option { background: #0d0820; color: #ffffff; }

  /* Error */
  .lp-error {
    display: flex; align-items: flex-start; gap: 8px;
    background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3);
    color: #ff7070; padding: 10px 13px;
    border-radius: 11px; font-size: 12.5px;
    margin-bottom: 14px; line-height: 1.4;
  }

  /* Botón */
  .lp-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #1DDC82 0%, #14b86c 100%);
    color: #040010; border: none; border-radius: 13px;
    font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.22s;
    box-shadow: 0 4px 22px rgba(29,220,130,0.45);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    letter-spacing: 0.02em;
    position: relative; overflow: hidden;
  }

  .lp-btn::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: skewX(-20deg);
    animation: btn-shine 3s ease-in-out infinite;
  }

  @keyframes btn-shine {
    0%,100% { left: -100%; }
    50%      { left: 150%; }
  }

  .lp-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(29,220,130,0.6);
  }

  .lp-btn:active:not(:disabled) { transform: translateY(0); }

  .lp-btn:disabled { background: rgba(29,220,130,0.25); color: rgba(255,255,255,0.3); cursor: not-allowed; box-shadow: none; }
  .lp-btn:disabled::after { display: none; }

  /* Divisor */
  .lp-div { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
  .lp-div-line { flex:1; height:1px; background: rgba(255,255,255,0.08); }
  .lp-div-txt  { font-size: 11px; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 0.1em; }

  /* Footer */
  .lp-footer { text-align: center; font-size: 13px; color: rgba(255,255,255,0.3); }

  .lp-footer-btn {
    color: #1DDC82; font-weight: 600; cursor: pointer;
    background: none; border: none;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    transition: color 0.2s;
  }
  .lp-footer-btn:hover { color: #4DFFA0; }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 700px) {
    .lp-visual { display: none; }
    .lp-form-panel { border-radius: 30px; padding: 40px 28px; }
  }
`;

function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}

// Estrellas generadas dinámicamente
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  left:  `${(i * 1.27) % 100}%`,
  top:   `${(i * 2.13) % 100}%`,
  size:  i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
  delay: `${(i * 0.7) % 5}s`,
  dur:   `${2 + (i * 0.4) % 4}s`,
}));

// Partículas de polvo cósmico
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left:  `${5 + (i * 4.8) % 92}%`,
  delay: `${(i * 1.1) % 14}s`,
  dur:   `${10 + (i * 1.4) % 12}s`,
  size:  i % 4 === 0 ? 3 : 2,
  color: i % 3 === 0 ? 'rgba(200,80,255,0.6)' : i % 3 === 1 ? 'rgba(29,220,130,0.6)' : 'rgba(100,180,255,0.5)',
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

        {/* Capa nebulosa base */}
        <div className="lp-nebula-base" />

        {/* Orbes de color */}
        <div className="lp-orb1" />
        <div className="lp-orb2" />
        <div className="lp-orb3" />
        <div className="lp-heart-glow" />

        {/* Campo de estrellas */}
        <div className="lp-stars">
          {STARS.map(s => (
            <div key={s.id} className="lp-star" style={{
              left: s.left, top: s.top,
              width: s.size, height: s.size,
              animationDelay: s.delay,
              animationDuration: s.dur,
            }} />
          ))}
        </div>

        {/* Partículas de polvo cósmico */}
        <div className="lp-particles">
          {PARTICLES.map(p => (
            <div key={p.id} className="lp-p" style={{
              left: p.left, bottom: '-10px',
              width: p.size, height: p.size,
              background: p.color,
              animationDelay: p.delay,
              animationDuration: p.dur,
            }} />
          ))}
        </div>

        {/* Tarjeta */}
        <div className="lp-card">

          {/* PANEL IZQUIERDO */}
          <div className="lp-visual">
            <div className="lp-visual-nebula" />
            <div className="lp-sep" />

            <div className="lp-visual-top">
              <span className="lp-dot" />
              <span className="lp-brand">Canal Reportes</span>
            </div>

            {/* Corazón galáctico */}
            <div className="lp-galaxy-heart">
              <div className="lp-heart-container">
                <div className="lp-heart-ring r3" />
                <div className="lp-heart-ring r2" />
                <div className="lp-heart-ring r1" />
                <div className="lp-heart-sparks" />
                <svg className="lp-heart-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="hg" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#ff80ea"/>
                      <stop offset="50%" stopColor="#d040ff"/>
                      <stop offset="100%" stopColor="#8000e0"/>
                    </radialGradient>
                  </defs>
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    fill="url(#hg)"
                    stroke="rgba(255,150,255,0.4)"
                    strokeWidth="0.5"
                  />
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
                    <svg style={{flexShrink:0,marginTop:1}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff7070" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <circle cx="12" cy="16" r="0.5" fill="#ff7070"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" className="lp-btn" disabled={loading}>
                  {loading ? (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#040010" strokeWidth="2.5" strokeLinecap="round" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Cargando...</>
                  ) : mode === 'login' ? (
                    <>Ingresar <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#040010" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                  ) : (
                    <>Crear cuenta <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#040010" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></>
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