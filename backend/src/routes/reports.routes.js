const router = require('express').Router();
const { getAll, getOne, create, updateStatus } = require('../controllers/reports.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.get('/',    verifyToken, getAll);
router.get('/:id', verifyToken, getOne);
router.post('/',   verifyToken, requireRole('ciudadano'), upload.single('foto'), create);
router.patch('/:id/estado', verifyToken, requireRole('operario','admin'), updateStatus);

module.exports = router;