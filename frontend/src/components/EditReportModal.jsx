import { useState } from 'react';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .erm-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    animation: erm-fade 0.2s ease;
    padding: 20px;
  }

  @keyframes erm-fade { from { opacity: 0; } to { opacity: 1; } }

  .erm-modal {
    background: #0d1b2a;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 32px;
    width: 100%; max-width: 480px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    animation: erm-up 0.25s cubic-bezier(.16,1,.3,1);
    font-family: 'DM Sans', sans-serif;
  }

  @keyframes erm-up {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .erm-header {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 28px;
  }

  .erm-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800;
    color: white; margin: 0 0 5px;
    letter-spacing: -0.3px;
  }

  .erm-subtitle {
    font-size: 12px; color: rgba(255,255,255,0.3);
    margin: 0; font-weight: 400;
  }

  .erm-close {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.4);
    width: 32px; height: 32px; border-radius: 8px;
    cursor: pointer; font-size: 15px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }

  .erm-close:hover {
    background: rgba(239,68,68,0.15);
    border-color: rgba(239,68,68,0.3);
    color: #f87171;
  }

  .erm-form { display: flex; flex-direction: column; gap: 16px; }

  .erm-field { display: flex; flex-direction: column; gap: 6px; }

  .erm-label {
    font-size: 11.5px; font-weight: 600;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase; letter-spacing: 0.09em;
  }

  .erm-input, .erm-select, .erm-textarea {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: white; font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    padding: 12px 14px; outline: none;
    transition: border-color 0.2s, background 0.2s;
    width: 100%; box-sizing: border-box;
  }

  .erm-input:focus, .erm-select:focus, .erm-textarea:focus {
    border-color: rgba(46,117,182,0.5);
    background: rgba(46,117,182,0.05);
  }

  .erm-select { appearance: none; cursor: pointer; }
  .erm-select option { background: #0d1b2a; }

  .erm-textarea { resize: vertical; min-height: 100px; line-height: 1.5; }

  .erm-error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171; padding: 10px 14px;
    border-radius: 10px; font-size: 13px;
    display: flex; align-items: center; gap: 8px;
  }

  .erm-actions { display: flex; gap: 10px; margin-top: 4px; }

  .erm-btn-cancel {
    flex: 1; padding: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.45);
    border-radius: 10px; cursor: pointer;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .erm-btn-cancel:hover {
    background: rgba(255,255,255,0.08);
    color: white;
  }

  .erm-btn-submit {
    flex: 2; padding: 12px;
    background: linear-gradient(135deg, #2E75B6, #1D9E75);
    border: none; color: white; border-radius: 10px;
    font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(46,117,182,0.3);
    transition: all 0.2s;
  }

  .erm-btn-submit:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(46,117,182,0.45);
  }

  .erm-btn-submit:disabled {
    opacity: 0.5; cursor: not-allowed; transform: none;
  }
`;

const tipoOpciones = [
  { value: 'infraestructura', label: '🏗️  Daño en infraestructura' },
  { value: 'basuras',         label: '🗑️  Acumulación de basuras'  },
  { value: 'alumbrado',       label: '💡  Falla en alumbrado'      },
  { value: 'otro',            label: '📌  Otro'                    },
];

export default function EditReportModal({ reporte, onClose, onUpdated }) {
  const [form, setForm]       = useState({ titulo: reporte.titulo, descripcion: reporte.descripcion, tipo: reporte.tipo });
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
    <>
      <style>{styles}</style>
      <div className="erm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="erm-modal">

          <div className="erm-header">
            <div>
              <h3 className="erm-title">Editar reporte</h3>
              <p className="erm-subtitle">Solo puedes editar reportes en estado Recibido</p>
            </div>
            <button className="erm-close" onClick={onClose}>✕</button>
          </div>

          <form className="erm-form" onSubmit={handleSubmit}>
            <div className="erm-field">
              <label className="erm-label">Título</label>
              <input
                className="erm-input"
                value={form.titulo}
                onChange={e => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>

            <div className="erm-field">
              <label className="erm-label">Categoría</label>
              <select
                className="erm-select"
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}
              >
                {tipoOpciones.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="erm-field">
              <label className="erm-label">Descripción</label>
              <textarea
                className="erm-textarea"
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                rows={4}
                required
              />
            </div>

            {error && (
              <div className="erm-error">⚠️ {error}</div>
            )}

            <div className="erm-actions">
              <button type="button" className="erm-btn-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="erm-btn-submit" disabled={loading}>
                {loading ? 'Guardando...' : '✓ Guardar cambios'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}