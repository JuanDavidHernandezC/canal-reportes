const pool = require('../models/db');
const { notificarNuevoReporte, notificarOperarios, notificarCambioEstado } = require('../services/email');
const { telegramNuevoReporte, telegramCambioEstado, telegramReporteEditado } = require('../services/telegram');

async function getAll(req, res) {
  try {
    let query, params = [];
    if (req.user.rol === 'ciudadano') {
      query = `SELECT r.*, u.nombre as ciudadano_nombre 
               FROM reportes r JOIN usuarios u ON r.ciudadano_id=u.id
               WHERE r.ciudadano_id=$1 ORDER BY r.created_at DESC`;
      params = [req.user.id];
    } else {
      query = `SELECT r.*, u.nombre as ciudadano_nombre 
               FROM reportes r JOIN usuarios u ON r.ciudadano_id=u.id
               ORDER BY r.created_at DESC`;
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function getOne(req, res) {
  try {
    const result = await pool.query(
      `SELECT r.*, u.nombre as ciudadano_nombre 
       FROM reportes r JOIN usuarios u ON r.ciudadano_id=u.id
       WHERE r.id=$1`, [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function create(req, res) {
  const { titulo, descripcion, tipo, latitud, longitud } = req.body;
  const foto_url = req.file ? req.file.path : null;
  try {
    const result = await pool.query(
      `INSERT INTO reportes (titulo, descripcion, tipo, latitud, longitud, foto_url, ciudadano_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [titulo, descripcion, tipo, latitud, longitud, foto_url, req.user.id]
    );
    const reporte = result.rows[0];

    const ciudadano = await pool.query(
      'SELECT nombre, email FROM usuarios WHERE id=$1',
      [req.user.id]
    );

    // Email al ciudadano
    notificarNuevoReporte({
      ciudadanoEmail:  ciudadano.rows[0].email,
      ciudadanoNombre: ciudadano.rows[0].nombre,
      reporteId:       reporte.id,
      titulo:          reporte.titulo,
      tipo:            reporte.tipo,
    }).catch(err => console.error('Email ciudadano:', err.message));

    // Email a operarios
    const operarios = await pool.query(
      `SELECT email FROM usuarios WHERE rol IN ('operario', 'admin')`
    );
    if (operarios.rows.length > 0) {
      notificarOperarios({
        operariosEmails: operarios.rows.map(o => o.email),
        ciudadanoNombre: ciudadano.rows[0].nombre,
        reporteId:       reporte.id,
        titulo:          reporte.titulo,
        tipo:            reporte.tipo,
        descripcion:     reporte.descripcion,
      }).catch(err => console.error('Email operarios:', err.message));
    }

    // Telegram
    telegramNuevoReporte({
      ciudadanoNombre: ciudadano.rows[0].nombre,
      reporteId:       reporte.id,
      titulo:          reporte.titulo,
      tipo:            reporte.tipo,
    }).catch(err => console.error('Telegram nuevo reporte:', err.message));

    res.status(201).json(reporte);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function updateStatus(req, res) {
  const { estado, operario_id } = req.body;
  try {
    const prev = await pool.query(
      'SELECT estado FROM reportes WHERE id=$1',
      [req.params.id]
    );
    if (!prev.rows.length) return res.status(404).json({ error: 'No encontrado' });

    await pool.query(
      `UPDATE reportes SET estado=$1, operario_id=$2, updated_at=NOW() WHERE id=$3`,
      [estado, operario_id || null, req.params.id]
    );
    await pool.query(
      `INSERT INTO estado_logs (reporte_id, estado_anterior, estado_nuevo, cambiado_por)
       VALUES ($1,$2,$3,$4)`,
      [req.params.id, prev.rows[0].estado, estado, req.user.id]
    );

    const info = await pool.query(
      `SELECT u.nombre, u.email, r.titulo
       FROM reportes r JOIN usuarios u ON r.ciudadano_id = u.id
       WHERE r.id=$1`,
      [req.params.id]
    );

    // Email al ciudadano
    notificarCambioEstado({
      ciudadanoEmail:  info.rows[0].email,
      ciudadanoNombre: info.rows[0].nombre,
      reporteId:       req.params.id,
      titulo:          info.rows[0].titulo,
      estado,
    }).catch(err => console.error('Email cambio estado:', err.message));

    // Telegram
    telegramCambioEstado({
      ciudadanoNombre: info.rows[0].nombre,
      reporteId:       req.params.id,
      titulo:          info.rows[0].titulo,
      estado,
    }).catch(err => console.error('Telegram cambio estado:', err.message));

    res.json({ message: 'Estado actualizado', estado });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function updateReport(req, res) {
  const { titulo, descripcion, tipo } = req.body;
  try {
    const check = await pool.query(
      'SELECT ciudadano_id, estado FROM reportes WHERE id=$1',
      [req.params.id]
    );
    if (!check.rows.length)
      return res.status(404).json({ error: 'Reporte no encontrado' });
    if (check.rows[0].ciudadano_id !== req.user.id)
      return res.status(403).json({ error: 'Solo puedes editar tus propios reportes' });
    if (check.rows[0].estado !== 'recibido')
      return res.status(400).json({ error: 'Solo puedes editar reportes en estado Recibido' });

    const result = await pool.query(
      `UPDATE reportes SET titulo=$1, descripcion=$2, tipo=$3, updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [titulo, descripcion, tipo, req.params.id]
    );

    const ciudadano = await pool.query(
      'SELECT nombre, email FROM usuarios WHERE id=$1',
      [req.user.id]
    );

    // Email
    notificarNuevoReporte({
      ciudadanoEmail:  ciudadano.rows[0].email,
      ciudadanoNombre: ciudadano.rows[0].nombre,
      reporteId:       req.params.id,
      titulo:          result.rows[0].titulo,
      tipo:            result.rows[0].tipo,
    }).catch(err => console.error('Email edicion:', err.message));

    // Telegram
    telegramReporteEditado({
      ciudadanoNombre: ciudadano.rows[0].nombre,
      reporteId:       req.params.id,
      titulo:          result.rows[0].titulo,
    }).catch(err => console.error('Telegram edicion:', err.message));

    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

module.exports = { getAll, getOne, create, updateStatus, updateReport };