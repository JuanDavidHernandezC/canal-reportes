const router = require('express').Router();
const { getByReport, send } = require('../controllers/messages.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/:reporteId',  verifyToken, getByReport);
router.post('/:reporteId', verifyToken, send);

module.exports = router;