const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { getAll, getOne, create, updateStatus } = require('../controllers/reports.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/',    verifyToken, getAll);
router.get('/:id', verifyToken, getOne);
router.post('/',   verifyToken, requireRole('ciudadano'), upload.single('foto'), create);
router.patch('/:id/estado', verifyToken, requireRole('operario','admin'), updateStatus);

module.exports = router;