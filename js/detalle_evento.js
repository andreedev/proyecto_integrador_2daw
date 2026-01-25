const iconHome = document.getElementById('iconHome');
const eventos = document.getElementById('eventos');
const smallEventTitle = document.getElementById('smallEventTitle');

const eventoTitle = document.getElementById('eventoTitle');

const eventoFecha = document.getElementById('eventoFecha');
const ubicacion = document.getElementById('ubicacion');

const imgEventoDerecho = document.getElementById('imgEventoDerecho');
const eventoDescripcion = document.getElementById('eventoDescripcion');

const backgroundImageEvent = document.getElementById('backgroundImageEvent');


iconHome.addEventListener('click', () => {
    window.location.href = 'index.html';
});

eventos.addEventListener('click', () => {
    window.location.href = 'eventos.html';
});

function renderizarEvento(evento) {
    smallEventTitle.textContent = evento.nombreEvento;
    eventoTitle.textContent = evento.nombreEvento;
    ubicacion.textContent = evento.ubicacionEvento;
    eventoFecha.textContent = humanizeDate(convertISOStringToDate(evento.fechaEvento)) + ' de ' + evento.horaInicioEvento.substring(0,5) + ' a ' + evento.horaFinEvento.substring(0,5);
    imgEventoDerecho.src = evento.rutaImagenEvento;
    backgroundImageEvent.style.setProperty('--header-bg', `url(${evento.rutaImagenEvento})`);
    imgEventoDerecho.alt = 'Imagen evento';
    eventoDescripcion.textContent = evento.descripcionEvento;
}

async function cargarEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        const response = await obtenerEventoPorId(id);
        if (response.status === 'success') {
            renderizarEvento(response.data);
        }
    }
}

cargarEvento();