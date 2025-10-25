import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/blueprints/:author/:name', (req, res) => {
  res.json({
    author: req.params.author,
    name: req.params.name,
    points: [{ x: 10, y: 10 }, { x: 40, y: 50 }],
  });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.on('join-room', (room) => socket.join(room));
  socket.on('draw-event', ({ room, point, author, name }) => {
    socket.to(room).emit('blueprint-update', { author, name, points: [point] });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Socket.IO up on :${PORT}`));
