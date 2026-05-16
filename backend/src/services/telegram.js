const TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegram(mensaje) {
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  const res  = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      chat_id:    CHAT_ID,
      text:       mensaje,
      parse_mode: 'HTML',
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description);
}

async function telegramNuevoReporte({ ciudadanoNombre, reporteId, titulo, tipo }) {
  const tipoLabel = {
    infraestructura: 'Daño en infraestructura',
    basuras:         'Acumulación de basuras',
    alumbrado:       'Falla en alumbrado',
    otro:            'Otro',
  };
  const msg = `🚨 <b>Nuevo reporte #${reporteId}</b>\n\n` +
              `📌 <b>Tipo:</b> ${tipoLabel[tipo] || tipo}\n` +
              `📝 <b>Título:</b> ${titulo}\n` +
              `👤 <b>Ciudadano:</b> ${ciudadanoNombre}`;
  await sendTelegram(msg);
}

async function telegramCambioEstado({ ciudadanoNombre, reporteId, titulo, estado }) {
  const estadoLabel = {
    en_proceso: '⚙️ En proceso',
    resuelto:   '✅ Resuelto',
    recibido:   '📋 Recibido',
  };
  const msg = `📢 <b>Reporte #${reporteId} actualizado</b>\n\n` +
              `📝 <b>Título:</b> ${titulo}\n` +
              `👤 <b>Ciudadano:</b> ${ciudadanoNombre}\n` +
              `🔄 <b>Nuevo estado:</b> ${estadoLabel[estado] || estado}`;
  await sendTelegram(msg);
}

async function telegramReporteEditado({ ciudadanoNombre, reporteId, titulo }) {
  const msg = `✏️ <b>Reporte #${reporteId} editado</b>\n\n` +
              `📝 <b>Nuevo título:</b> ${titulo}\n` +
              `👤 <b>Ciudadano:</b> ${ciudadanoNombre}`;
  await sendTelegram(msg);
}

module.exports = { telegramNuevoReporte, telegramCambioEstado, telegramReporteEditado };