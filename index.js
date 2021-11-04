//--------------------------------------------------------------------- Imports
const express = require('express');
const cors = require('cors');
//const { config } = require('./config');
const serverRoutes = require('./routes');
const { Server: HTTPServer } = require('http');
const { Server: IOServer } = require('socket.io');

//--------------------------------------------------------------------- Initializations
const app = express();
const httpServer = new HTTPServer(app);
const io = new IOServer(httpServer);

//--------------------------------------------------------------------- Settings
app.set('view engine', 'ejs');

//--------------------------------------------------------------------- Middlewares
app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('', express.static(__dirname + '/public'));

//--------------------------------------------------------------------- Global Variables
const PORT = 8088;

//--------------------------------------------------------------------- Routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
})

serverRoutes(app);

//--------------------------------------------------------------------- Listen
httpServer.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
})

const messages = [];

io.on('connection', (socket) => {
  console.log('nuevo usuario conectado');
  socket.emit('messages', messages);
  socket.on('new-message', data => {
    messages.push(data);
    io.sockets.emit('messages', messages);
  })
})