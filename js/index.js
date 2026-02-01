const eventoDatepicker = document.getElementById('eventoDatepicker');
const edicionesAnterioresCarousel = document.getElementById('edicionesAnterioresCarousel');

(async function cargarHome() {
    const response = await obtenerDatosHome();
    renderizarHome(response.data);

    const hoy = new Date();
    const isoHoy = hoy.toISOString().split('T')[0];

    await cargarEventosPorFecha(isoHoy);
    await cargarFechasConEventos(hoy.getMonth() + 1, hoy.getFullYear());
})();

async function cargarFechasConEventos(mes, anio) {
    const response = await obtenerFechasEventoPorMesAnio(mes, anio);
    console.log(response.data);
}

function renderizarHome(datosHome) {
    renderizarEdicionesAnteriores(datosHome.edicionesAnteriores);
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

    // Cargamos eventos del día específico
    await cargarEventosPorFecha(iso);

    // Cargamos los puntitos (eventos) del mes actual
    await cargarFechasConEventos(date.getMonth() + 1, date.getFullYear());
});

async function cargarEventosPorFecha(fechaISO) {
    const response = await listarEventos(fechaISO);
    renderizarEventos(response.data);
    if (response.data) {
        eventoDatepicker.setEvents(response.data);
    }
}

function renderizarEventos(eventos) {
    const eventosLista = document.getElementById('eventosLista');
    eventosLista.replaceChildren();

    eventos.forEach(evento => {
        const { idEvento, nombreEvento, descripcionEvento, ubicacionEvento, fechaEvento, horaInicioEvento, horaFinEvento, rutaImagenEvento } = evento;

        const eventoDiv = document.createElement('div');
        eventoDiv.classList.add('evento', 'd-flex', 'flex-row', 'gap-10px');
        eventoDiv.onclick = () => {
            window.location.href = `evento.html?id=${idEvento}`;
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
}