const router  = require('express').Router();
const pool    = require('../models/db');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// Obtener todos los usuarios
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Cambiar rol de un usuario
router.patch('/:id/rol', verifyToken, requireRole('admin'), async (req, res) => {
  const { rol } = req.body;
  const rolesValidos = ['ciudadano','operario','admin'];
  if (!rolesValidos.includes(rol))
    return res.status(400).json({ error: 'Rol inválido' });
  try {
    const result = await pool.query(
      'UPDATE usuarios SET rol=$1 WHERE id=$2 RETURNING id, nombre, email, rol',
      [rol, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;