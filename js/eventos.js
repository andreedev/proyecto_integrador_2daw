const iconHome = document.getElementById('iconHome');

const eventPost = document.getElementById('eventPost');

const imgEvento = document.getElementById('imgEvento');
const fechaEvento = document.getElementById('fechaEvento');
const horaEvento = document.getElementById('horaEvento');
const eventTitle = document.getElementById('eventTitle');
const eventDescription = document.getElementById('eventDescription');

iconHome.addEventListener('click', () => {
    window.location.href = 'index.html';
});

eventPost.addEventListener('click', () => {
    window.location.href = 'detalle_evento.html';
});
