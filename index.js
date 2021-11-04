//--------------------------------------------------------------------- Imports
const express = require('express');
const cors = require('cors');
//const { config } = require('./config');
const serverRoutes = require('./routes');
const { Server: HTTPServer } = require('http');
const { Server: IOServer } = require('socket.io');
const Container = require('./container');
const moment = require('moment');
const db = new Container('./db.txt');

//--------------------------------------------------------------------- Initializations
const app = express();
const httpServer = new HTTPServer(app);
const io = new IOServer(httpServer);

//--------------------------------------------------------------------- Settings
app.set('view engine', 'ejs');

//--------------------------------------------------------------------- Middlewares
app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('', express.static(__dirname + '/public'));

//--------------------------------------------------------------------- Global Variables
const PORT = 8088;

//--------------------------------------------------------------------- Routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
})
app.post('/', (req, res) => {
  const obj = req.body;
  const savedObj = db.save(obj);
  savedObj.then(res.redirect('/')).catch(err => console.log('Error ->', err));
})

//serverRoutes(app);

//--------------------------------------------------------------------- Listen
httpServer.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
})

//--------------------------------------------------------------------- Socket
const messages = [];

io.on('connection', (socket) => {
  console.log('nuevo usuario conectado');
  socket.emit('messages', messages);
  db.getAll().then(res => socket.emit('products', res)).catch(err => console.log('Error ->', err));
  socket.on('new-message', data => {
    const time = moment().format('DD/MM/YYYY hh:mm:ss');
    const dataWithTime = { ...data, time }
    messages.push(dataWithTime);
    io.sockets.emit('messages', messages);
  })
})