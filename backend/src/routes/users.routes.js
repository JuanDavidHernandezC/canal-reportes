const router = require('express').Router();
const pool   = require('../models/db');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;