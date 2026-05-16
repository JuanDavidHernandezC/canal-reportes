const pool = require('../models/db');

// Respuestas automáticas del bot
async function getBotResponse(contenido, reporteId) {
  const msg = contenido.toLowerCase();

  // Obtener estado actual del reporte
  const result = await pool.query(
    'SELECT estado, tipo, titulo FROM reportes WHERE id=$1',
    [reporteId]
  );
  const reporte = result.rows[0];
  const estadoLabels = {
    recibido:   'recibido y en espera de asignación',
    en_proceso: 'siendo atendido por un operario municipal',
    resuelto:   'resuelto satisfactoriamente'
  };

  // Respuestas por palabras clave
  if (msg.includes('estado') || msg.includes('cómo va') || msg.includes('como va') || msg.includes('avance')) {
    return `Tu reporte "${reporte.titulo}" está actualmente ${estadoLabels[reporte.estado] || reporte.estado}. Te notificaremos cuando haya cambios. 📋`;
  }
  if (msg.includes('cuándo') || msg.includes('cuando') || msg.includes('tiempo') || msg.includes('demora')) {
    return `El tiempo de atención depende del tipo de incidencia. Los reportes de ${reporte.tipo} suelen atenderse en un plazo de 24 a 72 horas hábiles. ⏱️`;
  }
  if (msg.includes('gracias') || msg.includes('thank')) {
    return `¡Con gusto! Estamos para servirte. Recuerda que puedes hacer seguimiento a tu reporte desde esta plataforma. 🙌`;
  }
  if (msg.includes('urgente') || msg.includes('emergencia') || msg.includes('peligro')) {
    return `Entendemos la urgencia. Hemos marcado tu reporte como prioritario y notificado al equipo de operarios. Si es una emergencia inmediata, contacta la línea 123. 🚨`;
  }
  if (msg.includes('foto') || msg.includes('imagen') || msg.includes('evidencia')) {
    return `Puedes adjuntar fotos al crear un reporte. Si necesitas agregar más evidencia, crea un nuevo reporte con la información actualizada. 📷`;
  }
  if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas')) {
    return `¡Hola! Soy el asistente virtual del Canal Reportes Sabana Centro. Puedo ayudarte con información sobre el estado de tu reporte, tiempos de atención y más. ¿En qué te puedo ayudar? 🤖`;
  }
  if (msg.includes('cancelar') || msg.includes('eliminar') || msg.includes('borrar')) {
    return `Para cancelar o modificar un reporte debes contactar directamente con el administrador del sistema. Los reportes activos no pueden eliminarse para mantener trazabilidad. 📝`;
  }
  if (msg.includes('número') || msg.includes('numero') || msg.includes('id') || msg.includes('código')) {
    return `El número de tu reporte es #${reporteId}. Puedes usarlo para hacer seguimiento o consultarlo en cualquier momento. 🔢`;
  }

  // Respuesta por defecto
  const defaults = [
    `Gracias por tu mensaje. Un operario municipal revisará tu reporte #${reporteId} a la brevedad. 📬`,
    `Tu reporte está registrado en el sistema. Estado actual: ${estadoLabels[reporte.estado] || reporte.estado}. 📋`,
    `Hemos recibido tu mensaje. Para consultas urgentes sobre infraestructura pública, también puedes llamar a la alcaldía de tu municipio. 🏛️`,
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function initSockets(io) {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Unirse a sala del reporte
    socket.on('join_report', (reporteId) => {
      socket.join(`reporte_${reporteId}`);
      console.log(`Socket ${socket.id} unido a reporte_${reporteId}`);
    });

    // Enviar mensaje en tiempo real + respuesta del bot
    socket.on('send_message', async ({ reporteId, mensaje }) => {
      // Emitir mensaje del usuario
      io.to(`reporte_${reporteId}`).emit('new_message', mensaje);

      // El bot solo responde a ciudadanos (no a operarios ni admins)
      if (mensaje.emisor_rol === 'ciudadano') {
        // Pequeño delay para que se vea natural
        setTimeout(async () => {
          try {
            const botText = await getBotResponse(mensaje.contenido, reporteId);

            // Guardar mensaje del bot en BD
            const result = await pool.query(
              `INSERT INTO mensajes (reporte_id, emisor_id, contenido)
               VALUES ($1, 1, $2) RETURNING *`,
              [reporteId, botText]
            );

            const botMsg = {
              ...result.rows[0],
              emisor_nombre: '🤖 Asistente Canal Reportes',
              emisor_rol: 'bot'
            };

            io.to(`reporte_${reporteId}`).emit('new_message', botMsg);
          } catch (err) {
            console.error('Bot error:', err.message);
          }
        }, 1200);
      }
    });

    // Notificar cambio de estado
    socket.on('status_change', ({ reporteId, estado }) => {
      io.to(`reporte_${reporteId}`).emit('report_updated', { reporteId, estado });

      // Bot notifica el cambio de estado automáticamente
      setTimeout(async () => {
        try {
          const labels = {
            recibido:   'ha sido recibido y está en cola de atención',
            en_proceso: 'está siendo atendido por un operario municipal ⚙️',
            resuelto:   'ha sido resuelto. ¡Gracias por reportarlo! ✅'
          };
          const text = `📢 Actualización automática: Tu reporte ${labels[estado] || estado}`;

          const result = await pool.query(
            `INSERT INTO mensajes (reporte_id, emisor_id, contenido)
             VALUES ($1, 1, $2) RETURNING *`,
            [reporteId, text]
          );

          const botMsg = {
            ...result.rows[0],
            emisor_nombre: '🤖 Asistente Canal Reportes',
            emisor_rol: 'bot'
          };

          io.to(`reporte_${reporteId}`).emit('new_message', botMsg);
        } catch (err) {
          console.error('Bot status error:', err.message);
        }
      }, 800);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
}

module.exports = initSockets;