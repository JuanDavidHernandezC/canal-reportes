const pool = require('../models/db');

// ===============================
// RESPUESTAS AUTOMÁTICAS INTELIGENTES
// ===============================
async function getBotResponse(contenido, reporteId) {
  const msg = contenido.toLowerCase().trim();

  // Obtener información del reporte
  const result = await pool.query(
    `SELECT 
        id,
        estado,
        tipo,
        titulo,
        descripcion,
        created_at
     FROM reportes 
     WHERE id = $1`,
    [reporteId]
  );

  if (result.rows.length === 0) {
    return `❌ No pudimos encontrar el reporte solicitado. Verifica el número del reporte e inténtalo nuevamente.`;
  }

  const reporte = result.rows[0];

  // ===============================
  // ETIQUETAS DE ESTADO
  // ===============================
  const estadoLabels = {
    recibido: '🟡 recibido y pendiente de asignación',
    en_proceso: '🛠️ siendo atendido por un operario municipal',
    resuelto: '✅ resuelto satisfactoriamente',
    rechazado: '❌ rechazado por inconsistencias en la información'
  };

  // ===============================
  // RESPUESTAS INTELIGENTES
  // ===============================

  // SALUDO
  if (
    msg.includes('hola') ||
    msg.includes('buenos') ||
    msg.includes('buenas') ||
    msg.includes('hey') ||
    msg.includes('saludos')
  ) {
    return `👋 ¡Hola! Soy el asistente virtual del sistema Canal Reportes Sabana Centro.

📌 Puedo ayudarte con:
• Estado de tu reporte
• Tiempo estimado de atención
• Información sobre evidencias
• Seguimiento del caso
• Prioridad de incidencias
• Número del reporte
• Cambios de estado

🧾 Tu reporte actual es:
"${reporte.titulo}"

¿En qué puedo ayudarte hoy? 🤖`;
  }

  // ESTADO DEL REPORTE
  if (
    msg.includes('estado') ||
    msg.includes('cómo va') ||
    msg.includes('como va') ||
    msg.includes('avance') ||
    msg.includes('seguimiento') ||
    msg.includes('proceso')
  ) {
    return `📋 Estado actual del reporte #${reporteId}

📝 Título: ${reporte.titulo}
📂 Tipo: ${reporte.tipo}
📌 Estado: ${estadoLabels[reporte.estado] || reporte.estado}

Nuestro equipo municipal revisa continuamente los reportes registrados. Recibirás actualizaciones automáticas cuando existan cambios en el proceso.

🙏 Gracias por contribuir al mejoramiento de la comunidad.`;
  }

  // TIEMPO DE ATENCIÓN
  if (
    msg.includes('cuándo') ||
    msg.includes('cuando') ||
    msg.includes('demora') ||
    msg.includes('tiempo') ||
    msg.includes('cuanto tarda') ||
    msg.includes('atención')
  ) {
    return `⏱️ Tiempo estimado de atención

Tu reporte corresponde a:
📂 ${reporte.tipo}

Dependiendo de la complejidad y prioridad, los tiempos aproximados son:

🚨 Emergencias:
• 1 a 12 horas

🛣️ Infraestructura y vías:
• 24 a 72 horas

💡 Alumbrado público:
• 24 a 48 horas

🌳 Espacio público y aseo:
• 1 a 5 días hábiles

Actualmente tu reporte está:
${estadoLabels[reporte.estado] || reporte.estado}

📌 Los tiempos pueden variar según disponibilidad operativa y nivel de urgencia.`;
  }

  // AGRADECIMIENTO
  if (
    msg.includes('gracias') ||
    msg.includes('muchas gracias') ||
    msg.includes('thank')
  ) {
    return `🙌 ¡Con gusto!

Gracias por utilizar Canal Reportes Sabana Centro y contribuir al mejoramiento de tu municipio.

📌 Recuerda:
• Puedes consultar el estado de tu reporte en cualquier momento.
• Recibirás notificaciones automáticas.
• Tu participación ayuda a mejorar los servicios públicos.

🤝 Estamos para ayudarte.`;
  }

  // URGENCIA
  if (
    msg.includes('urgente') ||
    msg.includes('emergencia') ||
    msg.includes('peligro') ||
    msg.includes('grave') ||
    msg.includes('riesgo')
  ) {
    return `🚨 Hemos detectado que tu mensaje indica una posible situación urgente.

📌 Tu reporte será marcado como PRIORITARIO para revisión más rápida.

⚠️ Si existe:
• Riesgo para la vida
• Accidentes
• Incendios
• Inundaciones
• Cableado eléctrico peligroso
• Emergencias médicas

Comunícate inmediatamente con:
📞 Línea de emergencias 123

🛡️ Nuestro equipo también ha sido notificado automáticamente.`;
  }

  // EVIDENCIAS
  if (
    msg.includes('foto') ||
    msg.includes('imagen') ||
    msg.includes('evidencia') ||
    msg.includes('archivo')
  ) {
    return `📷 Evidencias y archivos

Las fotografías ayudan a que los operarios identifiquen más rápido el problema reportado.

✅ Recomendaciones:
• Tomar fotos claras
• Mostrar el daño completo
• Adjuntar varias imágenes si es necesario
• Evitar imágenes borrosas

📌 Si necesitas agregar nueva evidencia:
1. Crea un nuevo reporte complementario
2. O contacta al administrador del sistema

🛠️ Las evidencias aceleran el proceso de validación y atención.`;
  }

  // CANCELAR
  if (
    msg.includes('cancelar') ||
    msg.includes('eliminar') ||
    msg.includes('borrar') ||
    msg.includes('cerrar reporte')
  ) {
    return `📝 Gestión de reportes

Por motivos de trazabilidad y transparencia institucional, los reportes registrados no pueden eliminarse directamente.

📌 Sin embargo puedes:
• Solicitar correcciones
• Reportar información errónea
• Contactar soporte administrativo

👨‍💼 Para ello comunícate con el administrador municipal correspondiente.`;
  }

  // NUMERO DE REPORTE
  if (
    msg.includes('número') ||
    msg.includes('numero') ||
    msg.includes('id') ||
    msg.includes('código') ||
    msg.includes('codigo')
  ) {
    return `🔢 Información del reporte

📌 Número de reporte: #${reporteId}
📝 Título: ${reporte.titulo}
📂 Tipo: ${reporte.tipo}

Puedes usar este número para:
• Consultar estado
• Realizar seguimiento
• Presentar solicitudes
• Contactar soporte

📋 Guarda este código para futuras consultas.`;
  }

  // OPERARIO
  if (
    msg.includes('operario') ||
    msg.includes('quien atiende') ||
    msg.includes('responsable')
  ) {
    return `👷 Información del proceso

Tu reporte será asignado automáticamente al área correspondiente según el tipo de incidencia reportada.

📂 Tipo de reporte:
${reporte.tipo}

🛠️ El equipo encargado actualizará el estado conforme avance el proceso de atención.`;
  }

  // UBICACIÓN
  if (
    msg.includes('ubicación') ||
    msg.includes('ubicacion') ||
    msg.includes('direccion') ||
    msg.includes('dirección')
  ) {
    return `📍 Información de ubicación

La ubicación registrada en tu reporte es utilizada únicamente para que los operarios municipales puedan identificar correctamente el incidente.

⚠️ Es importante:
• Registrar direcciones claras
• Agregar referencias visibles
• Especificar barrios o sectores

📌 Esto ayuda a reducir tiempos de atención.`;
  }

  // RESUELTO
  if (
    msg.includes('solucionado') ||
    msg.includes('resuelto') ||
    msg.includes('ya arreglaron')
  ) {
    if (reporte.estado === 'resuelto') {
      return `✅ Tu reporte ya figura como RESUELTO en nuestro sistema.

🙏 Gracias por utilizar Canal Reportes Sabana Centro.

📌 Si el problema persiste, puedes generar un nuevo reporte indicando que la incidencia continúa.`;
    }

    return `🛠️ Tu reporte aún se encuentra en proceso.

📌 Estado actual:
${estadoLabels[reporte.estado] || reporte.estado}

Nuestro equipo continúa trabajando en la solución.`;
  }

  // AYUDA
  if (
    msg.includes('ayuda') ||
    msg.includes('opciones') ||
    msg.includes('menu') ||
    msg.includes('menú')
  ) {
    return `🤖 Centro de ayuda - Canal Reportes

Puedes preguntarme sobre:

📋 "estado"
⏱️ "tiempo"
📷 "evidencias"
🚨 "urgente"
🔢 "número de reporte"
👷 "operario"
📍 "ubicación"
❌ "cancelar reporte"

💬 Escribe tu consulta de manera natural y trataré de ayudarte.`;
  }

  // RESPUESTA POR DEFECTO
  const defaults = [
    `📬 Hemos recibido tu mensaje correctamente.

Tu reporte #${reporteId} continúa:
${estadoLabels[reporte.estado] || reporte.estado}

Un operario revisará cualquier actualización necesaria.`,

    `📋 Tu reporte permanece registrado en el sistema municipal.

📝 Reporte: "${reporte.titulo}"
📂 Tipo: ${reporte.tipo}

Gracias por realizar seguimiento al caso.`,

    `🤝 Gracias por comunicarte con Canal Reportes Sabana Centro.

Nuestro sistema continúa monitoreando el avance de tu reporte y te notificará automáticamente ante cualquier cambio.`
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}

// ===============================
// SOCKETS
// ===============================
function initSockets(io) {
  io.on('connection', (socket) => {
    console.log('✅ Cliente conectado:', socket.id);

    // ===============================
    // UNIRSE A SALA DEL REPORTE
    // ===============================
    socket.on('join_report', (reporteId) => {
      socket.join(`reporte_${reporteId}`);

      console.log(
        `📌 Socket ${socket.id} unido a reporte_${reporteId}`
      );
    });

    // ===============================
    // ENVIAR MENSAJES
    // ===============================
    socket.on('send_message', async ({ reporteId, mensaje }) => {
      try {
        // Emitir mensaje del usuario
        io.to(`reporte_${reporteId}`).emit(
          'new_message',
          mensaje
        );

        // Solo responder ciudadanos
        if (mensaje.emisor_rol === 'ciudadano') {
          setTimeout(async () => {
            try {
              const botText = await getBotResponse(
                mensaje.contenido,
                reporteId
              );

              // Guardar mensaje del bot
              const result = await pool.query(
                `INSERT INTO mensajes 
                  (reporte_id, emisor_id, contenido)
                 VALUES ($1, 1, $2)
                 RETURNING *`,
                [reporteId, botText]
              );

              const botMsg = {
                ...result.rows[0],
                emisor_nombre:
                  '🤖 Asistente Canal Reportes',
                emisor_rol: 'bot'
              };

              io.to(`reporte_${reporteId}`).emit(
                'new_message',
                botMsg
              );

            } catch (err) {
              console.error(
                '❌ Error del bot:',
                err.message
              );
            }
          }, 1200);
        }

      } catch (err) {
        console.error(
          '❌ Error enviando mensaje:',
          err.message
        );
      }
    });

    // ===============================
    // CAMBIO DE ESTADO
    // ===============================
    socket.on(
      'status_change',
      async ({ reporteId, estado }) => {

        io.to(`reporte_${reporteId}`).emit(
          'report_updated',
          { reporteId, estado }
        );

        setTimeout(async () => {
          try {

            const labels = {
              recibido:
                '🟡 ha sido recibido y está en cola de atención',
              en_proceso:
                '🛠️ está siendo atendido por un operario municipal',
              resuelto:
                '✅ ha sido resuelto satisfactoriamente',
              rechazado:
                '❌ fue rechazado por inconsistencias en la información'
            };

            const text = `📢 ACTUALIZACIÓN AUTOMÁTICA

Tu reporte #${reporteId} ${labels[estado] || estado}.

📌 Gracias por utilizar Canal Reportes Sabana Centro.`;

            const result = await pool.query(
              `INSERT INTO mensajes
                (reporte_id, emisor_id, contenido)
               VALUES ($1, 1, $2)
               RETURNING *`,
              [reporteId, text]
            );

            const botMsg = {
              ...result.rows[0],
              emisor_nombre:
                '🤖 Asistente Canal Reportes',
              emisor_rol: 'bot'
            };

            io.to(`reporte_${reporteId}`).emit(
              'new_message',
              botMsg
            );

          } catch (err) {
            console.error(
              '❌ Error estado bot:',
              err.message
            );
          }
        }, 800);
      }
    );

    // ===============================
    // DESCONEXIÓN
    // ===============================
    socket.on('disconnect', () => {
      console.log(
        '❌ Cliente desconectado:',
        socket.id
      );
    });
  });
}

module.exports = initSockets;