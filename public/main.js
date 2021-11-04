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
const formMessage = document.getElementById('form-message');
const productsContainer = document.getElementById('products-container');

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
   <div style="margin: 1vh; background-color: khaki; border-radius: 1vh; padding-left: 3vh;"><b>${element.author}</b><span style="color: gray;"> [${element.time}]:</span> <em>${element.message}</em> </div>
  `).join(' ');
})

//Handlebars
const template = Handlebars.compile(`
<h2 style="text-align: center; margin-bottom: 5vh;">Lista de productos</h2>
<ul>
{{#each products}}
  <li style="margin: 10px; text-align: center; display: flex; flex-flow: row wrap; align-content: center; justify-content: space-evenly;">
    <img width="100px" src={{this.img}} alt="Card image cap">
    <h3>{{this.title}}</h3>
    <div>
      <p>id: {{this.id}}</p>
      <p>$ {{this.price}}</p>
    </div>
  </li>
{{/each}}
</ul>
`);

socket.on('products', data => {
  const html = template({ products: data });
  productsContainer.innerHTML = html;
})

