const router = require('express').Router();
const { getAll, getOne, create, updateStatus } = require('../controllers/reports.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');
const pool = require('../models/db');

// Ruta pública — sin token
router.get('/public', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.titulo, r.tipo, r.estado, r.latitud, r.longitud, r.created_at,
              u.nombre as ciudadano_nombre
       FROM reportes r JOIN usuarios u ON r.ciudadano_id=u.id
       ORDER BY r.created_at DESC LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Rutas privadas
router.get('/',    verifyToken, getAll);
router.get('/:id', verifyToken, getOne);
router.post('/',   verifyToken, requireRole('ciudadano'), upload.single('foto'), create);
router.patch('/:id/estado', verifyToken, requireRole('operario','admin'), updateStatus);

module.exports = router;