//initialization of socket on client
const socket = io();
socket.on('mensaje', data => {
  alert(data);
  socket.emit('notificacion', 'mensaje recibido');
})
socket.on('mensaje2', data => {
  alert(data);
})

// DOM elements
const btn = document.getElementById('send-btn');
const message = document.getElementById('message');
const messageContainer = document.getElementById('message-container');
const formMessage = document.getElementById('form-message')

//Functions
const addMessage = () => {
  const author = document.getElementById('author').value;
  const message = document.getElementById('message').value;
  const obj = { author, message };
  document.getElementById('message').value = '';
  socket.emit('new-message', obj);
}

//Events
formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  addMessage();
})
socket.on('messages', data => {
  messageContainer.innerHTML = data.map(element => `
   <div style="margin: 1vh; background-color: khaki; border-radius: 1vh; padding-left: 3vh;"><b>${element.author}:</b> <em>${element.message}</em> </div>
  `).join(' ');
})
