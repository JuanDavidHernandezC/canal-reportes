import { useState } from 'react';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .rf-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    animation: rf-fade-in 0.2s ease;
    padding: 20px;
  }

  @keyframes rf-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .rf-modal {
    background: #0d1b2a;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 32px;
    width: 100%; max-width: 480px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    animation: rf-slide-up 0.25s cubic-bezier(.16,1,.3,1);
    font-family: 'DM Sans', sans-serif;
  }

  @keyframes rf-slide-up {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .rf-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 28px;
  }

  .rf-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800;
    color: white; margin: 0;
    letter-spacing: -0.3px;
  }

  .rf-close {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.5);
    width: 32px; height: 32px; border-radius: 8px;
    cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }

  .rf-close:hover {
    background: rgba(239,68,68,0.15);
    border-color: rgba(239,68,68,0.3);
    color: #f87171;
  }

  .rf-form { display: flex; flex-direction: column; gap: 16px; }

  .rf-field { display: flex; flex-direction: column; gap: 6px; }

  .rf-label {
    font-size: 12px; font-weight: 500;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  .rf-input, .rf-select, .rf-textarea {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: white; font-size: 14px; font-family: 'DM Sans', sans-serif;
    padding: 12px 14px; outline: none;
    transition: border-color 0.2s, background 0.2s;
    width: 100%; box-sizing: border-box;
  }

  .rf-input::placeholder, .rf-textarea::placeholder { color: rgba(255,255,255,0.2); }

  .rf-input:focus, .rf-select:focus, .rf-textarea:focus {
    border-color: rgba(29,158,117,0.5);
    background: rgba(29,158,117,0.05);
  }

  .rf-select { appearance: none; cursor: pointer; }
  .rf-select option { background: #0d1b2a; }

  .rf-textarea { resize: vertical; min-height: 100px; line-height: 1.5; }

  .rf-file-label {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px dashed rgba(255,255,255,0.12);
    border-radius: 10px; padding: 14px;
    cursor: pointer; transition: all 0.2s;
  }

  .rf-file-label:hover {
    border-color: rgba(29,158,117,0.4);
    background: rgba(29,158,117,0.05);
  }

  .rf-file-icon {
    font-size: 20px; flex-shrink: 0;
  }

  .rf-file-text { font-size: 13px; color: rgba(255,255,255,0.4); }
  .rf-file-text strong { color: rgba(255,255,255,0.7); display: block; font-weight: 500; }

  .rf-file-input { display: none; }

  .rf-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171; padding: 10px 14px;
    border-radius: 10px; font-size: 13px;
  }

  .rf-actions { display: flex; gap: 10px; margin-top: 4px; }

  .rf-btn-cancel {
    flex: 1; padding: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.5);
    border-radius: 10px; cursor: pointer;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .rf-btn-cancel:hover {
    background: rgba(255,255,255,0.08);
    color: white;
  }

  .rf-btn-submit {
    flex: 2; padding: 12px;
    background: #1D9E75;
    border: none; color: white; border-radius: 10px;
    font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(29,158,117,0.35);
    transition: all 0.2s;
  }

  .rf-btn-submit:hover:not(:disabled) {
    background: #22b585;
    box-shadow: 0 6px 28px rgba(29,158,117,0.5);
    transform: translateY(-1px);
  }

  .rf-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .rf-geo-info {
    font-size: 11.5px; color: rgba(255,255,255,0.25);
    display: flex; align-items: center; gap: 5px;
  }
`;

const tipoOpciones = [
  { value: 'infraestructura', label: '🏗️  Daño en infraestructura' },
  { value: 'basuras',         label: '🗑️  Acumulación de basuras' },
  { value: 'alumbrado',       label: '💡  Falla en alumbrado' },
  { value: 'otro',            label: '📌  Otro' },
];

export default function ReportForm({ onClose, onCreated }) {
  const [form, setForm]       = useState({ titulo: '', descripcion: '', tipo: 'infraestructura' });
  const [foto, setFoto]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [fotoName, setFotoName] = useState('');

  function handleFoto(e) {
    const file = e.target.files[0];
    if (file) { setFoto(file); setFotoName(file.name); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (foto) fd.append('foto', foto);
      if (navigator.geolocation) {
        await new Promise(resolve => navigator.geolocation.getCurrentPosition(
          pos => { fd.append('latitud', pos.coords.latitude); fd.append('longitud', pos.coords.longitude); resolve(); },
          () => resolve()
        ));
      }
      await api.post('/reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear reporte');
    } finally { setLoading(false); }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="rf-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="rf-modal">
          <div className="rf-header">
            <h3 className="rf-title">Nuevo reporte</h3>
            <button className="rf-close" onClick={onClose}>✕</button>
          </div>

          <form className="rf-form" onSubmit={handleSubmit}>
            <div className="rf-field">
              <label className="rf-label">Título</label>
              <input
                className="rf-input"
                placeholder="Ej: Hueco en la vía principal"
                value={form.titulo}
                onChange={e => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>

            <div className="rf-field">
              <label className="rf-label">Categoría</label>
              <select
                className="rf-select"
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}
              >
                {tipoOpciones.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="rf-field">
              <label className="rf-label">Descripción</label>
              <textarea
                className="rf-textarea"
                placeholder="Describe el problema con el mayor detalle posible..."
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                required
              />
            </div>

            <div className="rf-field">
              <label className="rf-label">Evidencia fotográfica</label>
              <label className="rf-file-label" htmlFor="rf-foto">
                <span className="rf-file-icon">📎</span>
                <span className="rf-file-text">
                  <strong>{fotoName || 'Adjuntar foto'}</strong>
                  {!fotoName && 'Opcional · JPG, PNG, WEBP'}
                </span>
              </label>
              <input id="rf-foto" type="file" accept="image/*" className="rf-file-input" onChange={handleFoto} />
            </div>

            <p className="rf-geo-info">📍 Tu ubicación se agregará automáticamente si la permites</p>

            {error && <div className="rf-error">{error}</div>}

            <div className="rf-actions">
              <button type="button" className="rf-btn-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="rf-btn-submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar reporte'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}