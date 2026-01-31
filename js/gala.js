//Carousel info corto

const textoTransmision = document.getElementById('textoTransmision');
const trailerVideoPlayer = document.getElementById('trailerVideoPlayer');
const streamingEventoVideoPlayer = document.getElementById('streamingEventoVideoPlayer');
const galeriaFotograficaCarousel = document.getElementById('galeriaFotograficaCarousel');

cargarDatosGala();

async function cargarDatosGala() {
    const response = await obtenerDatosGala();
    renderizarDatosGala(response.data);
}

function renderizarDatosGala(data) {
    const contenidoPreEvento = document.getElementById('contenidoPreEvento');
    const contenidoPostEvento = document.getElementById('contenidoPostEvento');

    contenidoPreEvento.classList.add('d-none');
    contenidoPostEvento.classList.add('d-none');

    if (data.modo === 'pre-evento') {
        contenidoPreEvento.classList.remove('d-none');
        const preEventoTitulo = document.getElementById('preEventoTitulo');
        const preEventoDescripcion = document.getElementById('preEventoDescripcion');
        const preEventoFecha = document.getElementById('preEventoFecha');
        const preEventoUbicacion = document.getElementById('preEventoUbicacion');

        preEventoTitulo.textContent = data.titulo;
        preEventoDescripcion.textContent = data.descripcion;
        preEventoFecha.textContent = formatDateToLongSpanish(data.fecha);
        preEventoUbicacion.textContent = data.ubicacion;

        if (data.streamingActivo) {
            streamingEventoVideoPlayer.setVisible(true);
            textoTransmision.classList.remove('d-none');
            streamingEventoVideoPlayer.setSource(data.streamingUrl)
        } else {
            streamingEventoVideoPlayer.setVisible(false);
            textoTransmision.classList.add('d-none');
        }

        renderizarEventos(data.eventosDiaGala);
    }
    if (data.modo === 'post-evento') {
        contenidoPostEvento.classList.remove('d-none');

        const slides = [];
        data.galeria.forEach(archivo => {
            slides.push(`<div class="w-100"><img src="${archivo.rutaArchivo}" class="w-100"/></div>`);
        });
        galeriaFotograficaCarousel.setSlides(slides);
    }
}

const btnCalendario = document.getElementById('btnCalendario');
btnCalendario.addEventListener('click', () => {
    window.open('https://www.google.com/calendar/render?action=TEMPLATE&text=Festival+de+Cortometraje+2026&dates=20260123T090000Z/20260123T180000Z&details=Asistencia+al+Festival+de+Cortometraje&location=Auditorio+Principal', '_blank');
});


function renderizarEventos(eventos) {
    const contenedorEventos = document.getElementById('contenedorEventos');
    contenedorEventos.replaceChildren();

    eventos.forEach(evento => {
        const eventoDiv = document.createElement('div');
        eventoDiv.classList.add('evento-nombre-ubicacion');

        const formatTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':');
            return `${hours}:${minutes}`;
        };

        const horaEvento = `${formatTime(evento.horaInicioEvento)} - ${formatTime(evento.horaFinEvento)} h`;

        eventoDiv.innerHTML = `
            <div class="hora-puntitos">
                <div class="fw-600 w-max-content hora-evento">${horaEvento}</div>
                <div class="linea-puntos position-absolute">..............................</div>
            </div>
            <div class="d-flex flex-column min-w-0 flex-grow-1 gap-8px info-evento">
                <span class="nombre-evento">${evento.nombreEvento}</span>
                <div class="descripcion-evento">${evento.descripcionEvento}</div>
                <div class="icon-text">
                    <span class="icon-ubicacion"></span>
                    <span class="ubicacion-text">${evento.ubicacionEvento}</span>
                </div>
            </div>
        `;

        contenedorEventos.appendChild(eventoDiv);
    });
}