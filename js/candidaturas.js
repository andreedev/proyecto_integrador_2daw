const iconSinopsis = document.getElementById('iconSinopsis');
const labelSinopsis = document.getElementById('label');
const sinopsisErrorMessage = document.getElementById('sinopsisErrorMessage');
const sinopsisInput = document.getElementById('sinopsisInput');
const misCandidaturasContainer = document.getElementById('misCandidaturasContainer');
const statusCardRevision = document.getElementById('statusCardRevision');
const statusCardAceptada = document.getElementById('statusCardAceptada');
const statusCardRechazada = document.getElementById('statusCardRechazada');
const statusCardRechazadaSubsanar = document.getElementById('statusCardRechazadaSubsanar');

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
        candidaturaElement.classList.add('candidatura-mini-card-component', 'cursor-pointer');


        candidaturaElement.appendChild(buildBadge(candidatura));

        const titleCortometraje = document.createElement('span');
        titleCortometraje.classList.add('title-cortometraje');
        titleCortometraje.id = 'titleCortometraje';
        titleCortometraje.textContent = candidatura.sinopsis;
        candidaturaElement.appendChild(titleCortometraje);

        const horaPresentada = document.createElement('div');
        horaPresentada.classList.add('hora-presentada');
        const iconHora1 = document.createElement('span');
        iconHora1.classList.add('icon-hora');
        horaPresentada.appendChild(iconHora1);
        const fechaPresentada = document.createElement('span');
        fechaPresentada.classList.add('fecha-presentada');
        fechaPresentada.id = 'fechaPresentada';
        fechaPresentada.textContent = `Presentado: ${formatDateToSpanish(candidatura.fechaPresentacion)}`;
        horaPresentada.appendChild(fechaPresentada);
        candidaturaElement.appendChild(horaPresentada);

        const ultimaActualizacion = document.createElement('div');
        ultimaActualizacion.classList.add('ultima-actualizacion');
        const iconHora2 = document.createElement('span');
        iconHora2.classList.add('icon-hora');
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
    // mostrarDetallesCandidatura(candidaturas[0]);
}

function mostrarDetallesCandidatura(candidatura){
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

    sinopsisInput.setValue(candidatura.sinopsis, false);
}

async function cargarCandidaturas() {
    const response = await listarCandidaturasParticipante();
    if (response.status === 'success') {
        renderizarCandidaturas(response.data);
    }
}

cargarCandidaturas();