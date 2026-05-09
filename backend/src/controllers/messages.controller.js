const pool = require('../models/db');

async function getByReport(req, res) {
  try {
    const result = await pool.query(
      `SELECT m.*, u.nombre as emisor_nombre, u.rol as emisor_rol
       FROM mensajes m JOIN usuarios u ON m.emisor_id=u.id
       WHERE m.reporte_id=$1 ORDER BY m.created_at ASC`,
      [req.params.reporteId]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function send(req, res) {
  const { contenido } = req.body;
  const { reporteId } = req.params;
  try {
    const result = await pool.query(
      `INSERT INTO mensajes (reporte_id, emisor_id, contenido)
       VALUES ($1,$2,$3) RETURNING *`,
      [reporteId, req.user.id, contenido]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

module.exports = { getByReport, send };