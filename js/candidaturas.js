const sinopsisInput = document.getElementById('sinopsisInput');
const misCandidaturasContainer = document.getElementById('misCandidaturasContainer');
const statusCardRevision = document.getElementById('statusCardRevision');
const statusCardAceptada = document.getElementById('statusCardAceptada');
const statusCardRechazada = document.getElementById('statusCardRechazada');
const statusCardRechazadaSubsanar = document.getElementById('statusCardRechazadaSubsanar');
const posterInput = document.getElementById('posterInput');
const fichaTecnicaInput = document.getElementById('fichaTecnicaInput');
const btnVerVideo = document.getElementById('btnVerVideo');
const modalVerVideo = document.getElementById('modalVerVideo');
const playVideoCorto = document.getElementById('playVideoCorto');
const paginacion = document.getElementById('paginacion');

btnVerVideo.addEventListener('click', () => {
    modalVerVideo.open();
});

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
    if (candidatura.estado === 'Nominado'){
        span.classList.add('border-solid', 'border-information-03', 'text-information-01', 'bg-information-04');
    }
    span.id = 'textEstadoCandidatura';
    span.textContent = candidatura.estado;
    return span;
}

function renderizarCandidaturas(candidaturas) {
    misCandidaturasContainer.replaceChildren();
    candidaturas.forEach(candidatura => {
        const candidaturaElement = document.createElement('div');
        candidaturaElement.classList.add('candidatura-mini-card-component', 'cursor-pointer', 'gap-16px', 'p-24px', 'd-flex', 'flex-column', 'position-relative');
        candidaturaElement.appendChild(buildBadge(candidatura));

        const titleCortometraje = document.createElement('span');
        titleCortometraje.classList.add('fw-600');
        titleCortometraje.textContent = candidatura.sinopsis;
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
            mostrarDetallesCandidatura(candidatura);
        });

        misCandidaturasContainer.appendChild(candidaturaElement);
    });
    mostrarDetallesCandidatura(candidaturas[0]);
}

function mostrarDetallesCandidatura(candidatura){
    const playBtn = document.getElementById('playVideoCorto');
    if (playBtn) {
        playBtn.classList.remove('d-none');
    }
    playVideoCorto.classList.remove('d-none');
    statusCardRevision.classList.add('d-none');
    statusCardAceptada.classList.add('d-none');
    statusCardRechazada.classList.add('d-none');
    statusCardRechazadaSubsanar.classList.add('d-none');

    const estado = candidatura.estado;
    if (estado === 'En revisión') {
        statusCardRevision.classList.remove('d-none');
    } else if (estado === 'Aceptada') {
        statusCardAceptada.classList.remove('d-none');
    } else if (estado === 'Rechazada') {
        statusCardRechazada.classList.remove('d-none');
    }

    posterInput.setAttachedMode(candidatura.rutaCartel, candidatura.idArchivoCartel)
    fichaTecnicaInput.setAttachedMode(candidatura.rutaFichaTecnica, candidatura.idArchivoFichaTecnica)

    sinopsisInput.setValue(candidatura.sinopsis, true);

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

async function cargarCandidaturas() {
    const response = await listarCandidaturasParticipante();
    if (response.status === 'success') {
        renderizarCandidaturas(response.data);
    }
}

cargarCandidaturas();