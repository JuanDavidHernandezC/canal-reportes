const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Email al ciudadano cuando crea un reporte
async function notificarNuevoReporte({ ciudadanoEmail, ciudadanoNombre, reporteId, titulo, tipo }) {
  const tipoLabel = {
    infraestructura: 'Daño en infraestructura',
    basuras:         'Acumulación de basuras',
    alumbrado:       'Falla en alumbrado',
    otro:            'Otro',
  };

  await resend.emails.send({
    from:    'Canal Reportes <onboarding@resend.dev>',
    to: 'juandahernandez660@gmail.com',
    subject: `✅ Reporte #${reporteId} recibido — Canal Reportes Sabana Centro`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#08101c;color:white;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1A3A5C,#0F2A45);padding:32px 32px 24px;text-align:center;">
          <div style="font-size:36px;margin-bottom:10px;">📍</div>
          <h1 style="margin:0;font-size:22px;font-weight:800;color:white;letter-spacing:-0.5px;">Canal Reportes</h1>
          <p style="margin:6px 0 0;font-size:13px;color:#7FB3D3;">Sabana Centro</p>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.08em;">Hola, ${ciudadanoNombre}</p>
          <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:white;">Tu reporte fue recibido 🎉</h2>
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:600;color:#1D9E75;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">${tipoLabel[tipo] || tipo}</div>
            <div style="font-size:17px;font-weight:700;color:white;margin-bottom:12px;">${titulo}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:rgba(255,255,255,0.4);">Número de reporte</span>
              <span style="background:rgba(29,158,117,0.15);color:#1D9E75;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;">#${reporteId}</span>
            </div>
          </div>
          <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;margin:0 0 24px;">
            Nuestro equipo revisará tu reporte y te notificaremos cuando haya cambios. El tiempo estimado es de <strong style="color:white;">24 a 72 horas hábiles</strong>.
          </p>
          <a href="${process.env.FRONTEND_URL}/reporte/${reporteId}" style="display:block;text-align:center;background:#1D9E75;color:white;padding:14px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">Ver mi reporte →</a>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">Canal Reportes Sabana Centro · Este es un mensaje automático</p>
        </div>
      </div>
    `,
  });
}

// Email a operarios/admins cuando un ciudadano crea un reporte
async function notificarOperarios({ operariosEmails, ciudadanoNombre, reporteId, titulo, tipo, descripcion }) {
  const tipoLabel = {
    infraestructura: 'Daño en infraestructura',
    basuras:         'Acumulación de basuras',
    alumbrado:       'Falla en alumbrado',
    otro:            'Otro',
  };

  await resend.emails.send({
    from:    'Canal Reportes <onboarding@resend.dev>',
    to: 'juandahernandez660@gmail.com',  // array de emails
    subject: `🚨 Nuevo reporte #${reporteId} — ${titulo}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#08101c;color:white;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1A3A5C,#0F2A45);padding:32px;text-align:center;">
          <div style="font-size:36px;margin-bottom:8px;">🚨</div>
          <h1 style="margin:0;font-size:20px;font-weight:800;color:white;">Nuevo reporte recibido</h1>
          <p style="margin:8px 0 0;font-size:13px;color:#7FB3D3;">Requiere atención</p>
        </div>
        <div style="padding:32px;">
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:600;color:#eab308;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">${tipoLabel[tipo] || tipo}</div>
            <div style="font-size:18px;font-weight:700;color:white;margin-bottom:8px;">${titulo}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:14px;line-height:1.5;">${descripcion}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:13px;color:rgba(255,255,255,0.4);">Reportado por</span>
              <span style="font-size:13px;color:white;font-weight:600;">${ciudadanoNombre}</span>
            </div>
          </div>
          <a href="${process.env.FRONTEND_URL}/reporte/${reporteId}" style="display:block;text-align:center;background:#2E75B6;color:white;padding:14px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">Ver reporte #${reporteId} →</a>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">Canal Reportes Sabana Centro · Este es un mensaje automático</p>
        </div>
      </div>
    `,
  });
}

// Email al ciudadano cuando cambia el estado de su reporte
async function notificarCambioEstado({ ciudadanoEmail, ciudadanoNombre, reporteId, titulo, estado }) {
  const estadoConfig = {
    en_proceso: { label: 'En proceso', emoji: '⚙️',  color: '#eab308', msg: 'Un operario municipal está atendiendo tu reporte.' },
    resuelto:   { label: 'Resuelto',   emoji: '✅',  color: '#1D9E75', msg: '¡Tu reporte fue resuelto satisfactoriamente! Gracias por reportarlo.' },
    recibido:   { label: 'Recibido',   emoji: '📋',  color: '#2E75B6', msg: 'Tu reporte está en cola de atención.' },
  };

  const cfg = estadoConfig[estado] || { label: estado, emoji: '📌', color: '#888', msg: 'El estado de tu reporte fue actualizado.' };

  await resend.emails.send({
    from:    'Canal Reportes <onboarding@resend.dev>',
    to: 'juandahernandez660@gmail.com',
    subject: `${cfg.emoji} Reporte #${reporteId} — Estado actualizado: ${cfg.label}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#08101c;color:white;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1A3A5C,#0F2A45);padding:32px;text-align:center;">
          <div style="font-size:40px;margin-bottom:8px;">${cfg.emoji}</div>
          <h1 style="margin:0;font-size:20px;font-weight:800;color:white;">Estado actualizado</h1>
          <p style="margin:8px 0 0;font-size:13px;color:#7FB3D3;">Reporte #${reporteId}</p>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.4);">Hola, ${ciudadanoNombre}</p>
          <h2 style="margin:0 0 20px;font-size:18px;font-weight:700;color:white;">${titulo}</h2>
          <div style="text-align:center;margin-bottom:24px;">
            <span style="background:${cfg.color}22;color:${cfg.color};border:1px solid ${cfg.color}44;padding:8px 24px;border-radius:20px;font-size:15px;font-weight:700;">${cfg.label}</span>
          </div>
          <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;margin:0 0 24px;text-align:center;">${cfg.msg}</p>
          <a href="${process.env.FRONTEND_URL}/reporte/${reporteId}" style="display:block;text-align:center;background:${cfg.color};color:white;padding:14px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">Ver reporte →</a>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">Canal Reportes Sabana Centro · Este es un mensaje automático</p>
        </div>
      </div>
    `,
  });
}

module.exports = { notificarNuevoReporte, notificarOperarios, notificarCambioEstado };