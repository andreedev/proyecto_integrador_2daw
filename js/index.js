const eventoDatepicker = document.getElementById('eventoDatepicker');
const edicionesAnterioresCarousel = document.getElementById('edicionesAnterioresCarousel');
const noticiasDestacadasCarousel = document.getElementById('noticiasDestacadasCarousel');

(async function cargarHome() {
    const response = await obtenerDatosHome();
    renderizarHome(response.data);
})();

async function cargarFechasConEventos(mes, anio) {
    const response = await obtenerFechasEventoPorMesAnio(mes, anio);
    eventoDatepicker.setEvents(response.data);
}

function renderizarHome(datosHome) {
    renderizarEdicionesAnteriores(datosHome.edicionesAnteriores);
    renderizarNoticiasDestacadas(datosHome.noticiasDestacadas);
}

function renderizarEdicionesAnteriores(edicionesAnteriores) {
    const slides = edicionesAnteriores.map(edicion => {
        const { idEdicion, anioEdicion, resumenEvento, nroParticipantes, rutaImagenRepresentativa, nroGanadores } = edicion;
        return `
            <div class="h-auto cursor-pointer position-relative box-shadow-01 d-flex flex-column gap-16px" 
                 onclick="window.location.href='edicion.html?id=${idEdicion}'">
                <div class="img-container">
                    <img class="img-edicion-anterior" src="${rutaImagenRepresentativa}" alt="Edición ${anioEdicion}">
                </div>
                <div class="texto-edicion-anterior d-flex gap-4px flex-column">
                    <span class="num-edicion">Edición ${anioEdicion}</span>
                    <span class="text-edicion">${resumenEvento}</span>
                    <span class="participantes-ganadores">${nroParticipantes} participantes y ${nroGanadores} ganadores</span>
                </div>
                <div class="flecha-container">
                    <span class="flecha-derecha"></span>
                </div>
            </div>
        `;
    });

    edicionesAnterioresCarousel.setSlides(slides);
}

eventoDatepicker.addEventListener('date-change', async (event) => {
    const { date, iso } = event.detail;
    if (!date) {
        console.log("No hay fecha seleccionada");
        return;
    }
    await cargarEventosPorFecha(iso);
    await cargarFechasConEventos(date.getMonth() + 1, date.getFullYear());
});

eventoDatepicker.addEventListener('view-change', async (event) => {
    const { month, year } = event.detail;
    await cargarFechasConEventos(month, year);
});

async function cargarEventosPorFecha(fechaISO) {
    const response = await listarEventos(fechaISO);
    renderizarEventos(response.data);
    eventoDatepicker.setEvents(response.data);
}

function renderizarEventos(eventos) {
    const eventosLista = document.getElementById('eventosLista');
    eventosLista.replaceChildren();

    eventos.forEach(evento => {
        const { idEvento, nombreEvento, descripcionEvento, ubicacionEvento, fechaEvento, horaInicioEvento, horaFinEvento, rutaImagenEvento } = evento;

        const eventoDiv = document.createElement('div');
        eventoDiv.classList.add('evento', 'd-flex', 'flex-row', 'gap-10px');
        eventoDiv.onclick = () => {
            window.location.href = `detalle_evento.html?id=${idEvento}`;
        };

        eventoDiv.innerHTML = `
            <div class="img-evento-container">
                <img class="img-evento" src="${rutaImagenEvento}" alt="Evento ${idEvento}">
            </div>
            <div class="w-100 position-relative d-flex flex-column gap-10px p-16px">
                <span class="evento-title">${nombreEvento}</span>
                <div class="icono-hora d-flex gap-16px flex-row ju">
                    <span class="icono-reloj"></span>
                    <span class="hora">${horaInicioEvento.substring(0,5)} - ${horaFinEvento.substring(0,5)}</span>
                </div>
                <span class="descipcion-evento">${descripcionEvento}</span>
                <div class="flecha-container">
                    <span class="flecha-derecha"></span>
                </div>
            </div>
        `;

        eventosLista.appendChild(eventoDiv);
    });
    if (eventos.length === 0) {
        const noEventosDiv = document.createElement('div');
        noEventosDiv.classList.add('no-eventos', 'd-flex', 'justify-center', 'align-center', 'p-32px', 'flex-grow-1', 'w-100');
        noEventosDiv.innerText = "No hay eventos para la fecha seleccionada.";
        eventosLista.appendChild(noEventosDiv);
    }
}

/**
 * <div class="noticia">
 *                                     <div class="img-noticia-contenedor">
 *                                         <img class="img-noticia" src="../img/8af8cd7e799be1b89c542ebbf842f31bc9475db1.jpg" alt="Noticia 1">
 *                                     </div>
 *                                     <div class="noticia-texto d-flex flex-column gap-8px">
 *                                         <span class="fecha-noticia">23 de enero</span>
 *                                         <span class="title-noticia">La Universidad Europea da la bienvenida a sus estudiantes de intercambio del segundo semestre</span>
 *                                         <span class="noticia-content">Organizado por la Oficina de Relaciones Internacionales del Vicerrectorado de Estudiantes y Vida Universitaria</span>
 *                                     </div>
 *                                 </div>
 *
 *   {
 *                 "idNoticia": 5,
 *                 "nombreNoticia": "Convocatoria 2025",
 *                 "descripcionNoticia": "Apertura de inscripciones para la edici\u00f3n 2025.",
 *                 "fechaNoticia": "2024-12-31",
 *                 "rutaImagenNoticia": "http:\/\/localhost\/DWES\/proyecto_integrador_2daw\/uploads\/public\/festival1.png",
 *                 "nombreOrganizador": "Organizador Madrid"
 *             },
 */
function renderizarNoticiasDestacadas(noticias) {
    const slides = noticias.map(noticia => {
        const { idNoticia, nombreNoticia, descripcionNoticia, fechaNoticia, rutaImagenNoticia } = noticia;
        const fecha = new Date(fechaNoticia);
        const opcionesFecha = { day: 'numeric', month: 'long' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);

        return `
            <div class="h-auto cursor-pointer position-relative box-shadow-01 d-flex flex-column gap-16px" 
                 onclick="window.location.href='detalle_noticia.html?id=${idNoticia}'">
                <div class="w-100">
                    <img class="w-100" src="${rutaImagenNoticia}" alt="Noticia ${idNoticia}">
                </div>
                <div class="texto-noticia-destacada d-flex gap-4px flex-column">
                    <span class="fecha-noticia-destacada">${fechaFormateada}</span>
                    <span class="title-noticia-destacada">${nombreNoticia}</span>
                    <span class="descripcion-noticia-destacada">${descripcionNoticia}</span>
                </div>
                <div class="flecha-container">
                    <span class="flecha-derecha"></span>
                </div>
            </div>
        `;
    });

    noticiasDestacadasCarousel.setSlides(slides);

}