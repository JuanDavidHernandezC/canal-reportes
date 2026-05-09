-- USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'ciudadano',
  -- rol: ciudadano | operario | admin | planeacion
  created_at TIMESTAMP DEFAULT NOW()
);

-- REPORTES
CREATE TABLE IF NOT EXISTS reportes (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  -- tipo: infraestructura | basuras | alumbrado | otro
  estado VARCHAR(30) NOT NULL DEFAULT 'recibido',
  -- estado: recibido | en_proceso | resuelto
  latitud DECIMAL(10,8),
  longitud DECIMAL(11,8),
  foto_url TEXT,
  ciudadano_id INTEGER REFERENCES usuarios(id),
  operario_id INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- MENSAJES (mensajería interna)
CREATE TABLE IF NOT EXISTS mensajes (
  id SERIAL PRIMARY KEY,
  reporte_id INTEGER REFERENCES reportes(id) ON DELETE CASCADE,
  emisor_id INTEGER REFERENCES usuarios(id),
  contenido TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LOGS DE ESTADO
CREATE TABLE IF NOT EXISTS estado_logs (
  id SERIAL PRIMARY KEY,
  reporte_id INTEGER REFERENCES reportes(id) ON DELETE CASCADE,
  estado_anterior VARCHAR(30),
  estado_nuevo VARCHAR(30),
  cambiado_por INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW()
);