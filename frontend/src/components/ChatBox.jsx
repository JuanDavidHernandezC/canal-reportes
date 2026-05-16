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
      // Incluir rol del emisor para que el bot sepa a quién responder
      socket.emit('send_message', {
        reporteId,
        mensaje: { ...data, emisor_nombre: user.nombre, emisor_rol: user.rol }
      });
      setTexto('');
    } catch (err) { console.error(err); }
  }

  const isBot = (m) => m.emisor_rol === 'bot' || m.emisor_nombre?.includes('Asistente');

  return (
    <div style={{ border:'0.5px solid var(--color-border-tertiary)', borderRadius:12, overflow:'hidden' }}>
      {/* Header */}
      <div style={{
        background:'linear-gradient(135deg, #1A3A5C, #0F2A45)',
        padding:'12px 16px', display:'flex', alignItems:'center', gap:10
      }}>
        <div style={{
          width:32, height:32, borderRadius:'50%',
          background:'linear-gradient(135deg, #2E75B6, #1D9E75)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:16
        }}>💬</div>
        <div>
          <h4 style={{ margin:0, color:'white', fontSize:14, fontWeight:600 }}>
            Mensajes del reporte
          </h4>
          <p style={{ margin:0, color:'#7FB3D3', fontSize:11 }}>
            🤖 Asistente automático disponible 24/7
          </p>
        </div>
      </div>

      {/* Mensajes */}
      <div style={{
        height:320, overflowY:'auto', padding:16,
        display:'flex', flexDirection:'column', gap:10,
        background:'var(--color-background-secondary)'
      }}>
        {/* Mensaje inicial del bot */}
        <div style={{ display:'flex', justifyContent:'flex-start', gap:8 }}>
          <div style={{
            width:28, height:28, borderRadius:'50%',
            background:'linear-gradient(135deg, #2E75B6, #1D9E75)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14, flexShrink:0
          }}>🤖</div>
          <div style={{
            maxWidth:'78%', padding:'10px 13px',
            borderRadius:'4px 14px 14px 14px',
            background:'linear-gradient(135deg, #1A3A5C, #0F2A45)',
            border:'1px solid rgba(46,117,182,0.3)'
          }}>
            <p style={{ margin:'0 0 3px', fontSize:10, fontWeight:600, color:'#2E75B6' }}>
              🤖 Asistente Canal Reportes
            </p>
            <p style={{ margin:0, fontSize:13, color:'#AED6F1' }}>
              ¡Hola! Soy el asistente virtual. Puedes preguntarme sobre el estado de tu reporte, tiempos de atención y más.
            </p>
          </div>
        </div>

        {mensajes.length === 0 && (
          <p style={{ color:'var(--color-text-tertiary)', textAlign:'center', fontSize:12, marginTop:8 }}>
            Escribe un mensaje para empezar...
          </p>
        )}

        {mensajes.map(m => {
          const isMine = m.emisor_id === user?.id;
          const bot    = isBot(m);

          if (bot) return (
            <div key={m.id} style={{ display:'flex', justifyContent:'flex-start', gap:8 }}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                background:'linear-gradient(135deg, #2E75B6, #1D9E75)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:14, flexShrink:0
              }}>🤖</div>
              <div style={{
                maxWidth:'78%', padding:'10px 13px',
                borderRadius:'4px 14px 14px 14px',
                background:'linear-gradient(135deg, #1A3A5C, #0F2A45)',
                border:'1px solid rgba(46,117,182,0.3)'
              }}>
                <p style={{ margin:'0 0 3px', fontSize:10, fontWeight:600, color:'#2E75B6' }}>
                  🤖 Asistente Canal Reportes
                </p>
                <p style={{ margin:0, fontSize:13, color:'#AED6F1', lineHeight:1.5 }}>{m.contenido}</p>
                <p style={{ margin:'4px 0 0', fontSize:10, opacity:.5, color:'#7FB3D3', textAlign:'right' }}>
                  {new Date(m.created_at).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' })}
                </p>
              </div>
            </div>
          );

          return (
            <div key={m.id} style={{ display:'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', gap:8 }}>
              {!isMine && (
                <div style={{
                  width:28, height:28, borderRadius:'50%',
                  background:'#185FA5', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:12, color:'white',
                  fontWeight:700, flexShrink:0
                }}>
                  {m.emisor_nombre?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div style={{
                maxWidth:'75%', padding:'9px 13px',
                borderRadius: isMine ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                background: isMine
                  ? 'linear-gradient(135deg, #2E75B6, #1A5C9E)'
                  : 'var(--color-background-primary)',
                border: isMine ? 'none' : '0.5px solid var(--color-border-tertiary)',
                boxShadow: isMine ? '0 4px 12px rgba(46,117,182,0.3)' : 'none'
              }}>
                {!isMine && (
                  <p style={{ margin:'0 0 3px', fontSize:10, fontWeight:600, color:'#1D9E75' }}>
                    {m.emisor_nombre}
                  </p>
                )}
                <p style={{ margin:0, fontSize:14, color: isMine ? 'white' : 'var(--color-text-primary)', lineHeight:1.5 }}>
                  {m.contenido}
                </p>
                <p style={{ margin:'4px 0 0', fontSize:10, opacity:.6, color: isMine ? 'white' : 'var(--color-text-tertiary)', textAlign:'right' }}>
                  {new Date(m.created_at).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} style={{
        display:'flex', gap:8, padding:12,
        background:'var(--color-background-primary)',
        borderTop:'0.5px solid var(--color-border-tertiary)'
      }}>
        <input
          value={texto} onChange={e=>setTexto(e.target.value)}
          placeholder="Escribe un mensaje o pregunta al asistente..."
          style={{
            flex:1, padding:'10px 14px', borderRadius:10,
            border:'1px solid var(--color-border-tertiary)',
            background:'var(--color-background-secondary)',
            color:'var(--color-text-primary)', fontSize:14, outline:'none'
          }}
        />
        <button type="submit" style={{
          background:'linear-gradient(135deg, #2E75B6, #1D9E75)',
          border:'none', borderRadius:10, padding:'10px 18px',
          color:'white', fontWeight:600, cursor:'pointer', fontSize:14,
          boxShadow:'0 4px 12px rgba(46,117,182,0.3)'
        }}>
          Enviar
        </button>
      </form>
    </div>
  );
}