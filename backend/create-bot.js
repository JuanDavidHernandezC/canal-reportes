require('dotenv').config();
const pool = require('./src/models/db');
const bcrypt = require('bcryptjs');

bcrypt.hash('bot_secure_2026', 10).then(hash => {
  pool.query(
    `INSERT INTO usuarios (id, nombre, email, password, rol)
     VALUES (1, 'Asistente Canal Reportes', 'bot@canal.com', '${hash}', 'admin')
     ON CONFLICT (id) DO UPDATE SET nombre='Asistente Canal Reportes'`
  ).then(() => {
    console.log('✅ Bot creado exitosamente');
    process.exit(0);
  }).catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
});