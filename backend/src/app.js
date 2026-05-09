require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || '*', methods: ['GET','POST'] }
});

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Rutas
app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/reports',  require('./routes/reports.routes'));
app.use('/api/messages', require('./routes/messages.routes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Sockets
require('./sockets/chat.socket')(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));