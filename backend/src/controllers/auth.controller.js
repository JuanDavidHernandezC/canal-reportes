const pool = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { nombre, email, password, rol = 'ciudadano' } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });

  try {
    const exists = await pool.query('SELECT id FROM usuarios WHERE email=$1', [email]);
    if (exists.rows.length > 0)
      return res.status(400).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1,$2,$3,$4) RETURNING id, nombre, email, rol',
      [nombre, email, hash, rol]
    );
    const user = result.rows[0];
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email=$1', [email]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const payload = { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function me(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id=$1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login, me };