const iconHome = document.getElementById('iconHome');

const eventPost = document.getElementById('eventPost');

const imgEvento = document.getElementById('imgEvento');
const fechaEvento = document.getElementById('fechaEvento');
const horaEvento = document.getElementById('horaEvento');
const eventTitle = document.getElementById('eventTitle');
const eventDescription = document.getElementById('eventDescription');
const eventsContainer = document.getElementById('eventsContainer');
const pagination = document.getElementById('pagination');

let pageSize = 8;

iconHome.addEventListener('click', () => {
    window.location.href = 'index.html';
});

pagination.addEventListener('page-change', async () => {
    await cargarContenido();
})

function renderizarEventos(eventos) {
    eventos.forEach(evento => {
        const eventoElemento = document.createElement('div');
        eventoElemento.classList.add('event-post');

        const imagenEvento = document.createElement('img');
        imagenEvento.className = 'img-evento aspect-ratio-4-3 object-fit-cover';
        imagenEvento.src = evento.rutaImagenEvento;
        imagenEvento.alt = 'Imagen evento';

        const contenidoEvento = document.createElement('div');
        contenidoEvento.classList.add('event-post-content');

        const iconHoraFecha = document.createElement('div');
        iconHoraFecha.classList.add('event-icon-hora-fecha');

        const iconFecha = document.createElement('div');
        iconFecha.classList.add('icon-fecha');

        const iconoCalendario = document.createElement('span');
        iconoCalendario.classList.add('icon-calendario');

        const fechaEventoSpan = document.createElement('span');
        fechaEventoSpan.classList.add('event-hora');
        fechaEventoSpan.textContent = humanizeDate(convertISOStringToDate(evento.fechaEvento));

        iconFecha.appendChild(iconoCalendario);
        iconFecha.appendChild(fechaEventoSpan);

        const iconHora = document.createElement('div');
        iconHora.classList.add('icon-hora');

        const iconoReloj = document.createElement('span');
        iconoReloj.classList.add('icon-reloj');

        const horaEventoSpan = document.createElement('span');
        horaEventoSpan.classList.add('event-hora');
        horaEventoSpan.textContent = evento.horaInicioEvento.substring(0,5);

        iconHora.appendChild(iconoReloj);
        iconHora.appendChild(horaEventoSpan);

        iconHoraFecha.appendChild(iconFecha);
        iconHoraFecha.appendChild(iconHora);

        const tituloEvento = document.createElement('div');
        tituloEvento.classList.add('event-title');
        tituloEvento.textContent = evento.nombreEvento;

        const descripcionEvento = document.createElement('div');
        descripcionEvento.classList.add('event-description');
        descripcionEvento.textContent = evento.descripcionEvento;

        contenidoEvento.appendChild(iconHoraFecha);
        contenidoEvento.appendChild(tituloEvento);
        contenidoEvento.appendChild(descripcionEvento);

        eventoElemento.appendChild(imagenEvento);
        eventoElemento.appendChild(contenidoEvento);

        eventoElemento.addEventListener('click', () => {
            window.location.href = `detalle_evento.html?id=${evento.idEvento}`;
        });

        eventsContainer.appendChild(eventoElemento);
    });
}

async function cargarContenido(){
    eventsContainer.replaceChildren();
    const httpResponse = await listarEventos('', pagination.currentPage, pageSize);
    if (httpResponse.status === 'success') {
        const eventos = httpResponse.data.list;
        const totalPages = httpResponse.data.totalPages;
        pagination.setAttribute('total-pages',totalPages);
        renderizarEventos(eventos);
    }
}

cargarContenido();