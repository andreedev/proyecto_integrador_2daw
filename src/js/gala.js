const textoTransmision = document.getElementById('textoTransmision');
const streamingEventoVideoPlayer = document.getElementById('streamingEventoVideoPlayer');
const galeriaFotograficaCarousel = document.getElementById('galeriaFotograficaCarousel');
const ganadoresCortosCarousel = document.getElementById('ganadoresCortosCarousel');
const modalSinopsisTrailer = document.getElementById('modalSinopsisTrailer');
const sinopsisText = document.getElementById('sinopsisText');
const trailerVideoPlayer = document.getElementById('trailerVideoPlayer');
const postEventoTitulo = document.getElementById('postEventoTitulo');
const postEventoResumen = document.getElementById('postEventoResumen');
const btnCalendario = document.getElementById('btnCalendario');
const contenidoPreEvento = document.getElementById('contenidoPreEvento');
const contenidoPostEvento = document.getElementById('contenidoPostEvento');

const resolvePageReady = registerPageReady();

cargarDatosGala();

async function cargarDatosGala() {
    const response = await obtenerDatosGala();
    renderizarDatosGala(response.data);
    resolvePageReady();
}

function renderizarDatosGala(data) {

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

        configurarBotonCalendario(data.titulo, data.fecha, data.ubicacion, data.descripcion);

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
        postEventoResumen.textContent = data.resumen;
        postEventoTitulo.textContent = data.titulo;

        renderizarCarruselGaleria(data.galeria);
        renderizarCarruselCortos(data.candidaturasGanadoras);
    }
}

/**
 * Configura el botón de calendario con los datos del evento
 * @param {string} titulo - Título del evento
 * @param {string} fecha - Fecha en formato DD/MM/YYYY
 * @param {string} ubicacion - Ubicación del evento
 * @param {string} descripcion - Descripción del evento
 */
function configurarBotonCalendario(titulo, fecha, ubicacion, descripcion) {
    // Convertir fecha DD/MM/YYYY a formato Google Calendar YYYYMMDD
    const fechaGoogleCalendar = convertSpanishDateToGoogleCalendar(fecha);

    // Construir URL de Google Calendar
    const tituloEncoded = encodeURIComponent(titulo);
    const descripcionEncoded = encodeURIComponent(descripcion);
    const ubicacionEncoded = encodeURIComponent(ubicacion);

    // Para eventos de día completo, Google Calendar usa formato YYYYMMDD/YYYYMMDD
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${tituloEncoded}&dates=${fechaGoogleCalendar}/${fechaGoogleCalendar}&details=${descripcionEncoded}&location=${ubicacionEncoded}`;

    // Actualizar el event listener del botón
    btnCalendario.onclick = () => {
        window.open(googleCalendarUrl, '_blank');
    };
}


function renderizarCarruselGaleria(galeria) {
    const slides = [];
    galeria.forEach(archivo => {
        let html = '';
        if (archivo.tipoArchivo === 'video') {
            html = `<video-player-component src="${archivo.rutaArchivo}"></video-player-component>`;
        } else if (archivo.tipoArchivo === 'imagen') {
            html = `<div class="w-100"><img src="${archivo.rutaArchivo}" class="w-100"/></div>`;
        }
        slides.push(html);
    });
    galeriaFotograficaCarousel.setSlides(slides);
}


function renderizarCarruselCortos(candidaturasGanadoras) {
    const ganadoresSlides = [];

    candidaturasGanadoras.forEach((candidatura, index) => {
        const container = document.createElement('div');
        container.className = 'd-flex flex-column gap-16px align-items-center p-16px';

        if (candidatura.esHonorifico) {
            const videoPlayer = document.createElement('video-player-component');
            videoPlayer.setAttribute('src', candidatura.rutaVideo);
            videoPlayer.className = 'img-info-corto w-100';
            container.appendChild(videoPlayer);
        } else {
            const img = document.createElement('img');
            img.src = candidatura.rutaCartel;
            img.alt = 'Portada corto';
            img.className = 'img-info-corto w-100';
            container.appendChild(img);
        }

        const textContainer = document.createElement('div');
        textContainer.className = 'text-info-corto';

        const title = document.createElement('span');
        title.className = 'title-corto';
        title.textContent = candidatura.titulo;

        const autor = document.createElement('span');
        autor.className = 'autor';
        autor.textContent = candidatura.nombreParticipante;

        const posicion = document.createElement('span');
        posicion.className = 'posicion';
        posicion.textContent = `${candidatura.nombrePremio} - ${candidatura.nombreCategoria}`;

        textContainer.appendChild(title);
        textContainer.appendChild(autor);
        textContainer.appendChild(posicion);

        if (!candidatura.esHonorifico) {
            const botonWrapper = document.createElement('span');
            botonWrapper.className = 'ver-trailer-sinopsis';

            const boton = document.createElement('u');
            const link = document.createElement('span');
            link.className = 'text-decoration-none text-inherit cursor-pointer';
            link.textContent = 'Sinopsis y trailer';
            link.setAttribute('data-candidatura-index', index);

            boton.appendChild(link);
            botonWrapper.appendChild(boton);
            textContainer.appendChild(botonWrapper);
        }

        container.appendChild(textContainer);

        ganadoresSlides.push(container);
    });

    ganadoresCortosCarousel.setSlides(ganadoresSlides, true);

    setTimeout(() => {
        const links = ganadoresCortosCarousel.querySelectorAll('.ver-trailer-sinopsis span');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(link.getAttribute('data-candidatura-index'));
                const candidatura = candidaturasGanadoras[index];
                abrirModalSinopsisTrailer(candidatura);
            });
        });
    }, 200);
}

function abrirModalSinopsisTrailer(candidatura) {
    sinopsisText.textContent = candidatura.sinopsis || 'Sin sinopsis disponible';

    if (candidatura.rutaTrailer) {
        trailerVideoPlayer.setSource(candidatura.rutaTrailer);
        trailerVideoPlayer.setVisible(true);
    } else {
        trailerVideoPlayer.setVisible(false);
    }

    modalSinopsisTrailer.open();
}




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