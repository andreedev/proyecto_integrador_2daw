const tituloInput = document.getElementById('tituloInput');
const sinopsisInput = document.getElementById('sinopsisInput');
const contadorPalabras = document.getElementById('contadorPalabras');
const misCandidaturasContainer = document.getElementById('misCandidaturasContainer');
const statusContainer = document.getElementById('statusContainer');
const posterInput = document.getElementById('posterInput');
const fichaTecnicaInput = document.getElementById('fichaTecnicaInput');
const paginacionCandidaturas = document.getElementById('paginacionCandidaturas');
const btnGuardarCambios = document.getElementById('btnGuardarCambios');
const videoTrailerInput = document.getElementById('videoTrailerInput');
const mensajeSubsanacionInput = document.getElementById('mensajeSubsanacionInput');
const videoCandidatura = document.getElementById('videoCandidatura');
const modalMiPerfil = document.getElementById('modalMiPerfil');
const btnMiPerfil = document.getElementById('btnMiPerfil');
const nombreInput = document.getElementById('nombreInput');
const correoInput = document.getElementById('correoInput');
const passwordInput = document.getElementById('passwordInput');
const dniInput = document.getElementById('dniInput');
const numExpedienteInput = document.getElementById('numExpedienteInput');

let pageSize = 3;
let candidaturaSeleccionada = null;


sinopsisInput.addEventListener('solid-input-word-count', (e) => {
    contadorPalabras.textContent = e.detail.count;
});

btnMiPerfil.addEventListener('click', async () => {
    await renderizarDatosUsuarioEnModal();
    modalMiPerfil.open();
});


const StatusTemplates = {
    revision: () => `
        <div class="d-flex flex-row p-24px gap-16px align-items-center w-100 bg-warning-04 text-warning-01">
            <span class="icono-film flex-shrink-0"></span>
            <div class="text-revision">
                <span class="title-revision">Tu candidatura se encuentra en revisión</span>
                <span class="description-revision fw-500 line-height-120">Asegúrate que tu vídeo cumpla con los requisitos establecidos, al igual que el contenido de la ficha técnica.</span>
            </div>
        </div>
    `,
    finalista: () => `
        <div class="d-flex flex-row p-16px gap-16px align-items-center w-100 border-information-01 border-solid bg-information-04">
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
        </div>
    `
};

function buildBadge(candidatura) {
    const span = document.createElement('span');
    span.classList.add('estado-candidatura');
    if (candidatura.estado === ESTADOS_CANDIDATURA.EN_REVISION) {
        span.classList.add('border-solid', 'border-warning-03', 'text-warning-01', 'bg-warning-04');
    }
    if (candidatura.estado === ESTADOS_CANDIDATURA.ACEPTADA) {
        span.classList.add('border-solid', 'border-success-03', 'text-success-03', 'bg-success-04');
    }
    if (candidatura.estado === ESTADOS_CANDIDATURA.RECHAZADA) {
        span.classList.add('border-solid', 'border-error-03', 'text-error-01', 'bg-error-04');
    }
    if (candidatura.estado === ESTADOS_CANDIDATURA.FINALISTA) {
        span.classList.add('border-solid', 'border-information-03', 'text-information-01', 'bg-information-04');
    }
    span.id = 'textEstadoCandidatura';
    span.textContent = candidatura.estado;
    return span;
}

function renderizarCandidaturas(candidaturas) {
    misCandidaturasContainer.replaceChildren();

    const idASeleccionar = candidaturaSeleccionada
        ? candidaturaSeleccionada.idCandidatura
        : (candidaturas.length > 0 ? candidaturas[0].idCandidatura : null);

    candidaturas.forEach((candidatura, index) => {
        const candidaturaElement = document.createElement('div');
        candidaturaElement.classList.add('candidatura-mini-card-component', 'cursor-pointer', 'gap-16px', 'p-24px', 'd-flex', 'flex-column', 'position-relative');

        if (candidatura.idCandidatura === idASeleccionar) {
            candidaturaElement.classList.add('selected');
        }

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

        misCandidaturasContainer.appendChild(candidaturaElement);
    });

    if (candidaturas.length > 0) {
        const candidataActualizada = candidaturas.find(c => c.idCandidatura === idASeleccionar) || candidaturas[0];
        renderizarDetalleCandidatura(candidataActualizada);
    }
}

/**
 * Renderiza la tarjeta de estado según el tipo de estado de la candidatura
 */
function renderStatusCard(type, candidatura) {
    statusContainer.replaceChildren();

    switch (type) {
        case ESTADOS_CANDIDATURA.EN_REVISION:
            statusContainer.innerHTML = StatusTemplates.revision();
            break;
        case ESTADOS_CANDIDATURA.FINALISTA:
            statusContainer.innerHTML = StatusTemplates.finalista();
            break;
        case ESTADOS_CANDIDATURA.RECHAZADA:
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
async function renderizarDetalleCandidatura(candidatura) {
    document.querySelectorAll('.right-side-skeleton').forEach(skeleton => skeleton.show());
    document.querySelector('#right').classList.add('d-none');

    candidaturaSeleccionada = candidatura;

    console.log('Candidatura seleccionada:', candidaturaSeleccionada);

    videoTrailerInput.classList.add('d-none');
    mensajeSubsanacionInput.classList.add('d-none');
    btnGuardarCambios.classList.add('d-none');

    renderStatusCard(candidatura.estado, candidatura);

    let puedeEditarArchivos = false;

    if (candidatura.estado === ESTADOS_CANDIDATURA.EN_REVISION) {
        tituloInput.disabled = true;
        sinopsisInput.disabled = true;
        puedeEditarArchivos = false;
    }

    if (candidatura.estado === ESTADOS_CANDIDATURA.RECHAZADA) {
        sinopsisInput.disabled = false;
        mensajeSubsanacionInput.classList.remove('d-none');
        btnGuardarCambios.classList.remove('d-none');
        btnGuardarCambios.textContent = 'Enviar subsanación';
        puedeEditarArchivos = true;
    }


    if (candidatura.estado === ESTADOS_CANDIDATURA.ACEPTADA) {
        btnGuardarCambios.classList.add('d-none');
        tituloInput.disabled = true;
        sinopsisInput.disabled = true;
    }

    if (candidatura.estado === ESTADOS_CANDIDATURA.FINALISTA) {
        tituloInput.disabled = true;
        sinopsisInput.disabled = true;
        videoTrailerInput.classList.remove('d-none');
        btnGuardarCambios.textContent = 'Enviar';
        btnGuardarCambios.classList.remove('d-none');
        if (candidatura.rutaTrailer) {
            videoTrailerInput.setAttachedMode(candidatura.rutaTrailer, candidatura.idArchivoTrailer, true);
        }
    }


    posterInput.setAttachedMode(candidatura.rutaCartel, candidatura.idArchivoCartel, puedeEditarArchivos)
    fichaTecnicaInput.setAttachedMode(candidatura.rutaFichaTecnica, candidatura.idArchivoFichaTecnica, puedeEditarArchivos)
    sinopsisInput.setValue(candidatura.sinopsis);
    contadorPalabras.textContent = countWords(candidatura.sinopsis);
    tituloInput.setValue(candidatura.titulo);

    videoCandidatura.setSource(candidatura.rutaVideo);

    await sleep(500);

    document.querySelectorAll('.right-side-skeleton').forEach(skeleton => skeleton.hide());
    document.querySelector('#right').classList.remove('d-none');
}

paginacionCandidaturas.addEventListener('page-change', async (e) => {
    await cargarCandidaturas();
    scrollToElement(statusContainer);
});


btnGuardarCambios.addEventListener('click', async () => {
    handleGuardarCambios();
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

    await sleep(500);
    document.querySelectorAll('.right-side-skeleton').forEach(skeleton => skeleton.hide());
    document.querySelector('#right').classList.remove('d-none');
}

async function handleGuardarCambios() {
    if (!candidaturaSeleccionada) return;
    const tituloValido = tituloInput.validate(true).valid
    const sinopsisValida = sinopsisInput.validate(true).valid;
    const posterValido = posterInput.validate(true);
    const fichaTecnicaValida = fichaTecnicaInput.validate(true);
    const necesitaMensaje = candidaturaSeleccionada.estado === ESTADOS_CANDIDATURA.RECHAZADA;
    const mensajeValido = necesitaMensaje ? mensajeSubsanacionInput.validate(true).valid : true;

    const necesitaVideoTrailer = candidaturaSeleccionada.estado === ESTADOS_CANDIDATURA.FINALISTA;
    const videoTrailerValido = necesitaVideoTrailer ? videoTrailerInput.validate(true) : true;

    if (!tituloValido || !sinopsisValida || !posterValido || !fichaTecnicaValida || !mensajeValido || !videoTrailerValido) {
        return;
    }

    const titulo = tituloInput.value
    const sinopsis = sinopsisInput.value;
    const idPoster = await posterInput.uploadIfNeeded();
    const idFichaTecnica = await fichaTecnicaInput.uploadIfNeeded();

    let idTrailer = null;
    if (necesitaVideoTrailer) {
        idTrailer = await videoTrailerInput.uploadIfNeeded();
    }

    const mensajeSubsanacion = necesitaMensaje ? mensajeSubsanacionInput.value : null;

    btnGuardarCambios.disabled = true;

    let response = await actualizarCandidatura(candidaturaSeleccionada.idCandidatura, titulo, sinopsis, idPoster, idFichaTecnica, idTrailer, mensajeSubsanacion);

    btnGuardarCambios.disabled = false;

    if (response.status === 'success') {
        await cargarCandidaturas();
        notify('Candidatura actualizada correctamente');
        scrollToElement(statusContainer);
    } else {
        notify('Error al actualizar la candidatura: ' + response.message);
    }
}

/**
 * Muestra una notificación en pantalla
 */
function notify(message){
    document.getElementById('notification').show(message);
}

let isMobileMode = null;
watchScreenSize((dimensions) =>{
    const isNowMobile = dimensions.width < 768;
    if (isNowMobile !== isMobileMode) {
        isMobileMode = isNowMobile;
        pageSize = isMobileMode ? 2 : 3;
        cargarCandidaturas();
    }
})


/**
 * Renderiza los datos del usuario en el modal de "Mi Perfil"
 */
async function renderizarDatosUsuarioEnModal() {
    const response = await obtenerDatosParticipante();
    if (response.status === 'success') {
        const usuario = response.data;
        nombreInput.setValue(usuario.nombre);
        correoInput.setValue(usuario.correo);
        dniInput.setValue(usuario.dni);
        numExpedienteInput.setValue(usuario.nroExpediente);
    }
}