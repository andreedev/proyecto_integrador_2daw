const iconHome = document.getElementById('iconHome');
const eventos = document.getElementById('eventos');
const smallEventTitle = document.getElementById('smallEventTitle');

const eventoTitle = document.getElementById('eventoTitle');

const eventoFecha = document.getElementById('eventoFecha');
const evetoUbicacion = document.getElementById('evetoUbicacion');

const imgEventoDerecho = document.getElementById('imgEventoDerecho');
const eventoDescripcion = document.getElementById('eventoDescripcion');


iconHome.addEventListener('click', () => {
    window.location.href = 'index.html';
});

eventos.addEventListener('click', () => {
    window.location.href = 'eventos.html';
});