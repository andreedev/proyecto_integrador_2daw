const eventoDatepicker = document.getElementById('eventoDatepicker');
const edicionesAnterioresCarousel = document.getElementById('edicionesAnterioresCarousel');
const noticiasDestacadasCarousel = document.getElementById('noticiasDestacadasCarousel');
const premiosCarousel = document.getElementById('premiosCarousel');

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
    renderizarPremios(datosHome.premios);
}

function renderizarEdicionesAnteriores(edicionesAnteriores) {
    const slides = edicionesAnteriores.map(edicion => {
        const { idEdicion, anioEdicion, resumenEvento, nroParticipantes, rutaImagenRepresentativa, nroGanadores } = edicion;
        return `
            <div class="h-auto cursor-pointer position-relative box-shadow-01 d-flex flex-column gap-16px m-2px pb-32px" 
                 onclick="window.location.href='edicion.html?id=${idEdicion}'">
                <div class="img-container">
                    <img class="img-edicion-anterior" src="${rutaImagenRepresentativa}" alt="Edición ${anioEdicion}">
                </div>
                <div class="texto-edicion-anterior d-flex gap-8px flex-column">
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
                <span class="fs-12px fs-md-16px">${descripcionEvento}</span>
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

function renderizarNoticiasDestacadas(noticias) {
    const slides = noticias.map(noticia => {
        const { idNoticia, nombreNoticia, descripcionNoticia, fechaNoticia, rutaImagenNoticia } = noticia;
        const fecha = new Date(fechaNoticia);
        const opcionesFecha = { day: 'numeric', month: 'long' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);

        return `
            <div class="h-auto cursor-pointer position-relative box-shadow-01 d-flex flex-column cursor-pointer box-shadow-01 h-100 m-1px" 
                 onclick="window.location.href='detalle_noticia.html?id=${idNoticia}'">
                <div class="w-100">
                    <img class="w-100" src="${rutaImagenNoticia}" alt="Noticia ${idNoticia}">
                </div>
                <div class="d-flex flex-column gap-8px p-16px position-relative pb-16px">
                    <div class="texto-noticia-destacada d-flex gap-4px flex-column">
                        <span class="fs-14px text-right">${fechaFormateada}</span>
                        <span class="fw-600 fs-20px">${nombreNoticia}</span>
                        <span class="descripcion-noticia-destacada">${descripcionNoticia}</span>
                    </div>
                </div>
                <div class="flecha-container">
                    <span class="flecha-derecha"></span>
                </div>
            </div>
        `;
    });

    noticiasDestacadasCarousel.setSlides(slides);
}


function renderizarPremios(premios) {
    const slides = premios.map(premio => {
        const { nombre, incluyeDinero, cantidadDinero, nombreCategoria, incluyeObjetoAdicional, objetoAdicional } = premio;

        const cantidadDineroFormatted = incluyeDinero
            ? Number.parseFloat(cantidadDinero).toFixed(0)
            : '';

        const htmlDinero = incluyeDinero ? `
            <div class="d-flex flex-row align-center gap-8px">
                <span class="icon-money w-24px h-24px bg-neutral-01"></span>
                <span class="numero">${cantidadDineroFormatted}€</span>
            </div>
        ` : '';

        const separador = (incluyeDinero && incluyeObjetoAdicional) ? '<span class="fs-18px fw-400">+</span>' : '';

        const htmlObjeto = incluyeObjetoAdicional ? `
            <div class="d-flex flex-row align-center gap-8px">
                ${separador}
                <span class="objeto-texto">${objetoAdicional}</span>
            </div>
        ` : '';

        return `
            <div class="premio d-flex flex-column cursor-pointer box-shadow-01 p-16px h-auto m-1px">
                <span class="fs-20px fw-600 text-center">${nombreCategoria}</span>
                <div class="d-flex justify-content-center w-100">
                    <span class="icon-premio w-120px h-120px"></span>
                </div>
                <span class="puesto text-center">${nombre}</span>
                
                <div class="premio-recompensas d-flex flex-row flex-wrap justify-center align-center gap-8px mt-8px">
                    ${htmlDinero}
                    ${htmlObjeto}
                </div>
            </div>
        `;
    });

    premiosCarousel.setSlides(slides);
}

