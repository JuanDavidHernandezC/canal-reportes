import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import socket from '../services/socket';

export default function ChatBox({ reporteId }) {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto]       = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    api.get(`/messages/${reporteId}`).then(res => setMensajes(res.data));
    socket.emit('join_report', reporteId);
    socket.on('new_message', (msg) => setMensajes(prev => [...prev, msg]));
    return () => socket.off('new_message');
  }, [reporteId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [mensajes]);

  async function send(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    try {
      const { data } = await api.post(`/messages/${reporteId}`, { contenido: texto });
      socket.emit('send_message', { reporteId, mensaje: data });
      setTexto('');
    } catch (err) { console.error(err); }
  }

  return (
    <div style={{ border:'0.5px solid var(--color-border-tertiary)', borderRadius:12, overflow:'hidden' }}>
      <div style={{ background:'#1A3A5C', padding:'12px 16px' }}>
        <h4 style={{ margin:0, color:'white', fontSize:14 }}>💬 Mensajes del reporte</h4>
      </div>
      <div style={{ height:280, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:10, background:'var(--color-background-secondary)' }}>
        {mensajes.length === 0 && (
          <p style={{ color:'var(--color-text-tertiary)', textAlign:'center', margin:'auto', fontSize:13 }}>
            No hay mensajes aún
          </p>
        )}
        {mensajes.map(m => {
          const isMine = m.emisor_id === user?.id;
          return (
            <div key={m.id} style={{ display:'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth:'75%', padding:'9px 13px', borderRadius: isMine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: isMine ? '#2E75B6' : 'var(--color-background-primary)',
                border: isMine ? 'none' : '0.5px solid var(--color-border-tertiary)'
              }}>
                {!isMine && <p style={{ margin:'0 0 3px', fontSize:10, fontWeight:600, color:'#1D9E75' }}>{m.emisor_nombre}</p>}
                <p style={{ margin:0, fontSize:14, color: isMine ? 'white' : 'var(--color-text-primary)' }}>{m.contenido}</p>
                <p style={{ margin:'4px 0 0', fontSize:10, opacity:.6, color: isMine ? 'white' : 'var(--color-text-tertiary)', textAlign:'right' }}>
                  {new Date(m.created_at).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} style={{ display:'flex', gap:8, padding:12, background:'var(--color-background-primary)', borderTop:'0.5px solid var(--color-border-tertiary)' }}>
        <input value={texto} onChange={e=>setTexto(e.target.value)}
          placeholder="Escribe un mensaje..." style={{
            flex:1, padding:'9px 14px', borderRadius:9, border:'1px solid var(--color-border-tertiary)',
            background:'var(--color-background-secondary)', color:'var(--color-text-primary)',
            fontSize:14, outline:'none'
          }} />
        <button type="submit" style={{ background:'#1D9E75', border:'none', borderRadius:9, padding:'9px 16px', color:'white', fontWeight:600, cursor:'pointer', fontSize:14 }}>
          Enviar
        </button>
      </form>
    </div>
  );
}