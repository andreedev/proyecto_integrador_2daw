const tituloInput = document.getElementById('tituloInput');
const sinopsisInput = document.getElementById('sinopsisInput');
const misCandidaturasContainer = document.getElementById('misCandidaturasContainer');
const statusContainer = document.getElementById('statusContainer');
const posterInput = document.getElementById('posterInput');
const fichaTecnicaInput = document.getElementById('fichaTecnicaInput');
const playVideoCorto = document.getElementById('playVideoCorto');
const paginacionCandidaturas = document.getElementById('paginacionCandidaturas');
const btnGuardarCambios = document.getElementById('btnGuardarCambios');
const videoTrailerInput = document.getElementById('videoTrailerInput');
const mensajeSubsanacionInput = document.getElementById('mensajeSubsanacionInput');

let pageSize =3;
let candidaturaSeleccionada = null;

document.addEventListener('click', (e) => {
    const playBtn = e.target.closest('#playVideoCorto');
    if (playBtn) {
        playBtn.classList.add('d-none');
        const video = document.getElementById('videoCorto');
        if (video) {
            video.play().catch(error => {
                console.error("Error al reproducir:", error);
                playBtn.classList.remove('d-none');
            });
        }
    }
});


const StatusTemplates = {
    revision: () => `
        <div class="d-flex flex-row p-24px gap-16px align-items-center w-100 border-bg-warning-04-01 border-solid bg-warning-04 text-warning-01">
            <span class="icono-film flex-shrink-0"></span>
            <div class="text-revision">
                <span class="title-revision">Tu candidatura se encuentra en revisión</span>
                <span class="description-revision fw-500 line-height-120">Asegúrate que tu vídeo cumpla con los requisitos establecidos, al igual que el contenido de la ficha técnica.</span>
            </div>
        </div>
    `,
    finalista: () => `
        <div class="d-flex flex-row p-24px gap-16px align-items-center w-100 border-information-01 border-solid bg-information-04">
            <span class="icon-star w-36px h-36px bg-information-01 flex-shrink-0"></span>
            <div class="text-aceptada">
                <span class="title-aceptada">¡Enhorabuena!</span>
                <span class="description-aceptada">Tu candidatura se encuentra dentro de los cortometrajes finalistas. Necesitamos que subas un vídeo traíler de tu cortometraje para continuar en el concurso.</span>
            </div>
        </div>
    `,
    rechazada: (motivo) => `
        <div class="status-card-rechazada border-solid border-error-02">
            <div class="d-flex flex-row gap-8px">
                <span class="icon-warning w-36px h-36px bg-error-01 flex-shrink-0"></span>
                <div class="text-rechazada">
                    <span class="title-rechazada">Motivo del Rechazo:</span>
                    <span class="description-rechazada">${motivo || 'Motivo no especificado'}</span>
                </div>
            </div>
<!--            <div class="primary-button-01 w-auto btn-subsanar-trigger cursor-pointer">Subsanar</div>-->
        </div>
    `,
    subsanar: (motivo) => `
        <div class="status-card-rechazada-subsanar">
            <div class="d-flex flex-row gap-8px">
                <span class="icon-warning w-36px h-36px bg-error-01 flex-shrink-0"></span>
                <div class="text-rechazada">
                    <span class="title-rechazada">Motivo del Rechazo:</span>
                    <span class="description-rechazada-subsanar">${motivo}</span>
                </div>
            </div>
<!--            <div class="mensaje-para-subsanar">-->
<!--                <span class="mensaje">Mensaje para los Organizadores:</span>-->
<!--                <textarea class="textarea" id="mensajeTextarea" placeholder="Explica como has resuelto los motivos del rechazo"></textarea>-->
<!--            </div>-->
<!--            <div class="subsanar-action">-->
<!--                <span class="volver cursor-pointer" id="volver">Volver</span>-->
<!--                <span class="enviar-subsanacion cursor-pointer" id="btnEnviarSubsanación">Enviar Subsanación</span>-->
<!--            </div>-->
        </div>
    `
};

function buildBadge(candidatura) {
    const span = document.createElement('span');
    span.classList.add('estado-candidatura');
    if (candidatura.estado === 'En revisión') {
        span.classList.add('border-solid', 'border-warning-03', 'text-warning-01', 'bg-warning-04');
    }
    if (candidatura.estado === 'Aceptada') {
        span.classList.add('border-solid', 'border-success-03', 'text-success-03', 'bg-success-04');
    }
    if (candidatura.estado === 'Rechazada') {
        span.classList.add('border-solid', 'border-error-03', 'text-error-01', 'bg-error-04');
    }
    if (candidatura.estado === 'Finalista'){
        span.classList.add('border-solid', 'border-information-03', 'text-information-01', 'bg-information-04');
    }
    span.id = 'textEstadoCandidatura';
    span.textContent = candidatura.estado;
    return span;
}

function renderizarCandidaturas(candidaturas) {
    misCandidaturasContainer.replaceChildren();
    candidaturas.forEach((candidatura, index) => {
        const candidaturaElement = document.createElement('div');
        candidaturaElement.classList.add('candidatura-mini-card-component', 'cursor-pointer', 'gap-16px', 'p-24px', 'd-flex', 'flex-column', 'position-relative');
        candidaturaElement.appendChild(buildBadge(candidatura));

        const titleCortometraje = document.createElement('span');
        titleCortometraje.classList.add('fw-600');
        titleCortometraje.textContent = candidatura.titulo;
        candidaturaElement.appendChild(titleCortometraje);

        const horaPresentada = document.createElement('div');
        horaPresentada.classList.add('d-flex', 'align-items-center', 'gap-8px');
        const iconHora1 = document.createElement('span');
        iconHora1.classList.add('icon-sand-clock', 'w-20px', 'h-20px', 'bg-neutral-01');
        horaPresentada.appendChild(iconHora1);
        const fechaPresentada = document.createElement('span');
        fechaPresentada.id = 'fechaPresentada';
        fechaPresentada.textContent = `Presentado: ${formatDateToSpanish(candidatura.fechaPresentacion)}`;
        horaPresentada.appendChild(fechaPresentada);
        candidaturaElement.appendChild(horaPresentada);

        const ultimaActualizacion = document.createElement('div');
        ultimaActualizacion.classList.add('d-flex', 'align-items-center', 'gap-8px');
        const iconHora2 = document.createElement('span');
        iconHora2.classList.add('icon-sand-clock', 'w-20px', 'h-20px', 'bg-neutral-01');
        ultimaActualizacion.appendChild(iconHora2);
        const fechaActualizacion = document.createElement('span');
        fechaActualizacion.classList.add('fecha-actualizacion');
        fechaActualizacion.id = 'fechaActualizacion';
        fechaActualizacion.textContent = `Última actualización: ${formatDateToSpanish(candidatura.fechaUltimaModificacion)}`;
        ultimaActualizacion.appendChild(fechaActualizacion);
        candidaturaElement.appendChild(ultimaActualizacion);

        candidaturaElement.addEventListener('click', () => {
            const allCards = misCandidaturasContainer.querySelectorAll('.candidatura-mini-card-component');
            allCards.forEach(card => card.classList.remove('selected'));
            candidaturaElement.classList.add('selected');
            renderizarDetalleCandidatura(candidatura);
        });

        if (index === 0) {
            candidaturaElement.classList.add('selected');
        }

        misCandidaturasContainer.appendChild(candidaturaElement);
    });
    if (candidaturas.length > 0) {
        renderizarDetalleCandidatura(candidaturas[0]);
    }
}

/**
 * Renderiza la tarjeta de estado según el tipo de estado de la candidatura
 */
function renderStatusCard(type, candidatura) {
    statusContainer.replaceChildren();

    switch (type) {
        case 'En revisión':
            statusContainer.innerHTML = StatusTemplates.revision();
            break;
        case 'Finalista':
            statusContainer.innerHTML = StatusTemplates.finalista();
            break;
        case 'Rechazada':
            statusContainer.innerHTML = StatusTemplates.rechazada(candidatura.motivoRechazo);
            break;
        case 'Subsanar':
            statusContainer.innerHTML = StatusTemplates.subsanar(candidatura.motivoRechazo);
            break;
        default:
            break;
    }
}

/**
 * Renderiza el detalle de una candidatura seleccionada
 */
function renderizarDetalleCandidatura(candidatura){
    candidaturaSeleccionada = candidatura;
    videoTrailerInput.classList.add('d-none');
    mensajeSubsanacionInput.classList.add('d-none-force');
    btnGuardarCambios.textContent = 'Guardar Cambios';
    const playBtn = document.getElementById('playVideoCorto');
    if (playBtn) playBtn.classList.remove('d-none');
    playVideoCorto.classList.remove('d-none');

    renderStatusCard(candidatura.estado, candidatura);

    if (candidatura.estado === 'Finalista') {
        videoTrailerInput.classList.remove('d-none');
        if(candidatura.rutaTrailer) {
            videoTrailerInput.setAttachedMode(candidatura.rutaTrailer, candidatura.idArchivoTrailer);
        }
    }

    if(candidatura.estado !== 'En revisión') {
        btnGuardarCambios.classList.add('d-none');
    }

    if (candidatura.estado === 'Rechazada') {
        mensajeSubsanacionInput.classList.remove('d-none-force');
        btnGuardarCambios.classList.remove('d-none');
        btnGuardarCambios.textContent = 'Enviar Subsanación';
    }

    posterInput.setAttachedMode(candidatura.rutaCartel, candidatura.idArchivoCartel)
    fichaTecnicaInput.setAttachedMode(candidatura.rutaFichaTecnica, candidatura.idArchivoFichaTecnica)
    sinopsisInput.setValue(candidatura.sinopsis, true);
    tituloInput.setValue(candidatura.titulo, true);

    // Cargar video
    const video = document.getElementById('videoCorto');
    video.pause();
    if (video.src !== candidatura.rutaVideo) {
        video.src = candidatura.rutaVideo;
    }
    video.load();
    setTimeout(() => {
        video.src = candidatura.rutaVideo;
        video.load();
    }, 50);
}

paginacionCandidaturas.addEventListener('page-change', async (e) => {
    await cargarCandidaturas();
});

async function cargarCandidaturas() {
    const page = paginacionCandidaturas.currentPage;
    const response = await listarCandidaturasParticipante(page, pageSize);
    if (response.status === 'success') {
        const { list, totalPages, currentPage } = response.data;
        renderizarCandidaturas(list);
        paginacionCandidaturas.setAttribute('current-page', currentPage);
        paginacionCandidaturas.setAttribute('total-pages', totalPages);
    }
}

btnGuardarCambios.addEventListener('click', async () => {
    if (!candidaturaSeleccionada) return;
    const tituloValido = tituloInput.validate(true).valid
    const sinopsisValida = sinopsisInput.validate(true).valid;
    const posterValido = posterInput.validate(true);
    const fichaTecnicaValida = fichaTecnicaInput.validate(true);
    const necesitaMensaje = candidaturaSeleccionada.estado === 'Rechazada';
    const mensajeValido = necesitaMensaje ? mensajeSubsanacionInput.validate(true).valid : true;

    if (!tituloValido || !sinopsisValida || !posterValido || !fichaTecnicaValida || !mensajeValido) {
        return;
    }

    const titulo = tituloInput.value
    const sinopsis = sinopsisInput.value;
    const idPoster = await posterInput.uploadIfNeeded();
    const idFichaTecnica = await fichaTecnicaInput.uploadIfNeeded();
    const idVideoTrailer = await videoTrailerInput.uploadIfNeeded();
    const mensajeSubsanacion = necesitaMensaje ? mensajeSubsanacionInput.value : null;

    let response = await actualizarCandidatura(candidaturaSeleccionada.idCandidatura, titulo, sinopsis, idPoster, idFichaTecnica, idVideoTrailer, mensajeSubsanacion);
    if (response.status === 'success') {
        await cargarCandidaturas();
    } else {
        alert('Error al actualizar la candidatura: ' + response.message);
    }
});

watchScreenSize((dimensions) =>{
    const isMobile = dimensions.width < 768;
    pageSize = isMobile ? 2 : 3;
    cargarCandidaturas();
})

cargarCandidaturas();
