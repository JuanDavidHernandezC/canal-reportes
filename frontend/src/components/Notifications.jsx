import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    socket.on('report_updated', ({ reporteId, estado }) => {
      const labels = { recibido:'Recibido', en_proceso:'En proceso', resuelto:'Resuelto ✅' };
      const icons  = { recibido:'📋', en_proceso:'⚙️', resuelto:'✅' };
      toast(`${icons[estado]||'📌'} Reporte #${reporteId} → ${labels[estado]||estado}`, {
        duration: 5000,
        style: {
          background: '#1A3A5C',
          color: 'white',
          border: '1px solid #2E75B6',
          borderRadius: '12px',
          fontSize: '14px',
        },
      });
    });

    socket.on('new_message', (msg) => {
      if (msg.emisor_id !== user.id) {
        toast(`💬 ${msg.emisor_nombre}: ${msg.contenido.slice(0,40)}...`, {
          duration: 4000,
          style: {
            background: '#085041',
            color: 'white',
            border: '1px solid #1D9E75',
            borderRadius: '12px',
            fontSize: '14px',
          },
        });
      }
    });

    return () => {
      socket.off('report_updated');
      socket.off('new_message');
    };
  }, [user]);

  return <Toaster position="top-right" />;
}