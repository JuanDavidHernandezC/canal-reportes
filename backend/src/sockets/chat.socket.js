function initSockets(io) {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Unirse a la sala de un reporte
    socket.on('join_report', (reporteId) => {
      socket.join(`reporte_${reporteId}`);
      console.log(`Socket ${socket.id} unido a reporte_${reporteId}`);
    });

    // Enviar mensaje en tiempo real
    socket.on('send_message', ({ reporteId, mensaje }) => {
      io.to(`reporte_${reporteId}`).emit('new_message', mensaje);
    });

    // Notificar cambio de estado
    socket.on('status_change', ({ reporteId, estado }) => {
      io.to(`reporte_${reporteId}`).emit('report_updated', { reporteId, estado });
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
}

module.exports = initSockets;