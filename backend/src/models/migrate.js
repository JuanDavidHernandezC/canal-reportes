require('dotenv').config();
const pool = require('./db');

async function migrate() {
  console.log('Creando tablas...');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(20) NOT NULL DEFAULT 'ciudadano',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabla usuarios creada');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reportes (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        descripcion TEXT NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        estado VARCHAR(30) NOT NULL DEFAULT 'recibido',
        latitud DECIMAL(10,8),
        longitud DECIMAL(11,8),
        foto_url TEXT,
        ciudadano_id INTEGER REFERENCES usuarios(id),
        operario_id INTEGER REFERENCES usuarios(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabla reportes creada');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS mensajes (
        id SERIAL PRIMARY KEY,
        reporte_id INTEGER REFERENCES reportes(id) ON DELETE CASCADE,
        emisor_id INTEGER REFERENCES usuarios(id),
        contenido TEXT NOT NULL,
        leido BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabla mensajes creada');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS estado_logs (
        id SERIAL PRIMARY KEY,
        reporte_id INTEGER REFERENCES reportes(id) ON DELETE CASCADE,
        estado_anterior VARCHAR(30),
        estado_nuevo VARCHAR(30),
        cambiado_por INTEGER REFERENCES usuarios(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabla estado_logs creada');

    console.log('');
    console.log('🎉 Base de datos lista!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

migrate();